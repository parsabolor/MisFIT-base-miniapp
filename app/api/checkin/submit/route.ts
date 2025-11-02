import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const json = await req.json()
  // In production: verify signature, store on-chain, etc.
  return NextResponse.json({ ok: true, received: json })
}
