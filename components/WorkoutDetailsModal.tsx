'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { CheckinMeta, Lowlight } from '@/lib/types'
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage'

// ------- helpers -------
const DEFAULT_CHIPS = ['Felt tired', 'No motivation', 'Injury', 'Too busy']

function formatToday() {
  try {
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date())
  } catch {
    return new Date().toDateString()
  }
}

// A tiny, self-contained rating row to avoid any mismatch with a custom RatingSelector
function RatingRow({
  value,
  onChange,
}: {
  value: number | null
  onChange: (v: number) => void
}) {
  const items = [
    { v: 1, label: 'Awful', emoji: '😵‍💫' },
    { v: 2, label: 'Tough', emoji: '😣' },
    { v: 3, label: 'Okay', emoji: '😐' },
    { v: 4, label: 'Good', emoji: '😊' },
    { v: 5, label: 'Great', emoji: '🔥' },
  ]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {items.map((it) => {
        const active = value === it.v
        return (
          <button
            key={it.v}
            type="button"
            onClick={() => onChange(it.v)}
            className={[
              'w-full rounded-xl border px-3 py-3 text-left',
              'transition focus:outline-none focus:ring-2 focus:ring-white/20',
              active
                ? 'border-white/30 bg-white/10'
                : 'border-white/10 hover:border-white/20',
            ].join(' ')}
          >
            <div className="text-2xl">{it.emoji}</div>
            <div className="mt-1 text-sm text-neutral-300">{it.label}</div>
            <div className="text-xs text-neutral-500">{it.v}</div>
          </button>
        )
      })}
    </div>
  )
}

export function WorkoutDetailsModal({
  address,
  onSubmit,
}: {
  address: string
  onSubmit: (meta: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) => Promise<void>
}) {
  // Steps: 1=details, 2=rating, 3=rough (only if rating<=1), 4=review
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [lowlight, setLowlight] = useState<Lowlight | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  const todayLabel = useMemo(() => formatToday(), [])

  // figure total steps dynamically
  const showRough = rating !== null && rating <= 1
  const totalSteps = showRough ? 4 : 3
  const pct = useMemo(() => (step / totalSteps) * 100, [step, totalSteps])

  // draft autosave
  useEffect(() => {
    const id = setInterval(() => {
      saveDraft(address, { title, description, rating, lowlight })
    }, 1500)
    return () => clearInterval(id)
  }, [address, title, description, rating, lowlight])

  // load draft
  useEffect(() => {
    const d = loadDraft(address)
    if (!d) return
    if (typeof d.title === 'string') setTitle(d.title)
    if (typeof d.description === 'string') setDescription(d.description)
    if (typeof d.rating === 'number' || d.rating === null) setRating(d.rating)
    if (d.lowlight) setLowlight(d.lowlight as any)
  }, [address])

  const goFromRating = () => {
    // If no rating chosen, skip to review
    if (rating === null) {
      setStep(4)
      return
    }
    // If rating is 1 or less -> rough step; else -> review
    setStep(rating <= 1 ? 3 : 4)
  }

  const handleSubmit = async () => {
    setSaving(true)
    await onSubmit({
      title: title || undefined,
      description: description || undefined,
      rating: (rating ?? 0) as 0 | 1 | 2 | 3 | 4 | 5, // keep your existing type expectation
      lowlight,
    })
    clearDraft(address)
    setSaving(false)
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-card/60 backdrop-blur p-6 md:p-8 shadow-card">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Daily Check-in</h1>
          <p className="text-sm text-muted-foreground">Step {step} of {totalSteps}</p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-neutral-300">
          <span role="img" aria-label="calendar">📅</span>
          <span>{todayLabel}</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-6 h-2 w-full rounded-full bg-white/10">
        <div className="h-full rounded-full bg-white/30" style={{ width: `${pct}%` }} />
      </div>

      {/* STEP 1: details */}
      {step === 1 && (
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1 block text-sm text-neutral-300">What did you do?</span>
            <input
              className="input w-full"
              placeholder="e.g., Mobility W1D3 — Hip Flow"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-neutral-300">Description</span>
            <textarea
              className="textarea w-full min-h-28"
              placeholder="Deep dive, cues, how it felt…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={() => setStep(2)}>
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: rating */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <div className="mb-1 text-base font-medium">How did it feel?</div>
            <div className="mb-3 text-sm text-neutral-400">Rate your overall experience</div>
            <RatingRow value={rating} onChange={setRating} />
            <div className="mt-2 text-xs text-neutral-500">
              {rating === null ? 'You can skip rating and continue.' : 'You can change this before submitting.'}
            </div>
          </div>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={goFromRating}>
              {rating === null ? 'Skip →' : 'Continue →'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: rough-day extras */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm text-neutral-300">Rough day — anything specific?</div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CHIPS.map((c) => {
                const active = lowlight?.chips?.includes(c) ?? false
                return (
                  <button
                    key={c}
                    type="button"
                    className={`badge ${active ? 'border-misfit-red text-misfit-red' : ''}`}
                    onClick={() => {
                      const chips = new Set(lowlight?.chips || [])
                      active ? chips.delete(c) : chips.add(c)
                      setLowlight({ coachFlag: lowlight?.coachFlag ?? false, chips: Array.from(chips) })
                    }}
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={lowlight?.coachFlag ?? false}
              onChange={(e) =>
                setLowlight({ chips: lowlight?.chips || [], coachFlag: e.target.checked })
              }
            />
            Would like coach to reach out
          </label>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={() => setStep(4)}>Continue →</button>
          </div>
        </div>
      )}

      {/* STEP 4: review */}
      {step === 4 && (
        <div className="space-y-5">
          <div className="text-sm text-neutral-400">Review</div>
          <div className="space-y-1 text-sm">
            <div><span className="text-neutral-500">Date:</span> {todayLabel}</div>
            <div><span className="text-neutral-500">Title:</span> {title || '—'}</div>
            <div><span className="text-neutral-500">Description:</span> {description || '—'}</div>
            <div><span className="text-neutral-500">Rating:</span> {rating ?? '—'}</div>
            {showRough && (
              <div>
                <span className="text-neutral-500">Lowlight:</span>{' '}
                {(lowlight?.chips || []).join(', ') || '—'} {lowlight?.coachFlag ? '(coach reach-out)' : ''}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(showRough ? 3 : 2)}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
