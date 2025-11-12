import SiteTabs from '@/components/SiteTabs'
import NetworkGuard from '@/components/NetworkGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteTabs />
      {children}
    </>
  )
}
