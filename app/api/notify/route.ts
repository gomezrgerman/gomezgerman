import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { isAuthorized } from '@/lib/server-auth'

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { type, data } = await request.json()

    if (type === 'onboarding') {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: true,
        auth: {
          user: process.env.SMTP_USER || process.env.EMAIL_USER || 'contacto@german-gomez.es',
          pass: process.env.SMTP_PASS || process.env.EMAIL_PASS || '',
        },
      })

      const emailHtml = generateOnboardingEmail(data)

      await transporter.sendMail({
        from: `"Germán Gómez" <${process.env.EMAIL_USER || 'contacto@german-gomez.es'}>`,
        to: process.env.EMAIL_TO || 'contacto@german-gomez.es',
        subject: `Nuevo formulario de alta: ${data.companyName || data.contactName || 'Sin nombre'}`,
        html: emailHtml,
      })

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Unknown type' }, { status: 400 })
  } catch (error) {
    console.error('Notify error:', error)
    return NextResponse.json({ success: false, error: 'Failed to send notification' }, { status: 500 })
  }
}

function generateOnboardingEmail(data: Record<string, string>): string {
  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0a0a0a; color: #DDD0BC; margin: 0; padding: 40px 20px; }
    .container { max-width: 600px; margin: 0 auto; }
    h1 { color: #4A7C59; font-size: 24px; margin-bottom: 30px; }
    h2 { color: #DDD0BC; font-size: 16px; border-bottom: 1px solid #1E1E1E; padding-bottom: 8px; margin-top: 30px; }
    .field { margin: 12px 0; }
    .label { color: #A89F8C; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; }
    .value { color: #F5F0E8; font-size: 14px; margin-top: 4px; }
    .meta { color: #A89F8C; font-size: 12px; margin-bottom: 30px; }
    .section { background: #111111; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Nuevo formulario de alta</h1>
    <p class="meta">Recibido el ${formatDate(data.submittedAt || new Date().toISOString())}</p>

    <div class="section">
      <h2>Datos de contacto</h2>
      <div class="field">
        <div class="label">Empresa</div>
        <div class="value">${data.companyName || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Nombre</div>
        <div class="value">${data.contactName || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Email</div>
        <div class="value">${data.contactEmail || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Teléfono</div>
        <div class="value">${data.contactPhone || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Sector</div>
        <div class="value">${data.sector || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Ubicación</div>
        <div class="value">${data.location || '-'}</div>
      </div>
    </div>

    <div class="section">
      <h2>Objetivos</h2>
      <div class="field">
        <div class="label">Objetivo principal</div>
        <div class="value">${data.mainGoal || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Presupuesto</div>
        <div class="value">${data.budget || '-'}</div>
      </div>
      <div class="field">
        <div class="label">Timeline</div>
        <div class="value">${data.timeline || '-'}</div>
      </div>
    </div>

    <div class="section">
      <h2>Procesos</h2>
      <div class="field">
        <div class="label">Gestión actual</div>
        <div class="value">${data.currentManagement || '-'}</div>
      </div>
      <div class="field">
        <div class="label">CRM</div>
        <div class="value">${data.crmUsage || '-'} ${data.crmDetails ? `(${data.crmDetails})` : ''}</div>
      </div>
      <div class="field">
        <div class="label">Automatizaciones interés</div>
        <div class="value">${data.automationAreas || '-'}</div>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim()
}