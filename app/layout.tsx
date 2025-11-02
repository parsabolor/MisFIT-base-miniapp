import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from '@/providers/WagmiProvider'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MisFIT Check-ins',
  description: 'Track daily check-ins and build streaks on Base',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>
        <AppProviders>
          <header className="border-b border-neutral-800 sticky top-0 z-40 bg-neutral-950/80 backdrop-blur">
            <div className="container py-3 flex items-center justify-between">
              <Link href="/" className="font-semibold">MisFIT<span className="text-misfit-red">.</span> Base</Link>
              <nav className="hidden sm:flex items-center gap-4 text-sm">
                <Link href="/checkin">Check-in</Link>
                <Link href="/challenges">Challenges</Link>
                <Link href="/trophy-case">Trophy</Link>
                <Link href="/leaderboard">Leaderboard</Link>
              </nav>
              <ConnectButton chainStatus="icon" showBalance={false} />
            </div>
          </header>
          <main className="container py-6">{children}</main>
        </AppProviders>
      </body>
    </html>
  )
}
