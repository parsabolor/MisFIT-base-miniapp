'use client'

import { baseSepolia } from 'wagmi/chains'
import { wagmiConfig } from '@/providers/WagmiProvider'

/**
 * Force switch to Base Sepolia (84532) using several fallbacks:
 * 1) @wagmi/core switchChain
 * 2) Connector-level switchChain
 * 3) Raw EIP-3326 / 3085 on any injected provider (MetaMask, CBW, etc.)
 * Finally reconnects wagmi so useChainId() updates immediately.
 */
export async function forceSwitchToBaseSepolia(): Promise<void> {
  const target = baseSepolia.id

  // --- 1) @wagmi/core action -----------------------------
  try {
    const { switchChain } = await import('@wagmi/core')
    await switchChain(wagmiConfig, { chainId: target })
    await refreshWagmi()
    return
  } catch (e) {
    // ignore; try next path
  }

  // --- 2) Connector-level switch (works for WalletConnect, etc.) ---
  try {
    const { getConnections } = await import('@wagmi/core')
    const conns = getConnections(wagmiConfig)
    const active = conns[0]
    if (active?.connector?.switchChain) {
      await active.connector.switchChain({ chainId: target })
      await refreshWagmi()
      return
    }
  } catch (e) {
    // ignore; try next path
  }

  // --- 3) Raw wallet RPC (EIP-3326 + EIP-3085) ------------
  const hex84532 = '0x14a34'
  const rpc =
    process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA || 'https://sepolia.base.org'

  // Some wallets expose multiple providers
  const providers: any[] = []
  const eth: any = (globalThis as any).ethereum
  if (eth?.providers?.length) providers.push(...eth.providers)
  if (eth) providers.push(eth)

  let lastErr: any = null
  for (const p of providers) {
    if (!p?.request) continue
    try {
      // Try direct switch first
      await p.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: hex84532 }],
      })
      await refreshWagmi()
      return
    } catch (err: any) {
      lastErr = err
      // If the chain is unknown, add + switch
      if (err?.code === 4902) {
        try {
          await p.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: hex84532,
                chainName: 'Base Sepolia',
                nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                rpcUrls: [rpc],
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

  // If we got here, everything failed
  throw lastErr ?? new Error('Unable to switch network')
}

async function refreshWagmi() {
  // Make wagmi reflect the new chain immediately
  const { reconnect } = await import('@wagmi/core')
  await reconnect(wagmiConfig)
}
