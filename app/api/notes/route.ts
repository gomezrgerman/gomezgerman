import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''
const SUPABASE_KEY  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
}

async function getSubmissionNotes(id: string): Promise<unknown[]> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/submissions?id=eq.${id}&select=notes`,
    { headers, cache: 'no-store' },
  )
  const [row] = await res.json()
  return Array.isArray(row?.notes) ? row.notes : []
}

async function patchNotes(id: string, notes: unknown[]) {
  await fetch(`${SUPABASE_URL}/rest/v1/submissions?id=eq.${id}`, {
    method: 'PATCH',
    headers: { ...headers, Prefer: 'return=representation' },
    body: JSON.stringify({ notes }),
  })
}

export async function POST(req: NextRequest) {
  try {
    const { submissionId, content } = await req.json()
    if (!submissionId || !content?.trim()) {
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
  try {
    const { submissionId, noteId } = await req.json()
    if (!submissionId || !noteId) {
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
