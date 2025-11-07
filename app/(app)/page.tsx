'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useMemo, useState } from 'react'
import { useAccount, useChainId } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'

import WalletConnect from '@/components/WalletConnect'
import { StatsCard } from '@/components/StatsCard'
import { ProgressBar } from '@/components/ProgressBar'
import { WorkoutDetailsModal } from '@/components/WorkoutDetailsModal'
import { addCheckin, getStats, setStats } from '@/lib/storage'
import type { CheckinMeta } from '@/lib/types'
import { useCheckedInToday, useCheckInWrite, useOnchainStats } from '@/lib/chain/checkins'

type Stats = {
  currentStreak: number
  bestStreak: number
  totalCheckIns: number
  lastCheckInDate: string | null
}

function startOfUtcDay(d: Date) {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}
function readPseudonym(address?: string | null) {
  if (!address) return ''
  try {
    const raw = localStorage.getItem(`misfit-profile-${address}`)
    const obj = raw ? JSON.parse(raw) : null
    return obj?.pseudonym || ''
  } catch { return '' }
}

export default function Page() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const onWrongChain = isConnected && chainId !== undefined && chainId !== baseSepolia.id

  const { data: todayOnchain, refetch: refetchToday } = useCheckedInToday(address as any)
  const { refetch: refetchOnchainStats } = useOnchainStats(address as any)
  const { checkInAndWait, isPending } = useCheckInWrite()

  const [open, setOpen] = useState(false)
  const [pseudo, setPseudo] = useState('')
  const [txError, setTxError] = useState<string | null>(null)

  const [stats, setLocalStats] = useState<Stats>({
    currentStreak: 0, bestStreak: 0, totalCheckIns: 0, lastCheckInDate: null,
  })

  useEffect(() => {
    if (!address) return
    const s = getStats(address)
    if (s) setLocalStats(s)
    setPseudo(readPseudonym(address))
  }, [address])

  const alreadyTodayLocal = useMemo(() => {
    if (!stats.lastCheckInDate) return false
    const last = new Date(stats.lastCheckInDate)
    return startOfUtcDay(last) === startOfUtcDay(new Date())
  }, [stats.lastCheckInDate])

  const alreadyToday = (todayOnchain as boolean | undefined) ?? alreadyTodayLocal

  async function submit(payload: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) {
    if (!address) return
    setTxError(null)
    try {
      await checkInAndWait()
    } catch (e: any) {
      setTxError(e?.shortMessage || e?.message || 'Transaction was rejected or failed. Try again.')
      return
    }
    try { await refetchToday?.(); await refetchOnchainStats?.() } catch {}

    const nowIso = new Date().toISOString()
    const meta: CheckinMeta = { version: 'misfit-checkin-1', userId: address, checkinAt: nowIso, ...payload }
    addCheckin(address, meta)

    const s = getStats(address)
    const last = s.lastCheckInDate ? new Date(s.lastCheckInDate) : null
    const lastDay = last ? startOfUtcDay(last) : null
    const todayDay = startOfUtcDay(new Date(nowIso))
    const isDup = lastDay === todayDay
    if (!isDup) {
      s.currentStreak = last && todayDay - (lastDay as number) === 86400000 ? s.currentStreak + 1 : 1
      s.bestStreak = Math.max(s.bestStreak, s.currentStreak)
      s.totalCheckIns += 1
      s.lastCheckInDate = nowIso
    }
    setStats(address, s)
    setLocalStats(s)
    setOpen(false)
  }

  const { currentStreak, bestStreak, totalCheckIns } = stats

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <img src="/logo.png" alt="MisFIT Logo" className="w-24 h-24 md:w-32 md:h-32" />
        <h1 className="text-4xl md:text-5xl font-bold">MisFIT Check-ins</h1>

        {pseudo && (
          <div className="text-sm text-neutral-300">
            Welcome, <span className="font-semibold">{pseudo}</span>
          </div>
        )}

        <p className="text-muted-foreground max-w-2xl">
          Track your daily check-ins and build unstoppable streaks
        </p>

        <WalletConnect />

        {isConnected ? (
          <button
            onClick={() => setOpen(true)}
            disabled={onWrongChain || alreadyToday || isPending}
            className={[
              'mt-2 inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition',
              onWrongChain || alreadyToday || isPending
                ? 'bg-primary/40 text-primary-foreground/70 cursor-not-allowed'
                : 'bg-primary text-primary-foreground hover:opacity-90',
            ].join(' ')}
            title={
              onWrongChain
                ? 'Switch to Base Sepolia to check in'
                : alreadyToday
                ? 'You have already checked in today'
                : isPending
                ? 'Waiting for wallet / transaction'
                : 'Start your daily check-in'
            }
          >
            {onWrongChain
              ? 'Wrong network'
              : alreadyToday
              ? 'Already checked in today'
              : isPending
              ? 'Confirming…'
              : 'Check in for Today'}
          </button>
        ) : (
          <div className="text-sm text-muted-foreground">Connect your wallet to check in.</div>
        )}

        {!!txError && (
          <div className="mt-2 rounded-lg border border-yellow-500/30 bg-yellow-500/10 px-3 py-2 text-xs text-yellow-200">
            {txError}
          </div>
        )}
      </div>

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

      {isConnected && (
        <section className="rounded-2xl bg-card p-8 border border-white/10 shadow-card">
          <h3 className="text-xl font-semibold mb-2">Progress Towards Badges</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Track your overall streak milestones.
          </p>
          <div className="space-y-4">
            <ProgressBar label="30-Day Streak" current={currentStreak} total={30} />
          </div>
        </section>
      )}

      {isConnected && address && !onWrongChain && (
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
