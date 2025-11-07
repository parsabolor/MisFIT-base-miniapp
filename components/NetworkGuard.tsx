'use client'

import * as React from 'react'
import { useAccount, useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { ensureBaseSepolia } from '@/lib/ensureBaseSepolia'

export default function NetworkGuard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [busy, setBusy] = React.useState(false)

  if (!isConnected) return null
  const onWrong = chainId !== undefined && chainId !== baseSepolia.id
  if (!onWrong) return null

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 p-4 flex items-center justify-between">
        <div className="text-sm">
          <div className="font-medium">Wrong network</div>
          <div className="text-yellow-200/80">
            Please switch to <span className="font-semibold">Base Sepolia (84532)</span>.
          </div>
        </div>
        <button
          className="rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20 disabled:opacity-60"
          disabled={busy}
          onClick={async () => {
            setBusy(true)
            try { await ensureBaseSepolia() } finally { setBusy(false) }
          }}
        >
          {busy ? 'Switching…' : 'Switch to Base Sepolia'}
        </button>
      </div>
    </div>
  )
}
