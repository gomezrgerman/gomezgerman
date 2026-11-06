import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, clientIp } from '@/lib/rate-limit'
import { submissionsUrl, supabaseHeaders } from '@/lib/supabase-rest'

const ONBOARDING_RULE = { prefix: 'onboarding', limit: 5, window: '10 m' } as const

/** Límites del formulario: suficientes para el cuestionario real, no para usarlo de almacén. */
const MAX_FIELDS = 60
const MAX_VALUE_LENGTH = 4_000

/** Solo avanza leads que aún no han pasado de esta fase; nunca retrocede una propuesta o un cierre. */
const UPDATABLE_STATUSES = 'in.(new,contacted,onboarding_sent)'

function sanitize(input: unknown): Record<string, string> | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null
  const entries = Object.entries(input as Record<string, unknown>)
  if (entries.length === 0 || entries.length > MAX_FIELDS) return null
  const clean: Record<string, string> = {}
  for (const [key, value] of entries) {
    if (key.length > 64) return null
    const text = typeof value === 'string' ? value : Array.isArray(value) ? value.join(', ') : String(value ?? '')
    if (text.length > MAX_VALUE_LENGTH) return null
    clean[key] = text
  }
  return clean
}

async function updateContactLeadStatus(email: string, status: string) {
  await fetch(
    submissionsUrl({ 'data->>email': `eq.${email}`, type: 'eq.contact', lead_status: UPDATABLE_STATUSES }),
    {
      method: 'PATCH',
      headers: supabaseHeaders({ Prefer: 'return=minimal' }),
      body: JSON.stringify({ lead_status: status }),
    },
  ).catch(err => {
    console.warn('Failed to update contact lead status:', err.message)
  })
}

export async function POST(request: NextRequest) {
  if (!await checkRateLimit(clientIp(request), ONBOARDING_RULE)) {
    return NextResponse.json({ success: false, error: 'Too many attempts' }, { status: 429 })
  }

  try {
    const data = sanitize(await request.json().catch(() => null))
    if (!data) {
      return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 })
    }

    const submission = {
      type: 'onboarding',
      lead_status: 'onboarding_received',
      created_at: new Date().toISOString(),
      data,
    }

    const response = await fetch(submissionsUrl(), {
      method: 'POST',
      headers: supabaseHeaders(),
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    if (data.contactEmail) {
      await updateContactLeadStatus(data.contactEmail.trim(), 'onboarding_received')
    }

    try {
      await fetch(`${process.env.SITE_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.DASHBOARD_PASSWORD ?? ''}`,
        },
        body: JSON.stringify({ type: 'onboarding', data }),
      }).catch(() => null)
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding submission error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}
