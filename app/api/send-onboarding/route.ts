import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

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
  try {
    const { email, nombre } = await req.json()

    if (!email || !nombre) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const onboardingUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://german-gomez.es'}/onboarding`

    await transporter.sendMail({
      from: `"Germán Gómez" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Hola ${nombre}, para seguir adelante necesito conocer más sobre tu proyecto`,
      html: buildOnboardingEmailHtml({ nombre, onboardingUrl }),
    })

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Send onboarding error:', e)
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 })
  }
}

function buildOnboardingEmailHtml({ nombre, onboardingUrl }: { nombre: string; onboardingUrl: string }): string {
  const BG = '#0a0a0a', GREEN = '#4A7C59', GREEN_LIGHT = '#7DB892', CREAM = '#F5F0E8', BORDER = '#1E1E1E', BG_CARD = '#111111'

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Anybody:wght@700;800&display=swap');
  </style>
</head>
<body style="margin:0;padding:0;background:${BG};font-family:Georgia,'Times New Roman',serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${BG};padding:40px 20px">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%">
        <tr><td style="padding-bottom:32px;text-align:center">
          <p style="margin:0;font-family:'Anybody',Georgia,serif;font-size:32px;font-weight:800;letter-spacing:-0.04em;color:${CREAM}">GG</p>
        </td></tr>
        <tr><td style="background:${BG_CARD};border:1px solid ${BORDER};border-radius:12px;padding:40px">
          <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${GREEN_LIGHT}">Paso 2</p>
          <h1 style="margin:0 0 24px;font-family:'Anybody',Georgia,serif;font-size:36px;font-weight:800;letter-spacing:-0.04em;color:${CREAM};line-height:1.1">
            Hola ${nombre},<br>conozcámoste mejor.
          </h1>
          <p style="margin:0 0 20px;font-size:15px;color:${CREAM};line-height:1.7">
            Para poder hacer algo que realmente funcione para tu negocio, necesito saber más sobre ti, tu empresa y cómo trabajáis ahora mismo.
          </p>
          <p style="margin:0 0 28px;font-size:15px;color:${CREAM};line-height:1.7">
            He preparado un cuestionario rápido — te llevará unos 10 minutos— y me ayudará a entender tu situación antes de hablar.
          </p>
          <tr><td style="padding:0 0 28px;text-align:center">
            <a href="${onboardingUrl}" style="display:inline-block;background:${GREEN};color:${CREAM};font-family:'Anybody',Georgia,serif;font-size:14px;font-weight:700;letter-spacing:0.04em;text-decoration:none;padding:16px 40px;border-radius:6px">
              Rellenar questionnaire →
            </a>
          </td></tr>
          <p style="margin:0;font-size:13px;color:${CREAM};line-height:1.7">
            Si tienes cualquier duda, responde a este correo directamente.
          </p>
        </td></tr>
        <tr><td style="padding-top:32px;text-align:center">
          <p style="margin:0;font-size:11px;color:rgba(168,159,140,0.5);letter-spacing:0.06em">
            german-gomez.es
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`
}