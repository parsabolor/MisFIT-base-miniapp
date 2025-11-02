'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function NotFound() {
  const [queryClient] = useState(() => new QueryClient())
  return (
    <QueryClientProvider client={queryClient}>
      <div className="py-24 text-center space-y-4">
        <h1 className="text-3xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
        <a href="/" className="underline">Go back home</a>
      </div>
    </QueryClientProvider>
  )
}
