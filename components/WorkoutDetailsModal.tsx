'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { RatingSelector } from './RatingSelector'
import type { CheckinMeta, Lowlight } from '@/lib/types'
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage'

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
    // very safe fallback
    return new Date().toDateString()
  }
}

export function WorkoutDetailsModal({
  address,
  onSubmit,
}: {
  address: string
  onSubmit: (meta: Omit<CheckinMeta, 'version' | 'userId' | 'checkinAt'>) => Promise<void>
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState<0 | 1 | 2 | 3 | 4 | 5>(3)
  const [lowlight, setLowlight] = useState<Lowlight | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  // Static “today” string (doesn’t need to reformat on re-render)
  const todayLabel = useMemo(() => formatToday(), [])

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
    if (typeof d.rating === 'number') setRating(d.rating as any)
    if (d.lowlight) setLowlight(d.lowlight as any)
  }, [address])

  const totalSteps = useMemo(() => (rating <= 1 ? 3 : 2), [rating])
  const pct = useMemo(() => (step / totalSteps) * 100, [step, totalSteps])
  const showRough = rating <= 1

  const handleSubmit = async () => {
    setSaving(true)
    await onSubmit({
      title: title || undefined,
      description: description || undefined,
      rating,
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

        {/* Today badge (read-only) */}
        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-neutral-300">
          <span role="img" aria-label="calendar">📅</span>
          <span>{todayLabel}</span>
        </div>
      </div>

      {/* Stepper */}
      <div className="mb-6 h-2 w-full rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-white/30"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <label className="block">
            <span className="mb-1 block text-sm text-neutral-300">Title</span>
            <input
              className="input w-full"
              placeholder="Workout title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-neutral-300">Description</span>
            <textarea
              className="textarea w-full min-h-28"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>

          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={() => setStep(2)}>Next</button>
          </div>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm text-neutral-300">How did it feel?</div>
            <RatingSelector value={rating} onChange={setRating} />
          </div>

          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(1)}>Back</button>
            <button
              className="btn btn-primary"
              onClick={() => setStep(showRough ? 3 : 2 as any)}
            >
              {showRough ? 'Next' : 'Review'}
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 (only when rough) */}
      {step === 3 && showRough && (
        <div className="space-y-5">
          <div>
            <div className="mb-2 text-sm text-neutral-300">Rough day — anything specific?</div>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_CHIPS.map((c) => {
                const active = lowlight?.chips?.includes(c) ?? false
                return (
                  <button
                    key={c}
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
            <button className="btn btn-primary" onClick={() => setStep(2)}>Review</button>
          </div>
        </div>
      )}

      {/* REVIEW */}
      {step === 2 && (
        <div className="mt-6 space-y-5 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="text-sm text-neutral-400">Review</div>
          <div className="space-y-1 text-sm">
            <div><span className="text-neutral-500">Date:</span> {todayLabel}</div>
            <div><span className="text-neutral-500">Title:</span> {title || '—'}</div>
            <div><span className="text-neutral-500">Description:</span> {description || '—'}</div>
            <div><span className="text-neutral-500">Rating:</span> {rating}</div>
            {showRough && (
              <div>
                <span className="text-neutral-500">Lowlight:</span>{' '}
                {(lowlight?.chips || []).join(', ') || '—'} {lowlight?.coachFlag ? '(coach reach-out)' : ''}
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={() => setStep(showRough ? 3 : 1)}>
              Back
            </button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
              {saving ? 'Saving…' : 'Submit'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
