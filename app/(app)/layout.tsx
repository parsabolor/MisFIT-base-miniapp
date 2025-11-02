'use client'

import { RootProvider } from '../rootProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      {children}
    </RootProvider>
  )
}
