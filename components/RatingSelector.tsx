"use client"
import React from "react"
import clsx from "classnames"

export type RatingValue = 0 | 1 | 2 | 3 | 4 | 5

const RATINGS: { value: RatingValue; emoji: string; label: string }[] = [
  { value: 0, emoji: "😫", label: "Terrible" },
  { value: 1, emoji: "😕", label: "Bad" },
  { value: 2, emoji: "😐", label: "Okay" },
  { value: 3, emoji: "🙂", label: "Good" },
  { value: 4, emoji: "😊", label: "Great" },
  { value: 5, emoji: "🤩", label: "Amazing" },
]

export function RatingSelector({
  value,
  onChange,
}: {
  value: RatingValue | null
  onChange: (v: RatingValue) => void
}) {
  return (
    <div className="flex justify-between gap-2">
      {RATINGS.map((r) => (
        <button
          key={r.value}
          type="button"
          onClick={() => onChange(r.value)}
          className={clsx(
            "flex-1 p-4 rounded-lg border-2 transition-all",
            value === r.value
              ? "border-accent bg-accent/10"
              : "border-border hover:border-accent/50"
          )}
        >
          <div className="text-3xl">{r.emoji}</div>
          <div className="text-xs mt-2 text-muted-foreground">{r.label}</div>
        </button>
      ))}
    </div>
  )
}
