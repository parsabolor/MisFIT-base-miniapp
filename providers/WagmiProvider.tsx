'use client'

import { ReactNode } from 'react'
import { WagmiProvider as WagmiRoot, createConfig, http } from 'wagmi'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'

/**
 * WalletConnect Project ID (required)
 */
const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'MISFIT-DEMO'

/**
 * RPC URLs
 */
const baseSepoliaRpc =
  process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA || 'https://sepolia.base.org'
const baseMainnetRpc =
  process.env.NEXT_PUBLIC_ALCHEMY_BASE || 'https://mainnet.base.org'

/**
 * ✅ Explicitly configure both Base & Base Sepolia
 * This fixes the "Chain not configured" error.
 */
export const wagmiConfig = createConfig({
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(baseSepoliaRpc),
    [base.id]: http(baseMainnetRpc),
  },
  ssr: true,
})

export default function WagmiProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiRoot config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme()}
        modalSize="compact"
        initialChain={baseSepolia}
      >
        {children}
      </RainbowKitProvider>
    </WagmiRoot>
  )
}
