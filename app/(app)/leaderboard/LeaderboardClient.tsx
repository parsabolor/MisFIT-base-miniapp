'use client'

import * as React from 'react'
import { useAccount } from 'wagmi'

// ---- types ----
type Row = {
  rank: number
  address: `0x${string}`
  username?: string | null
  currentStreak: number
  bestStreak: number
  totalCheckIns: number
  lastCheckInAt?: string | null
}

type ApiResp = {
  items: Array<{
    address: `0x${string}`
    username?: string | null
    currentStreak?: number
    bestStreak?: number
    totalCheckIns?: number
    lastCheckInAt?: string | null
  }>
}

// ---- utils (inline to avoid imports) ----
function truncateMiddle(addr: string, left = 6, right = 4) {
  if (!addr) return ''
  if (addr.length <= left + right) return addr
  return `${addr.slice(0, left)}…${addr.slice(-right)}`
}

function clsx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ')
}

// Derive a single local row from localStorage-based stats (so the page is never empty)
// You already have local storage helpers; we read directly to avoid coupling.
function readLocalUserRow(address: `0x${string}` | undefined): Row[] {
  if (!address) return []
  try {
    const statsRaw = localStorage.getItem(`misfit-stats-${address}`)
    const stats = statsRaw ? JSON.parse(statsRaw) : null
    const current = Number(stats?.currentStreak || 0)
    const best = Number(stats?.bestStreak || 0)
    const total = Number(stats?.totalCheckIns || 0)
    const last = stats?.lastCheckInDate || null
    return [
      {
        rank: 1,
        address,
        username: null,
        currentStreak: current,
        bestStreak: best,
        totalCheckIns: total,
        lastCheckInAt: last,
      },
    ]
  } catch {
    return []
  }
}

// ---- component ----
export default function LeaderboardClient() {
  const { address, isConnected } = useAccount()
  const [rows, setRows] = React.useState<Row[] | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [query, setQuery] = React.useState('')

  // fetch leaderboard if available; gracefully fall back to local-only
  React.useEffect(() => {
    let cancelled = false

    async function load() {
      setError(null)
      // Try remote API
      try {
        const res = await fetch('/api/leaderboard?limit=100', { cache: 'no-store' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: ApiResp = await res.json()

        const normalized: Row[] = data.items
          .map((it) => ({
            address: it.address,
            username: it.username ?? null,
            currentStreak: Number(it.currentStreak ?? 0),
            bestStreak: Number(it.bestStreak ?? 0),
            totalCheckIns: Number(it.totalCheckIns ?? 0),
            lastCheckInAt: it.lastCheckInAt ?? null,
          }))
          .sort((a, b) => {
            // Sort by bestStreak desc, then currentStreak desc, then total desc
            if (b.bestStreak !== a.bestStreak) return b.bestStreak - a.bestStreak
            if (b.currentStreak !== a.currentStreak) return b.currentStreak - a.currentStreak
            return b.totalCheckIns - a.totalCheckIns
          })
          .map((r, i) => ({ ...r, rank: i + 1 }))

        if (!cancelled) setRows(normalized)
        return
      } catch (e) {
        // Swallow and fallback to local
        if (!cancelled) {
          const fallback = readLocalUserRow(address as `0x${string}` | undefined)
          setRows(fallback.length ? fallback : [])
          setError('Showing local results only')
        }
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [address])

  const filtered = React.useMemo(() => {
    if (!rows) return null
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => {
      const name = (r.username || '').toLowerCase()
      const addr = r.address.toLowerCase()
      return name.includes(q) || addr.includes(q)
    })
  }, [rows, query])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Leaderboard</h1>
          <p className="text-sm text-muted-foreground">
            Top streaks and total check-ins across MisFIT.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search address or username"
            className="input w-64"
          />
        </div>
      </div>

      {/* Connection hint */}
      {!isConnected && (
        <div className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-neutral-300">
          Connect your wallet to appear locally if the global leaderboard is unavailable.
        </div>
      )}

      {/* Error (non-blocking) */}
      {!!error && (
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-3 text-sm">
          {error}
        </div>
      )}

      {/* Table / Skeleton / Empty */}
      {filtered === null ? (
        // skeleton
        <div className="rounded-2xl border border-white/10 bg-card/60 p-6 shadow-card">
          <div className="animate-pulse space-y-3">
            <div className="h-6 w-1/3 rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
            <div className="h-10 w-full rounded bg-white/10" />
            <div className="h-10 w-2/3 rounded bg-white/10" />
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-card/60 p-8 text-center shadow-card">
          <div className="text-lg font-medium">No entries yet</div>
          <div className="mt-1 text-sm text-neutral-400">
            Be the first to check in and build a streak.
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-card/60 shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-white/5">
                <tr className="text-left text-xs uppercase tracking-wide text-neutral-400">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Current</th>
                  <th className="px-4 py-3">Best</th>
                  <th className="px-4 py-3">Total</th>
                  <th className="px-4 py-3">Last Check-in</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const isYou = address && r.address?.toLowerCase() === address.toLowerCase()
                  return (
                    <tr
                      key={r.rank + r.address}
                      className={clsx(
                        'border-t border-white/10',
                        isYou && 'bg-primary/5'
                      )}
                    >
                      <td className="px-4 py-3">
                        <span
                          className={clsx(
                            'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-semibold',
                            r.rank === 1
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : r.rank === 2
                              ? 'bg-neutral-500/20 text-neutral-200'
                              : r.rank === 3
                              ? 'bg-amber-700/20 text-amber-300'
                              : 'bg-white/10 text-white'
                          )}
                        >
                          {r.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-7 w-7 shrink-0 rounded-full bg-white/10" />
                          <div className="flex flex-col">
                            <span className="text-sm">
                              {r.username || truncateMiddle(r.address, 6, 4)}
                              {isYou && <span className="ml-2 text-xs text-primary">(you)</span>}
                            </span>
                            <span className="text-xs text-neutral-500">{truncateMiddle(r.address, 8, 6)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium">{r.currentStreak}</td>
                      <td className="px-4 py-3">{r.bestStreak}</td>
                      <td className="px-4 py-3">{r.totalCheckIns}</td>
                      <td className="px-4 py-3 text-sm text-neutral-400">
                        {r.lastCheckInAt
                          ? new Date(r.lastCheckInAt).toLocaleDateString()
                          : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* footer hint */}
          <div className="border-t border-white/10 px-4 py-3 text-right text-xs text-neutral-500">
            Sorted by Best Streak → Current Streak → Total Check-ins
          </div>
        </div>
      )}
    </div>
  )
}
