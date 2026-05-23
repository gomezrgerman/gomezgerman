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
  // Rate limit por IP
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
    const { nombre, email, negocio, mensaje, _trap } = body

    if (_trap) return NextResponse.json({ ok: true })

    if (!nombre?.trim() || !email?.trim() || !mensaje?.trim()) {
      return NextResponse.json({ error: 'Faltan campos requeridos.' }, { status: 400 })
    }
    if (nombre.trim().length > 100 || mensaje.trim().length > 2000) {
      return NextResponse.json({ error: 'Campos demasiado largos.' }, { status: 400 })
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Email inválido.' }, { status: 400 })
    }

    // Sanitizar campos que van al subject (previene SMTP header injection)
    const safeNombre  = sanitizeHeader(nombre)
    const safeNegocio = negocio?.trim() ? sanitizeHeader(negocio) : ''

    await transporter.sendMail({
      from:    `"Portfolio" <${process.env.SMTP_USER}>`,
      to:      'contacto@german-gomez.es',
      replyTo: email,
      subject: `Portfolio: mensaje de ${safeNombre}${safeNegocio ? ` (${safeNegocio})` : ''}`,
      html: `
        <p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${negocio?.trim() ? `<p><strong>Negocio:</strong> ${escapeHtml(negocio)}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p style="white-space:pre-wrap">${escapeHtml(mensaje)}</p>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('Contact API error:', e)
    return NextResponse.json({ error: 'Error al enviar el mensaje.' }, { status: 500 })
  }
}

// Elimina saltos de línea y caracteres de control — impide SMTP header injection
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
