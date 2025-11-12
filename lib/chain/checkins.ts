// lib/chain/checkins.ts
'use client'

import type { Address } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
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

// ---------- WRITE (forces Base Sepolia + waits for confirmation) ----------
export function useCheckInWrite() {
  const { chainId } = useAccount()
  const { writeContractAsync, isPending } = useWriteContract()

  async function checkInAndWait() {
    if (!CHECKINS_ADDR) {
      const err: any = new Error('Missing NEXT_PUBLIC_CHECKINS_ADDRESS')
      err.code = 'CONFIG_MISSING'
      throw err
    }

    if (chainId && chainId !== baseSepolia.id) {
      const err: any = new Error(`Wrong network: ${chainId}. Please switch to Base Sepolia (84532).`)
      err.code = 'WRONG_NETWORK'
      throw err
    }

    // Force the tx to Base Sepolia so the wallet doesn’t default to Ethereum
    let hash: `0x${string}`
    try {
      hash = await writeContractAsync({
        chainId: baseSepolia.id,
        address: CHECKINS_ADDR,
        abi: MISFIT_CHECKINS_ABI,
        functionName: 'checkIn',
      })
    } catch (e: any) {
      // Common wallet errors surface here (user reject, bad address, etc.)
      throw e
    }

    try {
      await waitForTransactionReceipt(wagmiConfig, { hash })
    } catch (e: any) {
      // RPC “resource not found” or similar confirmation issues surface here
      throw e
    }
    return hash
  }

  return { checkInAndWait, isPending }
}
