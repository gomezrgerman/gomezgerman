import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

// ── Rate limiting (in-memory, por IP, 5 req / 10 min) ─────────────────────────
const RATE_LIMIT = 5
const WINDOW_MS  = 10 * 60 * 1000

const rateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now   = Date.now()
  const entry = rateMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RATE_LIMIT) return false
  entry.count++
  return true
}

// ── SMTP transporter ──────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.hostinger.com',
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

// ── Handler ───────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           ?? req.headers.get('x-real-ip')
           ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Demasiados intentos. Espera unos minutos.' },
      { status: 429 },
    )
  }

  try {
    const body = await req.json()
    const { nombre, email, negocio, problema, presupuesto, timing, _trap } = body

    if (_trap) return NextResponse.json({ ok: true })

    if (!nombre?.trim() || !email?.trim() || !negocio?.trim() || !problema?.trim()) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }
    if (nombre.trim().length > 100 || problema.trim().length > 2000) {
      return NextResponse.json({ error: 'Campos demasiado largos.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    const safeNombre  = sanitizeHeader(nombre)
    const safeNegocio = negocio?.trim() ? sanitizeHeader(negocio) : ''

    // Enviar ambos correos en paralelo
    await Promise.all([
      // Notificación interna
      transporter.sendMail({
        from:    `"Portfolio" <${process.env.SMTP_USER}>`,
        to:      'contacto@german-gomez.es',
        replyTo: email,
        subject: `Portfolio: mensaje de ${safeNombre}${safeNegocio ? ` (${safeNegocio})` : ''}`,
        html: buildNotificationHtml({ nombre, email, negocio, problema, presupuesto, timing }),
      }),
      // Acuse de recibo al cliente
      transporter.sendMail({
        from:    `"Germán Gómez" <${process.env.SMTP_USER}>`,
        to:      email,
        subject: `Recibido, ${safeNombre} — te respondo pronto`,
        html:    buildAutoReplyHtml({ nombre, negocio }),
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact API error:', e)
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 })
  }
}

// ── Email templates ───────────────────────────────────────────────────────────

function buildNotificationHtml({
  nombre, email, negocio, problema, presupuesto, timing,
}: { nombre: string; email: string; negocio: string; problema: string; presupuesto?: string; timing?: string }): string {
  const row = (label: string, value: string, last = false) => `
    <tr><td style="padding:20px 0;${last ? '' : 'border-bottom:1px solid #1E1E1E'}">
      <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A89F8C">${label}</p>
      <p style="margin:0;font-size:15px;color:#F5F0E8;line-height:1.7;white-space:pre-wrap">${escapeHtml(value)}</p>
    </td></tr>`

  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="background:#152B1C;border-radius:4px 4px 0 0;padding:28px 40px;border-bottom:1px solid rgba(125,184,146,0.2)">
          <p style="margin:0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7DB892">Nuevo mensaje del portfolio</p>
        </td></tr>
        <tr><td style="background:#111;padding:32px 40px;border-radius:0 0 4px 4px;border:1px solid #1E1E1E;border-top:none">
          <table width="100%" cellpadding="0" cellspacing="0">
            ${row('Nombre', nombre)}
            <tr><td style="padding:20px 0;border-bottom:1px solid #1E1E1E">
              <p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:#A89F8C">Email</p>
              <p style="margin:0;font-size:15px"><a href="mailto:${escapeHtml(email)}" style="color:#7DB892;text-decoration:none">${escapeHtml(email)}</a></p>
            </td></tr>
            ${row('Negocio', negocio)}
            ${presupuesto?.trim() ? row('Presupuesto', presupuesto) : ''}
            ${timing?.trim()      ? row('Timing', timing)           : ''}
            ${row('¿Qué quiere resolver?', problema, true)}
          </table>
        </td></tr>
        <tr><td style="padding:16px 0 0;text-align:center">
          <p style="margin:0;font-size:11px;color:rgba(168,159,140,0.4);letter-spacing:0.08em">german-gomez.es</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}

function buildAutoReplyHtml({ nombre, negocio }: { nombre: string; negocio: string }): string {
  const BG      = '#152E1F'
  const BG_CARD = '#1C3828'
  const CREAM   = '#F5F0E8'
  const GREEN   = '#7DB892'
  const BORDER  = '#2E5240'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Anybody:wght@700;800&display=swap');
  </style>
</head>
<body bgcolor="${BG}" style="margin:0;padding:0;background-color:${BG} !important;font-family:Georgia,'Times New Roman',serif">
  <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="background-color:${BG} !important;padding:48px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="max-width:560px;width:100%;background-color:${BG} !important">

        <!-- Logo pequeño arriba -->
        <tr><td align="center" bgcolor="${BG}" style="padding-bottom:40px;background-color:${BG} !important">
          <svg viewBox="175 105 610 315" width="72" height="37" xmlns="http://www.w3.org/2000/svg">
            <path fill="${GREEN}" opacity="0.5" d="M342.249084,359.715759 C378.734680,372.422638 411.176422,365.472198 440.041718,341.024048 C451.730682,331.123810 462.604095,320.263824 474.234375,310.290466 C496.932526,290.825989 522.479797,276.997620 552.600098,273.294556 C586.342041,269.146271 616.924744,277.984039 644.903198,296.775208 C645.590027,297.236542 646.246948,297.742401 647.279968,298.489441 C643.903870,303.478485 639.506714,306.820251 635.851257,310.809845 C634.838684,311.914948 633.752319,312.952545 632.697144,314.018463 C626.920410,319.853973 628.052612,319.652130 621.290161,315.449585 C585.451660,293.177704 540.930054,295.929413 504.437225,322.211853 C491.114136,331.807220 479.480011,343.238861 467.532990,354.351318 C449.719421,370.920502 430.153717,384.705383 406.051300,390.131042 C355.762573,401.451477 313.030945,387.495392 280.043488,348.177856 C223.439804,280.712341 253.528687,177.347809 337.516174,149.833664 C383.927399,134.629425 425.482330,144.845749 461.885712,177.089188 C464.692688,179.575394 464.777832,181.361115 461.970032,183.892105 C457.394104,188.016937 452.938446,192.302139 448.730286,196.798767 C445.824249,199.904022 443.933197,199.305008 440.997406,196.621277 C420.482666,177.867874 396.024719,169.327118 368.519775,171.617706 C325.564056,175.194992 291.112823,205.931183 281.411072,247.960953 C270.718567,294.282623 296.181000,341.292206 342.249084,359.715759 z"/>
            <path fill="${GREEN}" opacity="0.5" d="M714.657166,282.663940 C718.248840,254.295853 710.974121,229.263718 693.557434,207.435303 C677.606812,187.444397 656.533752,175.704819 631.131958,172.336823 C598.740967,168.042099 571.131958,178.570816 547.420349,200.368912 C529.035339,217.270203 511.714233,235.337769 491.619812,250.352341 C464.623901,270.523743 435.374268,285.338074 401.346313,288.880920 C394.578857,289.585541 387.721039,289.437714 380.903687,289.641968 C377.728149,289.737122 376.571960,288.101562 376.652893,284.979065 C376.803955,279.151093 376.941223,273.302216 376.611389,267.488861 C376.350769,262.895813 377.935516,261.462982 382.561066,261.558197 C404.457642,262.008759 425.218323,257.158295 444.637970,247.014465 C463.358917,237.235565 479.997070,224.500595 495.782013,210.548019 C511.129425,196.982162 524.513245,181.205566 541.271912,169.262817 C580.259521,141.479004 622.710327,134.265427 666.948242,153.422913 C711.541809,172.734421 736.972229,208.004593 742.330444,256.667267 C746.745239,296.762390 733.605896,331.095917 704.744568,358.763153 C675.186218,387.098541 639.486633,398.166931 598.733215,392.468201 C569.850830,388.429535 546.035706,374.794769 525.530457,354.586731 C522.776245,351.872467 523.069336,350.157410 525.732788,347.723755 C530.034241,343.793335 534.228943,339.711792 538.130981,335.389130 C541.310974,331.866425 543.550354,331.879364 546.973083,335.368439 C562.861694,351.565369 582.022278,361.599396 604.597351,364.852112 C627.985046,368.221954 649.649292,363.384888 669.522644,350.800201 C694.544189,334.955475 709.566040,312.316040 714.657166,282.663940 z"/>
          </svg>
        </td></tr>

        <!-- El sello -->
        <tr><td bgcolor="${BG}" style="background-color:${BG} !important">
          <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG}" style="border:2px dashed ${BORDER};border-radius:3px;background-color:${BG} !important">
            <tr><td style="padding:6px" bgcolor="${BG}">
              <table width="100%" cellpadding="0" cellspacing="0" bgcolor="${BG_CARD}" style="border:1px solid ${BORDER};border-radius:2px;background-color:${BG_CARD} !important">
                <tr><td bgcolor="${BG_CARD}" style="padding:48px 44px 44px;text-align:center;background-color:${BG_CARD} !important">

                  <!-- Label -->
                  <p style="margin:0 0 24px;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:${GREEN};font-family:Georgia,serif">
                    Germán Gómez
                  </p>

                  <!-- Texto principal -->
                  <h1 style="margin:0 0 8px;font-size:64px;font-weight:800;letter-spacing:-0.04em;line-height:0.9;color:${CREAM};font-family:'Anybody',Georgia,serif">
                    Recibido.
                  </h1>
                  <p style="margin:0 0 32px;font-size:20px;font-weight:700;letter-spacing:-0.02em;color:${GREEN};font-family:'Anybody',Georgia,serif">
                    Hola, ${escapeHtml(nombre)}.
                  </p>

                  <!-- Separador -->
                  <div style="height:1px;background-color:${BORDER};margin:0 auto 32px;width:60px"></div>

                  <!-- Mensaje -->
                  <p style="margin:0 0 20px;font-size:15px;color:${CREAM};line-height:1.8;font-family:Georgia,serif;max-width:380px;margin-left:auto;margin-right:auto">
                    Ya he leído lo que necesitas.
                  </p>
                  <p style="margin:0 0 20px;font-size:15px;color:${CREAM};line-height:1.8;font-family:Georgia,serif;max-width:380px;margin-left:auto;margin-right:auto">
                    Ahora toca la parte importante:<br>
                    ver si realmente merece la pena hacerlo y cómo hacerlo bien.
                  </p>
                  <p style="margin:0 0 28px;font-size:15px;color:${CREAM};line-height:1.8;font-family:Georgia,serif;max-width:380px;margin-left:auto;margin-right:auto">
                    En menos de 24 horas te responderé con algo útil para tu caso.<br>
                    No con una plantilla reciclada.<br>
                    Ni con una videollamada eterna para &#8220;entender tu negocio&#8221;.
                  </p>
                  <a href="https://german-gomez.es/work" style="display:inline-block;font-size:12px;color:${GREEN};text-decoration:none;font-family:Georgia,serif;letter-spacing:0.08em;border-bottom:1px solid ${BORDER};padding-bottom:2px;margin-bottom:28px">
                    Ver proyectos reales →
                  </a>
                  <p style="margin:0;font-size:14px;color:${CREAM};line-height:1.8;font-family:Georgia,serif;max-width:380px;margin-left:auto;margin-right:auto">
                    Si tienes prisa, responde a este correo.<br>
                    Aquí no responde un equipo de soporte. Respondo yo.
                  </p>

                </td></tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        <!-- Firma debajo del sello -->
        <tr><td bgcolor="${BG}" style="padding:36px 0 0;text-align:center;background-color:${BG} !important">
          <p style="margin:0 0 6px;font-size:13px;font-weight:700;letter-spacing:-0.01em;color:${CREAM};font-family:'Anybody',Georgia,serif">
            Germán Gómez
          </p>
          <p style="margin:0 0 12px;font-size:11px;color:${GREEN};letter-spacing:0.08em;text-transform:uppercase;font-family:Georgia,serif">
            Automatización &amp; Desarrollo Web
          </p>
          <a href="https://german-gomez.es" style="font-size:12px;color:${GREEN};text-decoration:none;font-family:Georgia,serif;letter-spacing:0.04em">
            german-gomez.es
          </a>
        </td></tr>

        <!-- Footer -->
        <tr><td bgcolor="${BG}" style="padding:32px 0 0;text-align:center;border-top:1px solid ${BORDER};background-color:${BG} !important">
          <p style="margin:24px 0 0;font-size:10px;color:${GREEN};letter-spacing:0.06em;font-family:Georgia,serif">
            Has recibido este correo porque contactaste en german-gomez.es
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function sanitizeHeader(str: string): string {
  return str.replace(/[\r\n\t\0]/g, ' ').trim().slice(0, 100)
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
