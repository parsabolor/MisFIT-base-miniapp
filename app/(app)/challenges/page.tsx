'use client';

import Link from 'next/link';

type Challenge = {
  key: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  days: number;
  blurb: string;
  priceEth?: string;
  status?: 'active' | 'upcoming';
};

const CHALLENGES: Challenge[] = [
  {
    key: 'mobility-month',
    title: 'Mobility Month',
    level: 'Beginner',
    days: 30,
    blurb: '30 days of gentle mobility for sedentary lifers. Move better, feel better.',
    priceEth: '0.01',
    status: 'upcoming',
  },
  {
    key: 'strength-sprint',
    title: 'Strength Sprint',
    level: 'Intermediate',
    days: 21,
    blurb: 'Push, pull, legs minimal plan.',
    status: 'active',
  },
];

export default function ChallengesPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h1 className="mb-6 text-2xl font-semibold">Challenge Hub</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {CHALLENGES.map((c) => (
          <div
            key={c.key}
            className="rounded-2xl border border-white/10 bg-card/60 p-5 backdrop-blur"
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-lg font-semibold">{c.title}</div>
              {c.status && (
                <span
                  className={[
                    'rounded-full border px-2.5 py-0.5 text-[11px] uppercase tracking-wider',
                    c.status === 'active'
                      ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-300'
                      : 'border-amber-400/30 bg-amber-400/15 text-amber-200',
                  ].join(' ')}
                >
                  {c.status}
                </span>
              )}
            </div>

            <div className="mb-3 text-xs text-neutral-400">
              {c.level} • {c.days} Days
            </div>
            <p className="mb-4 text-sm text-neutral-300">{c.blurb}</p>

            {c.priceEth && (
              <div className="mb-4 text-xs text-neutral-400">
                Requires {c.priceEth} ETH
              </div>
            )}

            <div className="flex gap-2">
              <Link
                href={`/challenges/${c.key}`}
                className="btn btn-outline"
              >
                View
              </Link>
              <button className="btn btn-primary">Enroll</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
