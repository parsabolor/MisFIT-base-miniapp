'use client'

import { ReactNode } from 'react'
import { WagmiProvider as WagmiRoot } from 'wagmi'
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'MISFIT-DEMO'

export const wagmiConfig = getDefaultConfig({
  appName: 'MisFIT Check-ins',
  projectId,
  chains: [base, baseSepolia],
  transports: {
    [base.id]: http(),         // public RPCs are fine for now
    [baseSepolia.id]: http(),
  },
  ssr: true,
})

export default function WagmiProviders({ children }: { children: ReactNode }) {
  return (
    <WagmiRoot config={wagmiConfig}>
      <RainbowKitProvider theme={darkTheme()} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiRoot>
  )
}
