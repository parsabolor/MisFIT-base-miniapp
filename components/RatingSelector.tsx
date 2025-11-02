'use client'
import React from 'react'

const faces = ['😫','😕','😐','🙂','😊','🤩'] as const

export function RatingSelector({
  value, onChange,
}: { value: 0|1|2|3|4|5; onChange: (v:0|1|2|3|4|5)=>void }) {
  return (
    <div className="flex items-center justify-between text-2xl">
      {faces.map((f, i) => (
        <button
          key={i}
          className={`h-12 w-12 rounded-xl border ${value===i? 'border-misfit-red' : 'border-neutral-700'}`}
          onClick={()=>onChange(i as 0|1|2|3|4|5)}
          aria-label={`rating-${i}`}
        >{f}</button>
      ))}
    </div>
  )
}
