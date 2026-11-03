import { NextRequest, NextResponse } from 'next/server'
import { isAuthorized } from '@/lib/server-auth'
import { isRowId, submissionsUrl, supabaseHeaders } from '@/lib/supabase-rest'

async function getSubmissionNotes(id: string | number): Promise<unknown[]> {
  const res = await fetch(submissionsUrl({ id: `eq.${id}`, select: 'notes' }), {
    headers: supabaseHeaders(),
    cache: 'no-store',
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
  const [row] = await res.json()
  return Array.isArray(row?.notes) ? row.notes : []
}

async function patchNotes(id: string | number, notes: unknown[]) {
  const res = await fetch(submissionsUrl({ id: `eq.${id}` }), {
    method: 'PATCH',
    headers: supabaseHeaders({ Prefer: 'return=representation' }),
    body: JSON.stringify({ notes }),
  })
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`)
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { submissionId, content } = await req.json()
    if (!isRowId(submissionId) || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const existing = await getSubmissionNotes(submissionId)
    const note = {
      id: crypto.randomUUID(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    }
    await patchNotes(submissionId, [...existing, note])
    return NextResponse.json({ note })
  } catch (e) {
    console.error('Notes POST error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { submissionId, noteId } = await req.json()
    if (!isRowId(submissionId) || !noteId) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const existing = await getSubmissionNotes(submissionId)
    const updated = (existing as { id: string }[]).filter(n => n.id !== noteId)
    await patchNotes(submissionId, updated)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('Notes DELETE error:', e)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
