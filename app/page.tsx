'use client'
export const dynamic = 'force-dynamic'

import { StatsCard } from "@/components/StatsCard"
import { ProgressBar } from "@/components/ProgressBar"
import WalletConnect from '@/components/WalletConnect'

export default function Page() {
  // mock stats for the visual demo
  const current = 12, best = 30, total = 74

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex flex-col items-center gap-6 text-center">
        <img src="/logo.png" alt="MisFIT Logo" className="w-24 h-24 md:w-32 md:h-32" />
        <h1 className="text-4xl md:text-5xl font-bold">MisFIT Check-ins</h1>
        <p className="text-muted-foreground max-w-2xl">
          Track your daily check-ins and build unstoppable streaks
        </p>
       
         <WalletConnect />
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
          <ProgressBar label="Mobility Month" current={12} total={30} colorClass="bg-teal-500" />
        </div>
      </section>
    </div>
  )
}
