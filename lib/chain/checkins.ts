'use client'

import type { Address } from 'viem'
import { useReadContract, useWriteContract, useAccount, usePublicClient } from 'wagmi'
import { baseSepolia } from 'wagmi/chains'
import { MISFIT_CHECKINS_ABI } from '@/contracts/abi/misfitCheckins'

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

// ----- WRITE (waits for confirmation on Base Sepolia public client) -----
export function useCheckInWrite() {
  const { chainId } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()
  const publicClient = usePublicClient({ chainId: baseSepolia.id })

  async function checkInAndWait() {
    if (!CHECKINS_ADDR) throw new Error('Contract address missing')

    // Require Base Sepolia at time of write
    if (chainId !== baseSepolia.id) {
      const err: any = new Error('Wrong network')
      err.code = 'WRONG_NETWORK'
      throw err
    }

    // Send on Base Sepolia explicitly to avoid wallets defaulting to Ethereum
    const hash = await writeContractAsync({
      chainId: baseSepolia.id,
      address: CHECKINS_ADDR,
      abi: MISFIT_CHECKINS_ABI,
      functionName: 'checkIn',
    })

    // Wait on the Base Sepolia-bound public client
    // (prevents "requested resource not found" from mismatched RPCs)
    await publicClient!.waitForTransactionReceipt({ hash })
    return hash
  }

  return { checkInAndWait, isPending }
}
