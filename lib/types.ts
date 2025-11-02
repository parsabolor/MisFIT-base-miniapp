export type Stats = {
  currentStreak: number
  bestStreak: number
  totalCheckIns: number
  lastCheckInDate: string | null
}

export type Lowlight = {
  chips: string[]
  coachFlag: boolean
}

export type CheckinMeta = {
  version: 'misfit-checkin-1'
  userId: string
  checkinAt: string
  challengeId?: string
  title?: string
  description?: string
  rating: 0 | 1 | 2 | 3 | 4 | 5
  lowlight?: Lowlight
}

export type Reward = { day: number; tier: string; name: string }
export type Timeline = { week: number; title: string; description: string }
export type Challenge = {
  id: string
  slug: string
  title: string
  emoji: string
  status: 'active' | 'upcoming' | 'completed'
  durationDays: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  description: string
  rewards: Reward[]
  timeline: Timeline[]
  theme: { accent: string }
  tokenRequirement?: { amount: number; symbol: 'ETH' }
}
