'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next' // 👈 key import

const TABS = [
  { href: '/' as Route, label: 'Dashboard' },
  { href: '/leaderboard' as Route, label: 'Leaderboard' },
  { href: '/challenges' as Route, label: 'Challenges' },
  { href: '/trophy-case' as Route, label: 'Trophy Case' },
] as const

export default function SiteTabs() {
  const pathname = usePathname()
  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-1 overflow-x-auto py-3" aria-label="Primary">
          {TABS.map((t) => {
            const active = t.href === '/' ? pathname === '/' : pathname.startsWith(t.href)
            return (
              <Link
                key={t.href}
                href={t.href}
                className={[
                  'whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition',
                  active ? 'bg-white/10 text-white' : 'text-neutral-300 hover:bg-white/5 hover:text-white',
                ].join(' ')}
                aria-current={active ? 'page' : undefined}
              >
                {t.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
