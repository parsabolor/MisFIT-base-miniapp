'use client'

import * as React from 'react'
import { useAccount } from 'wagmi'

type ThemeOpt = 'light' | 'dark' | 'system'

const THEME_KEY = 'misfit-theme'
const profileKey = (addr: string) => `misfit-profile-${addr}`

// --- theme helpers ---
function getStoredTheme(): ThemeOpt {
  if (typeof window === 'undefined') return 'system'
  const v = localStorage.getItem(THEME_KEY)
  return v === 'light' || v === 'dark' || v === 'system' ? v : 'system'
}

function applyTheme(choice: ThemeOpt) {
  const root = document.documentElement
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const t = choice === 'system' ? (systemDark ? 'dark' : 'light') : choice
  root.classList.remove('light', 'dark')
  root.classList.add(t)
}

export default function SettingsPage() {
  const { address } = useAccount()

  // theme
  const [theme, setTheme] = React.useState<ThemeOpt>('system')

  // identity
  const [pseudo, setPseudo] = React.useState('')
  const [savedAt, setSavedAt] = React.useState<number | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  // --- hydrate on mount ---
  React.useEffect(() => {
    // theme
    const stored = getStoredTheme()
    setTheme(stored)
    // apply immediately
    if (typeof window !== 'undefined') applyTheme(stored)
  }, [])

  // watch OS scheme if user picked "system"
  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handle = () => {
      if (theme === 'system') applyTheme('system')
    }
    mql.addEventListener?.('change', handle)
    return () => mql.removeEventListener?.('change', handle)
  }, [theme])

  // load pseudonym when address ready
  React.useEffect(() => {
    if (!address) return
    try {
      const raw = localStorage.getItem(profileKey(address))
      const obj = raw ? JSON.parse(raw) : null
      setPseudo(obj?.pseudonym || '')
    } catch {
      /* ignore */
    }
  }, [address])

  // save handlers
  const selectTheme = (t: ThemeOpt) => {
    setTheme(t)
    try {
      localStorage.setItem(THEME_KEY, t)
      applyTheme(t)
    } catch {}
  }

  const savePseudo = () => {
    if (!address) return
    // simple validation (optional but nice)
    const trimmed = pseudo.trim()
    if (trimmed.length > 32) {
      setError('Pseudonym is too long (max 32 characters).')
      return
    }
    setError(null)
    try {
      localStorage.setItem(profileKey(address), JSON.stringify({ pseudonym: trimmed }))
      setSavedAt(Date.now())
      // auto-hide “saved” after 1.5s
      setTimeout(() => setSavedAt(null), 1500)
    } catch {}
  }

  const clearPseudo = () => {
    if (!address) return
    try {
      localStorage.removeItem(profileKey(address))
    } catch {}
    setPseudo('')
    setSavedAt(Date.now())
    setTimeout(() => setSavedAt(null), 1200)
  }

  // UI utilities
  const ThemeChip = ({ value, title, hint }: { value: ThemeOpt; title: string; hint: string }) => {
    const active = theme === value
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => selectTheme(value)}
        className={[
          'rounded-xl border px-4 py-3 text-left transition',
          active
            ? 'border-white/30 bg-white/10'
            : 'border-white/10 hover:border-white/20',
        ].join(' ')}
      >
        <div className="font-medium">{title}</div>
        <div className="text-xs text-neutral-500">{hint}</div>
      </button>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      <header>
        <h1 className="text-3xl md:text-4xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Personalize your MisFIT experience.</p>
      </header>

      {/* Appearance */}
      <section className="rounded-2xl border border-white/10 bg-card/60 p-6 shadow-card">
        <h2 className="text-lg font-semibold">Appearance</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Choose Dark, Light, or follow your system preference.
        </p>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ThemeChip value="light"  title="Light"  hint="Always light" />
          <ThemeChip value="dark"   title="Dark"   hint="Always dark" />
          <ThemeChip value="system" title="System" hint="Adapts to your OS theme" />
        </div>

        <div className="mt-3 text-xs text-neutral-500">
          Current: <span className="capitalize">{theme}</span>
        </div>
      </section>

      {/* Identity */}
      <section className="rounded-2xl border border-white/10 bg-card/60 p-6 shadow-card">
        <h2 className="text-lg font-semibold">Identity</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Set a pseudonym to display on the dashboard and leaderboard.
        </p>

        <div className="mt-4 space-y-3">
          <label className="block">
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm text-neutral-300">Pseudonym</span>
              <span className="text-xs text-neutral-500">{pseudo.trim().length}/32</span>
            </div>
            <input
              className="input w-full"
              placeholder="e.g., Iron Moose"
              value={pseudo}
              onChange={(e) => setPseudo(e.target.value)}
              maxLength={32}
              aria-invalid={!!error}
            />
          </label>

          {error && (
            <div className="text-xs text-red-400">{error}</div>
          )}

          <div className="flex items-center justify-between gap-2">
            <div className="text-xs text-neutral-500">
              This will replace your wallet address where supported.
            </div>
            <div className="flex items-center gap-2">
              <button
                className="btn btn-outline"
                onClick={clearPseudo}
                disabled={!address || pseudo.trim() === ''}
                title="Remove your pseudonym"
              >
                Clear
              </button>
              <button
                className="btn btn-primary"
                onClick={savePseudo}
                disabled={!address}
              >
                Save
              </button>
            </div>
          </div>

          {savedAt && (
            <div className="text-xs text-neutral-400">Saved.</div>
          )}
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
