'use client'

import { switchChain } from '@wagmi/core'
import { baseSepolia } from 'wagmi/chains'
import { wagmiConfig } from '@/providers/WagmiProvider'

/**
 * Attempt to switch the connected wallet to Base Sepolia.
 * If user rejects or the chain isn’t added, we just warn and return.
 */
export async function ensureBaseSepolia() {
  try {
    await switchChain(wagmiConfig, { chainId: baseSepolia.id })
  } catch (err) {
    // Non-fatal: UI can still render a "Switch network" button elsewhere
    console.warn('Switch to Base Sepolia was not completed', err)
  }
}
