
import type { Stats, CheckinMeta } from './types'

export const midnightUTC = (): string => {
  const now = new Date()
  const utc = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0))
  return utc.toISOString()
}

export const isSameUTCDay = (isoA: string, isoB: string): boolean => {
  const a = new Date(isoA)
  const b = new Date(isoB)
  return (
    a.getUTCFullYear() === b.getUTCFullYear() &&
    a.getUTCMonth() === b.getUTCMonth() &&
    a.getUTCDate() === b.getUTCDate()
  )
}

export const statsKey = (addr: string) => `${addr}:misfit-stats`
export const checkinsKey = (addr: string) => `${addr}:misfit-checkins`
export const draftKey = (addr: string) => `${addr}:misfit-checkin-draft`

export function getStats(addr: string): Stats {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(statsKey(addr)) : null
  if (!raw) {
    const init: Stats = { currentStreak: 0, bestStreak: 0, totalCheckIns: 0, lastCheckInDate: null }
    if (typeof window !== 'undefined') {
      localStorage.setItem(statsKey(addr), JSON.stringify(init))
    }
    return init
  }
  return JSON.parse(raw) as Stats
}

export function setStats(addr: string, stats: Stats) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(statsKey(addr), JSON.stringify(stats))
  }
}

export function addCheckin(addr: string, meta: CheckinMeta) {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(checkinsKey(addr)) : null
  const arr = raw ? (JSON.parse(raw) as CheckinMeta[]) : []
  arr.unshift(meta)
  if (typeof window !== 'undefined') {
    localStorage.setItem(checkinsKey(addr), JSON.stringify(arr))
  }
}

export function getCheckins(addr: string): CheckinMeta[] {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(checkinsKey(addr)) : null
  return raw ? (JSON.parse(raw) as CheckinMeta[]) : []
}

export function saveDraft(addr: string, draft: Partial<CheckinMeta>) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(draftKey(addr), JSON.stringify(draft))
  }
}

export function loadDraft(addr: string): Partial<CheckinMeta> | null {
  const raw = typeof window !== 'undefined' ? localStorage.getItem(draftKey(addr)) : null
  return raw ? JSON.parse(raw) : null
}

export function clearDraft(addr: string) {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(draftKey(addr))
  }
}
