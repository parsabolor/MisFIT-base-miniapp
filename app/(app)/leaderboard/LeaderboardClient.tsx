'use client'

import React from 'react'
import { useAccount } from 'wagmi'

type Row = { rank: number; address: string; current: number; best: number }

// TODO: replace with real data later
const mock: Row[] = [
  { rank: 1, address: '0x1234...abcd', current: 21, best: 30 },
  { rank: 2, address: '0x9fE2...77c1', current: 18, best: 22 },
  { rank: 3, address: '0x55aa...bb22', current: 15, best: 19 },
]

export default function LeaderboardClient() {
  const { address } = useAccount()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Leaderboard</h1>
        <div className="text-sm text-neutral-400">
          {address ? `You: ${address.slice(0,6)}...${address.slice(-4)}` : 'Connect wallet to see placement'}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-4 py-3">Rank</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Current Streak</th>
              <th className="px-4 py-3">Best Streak</th>
            </tr>
          </thead>
          <tbody>
            {mock.map((r) => (
              <tr key={r.rank} className="border-t border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-medium">{r.rank}</td>
                <td className="px-4 py-3 font-mono">{r.address}</td>
                <td className="px-4 py-3">{r.current}</td>
                <td className="px-4 py-3 text-neutral-400">{r.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
