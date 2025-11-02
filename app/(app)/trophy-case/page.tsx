'use client'
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import React from 'react'

export default function TrophyCase() {
  // Mock earned
  const earned = [
    { name: 'Loosen Up', tier: 'Bronze' },
    { name: 'Flow State', tier: 'Silver' },
  ]
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Trophy Case</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        {earned.map((b, i) => (
          <div key={i} className="card">
            <div className="text-sm text-neutral-400">{b.tier}</div>
            <div className="text-xl font-semibold">{b.name}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
