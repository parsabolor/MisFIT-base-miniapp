'use client'

import { WagmiProvider, createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// If you use RainbowKit, uncomment the next 2 lines and wrap children with it.
// import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
// import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

// Minimal wagmi config (tweak chains/transports as needed)
const wagmiConfig = createConfig({
  chains: [base],
  transports: { [base.id]: http() },
  ssr: true,
})

export default function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* If using RainbowKit:
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
        */}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
