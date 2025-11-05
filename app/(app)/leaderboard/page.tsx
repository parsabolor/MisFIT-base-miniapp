'use client'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import LeaderboardClient from './LeaderboardClient' // or your component

export default function Page() {
  return <LeaderboardClient />
}
