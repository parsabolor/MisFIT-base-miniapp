export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import ChallengeHubClient from './ChallengeHubClient'

export default function Page() {
  return <ChallengeHubClient />
}
