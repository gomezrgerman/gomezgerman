import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { isAuthorized } from '@/lib/server-auth'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST ?? 'smtp.hostinger.com',
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { email, nombre } = await req.json()

    if (!email || !nombre) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const onboardingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://german-gomez.es'}/onboarding`

    await transporter.sendMail({
      from: `"Germán Gómez" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `${nombre} — un paso antes de empezar`,
      html: buildOnboardingEmailHtml({ nombre, onboardingUrl }),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Send onboarding error:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

function buildOnboardingEmailHtml({ nombre, onboardingUrl }: { nombre: string; onboardingUrl: string }): string {
  const BG = '#0a0a0a', GREEN = '#4A7C59', GREEN_LIGHT = '#7DB892', CREAM = '#F5F0E8', CREAM_DIM = '#A89F8C', BORDER = '#1E1E1E', BG_CARD = '#111111'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:48px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

        <!-- Logo -->
        <tr><td style="padding-bottom:36px;text-align:center">
          <p style="margin:0;font-size:28px;font-weight:800;letter-spacing:-0.04em;color:${CREAM}">GG</p>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:8px;padding:44px 40px">

          <!-- Label -->
          <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:${GREEN_LIGHT}">Siguiente paso</p>

          <!-- Headline -->
          <h1 style="margin:0 0 28px;font-size:34px;font-weight:800;letter-spacing:-0.03em;color:${CREAM};line-height:1.1">
            Antes de empezar,<br>necesito entenderte.
          </h1>

          <!-- Body -->
          <p style="margin:0 0 18px;font-size:15px;color:${CREAM_DIM};line-height:1.75">
            No construyo lo mismo para todos. Antes de hacer cualquier propuesta, necesito entender cómo funciona tu negocio ahora mismo: qué procesos se repiten, dónde se va el tiempo y qué resultado buscas.
          </p>
          <p style="margin:0 0 36px;font-size:15px;color:${CREAM_DIM};line-height:1.75">
            El formulario lleva unos 10 minutos. Con esa información puedo darte una propuesta que tenga sentido real para tu situación — no una genérica.
          </p>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="text-align:center;padding-bottom:36px">
              <a href="${onboardingUrl}"
                 style="display:inline-block;background:${GREEN};color:${CREAM};font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:16px 44px;border-radius:4px">
                Completar el formulario &rarr;
              </a>
            </td></tr>
          </table>

          <!-- Divider -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr><td style="border-top:1px solid ${BORDER};padding-top:28px">
              <p style="margin:0;font-size:13px;color:${CREAM_DIM};line-height:1.7">
                Si tienes alguna duda antes de rellenarlo, responde a este correo directamente.
              </p>
            </td></tr>
          </table>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;text-align:center">
          <p style="margin:0;font-size:11px;color:rgba(168,159,140,0.4);letter-spacing:0.08em;text-transform:uppercase">
            german-gomez.es
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}