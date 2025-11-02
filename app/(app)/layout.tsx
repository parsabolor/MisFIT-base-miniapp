'use client'

import { RootProvider } from "../rootProvider"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">{children}</main>
    </RootProvider>
  )
}
