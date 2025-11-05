'use client'

import Link from 'next/link'

export default function TrophyCaseClient() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/10 ring-1 ring-white/10">
          <span className="text-3xl">🏆</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold">Trophy Case</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Coming soon. You’ll collect badges and milestones here as you build your streaks and complete challenges.
        </p>

        <div className="pt-2">
          <Link
            href="/"
            className="btn btn-primary"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Placeholder panel to match site look */}
      <div className="mt-10 panel">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Your badges</div>
            <div className="text-sm text-muted-foreground">Locked for now</div>
          </div>
          <div className="text-sm text-muted-foreground">—</div>
        </div>
      </div>
    </div>
  )
}
