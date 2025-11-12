'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import type { CheckinMeta, Lowlight } from '@/lib/types'
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage'

const DEFAULT_CHIPS = ['Felt tired', 'No motivation', 'Injury', 'Too busy'] as const
type RatingUnion = 0 | 1 | 2 | 3 | 4 | 5

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
  ] as const

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
      {items.map((it) => {
        const active = value === it.v
        return (
          <button
            key={it.v}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(it.v)}
            className={[
              'w-full rounded-xl border px-3 py-3 text-left transition',
              'focus:outline-none focus:ring-2 focus:ring-white/20',
              active
                ? 'border-white/40 bg-white/10 ring-1 ring-white/20'
                : 'border-white/10 hover:border-white/20 hover:bg-white/5',
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
  open,
  onClose,
  address,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  address: string
  onSubmit: (meta: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) => Promise<void>
}): null | React.ReactElement {
  // Strict 3-step flow
  const [step, setStep] = useState<1 | 2 | 3>(1)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState<number | null>(null)
  const [lowlight, setLowlight] = useState<(Lowlight & { note?: string }) | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  const totalSteps = 3
  const pct = useMemo(() => (step / totalSteps) * 100, [step])
  const todayLabel = useMemo(() => formatToday(), [])

  const titleRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!open) return
    const d = loadDraft(address)
    if (d) {
      if (typeof d.title === 'string') setTitle(d.title)
      if (typeof d.description === 'string') setDescription(d.description)
      if (typeof d.rating === 'number' && d.rating >= 0 && d.rating <= 5) setRating(d.rating)
      if (d.lowlight) setLowlight(d.lowlight as any)
    }
    setStep(1)
    const t = setTimeout(() => titleRef.current?.focus(), 40)
    return () => clearTimeout(t)
  }, [open, address])

  useEffect(() => {
    if (!open) return
    const id = setInterval(() => {
      const ratingForDraft = rating === null ? undefined : (rating as RatingUnion)
      saveDraft(address, { title, description, rating: ratingForDraft, lowlight })
    }, 1500)
    return () => clearInterval(id)
  }, [open, address, title, description, rating, lowlight])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (step !== 1) return
      if (e.key === 'Enter' && !e.shiftKey) {
        const tag = (e.target as HTMLElement)?.tagName
        if (tag !== 'TEXTAREA') {
          e.preventDefault()
          setStep(2)
        }
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, step])

  const goFromRating = () => setStep(3)

  const handleSubmit = async () => {
    setSaving(true)
    await onSubmit({
      title: title || undefined,
      description: description || undefined,
      rating: (rating ?? 3) as RatingUnion,
      lowlight,
    })
    clearDraft(address)
    setSaving(false)
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4">
      {/* overlay */}
      <button
        aria-label="Close"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* dialog */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-neutral-900/90 p-6 md:p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold leading-tight">Daily Check-in</h1>
            <p className="mt-0.5 text-sm text-neutral-400">
              Step {step} of {totalSteps}
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-200">
            <span role="img" aria-label="calendar">📅</span>
            <span>{todayLabel}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6 h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white/30 transition-all duration-300"
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* STEP 1: Details */}
        {step === 1 && (
          <div className="space-y-5">
            <label className="block">
              <span className="mb-1 block text-sm text-neutral-300">What did you do?</span>
              <input
                ref={titleRef}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-white/20 focus:outline-none"
                placeholder="e.g., Mobility W1D3 — Hip Flow"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="mb-1 block text-sm text-neutral-300">Description</span>
              <textarea
                className="w-full min-h-28 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-white/20 focus:outline-none"
                placeholder="Notes, cues, how it felt… (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>

            <div className="flex justify-end">
              <button
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                onClick={() => setStep(2)}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Rating */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <div className="mb-1 text-base font-medium">How did it feel?</div>
              <div className="mb-3 text-sm text-neutral-400">
                Rate your overall experience (optional)
              </div>
              <RatingRow value={rating} onChange={setRating} />
              <div className="mt-2 text-xs text-neutral-500">
                {rating === null
                  ? 'You can skip rating and continue.'
                  : 'You can change this before submitting.'}
              </div>
            </div>

            <div className="flex justify-between">
              <button
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                onClick={goFromRating}
              >
                {rating === null ? 'Skip →' : 'Continue →'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Review (+ rough day if rating ≤ 1) */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="text-sm text-neutral-400">Review</div>
            <div className="space-y-1 text-sm">
              <div><span className="text-neutral-500">Date:</span> {todayLabel}</div>
              <div><span className="text-neutral-500">Title:</span> {title || '—'}</div>
              <div><span className="text-neutral-500">Description:</span> {description || '—'}</div>
              <div><span className="text-neutral-500">Rating:</span> {rating ?? '—'}</div>
            </div>

            {rating !== null && rating <= 1 && (
              <div className="space-y-3">
                <div className="mb-2 text-sm text-neutral-300">
                  Rough day — anything specific? (optional)
                </div>

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
                          setLowlight({
                            coachFlag: lowlight?.coachFlag ?? false,
                            note: lowlight?.note,
                            chips: Array.from(chips),
                          })
                        }}
                      >
                        {c}
                      </button>
                    )
                  })}
                </div>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={lowlight?.coachFlag ?? false}
                    onChange={(e) =>
                      setLowlight({
                        chips: lowlight?.chips || [],
                        note: lowlight?.note,
                        coachFlag: e.target.checked,
                      })
                    }
                  />
                  Would like coach to reach out
                </label>

                <label className="block">
                  <span className="mb-1 block text-sm text-neutral-300">Anything else? (optional)</span>
                  <textarea
                    className="w-full min-h-20 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm placeholder:text-neutral-500 focus:border-white/20 focus:outline-none"
                    placeholder="Add a quick note…"
                    value={lowlight?.note || ''}
                    onChange={(e) =>
                      setLowlight({
                        chips: lowlight?.chips || [],
                        coachFlag: lowlight?.coachFlag ?? false,
                        note: e.target.value,
                      })
                    }
                  />
                </label>
              </div>
            )}

            <div className="flex justify-between">
              <button
                className="rounded-xl border border-white/15 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                onClick={handleSubmit}
                disabled={saving}
              >
                {saving ? 'Saving…' : 'Submit'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
