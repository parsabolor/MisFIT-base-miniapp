'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import WalletConnect from '@/components/WalletConnect'
import { StatsCard } from '@/components/StatsCard'
import { ProgressBar } from '@/components/ProgressBar'
import { WorkoutDetailsModal } from '@/components/WorkoutDetailsModal'
import { SuccessSheet } from '@/components/SuccessSheet'
import type { CheckinMeta } from '@/lib/types'
import { addCheckin, getStats, setStats } from '@/lib/storage'

export default function Page() {
  const { address, isConnected } = useAccount()

  // UI state
  const [showCheckin, setShowCheckin] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)
  const [summary, setSummary] = useState<React.ReactNode>(null)

  // Stats state
  const [current, setCurrent] = useState(0)
  const [best, setBest] = useState(0)
  const [total, setTotal] = useState(0)

  // Load stats whenever wallet changes
  useEffect(() => {
    if (!address) {
      setCurrent(0); setBest(0); setTotal(0)
      return
    }
    const s = getStats(address)
    setCurrent(s.currentStreak || 0)
    setBest(s.bestStreak || 0)
    setTotal(s.totalCheckIns || 0)
  }, [address])

  // Submit handler used by the modal
  const submit = async (payload: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) => {
    if (!address) return
    const now = new Date().toISOString()
    const meta: CheckinMeta = { version: 'misfit-checkin-1', userId: address, checkinAt: now, ...payload }
    addCheckin(address, meta)

    // Streak math (UTC day bounds)
    const s = getStats(address)
    const last = s.lastCheckInDate ? new Date(s.lastCheckInDate) : null
    const lastDay = last ? Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()) : null
    const today = new Date(now)
    const todayDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

    if (lastDay === todayDay) {
      // already checked in today; keep streak
    } else if (last && todayDay - (lastDay as number) === 24 * 60 * 60 * 1000) {
      s.currentStreak += 1
    } else {
      s.currentStreak = 1
    }
    s.bestStreak = Math.max(s.bestStreak, s.currentStreak)
    s.totalCheckIns += 1
    s.lastCheckInDate = now
    setStats(address, s)

    // Reflect new stats immediately
    setCurrent(s.currentStreak || 0)
    setBest(s.bestStreak || 0)
    setTotal(s.totalCheckIns || 0)

    // Configure success UI
    setSummary(
      <div className="space-y-2">
        <div className="text-sm text-neutral-300">
          Streak: <b>{s.currentStreak}</b> (best {s.bestStreak})
        </div>
        <div className="text-sm">
          <span className="text-neutral-400">Title:</span> {meta.title || '—'}
        </div>
        <div className="text-sm">
          <span className="text-neutral-400">Rating:</span> {meta.rating}
        </div>
        {meta.lowlight && (
          <div className="text-sm">
            <span className="text-neutral-400">Lowlight:</span>{' '}
            {(meta.lowlight.chips || []).join(', ') || '—'} {meta.lowlight.coachFlag ? '(coach reach-out)' : ''}
          </div>
        )}
      </div>
    )
    setShowCheckin(false)
    setSuccessOpen(true)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 text-center">
        <img src="/logo.png" alt="MisFIT Logo" className="w-24 h-24 md:w-32 md:h-32" />
        <h1 className="text-4xl md:text-5xl font-bold">MisFIT Check-ins</h1>
        <p className="text-muted-foreground max-w-2xl">
          Track your daily check-ins and build unstoppable streaks
        </p>

        <WalletConnect />

        {/* Single CTA — opens the modal directly */}
        {isConnected ? (
          <button
            onClick={() => setShowCheckin(true)}
            className="mt-2 inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold
                       bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Check in for Today
          </button>
        ) : (
          <div className="text-sm text-muted-foreground">Connect your wallet to check in.</div>
        )}
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard label="Current Streak" value={current} icon="flame" highlight />
          <StatsCard label="Best Streak" value={best} icon="trophy" />
          <StatsCard label="Total Check-ins" value={total} icon="calendar" />
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-2xl bg-card p-8 border border-white/10 shadow-card">
        <h3 className="text-xl font-semibold mb-2">Progress Towards Badges</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track your overall streak and challenge milestones
        </p>
        <div className="space-y-4">
          <ProgressBar label="30-Day Streak" current={current} total={30} />
          <ProgressBar label="Mobility Month" current={Math.min(current, 30)} total={30} />
        </div>
      </section>

      {/* Check-in modal (rendered inline, no props needed) */}
      {isConnected && showCheckin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-xl">
            <button
              className="absolute right-3 top-3 text-sm text-neutral-400 hover:text-white"
              onClick={() => setShowCheckin(false)}
              aria-label="Close"
            >
              ✕
            </button>
            <WorkoutDetailsModal address={address as string} onSubmit={submit} />
          </div>
        </div>
      )}

      {/* Success sheet */}
      <SuccessSheet open={successOpen} onClose={() => setSuccessOpen(false)} summary={summary} />
    </div>
  )
}
