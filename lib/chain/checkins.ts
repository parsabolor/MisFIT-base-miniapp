import { Address, Hex } from 'viem'
import { useAccount, useReadContract, useWriteContract } from 'wagmi'
import { MISFIT_CHECKINS_ABI } from '@/contracts/abi/misfitCheckins'

export const CHECKINS_ADDR =
  (process.env.NEXT_PUBLIC_CHECKINS_ADDRESS || '') as Address

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

export function useCheckInWrite() {
  const { writeContract, isPending } = useWriteContract()
  async function checkIn() {
    if (!CHECKINS_ADDR) throw new Error('Contract address missing')
    return writeContract({
      address: CHECKINS_ADDR,
      abi: MISFIT_CHECKINS_ABI,
      functionName: 'checkIn',
    })
  }
  return { checkIn, isPending }
}
