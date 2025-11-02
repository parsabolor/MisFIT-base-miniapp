import type { Challenge } from './types'

export const challenges: Challenge[] = [
  {
    id: 'mobility-month',
    slug: 'mobility-month',
    title: 'Mobility Month',
    emoji: '🧘',
    status: 'active',
    durationDays: 30,
    difficulty: 'beginner',
    description: '30 days of gentle mobility for sedentary lifers. Move better, feel better.',
    rewards: [
      { day: 10, tier: 'Bronze', name: 'Loosen Up' },
      { day: 20, tier: 'Silver', name: 'Flow State' },
      { day: 30, tier: 'Gold', name: 'Bendy Badge' },
    ],
    timeline: [
      { week: 1, title: 'Wake up joints', description: 'Neck, hips, ankles basics' },
      { week: 2, title: 'Posture reset', description: 'Thoracic + hamstrings' },
      { week: 3, title: 'Range builder', description: 'Deeper hip flexors + calves' },
      { week: 4, title: 'Full flow', description: 'Daily 15–20 min flows' },
    ],
    theme: { accent: '#14b8a6' }, // teal
    tokenRequirement: { amount: 0.01, symbol: 'ETH' },
  },
  {
    id: 'strength-sprint',
    slug: 'strength-sprint',
    title: 'Strength Sprint',
    emoji: '🏋️',
    status: 'upcoming',
    durationDays: 21,
    difficulty: 'intermediate',
    description: 'Push, pull, legs minimal plan.',
    rewards: [
      { day: 7, tier: 'Bronze', name: 'Starter' },
      { day: 14, tier: 'Silver', name: 'Committed' },
      { day: 21, tier: 'Gold', name: 'Sprinter' },
    ],
    timeline: [
      { week: 1, title: 'Base', description: 'Learn movement' },
      { week: 2, title: 'Volume', description: 'Add sets' },
      { week: 3, title: 'Finish', description: 'Deload or peak' },
    ],
    theme: { accent: '#fb923c' }, // orange
  },
]
