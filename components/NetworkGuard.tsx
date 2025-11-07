'use client'

import * as React from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export default function NetworkGuard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()
  const [busy, setBusy] = React.useState(false)
  const [err, setErr] = React.useState<string | null>(null)

  // If not connected or already on Base Sepolia, render nothing
  if (!isConnected) return null
  const onWrong = chainId !== undefined && chainId !== baseSepolia.id
  if (!onWrong) return null

  async function handleSwitch() {
    setErr(null)
    setBusy(true)
    try {
      // 1) try native wagmi switch
      await switchChainAsync({ chainId: baseSepolia.id })
      return
    } catch (e) {
      // 2) add the chain (some wallets need this) then try again
      try {
        await (window as any)?.ethereum?.request?.({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x14A34', // 84532
              chainName: 'Base Sepolia',
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org'],
              nativeCurrency: { name: 'Ethereum', symbol: 'ETH', decimals: 18 },
            },
          ],
        })
        await switchChainAsync({ chainId: baseSepolia.id })
        return
      } catch (e2: any) {
        setErr(e2?.message || 'Failed to switch network')
      }
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

          {/* small debug readout; remove later if you want */}
          <div className="mt-1 text-xs text-yellow-200/60">
            Detected chainId: {String(chainId)} (expected {baseSepolia.id})
          </div>
          {!!err && (
            <div className="mt-1 text-xs text-red-300">{err}</div>
          )}
        </div>

        <button
          className="rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20 disabled:opacity-60"
          disabled={isPending || busy}
          onClick={handleSwitch}
        >
          {isPending || busy ? 'Switching…' : 'Switch to Base Sepolia'}
        </button>
      </div>
    </div>
  )
}
