'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { WorkoutDetailsModal } from '@/components/WorkoutDetailsModal'
import type { CheckinMeta } from '@/lib/types'
import { addCheckin, getStats, setStats } from '@/lib/storage'
import { SuccessSheet } from '@/components/SuccessSheet'

export default function CheckinClient() {
  const { address } = useAccount()
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<React.ReactNode>(null)

  const submit = async (payload: Omit<CheckinMeta,'version'|'userId'|'checkinAt'>) => {
    if (!address) return
    const now = new Date().toISOString()
    const meta: CheckinMeta = { version: 'misfit-checkin-1', userId: address, checkinAt: now, ...payload }
    addCheckin(address, meta)

    const s = getStats(address)
    const last = s.lastCheckInDate ? new Date(s.lastCheckInDate) : null
    const lastDay = last ? Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate()) : null
    const today = new Date(now)
    const todayDay = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())

    if (lastDay === todayDay) {
      // already checked in today
    } else if (last && todayDay - (lastDay as number) === 24*60*60*1000) {
      s.currentStreak += 1
    } else {
      s.currentStreak = 1
    }
    s.bestStreak = Math.max(s.bestStreak, s.currentStreak)
    s.totalCheckIns += 1
    s.lastCheckInDate = now
    setStats(address, s)

    setSummary(
      <div className="space-y-2">
        <div className="text-sm text-neutral-300">Streak: <b>{s.currentStreak}</b> (best {s.bestStreak})</div>
        <div className="text-sm"><span className="text-neutral-400">Title:</span> {meta.title || '—'}</div>
        <div className="text-sm"><span className="text-neutral-400">Rating:</span> {meta.rating}</div>
      </div>
    )
    setOpen(false)
  }

  if (!address) return <div className="card">Connect your wallet to check-in.</div>

  return (
    <div className="space-y-6">
      <button
        onClick={() => setOpen(true)}
        className="w-full rounded-xl bg-rose-600 px-6 py-3 text-lg font-medium text-white hover:bg-rose-500"
      >
        Check in for Today
      </button>

      <WorkoutDetailsModal address={address} onSubmit={submit} open={open} setOpen={setOpen} />
      <SuccessSheet open={!!summary} onClose={()=>setSummary(null)} summary={summary} />
    </div>
  )
}
