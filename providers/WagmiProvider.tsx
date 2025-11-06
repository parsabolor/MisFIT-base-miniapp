'use client'

import { ReactNode } from 'react'
import { WagmiProvider as WagmiRoot } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

/**
 * WalletConnect project id (public). Replace in Vercel:
 *   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_id
 * This fallback is only for local/dev.
 */
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'MISFIT-DEMO'

/**
 * Optional Alchemy RPC for Base Sepolia (more reliable than public RPCs):
 *   NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA=https://base-sepolia.g.alchemy.com/v2/KEY
 * We fall back to the official public RPC if not set.
 */
const baseSepoliaRpc =
  process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA || 'https://sepolia.base.org'

/**
 * Optional Alchemy RPC for Base mainnet:
 *   NEXT_PUBLIC_ALCHEMY_BASE=https://base-mainnet.g.alchemy.com/v2/KEY
 * We fall back to the default http() (public) if not set.
 */
const baseMainnetRpc =
  process.env.NEXT_PUBLIC_ALCHEMY_BASE || undefined

// Put Base Sepolia FIRST so the connect modal defaults to the testnet
export const wagmiConfig = getDefaultConfig({
  appName: 'MisFIT Check-ins',
  projectId,
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(baseSepoliaRpc),
    [base.id]: http(baseMainnetRpc), // undefined => public RPC
  },
  // Good for Next.js App Router
  ssr: true,
})

export default function WagmiProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiRoot config={wagmiConfig}>
      <RainbowKitProvider
        theme={darkTheme()}
        modalSize="compact"
        // Prefer Base Sepolia in the modal
        initialChain={baseSepolia}
      >
        {children}
      </RainbowKitProvider>
    </WagmiRoot>
  )
}
