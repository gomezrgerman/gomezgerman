import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/server-auth'

interface Submission {
  id: string
  type: 'contact' | 'onboarding'
  lead_status: 'new' | 'contacted' | 'onboarding_sent' | 'onboarding_received' | 'proposal' | 'closed'
  created_at: string
  data: Record<string, unknown>
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions?order=created_at.desc`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ data })
  } catch (e) {
    console.error('Failed to fetch from Supabase:', e)
    return NextResponse.json({ data: [] })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, lead_status, deal_amount } = await req.json()

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }

    const body: Record<string, unknown> = {}
    if (lead_status !== undefined) body.lead_status = lead_status
    if (deal_amount !== undefined) body.deal_amount = deal_amount

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions?id=eq.${id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(body),
      }
    )

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Failed to update in Supabase:', e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}