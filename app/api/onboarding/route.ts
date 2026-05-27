import { NextRequest, NextResponse } from 'next/server'

async function updateContactLeadStatus(email: string, status: string) {
  await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions?email=eq.${encodeURIComponent(email)}&type=eq.contact`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
        Prefer: 'return=representation',
      },
      body: JSON.stringify({ lead_status: status }),
    }
  ).catch(err => {
    console.warn('Failed to update contact lead status:', err.message)
  })
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json() as Record<string, string>

    const submission = {
      type: 'onboarding',
      lead_status: 'onboarding_received',
      created_at: new Date().toISOString(),
      data,
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
      },
      body: JSON.stringify(submission),
    })

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    if (data.contactEmail) {
      await updateContactLeadStatus(data.contactEmail, 'onboarding_received')
    }

    try {
      await fetch(`${process.env.SITE_URL || 'http://localhost:3000'}/api/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'onboarding', data }),
      }).catch(() => null)
    } catch {}

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Onboarding submission error:', error)
    return NextResponse.json({ success: false, error: 'Internal error' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok' })
}