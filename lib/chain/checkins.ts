'use client'

import type { Address } from 'viem'
import { useReadContract, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { MISFIT_CHECKINS_ABI } from '@/contracts/abi/misfitCheckins'
import { wagmiConfig, baseSepolia } from '@/lib/wagmiConfig'

export const CHECKINS_ADDR = (process.env.NEXT_PUBLIC_CHECKINS_ADDRESS || '') as Address

// Reads (unchanged)
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

// Write: attempt on-chain (Base Sepolia). If it fails, just return {ok:false}.
export function useCheckInWrite() {
  const { writeContractAsync, isPending } = useWriteContract()

  async function tryOnchainCheckIn(): Promise<{ ok: boolean; hash?: `0x${string}`; error?: string }> {
    if (!CHECKINS_ADDR) return { ok: false, error: 'Contract address missing' }
    try {
      const hash = await writeContractAsync({
        chainId: baseSepolia.id,         // wallet may prompt to switch/add chain
        address: CHECKINS_ADDR,
        abi: MISFIT_CHECKINS_ABI,
        functionName: 'checkIn',
      })
      await waitForTransactionReceipt(wagmiConfig, { hash })
      return { ok: true, hash }
    } catch (e: any) {
      return {
        ok: false,
        error: e?.shortMessage || e?.message || 'On-chain check-in skipped',
      }
    }
  }

  return { tryOnchainCheckIn, isPending }
}
