'use client'

import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default function NotFound() {
  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground">The page you’re looking for doesn’t exist.</p>
    </div>
  )
}
