'use client'

import type { Address } from 'viem'
import { useReadContract, useWriteContract, useAccount } from 'wagmi'
import { waitForTransactionReceipt } from '@wagmi/core'
import { baseSepolia } from 'wagmi/chains'

import { MISFIT_CHECKINS_ABI } from '@/contracts/abi/misfitCheckins'
import { wagmiConfig } from '@/providers/WagmiProvider'

export const CHECKINS_ADDR = (process.env.NEXT_PUBLIC_CHECKINS_ADDRESS || '') as Address

// ---------- READS ----------
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

// ---------- WRITES ----------
export function useCheckInWrite() {
  const { chainId } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  // Strict version: throws if wrong chain, waits for confirmation, returns tx hash
  async function checkInAndWait(): Promise<`0x${string}`> {
    if (!CHECKINS_ADDR) throw new Error('Contract address missing')
    if (chainId && chainId !== baseSepolia.id) {
      const err: any = new Error('Wrong network')
      err.code = 'WRONG_NETWORK'
      throw err
    }
    const hash = await writeContractAsync({
      chainId: baseSepolia.id,
      address: CHECKINS_ADDR,
      abi: MISFIT_CHECKINS_ABI,
      functionName: 'checkIn',
    })
    await waitForTransactionReceipt(wagmiConfig, { hash })
    return hash
  }

  // Soft version: tries on-chain, never throws; returns true if mined, false otherwise
  async function tryOnchainCheckIn(): Promise<boolean> {
    try {
      await checkInAndWait()
      return true
    } catch {
      return false
    }
  }

  return { checkInAndWait, tryOnchainCheckIn, isPending }
}
