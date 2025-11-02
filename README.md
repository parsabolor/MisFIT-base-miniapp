# MisFIT Check-ins — Base Mini App (mock-first)

A Farcaster-integrated Base mini app scaffold for fitness check-ins, streaks, and challenges.
- Next.js 14 (App Router) + Tailwind
- wagmi + viem + RainbowKit (Base L2)
- LocalStorage stats & mock APIs (ready for on-chain later)

## Quickstart
```bash
pnpm i   # or npm i / yarn
pnpm dev # open http://localhost:3000
```
Connect a wallet (MetaMask/Coinbase/Rainbow), then:
- Check in at **/checkin**
- Explore **/challenges**
- View **/leaderboard** and **/trophy-case**

## Notes
- Dark mode by default with MisFIT red accents.
- Multi-step check-in with autosave every 2s.
- Conditional "Rough day" step (chips + coach flag) when rating ≤ 1.
- Streak logic resets by UTC day and persists per wallet in LocalStorage.
- Token-gated enrollment is mocked (checks ETH balance on Base).

## Next steps (on-chain)
- Write contracts for check-ins and streaks.
- ERC-1155/SBT badge minting for milestones.
- Challenge enrollments with ETH transfers.
- Leaderboard from on-chain events.

## Base Mini App
- `minikit.config.ts` stub included. Wire to MiniKit (@farcaster/frame-sdk) and set webhook secret verification in `/api/webhook`.
