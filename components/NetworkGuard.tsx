'use client'

import * as React from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

function getInjectedChainId(): number | null {
  try {
    // window.ethereum.chainId is hex like '0x14a34' (84532)
    // some wallets expose ethereum.networkVersion (decimal)
    const eth: any = (window as any).ethereum
    if (!eth) return null
    if (eth.chainId) return parseInt(eth.chainId, 16)
    if (eth.networkVersion) return Number(eth.networkVersion)
    return null
  } catch {
    return null
  }
}

export default function NetworkGuard() {
  const { isConnected } = useAccount()
  const wagmiChainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  // Read injected (wallet) view for debugging / sanity checks
  const [injectedId, setInjectedId] = React.useState<number | null>(null)
  React.useEffect(() => {
    setInjectedId(getInjectedChainId())
    const eth: any = (window as any).ethereum
    if (!eth?.on) return
    const handler = () => setInjectedId(getInjectedChainId())
    eth.on?.('chainChanged', handler)
    return () => eth.removeListener?.('chainChanged', handler)
  }, [])

  if (!isConnected) return null

  const onWrong = wagmiChainId !== baseSepolia.id

  if (!onWrong) return null

  const handleSwitch = async () => {
    try {
      // 1) Try wagmi's switch (best UX, covers WC + injected)
      await switchChainAsync({ chainId: baseSepolia.id })
      return
    } catch (err) {
      // 2) If wagmi says "Chain not configured", try raw EIP-3085 + 3326
      const eth: any = (window as any).ethereum
      if (!eth?.request) throw err

      // Add chain (EIP-3085)
      try {
        await eth.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x14a34', // 84532
            chainName: 'Base Sepolia',
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
            rpcUrls: [
              process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA || 'https://sepolia.base.org'
            ],
            blockExplorerUrls: ['https://sepolia.basescan.org'],
          }],
        })
      } catch (addErr) {
        // user might cancel add; surface the original error
      }

      // Switch chain (EIP-3326)
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x14a34' }],
      })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
      <div className="rounded-xl border border-yellow-500/25 bg-yellow-500/10 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="text-sm">
            <div className="font-medium">Wrong network</div>
            <div className="text-yellow-200/80">
              Please switch to <span className="font-semibold">Base Sepolia (84532)</span>.
            </div>
            <div className="mt-1 text-xs opacity-70">
              wagmi: {wagmiChainId ?? '—'} • wallet: {injectedId ?? '—'}
            </div>
          </div>
          <button
            className="rounded-lg bg-white/15 px-3 py-2 text-sm font-semibold hover:bg-white/20"
            disabled={isPending}
            onClick={handleSwitch}
          >
            {isPending ? 'Switching…' : 'Switch to Base Sepolia'}
          </button>
        </div>
      </div>
    </div>
  )
}
