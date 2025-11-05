export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function MobilityMonthPage() {
  const router = useRouter()

  return (
    <div className="mobility-theme">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <div className="inline-flex items-center gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10">
              <span className="text-2xl">🧘‍♂️</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold leading-tight">Mobility Month</h1>
              <div className="mt-1 text-sm text-muted-foreground">Beginner • 30 Days</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={() => router.back()}>
              Back
            </button>
            <Link href="/challenges" className="btn btn-primary">
              Challenge Hub
            </Link>
          </div>
        </div>

        {/* Intro / Summary */}
        <div className="panel mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <p className="text-base">
                30 days of gentle mobility for sedentary lifers. Move better, feel better.
                Daily 15–20 minute flows with zero equipment, focused on posture, hips, and ankles.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-2 text-sm">
                <Pill icon="⏱">15–20 mins / day</Pill>
                <Pill icon="🏠">At home, no gear</Pill>
                <Pill icon="🧩">Beginner friendly</Pill>
              </div>
            </div>

            {/* Right summary card */}
            <aside className="lg:col-span-1">
              <div className="panel lg:sticky lg:top-6">
                <div className="flex items-center justify-between">
                  <div className="font-medium">Program</div>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">UPCOMING</span>
                </div>

                <dl className="mt-4 space-y-3 text-sm">
                  <Row label="Length" value="30 days" />
                  <Row label="Level" value="Beginner" />
                  <Row label="Entry" value="0.01 ETH" />
                </dl>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <Link href="/challenges" className="btn btn-outline text-center">
                    View Hub
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => alert('Enrollment flow coming soon')}
                  >
                    Enroll
                  </button>
                </div>

                <p className="mt-3 text-xs text-muted-foreground">
                  Enrollment opens after contract go-live. You’ll earn on-chain badges for your streak.
                </p>
              </div>
            </aside>
          </div>
        </div>

        {/* Weekly timeline */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Weekly Timeline</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            <WeekCard
              week="Week 1"
              title="Wake up joints"
              bullets={['Neck', 'Hips', 'Ankles basics']}
            />
            <WeekCard
              week="Week 2"
              title="Posture reset"
              bullets={['Thoracic', 'Hamstrings']}
            />
            <WeekCard
              week="Week 3"
              title="Range builder"
              bullets={['Deeper hip flexors', 'Calves']}
            />
            <WeekCard
              week="Week 4"
              title="Full flow"
              bullets={['Daily 15–20 min flows']}
            />
          </div>
        </section>

        {/* Rewards */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold">Rewards</h2>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <BadgeCard tier="Bronze"  when="@ 10 days"  tagline="Loosen Up" icon="🥉" />
            <BadgeCard tier="Silver"  when="@ 20 days"  tagline="Flow State" icon="🥈" />
            <BadgeCard tier="Gold"    when="@ 30 days"  tagline="Bendy Badge" icon="🥇" />
          </div>
        </section>
      </div>
    </div>
  )
}

/* ---------- Local UI bits (no external imports) ---------- */

function Pill({ icon, children }: { icon: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
      <span className="mr-1.5 text-xs">{icon}</span>{children}
    </span>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted-foreground">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function WeekCard({
  week,
  title,
  bullets,
}: {
  week: string
  title: string
  bullets: string[]
}) {
  return (
    <div className="panel">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{week}</div>
          <div className="mt-1 font-medium">{title}</div>
        </div>
        <span className="h-2 w-2 rounded-full bg-[hsl(var(--accent))]" />
      </div>

      <ul className="mt-3 space-y-1 text-sm text-neutral-300">
        {bullets.map((b) => (
          <li key={b} className="flex items-center gap-2">
            <span className="text-xs">•</span> {b}
          </li>
        ))}
      </ul>
    </div>
  )
}

function BadgeCard({
  icon,
  tier,
  when,
  tagline,
}: {
  icon: string
  tier: string
  when: string
  tagline: string
}) {
  return (
    <div className="panel">
      <div className="flex items-center gap-3">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <div className="font-semibold">{tier}</div>
          <div className="text-xs text-muted-foreground">{when} — {tagline}</div>
        </div>
      </div>
    </div>
  )
}
