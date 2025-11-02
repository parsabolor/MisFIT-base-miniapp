'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAccount } from 'wagmi'
import { StatsCard } from '@/components/StatsCard'
import { ProgressBar } from '@/components/ProgressBar'
import Link from 'next/link'
import { getStats, isSameUTCDay } from '@/lib/storage'

export default function DashboardPage() {
  const { address } = useAccount()
  const [stats, setStats] = useState(() => ({ currentStreak: 0, bestStreak: 0, totalCheckIns: 0, lastCheckInDate: null as string | null }))

  useEffect(()=>{
    if (!address) return
    setStats(getStats(address))
  }, [address])

  const todayDone = useMemo(()=>{
    if (!stats.lastCheckInDate) return false
    const now = new Date().toISOString()
    return isSameUTCDay(stats.lastCheckInDate, now)
  }, [stats.lastCheckInDate])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/checkin" className="btn btn-primary">Quick Check-in</Link>
      </div>

      {!address && (
        <div className="card">
          <div className="text-sm text-neutral-300">Connect your wallet to see streaks, join challenges, and check-in.</div>
        </div>
      )}

      {address && (
        <div className="grid sm:grid-cols-3 gap-4">
          <StatsCard title="Current Streak" value={stats.currentStreak} sub={todayDone? 'You’ve checked in today' : 'No check-in yet today'} />
          <StatsCard title="Best Streak" value={stats.bestStreak} />
          <StatsCard title="Total Check-ins" value={stats.totalCheckIns} />
        </div>
      )}

      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Progress</div>
          <div className="text-xs text-neutral-500">Resets 00:00 UTC</div>
        </div>
        <ProgressBar current={todayDone ? 1 : 0} total={1} />
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="card">
          <div className="font-semibold mb-2">Challenges</div>
          <p className="text-sm text-neutral-400">Join a seasonal arc to earn badges.</p>
          <div className="mt-3">
            <Link href="/challenges" className="btn btn-outline">Open Challenge Hub</Link>
          </div>
        </div>
        <div className="card">
          <div className="font-semibold mb-2">Trophy Case</div>
          <p className="text-sm text-neutral-400">Your earned badges will show up here.</p>
          <div className="mt-3">
            <Link href="/trophy-case" className="btn btn-outline">View Trophy Case</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
