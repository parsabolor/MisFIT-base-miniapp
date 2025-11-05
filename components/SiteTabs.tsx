'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAccount } from 'wagmi';
import type { Route } from 'next';

type Tab = { label: string; href: Route };

const TABS: Tab[] = [
  { label: 'Dashboard',   href: '/' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Challenges',  href: '/challenges' },
  { label: 'Trophy Case', href: '/trophy' }, // leave as-is for now
];

export default function SiteTabs() {
  const pathname = usePathname();
  const { address, isConnected } = useAccount();

  return (
    <div className="sticky top-0 z-40 w-full border-b border-white/10 bg-background/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className="flex items-center justify-between"
          aria-label="Primary"
        >
          {/* Tabs */}
          <div className="flex gap-1 overflow-x-auto py-3">
            {TABS.map((t) => {
              const active =
                t.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(t.href);
              return (
                <Link
                  key={t.href}
                  href={t.href}
                  className={[
                    'relative whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition',
                    active
                      ? 'text-white'
                      : 'text-neutral-300 hover:text-white/90',
                  ].join(' ')}
                >
                  {t.label}
                  {/* active underline */}
                  <span
                    className={[
                      'absolute left-3.5 right-3.5 -bottom-0.5 h-0.5 rounded-full transition-opacity',
                      active ? 'bg-white/60 opacity-100' : 'opacity-0',
                    ].join(' ')}
                  />
                </Link>
              );
            })}
          </div>

          {/* “You” chip */}
          <div className="hidden sm:flex items-center gap-2 py-3">
            {isConnected && address && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-neutral-300">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                You: {address.slice(0, 6)}…{address.slice(-4)}
              </span>
            )}
          </div>
        </nav>
      </div>
    </div>
  );
}
