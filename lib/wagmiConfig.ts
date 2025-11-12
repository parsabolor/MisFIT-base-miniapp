import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base, baseSepolia } from 'wagmi/chains'
import { http } from 'viem'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'MISFIT-DEMO'
const baseSepoliaRpc = process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA || 'https://sepolia.base.org'
const baseMainnetRpc = process.env.NEXT_PUBLIC_ALCHEMY_BASE || undefined

export const wagmiConfig = getDefaultConfig({
  appName: 'MisFIT Check-ins',
  projectId,
  chains: [baseSepolia, base],
  transports: {
    [baseSepolia.id]: http(baseSepoliaRpc),
    [base.id]: http(baseMainnetRpc),
  },
  ssr: true,
})

export { base, baseSepolia }
