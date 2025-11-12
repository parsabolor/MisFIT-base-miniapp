'use client'

import { baseSepolia } from 'wagmi/chains'
import { wagmiConfig } from '@/providers/WagmiProvider'

/**
 * Force switch to Base Sepolia (84532) with multiple fallbacks,
 * then reconnect wagmi so useChainId() updates in the UI.
 */
export async function forceSwitchToBaseSepolia(): Promise<void> {
  const target = baseSepolia.id // 84532
  const hex84532 = '0x14a34'
  const rpcUrl =
    process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA || 'https://sepolia.base.org'

  // 1) Wagmi core action (preferred)
  try {
    const { switchChain } = await import('@wagmi/core')
    await switchChain(wagmiConfig, { chainId: target })
    await refreshWagmi()
    return
  } catch {
    // continue to fallbacks
  }

  // 2) Active connector-level switch (WalletConnect, etc.)
  try {
    const { getConnections } = await import('@wagmi/core')
    const conns = getConnections(wagmiConfig)
    const active = conns[0]
    if (active?.connector?.switchChain) {
      await active.connector.switchChain({ chainId: target })
      await refreshWagmi()
      return
    }
  } catch {
    // continue to fallbacks
  }

  // 3) Raw wallet RPC (MetaMask / Coinbase / injected)
  const candidates: any[] = []
  const eth: any = (globalThis as any).ethereum
  if (eth?.providers?.length) candidates.push(...eth.providers)
  if (eth) candidates.push(eth)

  let lastErr: any = null
  for (const p of candidates) {
    if (!p?.request) continue

    try {
      await p.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex84532 }],
      })
      await refreshWagmi()
      return
    } catch (err: any) {
      lastErr = err
      // Chain not added
      if (err?.code === 4902) {
        try {
          await p.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hex84532,
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: [rpcUrl],
                blockExplorerUrls: ['https://sepolia.basescan.org'],
              },
            ],
          })
          await p.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: hex84532 }],
          })
          await refreshWagmi()
          return
        } catch (e2) {
          lastErr = e2
        }
      }
    }
  }

  throw lastErr ?? new Error('Unable to switch to Base Sepolia')
}

async function refreshWagmi() {
  const { reconnect } = await import('@wagmi/core')
  await reconnect(wagmiConfig)
}
