import SiteTabs from '@/components/SiteTabs'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteTabs />
      {children}
    </>
  )
}
