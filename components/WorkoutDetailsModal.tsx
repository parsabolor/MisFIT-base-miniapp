'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { RatingSelector } from './RatingSelector'
import type { CheckinMeta, Lowlight } from '@/lib/types'
import { saveDraft, loadDraft, clearDraft } from '@/lib/storage'

const DEFAULT_CHIPS = ['Felt tired','No motivation','Injury','Too busy']

export function WorkoutDetailsModal({
  address, onSubmit,
}: { address: string; onSubmit: (meta: Omit<CheckinMeta,'version'|'userId'|'checkinAt'>)=>Promise<void> }) {
  const [step, setStep] = useState<1|2|3>(1)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [rating, setRating] = useState<0|1|2|3|4|5>(3)
  const [lowlight, setLowlight] = useState<Lowlight | undefined>(undefined)
  const [saving, setSaving] = useState(false)

  // Auto-save every 2s
  useEffect(()=>{
    const id = setInterval(()=>{
      saveDraft(address, { title, description, rating, lowlight })
    }, 2000)
    return ()=>clearInterval(id)
  }, [address, title, description, rating, lowlight])

  // Load draft on mount
  useEffect(()=>{
    const d = loadDraft(address)
    if (d) {
      if (typeof d.title === 'string') setTitle(d.title)
      if (typeof d.description === 'string') setDescription(d.description)
      if (typeof d.rating === 'number') setRating(d.rating as any)
      if (d.lowlight) setLowlight(d.lowlight as any)
    }
  }, [address])

  const showRough = rating <= 1

  const handleSubmit = async () => {
    setSaving(true)
    await onSubmit({ title: title || undefined, description: description || undefined, rating, lowlight })
    clearDraft(address)
    setSaving(false)
  }

  return (
    <div className="card">
      <div className="text-lg font-semibold mb-2">Daily Check-in</div>
      <div className="text-sm text-neutral-400 mb-4">Step {step} of {showRough?3:2}</div>

      {step===1 && (
        <div className="space-y-3">
          <input className="input" placeholder="Workout title (optional)" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="textarea" placeholder="Description (optional)" value={description} onChange={e=>setDescription(e.target.value)} />
          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={()=>setStep(2)}>Next</button>
          </div>
        </div>
      )}

      {step===2 && (
        <div className="space-y-3">
          <div className="text-sm text-neutral-300">How did it feel?</div>
          <RatingSelector value={rating} onChange={setRating} />
          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={()=>setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={()=>setStep(showRough?3:2 as any)}>
              {showRough? 'Next' : 'Review'}
            </button>
          </div>
        </div>
      )}

      {step===3 && showRough && (
        <div className="space-y-3">
          <div className="text-sm text-neutral-300">Rough day — anything specific?</div>
          <div className="flex gap-2 flex-wrap">
            {DEFAULT_CHIPS.map((c)=>{
              const active = lowlight?.chips?.includes(c) ?? false
              return (
                <button key={c} className={`badge ${active? 'border-misfit-red text-misfit-red': ''}`}
                  onClick={()=>{
                    const chips = new Set(lowlight?.chips || [])
                    active ? chips.delete(c) : chips.add(c)
                    setLowlight({ coachFlag: lowlight?.coachFlag ?? false, chips: Array.from(chips) })
                  }}
                >{c}</button>
              )
            })}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={lowlight?.coachFlag ?? false}
              onChange={(e)=> setLowlight({ chips: lowlight?.chips || [], coachFlag: e.target.checked })} />
            Would like coach to reach out
          </label>
          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={()=>setStep(2)}>Back</button>
            <button className="btn btn-primary" onClick={()=>setStep(2)}>Review</button>
          </div>
        </div>
      )}

      {/* Review & Submit */}
      {step===2 && !showRough && (
        <div className="space-y-3">
          <div className="text-sm text-neutral-400">Review</div>
          <div className="text-sm">
            <div><span className="text-neutral-500">Title:</span> {title || '—'}</div>
            <div><span className="text-neutral-500">Description:</span> {description || '—'}</div>
            <div><span className="text-neutral-500">Rating:</span> {rating}</div>
          </div>
          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={()=>setStep(1)}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving? 'Saving...' : 'Submit'}</button>
          </div>
        </div>
      )}

      {step===2 && showRough && (
        <div className="space-y-3">
          <div className="text-sm text-neutral-400">Review</div>
          <div className="text-sm">
            <div><span className="text-neutral-500">Title:</span> {title || '—'}</div>
            <div><span className="text-neutral-500">Description:</span> {description || '—'}</div>
            <div><span className="text-neutral-500">Rating:</span> {rating}</div>
            <div><span className="text-neutral-500">Lowlight:</span> {(lowlight?.chips||[]).join(', ') || '—'} {lowlight?.coachFlag? '(coach reach-out)': ''}</div>
          </div>
          <div className="flex justify-between">
            <button className="btn btn-outline" onClick={()=>setStep(3)}>Back</button>
            <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>{saving? 'Saving...' : 'Submit'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
