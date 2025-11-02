'use client'
import React from 'react'

export function StatsCard({
  title, value, sub, mono = false, icon,
}: { title: string; value: string | number; sub?: string; mono?: boolean; icon?: React.ReactNode }) {
  return (
    <div className="card">
      <div className="flex items-center gap-3">
        {icon && <div className="text-misfit-red">{icon}</div>}
        <div>
          <div className="text-sm text-neutral-400">{title}</div>
          <div className={mono ? 'text-2xl font-semibold font-mono' : 'text-2xl font-semibold'}>{value}</div>
          {sub && <div className="text-xs text-neutral-500 mt-1">{sub}</div>}
        </div>
      </div>
    </div>
  )
}
