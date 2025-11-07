import { switchChain } from 'wagmi/actions'
import { baseSepolia } from 'wagmi/chains'

export async function ensureBaseSepolia() {
  try {
    await switchChain({ chainId: baseSepolia.id })
  } catch (err) {
    // User rejected or chain not added — UI will still show a switch button
    console.warn('Switch to Base Sepolia was not completed', err)
  }
}
