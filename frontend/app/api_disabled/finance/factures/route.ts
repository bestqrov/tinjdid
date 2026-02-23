import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    // For now accept any body and return OK. Backend persistence to be implemented.
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ ok: false, error: (err as any).message || 'error' }, { status: 500 })
  }
}
