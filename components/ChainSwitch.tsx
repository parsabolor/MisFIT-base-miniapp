'use client'

import * as React from 'react'
import { useChainId } from 'wagmi'
import { useChainModal } from '@rainbow-me/rainbowkit'
import { baseSepolia, base } from 'wagmi/chains'

function labelFor(id?: number) {
  if (id === baseSepolia.id) return 'Base Sepolia'
  if (id === base.id) return 'Base'
  if (!id) return 'Unknown'
  return `Chain ${id}`
}

export default function ChainSwitch() {
  const chainId = useChainId()
  const { openChainModal } = useChainModal()

  return (
    <button
      onClick={openChainModal}
      className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs hover:bg-white/10"
      title="Switch network"
    >
      {labelFor(chainId)}
    </button>
  )
}
