import React from 'react'
export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.min(100, Math.max(0, (current / Math.max(total, 1)) * 100))
  return (
    <div className="progress" aria-valuenow={current} aria-valuemax={total} role="progressbar">
      <span style={{ width: `${pct}%` }} />
    </div>
  )
}
