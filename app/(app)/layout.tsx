'use client'

import { RootProvider } from '../rootProvider'
import SiteTabs from '@/components/SiteTabs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <RootProvider>
      <SiteTabs />
      {children}
    </RootProvider>
  )
}
