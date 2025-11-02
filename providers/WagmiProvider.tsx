'use client'
import React from 'react'
import { http, createConfig, WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, getDefaultConfig, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { base } from '@/lib/chains'

const config = getDefaultConfig({
  appName: 'MisFIT Check-ins',
  projectId: 'MISFIT-DEMO', // replace with WalletConnect ID in prod
  chains: [base],
  transports: { [base.id]: http('https://mainnet.base.org') },
})

const qc = new QueryClient()

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config as unknown as ReturnType<typeof createConfig>}>
      <QueryClientProvider client={qc}>
        <RainbowKitProvider
          theme={{ lightMode: lightTheme(), darkMode: darkTheme({ accentColor: '#ef4444' }) }}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
