import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST ?? 'smtp.hostinger.com',
  port:   Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function POST(req: NextRequest) {
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

    await transporter.sendMail({
      from:    `"Portfolio" <${process.env.SMTP_USER}>`,
      to:      'contacto@german-gomez.es',
      replyTo: email,
      subject: `Portfolio: mensaje de ${nombre}${negocio?.trim() ? ` (${negocio})` : ''}`,
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

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
