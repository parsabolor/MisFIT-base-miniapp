'use client'
export const dynamic = 'force-dynamic'

import React, { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { StatsCard } from '@/components/StatsCard'
import { ProgressBar } from '@/components/ProgressBar'
import WalletConnect from '@/components/WalletConnect'
import { WorkoutDetailsModal } from '@/components/WorkoutDetailsModal'
import { SuccessSheet } from '@/components/SuccessSheet'
import type { CheckinMeta } from '@/lib/types'
import { addCheckin, getStats, setStats } from '@/lib/storage'

export default function Page() {
  const { address, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<React.ReactNode>(null)
  const [stats, setStatsState] = useState({
    current: 0,
    best: 0,
    total: 0,
  })

  // Load stats from storage whenever wallet connects
  useEffect(() => {
    if (!address) return
    const s = getStats(address)
    setStatsState({
      current: s.currentStreak,
      best: s.bestStreak,
      total: s.totalCheckIns,
    })
  }, [address])

  // Handle check-in submission
  const submit = async (payload: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) => {
    if (!address) return
    const now = new Date().toISOString()
    const meta: CheckinMeta = {
      version: 'misfit-checkin-1',
      userId: address,
      checkinAt: now,
      ...payload,
    }

    addCheckin(address, meta)
    const s = getStats(address)
    const last = s.lastCheckInDate ? new Date(s.lastCheckInDate) : null
    const lastDay = last ? Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()) : null
    const today = new Date(now)
    const todayDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

    if (lastDay === todayDay) {
      // already checked in today
    } else if (last && todayDay - (lastDay as number) === 24 * 60 * 60 * 1000) {
      s.currentStreak += 1
    } else {
      s.currentStreak = 1
    }

    s.bestStreak = Math.max(s.bestStreak, s.currentStreak)
    s.totalCheckIns += 1
    s.lastCheckInDate = now
    setStats(address, s)
    setStatsState({
      current: s.currentStreak,
      best: s.bestStreak,
      total: s.totalCheckIns,
    })

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
      </div>
    )
    setOpen(false)
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

        {/* CTA */}
        {isConnected ? (
          <button
            onClick={() => setOpen(true)}
            className="mt-2 inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold
                       bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            Check in for Today
          </button>
        ) : (
          <div className="text-sm text-muted-foreground">
            Connect your wallet to check in.
          </div>
        )}
      </div>

      {/* Stats */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Your Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard label="Current Streak" value={stats.current} icon="flame" highlight />
          <StatsCard label="Best Streak" value={stats.best} icon="trophy" />
          <StatsCard label="Total Check-ins" value={stats.total} icon="calendar" />
        </div>
      </section>

      {/* Progress */}
      <section className="rounded-2xl bg-card p-8 border border-white/10 shadow-card">
        <h3 className="text-xl font-semibold mb-2">Progress Towards Badges</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Track your overall streak and challenge milestones
        </p>
        <div className="space-y-4">
          <ProgressBar label="30-Day Streak" current={stats.current} total={30} />
          <ProgressBar label="Mobility Month" current={stats.current} total={30} colorClass="bg-teal-500" />
        </div>
      </section>

      {/* Modal + Success */}
      {address && (
        <>
          <WorkoutDetailsModal address={address} onSubmit={submit} open={open} setOpen={setOpen} />
          <SuccessSheet open={!!summary} onClose={() => setSummary(null)} summary={summary} />
        </>
      )}
    </div>
  )
}
