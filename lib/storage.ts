'use client'
import type { Stats, CheckinMeta } from './types'

export const midnightUTC = (): string => {
  const now = new Date()
  const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  return utc.toISOString()
}

export const isSameUTCDay = (isoA: string, isoB: string): bool => {
  const a = new Date(isoA); const b = new Date(isoB)
  return a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
} as unknown as (a:string,b:string)=>boolean

export const statsKey = (addr: string) => `${addr}:misfit-stats`
export const checkinsKey = (addr: string) => `${addr}:misfit-checkins`
export const draftKey = (addr: string) => `${addr}:misfit-checkin-draft`

export function getStats(addr: string): Stats {
  const raw = localStorage.getItem(statsKey(addr))
  if (!raw) {
    const init: Stats = { currentStreak: 0, bestStreak: 0, totalCheckIns: 0, lastCheckInDate: null }
    localStorage.setItem(statsKey(addr), JSON.stringify(init))
    return init
  }
  return JSON.parse(raw) as Stats
}

export function setStats(addr: string, stats: Stats) {
  localStorage.setItem(statsKey(addr), JSON.stringify(stats))
}

export function addCheckin(addr: string, meta: CheckinMeta) {
  const raw = localStorage.getItem(checkinsKey(addr))
  const arr = raw ? JSON.parse(raw) as CheckinMeta[] : []
  arr.unshift(meta)
  localStorage.setItem(checkinsKey(addr), JSON.stringify(arr))
}

export function getCheckins(addr: string): CheckinMeta[] {
  const raw = localStorage.getItem(checkinsKey(addr))
  return raw ? JSON.parse(raw) as CheckinMeta[] : []
}

export function saveDraft(addr: string, draft: Partial<CheckinMeta>) {
  localStorage.setItem(draftKey(addr), JSON.stringify(draft))
}

export function loadDraft(addr: string): Partial<CheckinMeta> | null {
  const raw = localStorage.getItem(draftKey(addr))
  return raw ? JSON.parse(raw) : null
}

export function clearDraft(addr: string) {
  localStorage.removeItem(draftKey(addr))
}
