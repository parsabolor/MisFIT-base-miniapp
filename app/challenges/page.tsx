'use client'
import React, { useMemo, useState } from 'react'
import { challenges as data } from '@/lib/challenges'
import { ChallengeCard } from '@/components/ChallengeCard'
import { useAccount } from 'wagmi'
import { useQuery } from '@tanstack/react-query'
import { createPublicClient, http, formatEther } from 'viem'
import { base } from '@/lib/chains'

const client = createPublicClient({ chain: base, transport: http('https://mainnet.base.org') })

export default function ChallengeHub() {
  const { address } = useAccount()
  const [enrolled, setEnrolled] = useState<string[]>([])

  const { data: balance } = useQuery({
    queryKey: ['balance', address],
    queryFn: async () => {
      if (!address) return null
      const b = await client.getBalance({ address })
      return b
    },
    enabled: !!address,
  })

  const enroll = async (slug: string) => {
    const ch = data.find(c=>c.slug===slug)!
    if (ch.tokenRequirement && balance !== undefined) {
      const eth = balance ? parseFloat(formatEther(balance)) : 0
      if (eth < ch.tokenRequirement.amount) {
        alert(`Insufficient balance. Need ${ch.tokenRequirement.amount} ETH.`)
        return
      }
    }
    setEnrolled(prev => [...new Set([...prev, slug])])
    alert('Enrolled (mock). On-chain coming soon.')
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Challenge Hub</h1>
      {!address && <div className="card">Connect wallet to enroll.</div>}
      <div className="grid gap-4 md:grid-cols-2">
        {data.map(c => (
          <ChallengeCard
            key={c.id}
            c={c}
            enrolled={enrolled.includes(c.slug)}
            requires={!address ? 'Wallet required' : undefined}
            onEnroll={()=>enroll(c.slug)}
          />
        ))}
      </div>
    </div>
  )
}
