'use client'

import { baseSepolia } from 'wagmi/chains'
import { switchChain } from '@wagmi/core'
import { wagmiConfig } from '@/providers/WagmiProvider'

// Add + switch to Base Sepolia. Returns true on success, throws on final failure.
export async function ensureBaseSepolia(): Promise<boolean> {
  try {
    // Preferred path: wagmi/core switch (works if chain is already in wallet)
    await switchChain(wagmiConfig, { chainId: baseSepolia.id })
    return true
  } catch (err) {
    // If wallet doesn't have the chain (or user removed it), try to add it
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
      // Then switch again
      await switchChain(wagmiConfig, { chainId: baseSepolia.id })
      return true
    } catch (e) {
      console.warn('Add/switch Base Sepolia failed:', e)
      throw e
    }
  }
}
