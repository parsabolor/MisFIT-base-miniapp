// components/WalletConnect.tsx
'use client'

import React from 'react'

// Prefer RainbowKit if available
let RainbowButton: React.ReactNode | null = null
try {
  // @ts-ignore optional dep
  const { ConnectButton } = require('@rainbow-me/rainbowkit')
  RainbowButton = <ConnectButton chainStatus="icon" showBalance={false} />
} catch { /* RainbowKit not installed – fallback to wagmi */ }

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'

// tiny helper to shorten addresses
const truncate = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : '')

function MinimalWagmiButton() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect({ connector: injected() })
  const { disconnect } = useDisconnect()

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="rounded-xl px-5 py-3 border border-white/10 bg-white/5 hover:bg-white/10 transition"
      >
        {truncate(address)} · Disconnect
      </button>
    )
  }

  return (
    <button
      onClick={() => connect()}
      disabled={isPending}
      className="rounded-xl px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 transition"
    >
      {isPending ? 'Connecting…' : 'Connect Wallet'}
    </button>
  )
}

export default function WalletConnect() {
  // Use RainbowKit if present; otherwise minimal wagmi button
  return RainbowButton ? <>{RainbowButton}</> : <MinimalWagmiButton />
}
