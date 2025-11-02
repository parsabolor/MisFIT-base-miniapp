import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const json = await req.json()
  // In production: validate + persist
  return NextResponse.json({ ok: true, received: json })
}
