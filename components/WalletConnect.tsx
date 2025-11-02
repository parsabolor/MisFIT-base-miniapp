'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

function truncateMiddle(str: string, start = 6, end = 4) {
  if (!str) return ''
  if (str.length <= start + end) return str
  return `${str.slice(0, start)}…${str.slice(-end)}`
}

export default function WalletConnect() {
  const { address, isConnected, status } = useAccount()
  const { connect, isPending: isConnecting } = useConnect()
  const { disconnect } = useDisconnect()

  if (!isConnected) {
    return (
      <button
        className="rounded-xl px-6 py-3 font-semibold bg-primary text-primary-foreground hover:opacity-90 transition"
        onClick={() => connect({ connector: injected() })}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting…' : 'Connect Wallet'}
      </button>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-mono text-muted-foreground">
        {truncateMiddle(address || '')}
      </span>
      <span
        className={`h-2.5 w-2.5 rounded-full ${
          status === 'connected' ? 'bg-green-500' : 'bg-gray-400'
        }`}
        aria-label={status}
      />
      <button
        className="rounded-xl px-4 py-2 text-sm border border-white/10 hover:bg-white/5 transition"
        onClick={() => disconnect()}
      >
        Disconnect
      </button>
    </div>
  )
}
