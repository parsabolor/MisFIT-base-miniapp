'use client'

import * as React from 'react'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

export default function NetworkGuard() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChainAsync, isPending } = useSwitchChain()

  if (!isConnected) return null
  const onWrong = !!chainId && chainId !== baseSepolia.id
  if (!onWrong) return null

  async function handleSwitch() {
    try {
      // 1) Ask the connected wallet to switch using Wagmi
      await switchChainAsync({ chainId: baseSepolia.id })
      return
    } catch (err) {
      console.warn('wagmi switchChain failed, trying raw EIP-3326…', err)
    }

    // 2) Fallback: direct request (works well with MetaMask)
    const eth = typeof window !== 'undefined' ? (window as any).ethereum : undefined
    if (!eth?.request) return

    // Base Sepolia = 0x14A34 (84532)
    const chainIdHex = '0x14A34'
    try {
      await eth.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      })
      return
    } catch (e: any) {
      // 4902 = chain not added -> add and retry switch
      if (e?.code === 4902) {
        try {
          await eth.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: chainIdHex,
              chainName: 'Base Sepolia',
              nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia.basescan.org'],
            }],
          })
          await eth.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chainIdHex }],
          })
        } catch (e2) {
          console.warn('add/switch Base Sepolia failed', e2)
        }
      } else {
        console.warn('wallet_switchEthereumChain failed', e)
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
