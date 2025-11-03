// /app/(app)/checkin/page.tsx
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import CheckinClient from './CheckinClient'

export default function Page() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-6">
      <CheckinClient />
    </div>
  )
}
