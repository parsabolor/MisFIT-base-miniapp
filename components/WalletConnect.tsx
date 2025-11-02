'use client'

import React from 'react'

/** Try RainbowKit first */
let RainbowButton: React.ReactNode = null
try {
  // @ts-ignore – optional import
  const { ConnectButton } = require('@rainbow-me/rainbowkit')
  RainbowButton = <ConnectButton chainStatus="icon" showBalance={false} />
} catch {}

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { truncateMiddle } from './utils' // optional helper if you have one

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
        {address ? `${address.slice(0,6)}…${address.slice(-4)}` : 'Connected'} · Disconnect
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
  // Prefer RainbowKit if available & providers are set up
  if (RainbowButton) return <>{RainbowButton}</>
  // Fallback to minimal wagmi button
  return <MinimalWagmiButton />
}
