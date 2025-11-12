'use client'

import * as React from 'react'
import { useAccount, useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { forceSwitchToBaseSepolia } from '@/lib/forceSwitch'

export default function NetworkGuard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const [busy, setBusy] = React.useState(false)
  const [errMsg, setErrMsg] = React.useState<string | null>(null)

  if (!isConnected) return null
  const onWrong = chainId !== baseSepolia.id
  if (!onWrong) return null

  const handleClick = async () => {
    setErrMsg(null)
    setBusy(true)
    try {
      await forceSwitchToBaseSepolia()
    } catch (e: any) {
      setErrMsg(
        e?.shortMessage ||
          e?.message ||
          'Could not switch. Please add/switch to Base Sepolia in your wallet and reconnect.'
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 p-4 flex items-center justify-between">
        <div className="text-sm">
          <div className="font-medium">Wrong network</div>
          <div className="text-yellow-200/80">
            Please switch to <span className="font-semibold">Base Sepolia (84532)</span>.
          </div>
          {!!errMsg && (
            <div className="mt-1 text-xs text-red-300">{errMsg}</div>
          )}
        </div>
        <button
          className="rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20 disabled:opacity-50"
          disabled={busy}
          onClick={handleClick}
        >
          {busy ? 'Switching…' : 'Switch to Base Sepolia'}
        </button>
      </div>
    </div>
  )
}
