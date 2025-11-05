'use client'

import { useAccount } from 'wagmi'
// import your UI + data hooks as needed

export default function LeaderboardClient() {
  const { isConnected } = useAccount()
  // render your leaderboard here
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h1 className="text-2xl font-semibold mb-6">Leaderboard</h1>
      {/* your list/table */}
    </div>
  )
}
