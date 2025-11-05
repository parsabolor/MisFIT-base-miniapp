'use client'

import Link from 'next/link'

export default function TrophyCaseClient() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-10">
      {/* Header */}
      <header className="text-center space-y-3">
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-card border border-white/10 shadow-card">
          {/* Trophy icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-primary"
          >
            <path d="M6 4h12v2a4 4 0 0 1-3 3.87V12a5 5 0 0 1-4 4.9V19h3a1 1 0 1 1 0 2H10a1 1 0 1 1 0-2h3v-2.1A5 5 0 0 1 9 12V9.87A4 4 0 0 1 6 6V4Zm2 2a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2H8Zm-2 0H4a3 3 0 0 0 3 3V6Zm12 0v3a3 3 0 0 0 3-3h-2Z" />
          </svg>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">Trophy Case</h1>
        <p className="text-sm text-muted-foreground max-w-prose mx-auto">
          Your achievements, badges, and streak milestones are{' '}
          <span className="font-medium text-foreground">coming soon</span>.  
          We’re polishing the cabinet so your accomplishments shine.
        </p>
      </header>

      {/* Placeholder Panel */}
      <section className="rounded-2xl border border-white/10 bg-card/60 p-8 shadow-card text-center space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Nothing to display yet
        </h2>
        <p className="text-sm text-muted-foreground">
          Keep checking in and completing challenges to earn your first trophy.
        </p>
        <div className="pt-4">
          <Link href="/" className="btn btn-primary">
            ← Back to Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}
