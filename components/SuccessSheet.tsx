'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function SuccessSheet({
  open,
  onClose,
  summary,
}: {
  open: boolean
  onClose: () => void
  summary: React.ReactNode
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl bg-card border border-white/10 p-6 shadow-xl text-center space-y-5"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
          >
            <div className="space-y-3">
              <h2 className="text-2xl font-semibold">✅ Check-in Complete</h2>
              <p className="text-sm text-muted-foreground">
                Great job staying consistent. Your streak and stats are now updated.
              </p>
            </div>

            <div className="rounded-xl bg-black/20 border border-white/10 text-left p-4 text-sm space-y-1">
              {summary || (
                <div className="text-muted-foreground text-center">
                  Summary not available.
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full rounded-xl bg-rose-600 py-2.5 text-sm font-medium text-white hover:bg-rose-500 transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
