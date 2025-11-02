import { NextResponse } from 'next/server'

// Base app webhook stub
export async function POST(req: Request) {
  const payload = await req.json().catch(()=>null)
  console.log('Webhook payload', payload)
  // TODO: verify signature per MiniKit docs
  return NextResponse.json({ ok: true })
}
