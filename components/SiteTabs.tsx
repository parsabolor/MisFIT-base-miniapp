'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

// --- simple className combiner (inline) ---
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ')
}

// --- types & data ---
type Tab = { label: string; href: string }

const TABS: Tab[] = [
  { label: 'Dashboard',   href: '/' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Challenges',  href: '/challenges' },
  { label: 'Trophy Case', href: '/trophy-case' }, // keep for later
  { label: 'Settings',    href: '/settings' },
]

// --- link wrapper to satisfy typedRoutes ---
function NavLink(props: React.ComponentProps<'a'> & { href: string }) {
  const { href, ...rest } = props
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <Link href={href as any} {...rest} />
}

// --- main component ---
export default function SiteTabs() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          aria-label="Primary"
          className="flex items-center gap-1 py-3 overflow-x-auto"
        >
          {TABS.map((t) => {
            const active =
              pathname === t.href ||
              (t.href !== '/' && pathname?.startsWith(t.href))

            return (
              <NavLink
                key={t.href}
                href={t.href}
                className={cn(
                  'relative whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition',
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5'
                )}
              >
                {t.label}
                {active && (
                  <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-primary/80" />
                )}
              </NavLink>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
