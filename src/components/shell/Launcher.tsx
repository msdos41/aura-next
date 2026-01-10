'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DEFAULT_APPS } from '@/lib/constants'

interface LauncherProps {
  isOpen: boolean
  onClose: () => void
  onAppSelect: (appId: string) => void
}

export function Launcher({ isOpen, onClose, onAppSelect }: LauncherProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredApps = DEFAULT_APPS.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "fixed bottom-20 left-1/2 z-50 w-full max-w-2xl -translate-x-1/2 rounded-3xl bg-surface-10 p-6 shadow-m3-5"
            )}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search apps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-surface-30 bg-surface-20 px-4 py-3 text-surface-90 placeholder:text-surface-60 focus:border-primary-40 focus:outline-none"
                autoFocus
              />
            </div>

            <div className="grid grid-cols-6 gap-3">
              {filteredApps.map(app => (
                <button
                  key={app.id}
                  className="flex flex-col items-center gap-2 rounded-2xl p-3 hover:bg-surface-20 transition-colors"
                  onClick={() => onAppSelect(app.id)}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: app.backgroundColor }}>
                    <span className="text-2xl">{app.icon}</span>
                  </div>
                  <span className="text-xs text-surface-80">{app.name}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
