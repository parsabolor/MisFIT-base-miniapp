'use client'

import React, { useState } from 'react'
import { useAccount } from 'wagmi'
import { WorkoutDetailsModal } from '@/components/WorkoutDetailsModal'
import type { CheckinMeta } from '@/lib/types'
import { addCheckin, getStats, setStats } from '@/lib/storage'
import { SuccessSheet } from '@/components/SuccessSheet'

export default function CheckinClient() {
  const { address } = useAccount()

  // Controlled modal state
  const [open, setOpen] = useState(false)
  const [summary, setSummary] = useState<React.ReactNode>(null)

  const onStart = () => setOpen(true)

  const submit = async (payload: Omit<CheckinMeta,'version'|'userId'|'checkinAt'>) => {
    if (!address) return
    const now = new Date().toISOString()
    const meta: CheckinMeta = { version: 'misfit-checkin-1', userId: address, checkinAt: now, ...payload }
    addCheckin(address, meta)

    // update streak stats (local storage mock)
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
            {(meta.lowlight.chips || []).join(', ') || '—'}{' '}
            {meta.lowlight.coachFlag ? '(coach reach-out)' : ''}
          </div>
        )}
      </div>
    )

    // close modal, show success
    setOpen(false)
    // SuccessSheet is controlled by its own "open" prop—open it right after closing the modal
    setTimeout(() => setSuccessOpen(true), 0)
  }

  const [successOpen, setSuccessOpen] = useState(false)

  if (!address) return <div className="card">Connect your wallet to check-in.</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Daily Check-in</h1>
        <button className="btn btn-primary" onClick={onStart}>
          Start Check-in
        </button>
      </div>

      {/* Controlled Modal */}
      <WorkoutDetailsModal
        address={address}
        open={open}
        onOpenChange={setOpen}
        onSubmit={submit}
      />

      <SuccessSheet
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        summary={summary}
      />
    </div>
  )
}
