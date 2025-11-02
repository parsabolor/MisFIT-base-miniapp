'use client'

import { ReactNode, useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import WagmiProviders from '../providers/WagmiProvider'

export function RootProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviders>
        {children}
      </WagmiProviders>
    </QueryClientProvider>
  )
}
