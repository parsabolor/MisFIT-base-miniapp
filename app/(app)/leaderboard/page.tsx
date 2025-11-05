'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAccount } from 'wagmi';

type Row = {
  address: string;
  current: number;
  best: number;
};

function loadLocalLeaderboard(): Row[] {
  // Reads any keys like misfit-stats-0xABC... from localStorage
  if (typeof window === 'undefined') return [];
  const rows: Row[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)!;
    if (!k.startsWith('misfit-stats-')) continue;
    try {
      const s = JSON.parse(localStorage.getItem(k) || '{}');
      rows.push({
        address: k.replace('misfit-stats-', ''),
        current: Number(s.currentStreak || 0),
        best: Number(s.bestStreak || 0),
      });
    } catch {}
  }
  // sort by current desc, then best desc
  rows.sort((a, b) => (b.current - a.current) || (b.best - a.best));
  return rows;
}

export default function LeaderboardPage() {
  const { address } = useAccount();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    setRows(loadLocalLeaderboard());
    const onStorage = () => setRows(loadLocalLeaderboard());
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const you = address?.toLowerCase();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      <h1 className="mb-6 text-2xl font-semibold">Leaderboard</h1>

      {rows.length === 0 ? (
        <div className="rounded-xl border border-white/10 bg-black/30 p-6 text-sm text-neutral-300">
          No entries yet. Do a few check-ins and come back!
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-card/60 backdrop-blur">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-xs uppercase tracking-wide text-neutral-400">
              <tr>
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Address</th>
                <th className="px-4 py-3">Current Streak</th>
                <th className="px-4 py-3">Best Streak</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {rows.map((r, idx) => {
                const isYou = you && r.address.toLowerCase() === you;
                const medal = idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : String(idx + 1);
                return (
                  <tr
                    key={r.address}
                    className={[
                      idx % 2 ? 'bg-white/[0.02]' : '',
                      isYou ? 'bg-white/[0.06]' : ''
                    ].join(' ')}
                  >
                    <td className="px-4 py-3 font-medium">{medal}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono">
                        {r.address.slice(0, 6)}…{r.address.slice(-4)}
                      </span>
                      {isYou && (
                        <span className="ml-2 rounded-full border border-white/10 bg-emerald-500/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-emerald-300">
                          You
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">{r.current}</td>
                    <td className="px-4 py-3">{r.best}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
