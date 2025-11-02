
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import LandingClient from './LandingClient'

export default function Page() {
  return <LandingClient />
}
