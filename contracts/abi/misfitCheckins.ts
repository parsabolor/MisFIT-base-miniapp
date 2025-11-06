// contracts/abi/misfitCheckins.ts
export const MISFIT_CHECKINS_ABI = [
  // check in for msg.sender (no params)
  { "type":"function","name":"checkIn","stateMutability":"nonpayable","inputs":[],"outputs":[] },

  // view packed stats: (current, best, total, lastDay)
  {
    "type":"function","name":"getUserStats","stateMutability":"view",
    "inputs":[{ "name":"user","type":"address" }],
    "outputs":[
      { "name":"current","type":"uint32" },
      { "name":"best","type":"uint32" },
      { "name":"total","type":"uint32" },
      { "name":"lastDay","type":"uint64" }
    ]
  },

  // optional helper
  {
    "type":"function","name":"checkedInToday","stateMutability":"view",
    "inputs":[{ "name":"user","type":"address" }],
    "outputs":[{ "type":"bool" }]
  }
] as const
