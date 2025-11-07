'use client'

import * as React from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

const BASE_SEPOLIA_HEX = '0x14A34' // 84532 in hex

async function legacySwitchToBaseSepolia() {
  const eth = (globalThis as any)?.ethereum
  if (!eth?.request) throw new Error('No injected wallet found')

  try {
    // Try native switch first
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BASE_SEPOLIA_HEX }],
    })
    return
  } catch (err: any) {
    // 4902 => chain not added
    if (err?.code !== 4902) throw err
  }

  // Add then switch
  await (globalThis as any).ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [
      {
        chainId: BASE_SEPOLIA_HEX,
        chainName: 'Base Sepolia',
        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
        rpcUrls: ['https://sepolia.base.org'],
        blockExplorerUrls: ['https://sepolia.basescan.org'],
      },
    ],
  })

  await (globalThis as any).ethereum.request({
    method: 'wallet_switchEthereumChain',
    params: [{ chainId: BASE_SEPOLIA_HEX }],
  })
}

export default function NetworkGuard() {
  // useAccount provides chainId reliably in wagmi v2
  const { isConnected, chainId, status } = useAccount()
  const { switchChain, isPending } = useSwitchChain()
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null)

  // Don’t render while connecting/unknown, avoids false banner
  const chainKnown = typeof chainId === 'number'

  if (!isConnected || !chainKnown) return null
  const onWrong = chainId !== baseSepolia.id
  if (!onWrong) return null

  async function handleSwitch() {
    setErrorMsg(null)
    try {
      // Preferred: wagmi (works with WalletConnect + EIP-6963 wallets)
      await switchChain({ chainId: baseSepolia.id })
    } catch (e) {
      // Fallback: direct EIP-1193 calls (MetaMask / injected)
      try {
        await legacySwitchToBaseSepolia()
      } catch (finalErr: any) {
        setErrorMsg(finalErr?.message ?? 'Failed to switch network.')
      }
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
          {errorMsg && (
            <div className="mt-1 text-xs text-red-300">{errorMsg}</div>
          )}
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
  )
}
