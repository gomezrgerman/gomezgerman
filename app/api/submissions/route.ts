import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/server-auth'
import { isRowId, submissionsUrl, supabaseHeaders } from '@/lib/supabase-rest'

const LEAD_STATUSES = ['new', 'contacted', 'onboarding_sent', 'onboarding_received', 'proposal', 'closed'] as const

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const response = await fetch(submissionsUrl({ order: 'created_at.desc' }), {
      headers: supabaseHeaders(),
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json({ data })
  } catch (e) {
    console.error('Failed to fetch from Supabase:', e)
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { id, lead_status, deal_amount } = await req.json()

    if (!isRowId(id)) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 })
    }
    if (lead_status !== undefined && !LEAD_STATUSES.includes(lead_status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    if (deal_amount !== undefined && deal_amount !== null && typeof deal_amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const body: Record<string, unknown> = {}
    if (lead_status !== undefined) body.lead_status = lead_status
    if (deal_amount !== undefined) body.deal_amount = deal_amount

    const response = await fetch(submissionsUrl({ id: `eq.${id}` }), {
      method: 'PATCH',
      headers: supabaseHeaders({ Prefer: 'return=representation' }),
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Supabase error: ${response.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Failed to update in Supabase:', e)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
