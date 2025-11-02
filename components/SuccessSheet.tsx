'use client'
import React from 'react'

export function SuccessSheet({
  open, onClose, summary,
}: { open: boolean; onClose: ()=>void; summary?: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="sheet">
      <div className="flex items-center justify-between">
        <div className="font-semibold">Check-in complete</div>
        <button onClick={onClose} className="badge">Close</button>
      </div>
      <div className="separator" />
      <div>{summary}</div>
    </div>
  )
}
