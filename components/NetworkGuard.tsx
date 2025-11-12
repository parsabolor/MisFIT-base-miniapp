// components/NetworkGuard.tsx
'use client'

import * as React from 'react'
import { useAccount, useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { forceSwitchToBaseSepolia } from '@/lib/forceSwitch'

export default function NetworkGuard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [err, setErr] = React.useState<string | null>(null)
  const [working, setWorking] = React.useState(false)

  if (!isConnected) return null

  const onWrong = chainId !== undefined && chainId !== baseSepolia.id
  if (!onWrong) return null

  async function handleSwitch() {
    setErr(null)
    setWorking(true)
    try {
      await forceSwitchToBaseSepolia()
    } catch (e: any) {
      const msg =
        e?.shortMessage || e?.message || 'Could not switch to Base Sepolia.'
      setErr(msg)
    } finally {
      setWorking(false)
    }
  }

  const hex = chainId ? '0x' + chainId.toString(16) : '—'

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm">
            <div className="font-medium">Wrong network</div>
            <div className="text-yellow-200/90">
              Please switch to <b>Base Sepolia (84532)</b>.
            </div>
            <div className="mt-1 text-xs text-yellow-200/70">
              Detected chainId: <b>{chainId ?? 'unknown'}</b> ({hex})
            </div>
            {err && (
              <div className="mt-2 text-xs text-red-300">
                {err}
              </div>
            )}
          </div>
          <button
            className="rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20"
            disabled={working}
            onClick={handleSwitch}
          >
            {working ? 'Switching…' : 'Switch to Base Sepolia'}
          </button>
        </div>
      </div>
    </div>
  )
}
