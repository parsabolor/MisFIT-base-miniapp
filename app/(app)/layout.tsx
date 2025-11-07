import SiteTabs from '@/components/SiteTabs'
import NetworkGuard from '@/components/NetworkGuard'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteTabs />
      {/* Shows a “Wrong network” banner + switch button when not on Base Sepolia */}
      <NetworkGuard />
      {children}
    </>
  )
}
