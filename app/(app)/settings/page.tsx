'use client'

import * as React from 'react'
import { useAccount } from 'wagmi'

type ThemeOpt = 'light' | 'dark' | 'system'

// helpers
function getStoredTheme(): ThemeOpt {
  if (typeof window === 'undefined') return 'system'
  const v = localStorage.getItem('misfit-theme')
  return (v === 'light' || v === 'dark' || v === 'system') ? v : 'system'
}

function applyTheme(t: ThemeOpt) {
  const root = document.documentElement
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = t === 'system' ? (systemDark ? 'dark' : 'light') : t
  root.classList.remove('light','dark')
  root.classList.add(theme)
}

function getPseudonymKey(addr: string) {
  return `misfit-profile-${addr}`
}

export default function SettingsPage() {
  const { address } = useAccount()
  const [theme, setTheme] = React.useState<ThemeOpt>('system')
  const [pseudo, setPseudo] = React.useState('')

  // hydrate from storage
  React.useEffect(() => {
    setTheme(getStoredTheme())
  }, [])

  React.useEffect(() => {
    if (!address) return
    try {
      const raw = localStorage.getItem(getPseudonymKey(address))
      const obj = raw ? JSON.parse(raw) : null
      setPseudo(obj?.pseudonym || '')
    } catch {}
  }, [address])

  const saveTheme = (t: ThemeOpt) => {
    setTheme(t)
    try {
      localStorage.setItem('misfit-theme', t)
      applyTheme(t)
    } catch {}
  }

  const savePseudo = () => {
    if (!address) return
    try {
      localStorage.setItem(getPseudonymKey(address), JSON.stringify({ pseudonym: pseudo }))
    } catch {}
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Personalize your MisFIT experience.
        </p>
      </header>

      {/* Theme */}
      <section className="rounded-2xl border border-white/10 bg-card/60 p-6 shadow-card">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Choose Dark, Light, or follow your system preference.
        </p>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(['light','dark','system'] as ThemeOpt[]).map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => saveTheme(opt)}
              className={[
                'rounded-xl border px-4 py-3 text-left transition',
                theme === opt ? 'border-white/30 bg-white/10' : 'border-white/10 hover:border-white/20',
              ].join(' ')}
            >
              <div className="font-medium capitalize">{opt}</div>
              <div className="text-xs text-neutral-500">
                {opt === 'system' ? 'Adapts to your OS theme' : `Always ${opt}`}
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Pseudonym */}
      <section className="rounded-2xl border border-white/10 bg-card/60 p-6 shadow-card">
        <h2 className="text-lg font-semibold">Identity</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Set a pseudonym to display on the dashboard and leaderboard.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="mb-1 block text-sm text-neutral-300">Pseudonym</span>
            <input
              className="input w-full"
              placeholder="e.g., Iron Moose"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              maxLength={32}
            />
          </label>

          <div className="flex justify-end">
            <button className="btn btn-primary" onClick={savePseudo} disabled={!address}>
              Save
            </button>
          </div>

          {!address && (
            <div className="text-xs text-neutral-500">
              Connect your wallet to save a pseudonym.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
