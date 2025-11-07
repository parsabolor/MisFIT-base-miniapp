'use client'

import type { Address } from 'viem'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { baseSepolia } from 'wagmi/chains'

import { MISFIT_CHECKINS_ABI } from '@/contracts/abi/misfitCheckins'
import { wagmiConfig } from '@/providers/WagmiProvider'

export const CHECKINS_ADDR = (process.env.NEXT_PUBLIC_CHECKINS_ADDRESS || '') as Address

// ----- READS -----
export function useOnchainStats(address?: Address) {
  return useReadContract({
    address: CHECKINS_ADDR,
    abi: MISFIT_CHECKINS_ABI,
    functionName: 'getUserStats',
    args: [address!],
    query: { enabled: !!address && !!CHECKINS_ADDR },
  })
}

export function useCheckedInToday(address?: Address) {
  return useReadContract({
    address: CHECKINS_ADDR,
    abi: MISFIT_CHECKINS_ABI,
    functionName: 'checkedInToday',
    args: [address!],
    query: { enabled: !!address && !!CHECKINS_ADDR },
  })
}

// ----- WRITE (waits for confirmation) -----
export function useCheckInWrite() {
  const { chainId } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  async function checkInAndWait() {
    if (!CHECKINS_ADDR) throw new Error('Contract address missing')

    // Optional safety: ensure user is on Base Sepolia
    if (chainId && chainId !== baseSepolia.id) {
      const err: any = new Error('Wrong network')
      err.code = 'WRONG_NETWORK'
      throw err
    }

    // 1) Prompt wallet & send
    const hash = await writeContractAsync({
      address: CHECKINS_ADDR,
      abi: MISFIT_CHECKINS_ABI,
      functionName: 'checkIn',
    })

    // 2) Wait for on-chain confirmation before resolving
    await waitForTransactionReceipt(wagmiConfig, { hash })
    return hash
  }

  return { checkInAndWait, isPending }
}
