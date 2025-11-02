"use client"
import React from "react"
import { Flame, Trophy, Calendar } from "lucide-react"

type StatIcon = "flame" | "trophy" | "calendar"
const IconMap = { flame: Flame, trophy: Trophy, calendar: Calendar }

export function StatsCard({
  label,
  value,
  icon = "flame",
  highlight,
  trend, // "up" | "flat" | "down" | undefined
}: {
  label: string
  value: number | string
  icon?: StatIcon
  highlight?: boolean
  trend?: "up" | "flat" | "down"
}) {
  const Icon = IconMap[icon]
  return (
    <div className={`rounded-2xl bg-card text-card-foreground border border-white/10 p-8 ${highlight ? "border-accent" : ""} shadow-card`}>
      <div className="flex items-center justify-between pb-2">
        <div className="text-sm font-medium">{label}</div>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="text-4xl font-bold">{value}</div>
      {trend && (
        <p className="text-xs text-muted-foreground mt-1">
          {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} trend
        </p>
      )}
    </div>
  )
}
