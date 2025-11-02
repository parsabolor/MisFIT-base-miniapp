'use client'
import React from 'react'

const mock = [
  { address: '0xA1...b3', current: 27, best: 40 },
  { address: '0x42...99', current: 18, best: 22 },
  { address: '0x9C...0d', current: 14, best: 19 },
  { address: '0xDe...ad', current: 10, best: 25 },
]

export default function Leaderboard() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Leaderboard</h1>
      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-neutral-400">
            <tr>
              <th className="py-2">Rank</th>
              <th>Address</th>
              <th>Current Streak</th>
              <th>Best Streak</th>
            </tr>
          </thead>
          <tbody>
            {mock.map((r, i) => (
              <tr key={i} className="border-t border-neutral-800">
                <td className="py-2">{i+1}</td>
                <td className="font-mono">{r.address}</td>
                <td>{r.current}</td>
                <td>{r.best}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
