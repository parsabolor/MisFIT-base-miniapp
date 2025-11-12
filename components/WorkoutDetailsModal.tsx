// …imports stay the same…

export function WorkoutDetailsModal(/* props unchanged */) {
  // Steps are now 1|2|3 only
  const [step, setStep] = useState<1 | 2 | 3>(1)
  // …state unchanged…

  const totalSteps = 3
  const pct = useMemo(() => (step / totalSteps) * 100, [step])

  // goFromRating now always goes to step 3 (Review)
  const goFromRating = () => setStep(3)

  // --- render ---
  // Header shows: Step {step} of 3
  // Keep your existing header; just make sure it uses {totalSteps}

  // STEP 1: unchanged (Details) → Continue => setStep(2)

  // STEP 2: unchanged (Rating) → Continue => goFromRating()

  // STEP 3: Review (ALSO shows optional “rough day” inputs when rating <= 1)
  // Replace your current review block with:
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
          <div className="mb-2 text-sm text-neutral-300">Rough day — anything specific? (optional)</div>
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
        </div>
      )}

      <div className="flex justify-between">
        <button className="rounded-xl border border-white/15 px-4 py-2 text-sm text-neutral-200 hover:bg-white/5"
                onClick={() => setStep(2)}>
          Back
        </button>
        <button className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-90"
                onClick={handleSubmit}
                disabled={saving}>
          {saving ? 'Saving…' : 'Submit'}
        </button>
      </div>
    </div>
  )}
}
