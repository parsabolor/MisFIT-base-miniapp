'use client'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { RootProvider } from '../rootProvider'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <RootProvider>{children}</RootProvider>
}
