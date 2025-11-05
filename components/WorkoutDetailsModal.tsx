'use client'

import React, { useEffect, useMemo, useState } from 'react'
import type { CheckinMeta, Lowlight } from '@/lib/types'
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage'

const DEFAULT_CHIPS = ['Felt tired','No motivation','Injury','Too busy']
const fmtDate = () =>
  new Intl.DateTimeFormat(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'}).format(new Date())

type Step = 1|2|3|4 // 4 = review

export function WorkoutDetailsModal({
  address,
  onSubmit,
}: {
  address: string
  onSubmit: (meta: Omit<CheckinMeta,'version'|'userId'|'checkinAt'>) => Promise<void>
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState<0|1|2|3|4|5>(0)
  const [lowlight, setLowlight] = useState<Lowlight | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  const today = useMemo(fmtDate, [])
  const showRough = rating === 1

  // draft autosave/load
  useEffect(() => {
    if (!open) return
    const d = loadDraft(address)
    if (d) {
      if (typeof d.title === 'string') setTitle(d.title)
      if (typeof d.description === 'string') setDescription(d.description)
      if (typeof d.rating === 'number') setRating(d.rating as any)
      if (d.lowlight) setLowlight(d.lowlight as any)
    }
    const id = setInterval(() => saveDraft(address, { title, description, rating, lowlight }), 1500)
    return () => clearInterval(id)
  }, [open, address, title, description, rating, lowlight])

  const reset = () => { setStep(1); setTitle(''); setDescription(''); setRating(0); setLowlight(undefined) }

  const handlePrimary = async () => {
    if (step === 1) return setStep(2)
    if (step === 2) return setStep(showRough ? 3 : 4)
    if (step === 3) return setStep(4)
    if (step === 4) {
      setSaving(true)
      await onSubmit({ title: title || undefined, description: description || undefined, rating, lowlight })
      clearDraft(address)
      setSaving(false)
      setOpen(false)
      reset()
    }
  }

  const primaryLabel =
    step === 1 ? 'Continue' :
    step === 2 ? 'Continue' :
    step === 3 ? 'Review' :
    saving ? 'Saving…' : 'Submit'

  const canContinue =
    step === 1 ? true :
    step === 2 ? rating > 0 :
    step === 3 ? true : !saving

  return (
    <>
      {/* Trigger */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          Start Check-in
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />

          {/* panel */}
          <div className="absolute inset-0 grid place-items-center p-4">
            <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#0c0c0c] p-6 shadow-2xl">
              {/* header */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="text-lg font-semibold">
                    {step===1 && 'Add workout details (optional)'}
                    {step===2 && 'How did it feel?'}
                    {step===3 && 'Rough day — anything specific?'}
                    {step===4 && 'Review'}
                  </div>
                  <div className="text-sm text-neutral-400">
                    {step===1 && 'Share details about your workout'}
                    {step===2 && 'Rate your overall experience'}
                    {step===3 && 'Pick any that apply (optional)'}
                    {step===4 && 'Confirm and submit'}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-neutral-300">
                    {today}
                  </span>
                  <button
                    onClick={() => setOpen(false)}
                    className="rounded-md p-2 text-neutral-400 hover:text-neutral-200 hover:bg-white/5"
                    aria-label="Close"
                  >✕</button>
                </div>
              </div>

              {/* content */}
              <div className="mt-6 space-y-4">
                {step===1 && (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-sm text-neutral-300">What did you do?</label>
                      <input
                        className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-white/20"
                        placeholder="e.g., Mobility W1D3 — Hip Flow"
                        value={title}
                        onChange={(e)=>setTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="mb-2 block text-sm text-neutral-300">Description</label>
                      <textarea
                        rows={4}
                        className="w-full resize-none rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm outline-none placeholder:text-neutral-500 focus:border-white/20"
                        placeholder="Deep dive, cues, how it felt…"
                        value={description}
                        onChange={(e)=>setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {step===2 && (
                  <div className="space-y-3">
                    <div className="text-sm text-neutral-300">How did it feel overall?</div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                      {[
                        {v:1,label:'Awful',emoji:'😵‍💫'},
                        {v:2,label:'Tough',emoji:'😖'},
                        {v:3,label:'Okay',emoji:'🙂'},
                        {v:4,label:'Good',emoji:'😊'},
                        {v:5,label:'Great',emoji:'🔥'},
                      ].map(({v,label,emoji})=>{
                        const active = rating === v
                        return (
                          <button
                            key={v}
                            onClick={()=>setRating(v as any)}
                            className={`flex h-24 flex-col items-center justify-center rounded-xl border text-sm transition
                              ${active ? 'border-rose-500 bg-rose-500/10' : 'border-white/10 hover:border-white/20 hover:bg-white/5'}`}
                          >
                            <div className="text-2xl">{emoji}</div>
                            <div className="mt-1 font-medium">{label}</div>
                            <div className="text-xs text-neutral-400">{v}</div>
                          </button>
                        )
                      })}
                    </div>
                    <div className="text-xs text-neutral-500">
                      Select a rating to continue, or skip to proceed without rating.
                    </div>
                  </div>
                )}

                {step===3 && (
                  <div className="space-y-4">
                    <div className="text-sm text-neutral-300">Pick any that apply</div>
                    <div className="flex flex-wrap gap-2">
                      {DEFAULT_CHIPS.map((c)=>{
                        const active = lowlight?.chips?.includes(c) ?? false
                        return (
                          <button
                            key={c}
                            onClick={()=>{
                              const chips = new Set(lowlight?.chips || [])
                              active ? chips.delete(c) : chips.add(c)
                              setLowlight({ coachFlag: lowlight?.coachFlag ?? false, chips: Array.from(chips) })
                            }}
                            className={`rounded-full border px-3 py-1 text-sm
                              ${active ? 'border-rose-500 text-rose-400 bg-rose-500/10' : 'border-white/10 text-neutral-300 hover:bg-white/5'}`}
                          >
                            {c}
                          </button>
                        )
                      })}
                    </div>
                    <label className="flex items-center gap-2 text-sm text-neutral-300">
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-white/20 bg-black/40"
                        checked={lowlight?.coachFlag ?? false}
                        onChange={(e)=>setLowlight({ chips: lowlight?.chips || [], coachFlag: e.target.checked })}
                      />
                      Would like coach to reach out
                    </label>
                  </div>
                )}

                {step===4 && (
                  <div className="space-y-2 rounded-xl border border-white/10 bg-black/20 p-4 text-sm">
                    <div className="text-neutral-400">Review</div>
                    <div><span className="text-neutral-500">Date:</span> {today}</div>
                    <div><span className="text-neutral-500">Title:</span> {title || '—'}</div>
                    <div><span className="text-neutral-500">Description:</span> {description || '—'}</div>
                    <div><span className="text-neutral-500">Rating:</span> {rating || '—'}</div>
                    {showRough && (
                      <div>
                        <span className="text-neutral-500">Lowlight:</span>{' '}
                        {(lowlight?.chips || []).join(', ') || '—'} {lowlight?.coachFlag ? '(coach reach-out)' : ''}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* footer */}
              <div className="mt-6 flex items-center justify-between">
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5"
                  onClick={() => setStep(prev => (prev === 1 ? 1 : (prev - 1) as Step))}
                >
                  ← Back
                </button>
                <button
                  disabled={!canContinue}
                  onClick={handlePrimary}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-white
                    ${canContinue ? 'bg-rose-600 hover:bg-rose-500' : 'bg-rose-900/40 cursor-not-allowed'}`}
                >
                  {primaryLabel} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
