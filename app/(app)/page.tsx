'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import WalletConnect from '@/components/WalletConnect'
import { StatsCard } from '@/components/StatsCard'
import { ProgressBar } from '@/components/ProgressBar'
import { WorkoutDetailsModal } from '@/components/WorkoutDetailsModal'
import { addCheckin, getStats, setStats } from '@/lib/storage'
import type { CheckinMeta } from '@/lib/types'

function startOfUtcDay(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

export default function Page() {
  const { address, isConnected } = useAccount()
  const [open, setOpen] = useState(false)
  const [stats, setLocalStats] = useState({
    currentStreak: 0,
    bestStreak: 0,
    totalCheckIns: 0,
    lastCheckInDate: null as string | null,
  })

  // Load stats when wallet connects/changes
  useEffect(() => {
    if (!address) return
    const s = getStats(address)
    if (s) setLocalStats(s)
  }, [address])

  // Have they already checked in today?
  const alreadyToday = useMemo(() => {
    if (!stats.lastCheckInDate) return false
    const last = new Date(stats.lastCheckInDate)
    return startOfUtcDay(last) === startOfUtcDay(new Date())
  }, [stats.lastCheckInDate])

  // Submit handler (no double-counting on same day)
  async function submit(payload: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) {
    if (!address) return

    const now = new Date().toISOString()
    const meta: CheckinMeta = {
      version: 'misfit-checkin-1',
      userId: address,
      checkinAt: now,
      ...payload,
    }
    // You can allow multiple logs per day, but stats won’t change on duplicates:
    addCheckin(address, meta)

    const s = getStats(address)
    const last = s.lastCheckInDate ? new Date(s.lastCheckInDate) : null
    const lastDay = last ? startOfUtcDay(last) : null
    const todayDay = startOfUtcDay(new Date(now))
    const isDup = lastDay === todayDay

    if (!isDup) {
      if (last && todayDay - (lastDay as number) === 24 * 60 * 60 * 1000) {
        s.currentStreak += 1
      } else {
        s.currentStreak = 1
      }
      s.bestStreak = Math.max(s.bestStreak, s.currentStreak)
      s.totalCheckIns += 1
      s.lastCheckInDate = now
    } else {
      // keep the original stats; optionally keep the original lastCheckInDate
      // s.lastCheckInDate = s.lastCheckInDate // no change
    }

    setStats(address, s)
    setLocalStats(s)
    setOpen(false)
  }

  const { currentStreak, bestStreak, totalCheckIns } = stats

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

        {isConnected ? (
          <button
            onClick={() => setOpen(true)}
            disabled={alreadyToday}
            className={[
              'mt-2 inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition',
              alreadyToday
                ? 'bg-primary/40 text-primary-foreground/70 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90',
            ].join(' ')}
            title={alreadyToday ? 'You have already checked in today' : 'Start your daily check-in'}
          >
            {alreadyToday ? 'Already checked in today' : 'Check in for Today'}
          </button>
        ) : (
          <div className="text-sm text-muted-foreground">Connect your wallet to check in.</div>
        )}
      </div>

      {/* Stats */}
      {isConnected && (
        <section>
          <h2 className="text-2xl font-semibold mb-6">Your Stats</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard label="Current Streak" value={currentStreak} icon="flame" highlight />
            <StatsCard label="Best Streak" value={bestStreak} icon="trophy" />
            <StatsCard label="Total Check-ins" value={totalCheckIns} icon="calendar" />
          </div>
        </section>
      )}

      {/* Progress */}
      {isConnected && (
        <section className="rounded-2xl bg-card p-8 border border-white/10 shadow-card">
          <h3 className="text-xl font-semibold mb-2">Progress Towards Badges</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track your overall streak and challenge milestones
          </p>
          <div className="space-y-4">
            <ProgressBar label="30-Day Streak" current={currentStreak} total={30} />
            <ProgressBar label="Mobility Month" current={currentStreak} total={30} colorClass="bg-teal-500" />
          </div>
        </section>
      )}

      {/* Modal */}
      {isConnected && address && (
        <WorkoutDetailsModal
          open={open}
          onClose={() => setOpen(false)}
          address={address}
          onSubmit={submit}
        />
      )}
    </div>
  )
}
