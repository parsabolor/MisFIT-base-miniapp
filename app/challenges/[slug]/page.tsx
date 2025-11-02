'use client'
import React from 'react'
import { useParams } from 'next/navigation'
import { challenges } from '@/lib/challenges'
import Link from 'next/link'

export default function ChallengeDetail() {
  const { slug } = useParams<{ slug: string }>()
  const c = challenges.find(x=>x.slug===slug)
  if (!c) return <div className="card">Not found</div>

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{c.emoji} {c.title}</h1>
        <Link href="/challenges" className="btn btn-outline">Back</Link>
      </div>
      <div className="card">
        <div className="text-sm text-neutral-400 capitalize">{c.difficulty} • {c.durationDays} days</div>
        <p className="mt-2 text-neutral-300">{c.description}</p>
        <div className="separator" />
        <div className="font-semibold mb-2">Weekly Timeline</div>
        <ol className="space-y-2 list-decimal pl-5">
          {c.timeline.map(t => (
            <li key={t.week}>
              <div className="font-medium">Week {t.week}: {t.title}</div>
              <div className="text-sm text-neutral-400">{t.description}</div>
            </li>
          ))}
        </ol>
        <div className="separator" />
        <div className="font-semibold mb-2">Rewards</div>
        <div className="flex gap-2 flex-wrap">
          {c.rewards.map(r => (
            <span key={r.day} className="badge">{r.tier} @ {r.day} days — {r.name}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
