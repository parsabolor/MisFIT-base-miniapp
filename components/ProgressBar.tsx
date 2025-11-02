"use client"
import React from "react"
import clsx from "classnames"

export function ProgressBar({
  label,
  current,
  total,
  colorClass,
  showFraction = true,
}: {
  label: string
  current: number
  total: number
  colorClass?: string
  showFraction?: boolean
}) {
  const pct = Math.max(0, Math.min(100, (current / Math.max(1, total)) * 100))
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="text-muted-foreground">
          {showFraction ? `${current}/${total}` : `${Math.round(pct)}%`}
        </span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={clsx(colorClass ?? "bg-accent", "h-full")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
