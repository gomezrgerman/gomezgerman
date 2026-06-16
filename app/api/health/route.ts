import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/submissions?select=id&limit=1`,
      {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''}`,
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      return NextResponse.json({ status: 'error', supabase: response.status }, { status: 503 })
    }

    return NextResponse.json({ status: 'ok', ts: new Date().toISOString() })
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 503 })
  }
}
