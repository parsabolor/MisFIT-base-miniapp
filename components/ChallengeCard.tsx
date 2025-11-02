'use client'
import React from 'react'
import Link from 'next/link'
import type { Challenge } from '@/lib/types'

export function ChallengeCard({ c, enrolled, requires, onEnroll }:
  { c: Challenge; enrolled?: boolean; requires?: string; onEnroll?: ()=>void }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl" style={{ color: c.theme.accent }}>{c.emoji}</div>
          <div>
            <div className="font-semibold">{c.title}</div>
            <div className="text-xs text-neutral-400 capitalize">{c.difficulty} • {c.durationDays} days</div>
          </div>
        </div>
        <span className="badge">{c.status}</span>
      </div>
      <p className="mt-3 text-neutral-300 text-sm">{c.description}</p>
      <div className="mt-3 flex gap-2 flex-wrap">
        {c.tokenRequirement && (
          <span className="badge">Requires {c.tokenRequirement.amount} {c.tokenRequirement.symbol}</span>
        )}
        {requires && <span className="badge">{requires}</span>}
        {enrolled && <span className="badge">Enrolled</span>}
      </div>
      <div className="mt-4 flex gap-2">
        <Link href={`/challenges/${c.slug}`} className="btn btn-outline">View</Link>
        {c.status !== 'completed' && !enrolled && (
          <button className="btn btn-primary" onClick={onEnroll}>Enroll</button>
        )}
      </div>
    </div>
  )
}
