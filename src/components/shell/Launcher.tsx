'use client'

import { useState, useEffect, useRef } from 'react'
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
  const launcherRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (launcherRef.current && !launcherRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const filteredApps = DEFAULT_APPS.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={launcherRef}
          className={cn(
            "fixed bottom-20 left-6 z-[10000] h-[66.666667vh] w-[66.666667vw] rounded-lg bg-gray-900 p-6 shadow-m3-5 overflow-auto"
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
              className="w-full rounded-2xl border border-gray-700 bg-gray-800 px-4 py-3 text-gray-100 placeholder:text-gray-500 focus:border-gray-600 focus:outline-none"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-6 gap-3">
            {filteredApps.map(app => (
              <button
                key={app.id}
                className="flex flex-col items-center gap-2 rounded-2xl p-3 hover:bg-gray-800 transition-colors"
                onClick={() => onAppSelect(app.id)}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: app.backgroundColor }}>
                  <span className="text-2xl">{app.icon}</span>
                </div>
                <span className="text-xs text-gray-300">{app.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
