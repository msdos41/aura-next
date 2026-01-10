'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSystemTime } from '@/hooks/useSystemTime'

export function Tray() {
  const [showQuickSettings, setShowQuickSettings] = useState(false)
  const { time, date } = useSystemTime()

  return (
    <>
      <div className="fixed top-0 right-0 z-50 flex h-8 items-center gap-2 px-4 bg-glass-light/80 backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs text-surface-80">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12.55a11 11 0 0 1 14.08 0" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M1.42 9a16 16 0 0 1 21.16 0" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.53 16.11a6 6 0 0 1 6.95 0" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="12" y1="20" x2="12" y2="20" strokeLinecap="round" />
          </svg>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="7" width="20" height="10" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="22" y1="11" x2="22" y2="13" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-6 rounded-xl text-xs text-surface-80 hover:bg-surface-40"
          onClick={() => setShowQuickSettings(!showQuickSettings)}
        >
          {time}
        </Button>
      </div>

      <AnimatePresence>
        {showQuickSettings && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQuickSettings(false)}
            />
            <motion.div
              className="fixed right-2 top-10 z-50 w-80 rounded-3xl bg-surface-10 p-4 shadow-m3-5"
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
            >
              <div className="mb-4 text-center">
                <div className="text-2xl font-medium text-surface-90">{time}</div>
                <div className="text-sm text-surface-60">{date}</div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-2xl bg-surface-20 p-3">
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-80">
                      <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-surface-80">Brightness</span>
                  </div>
                  <div className="h-8 w-32 rounded-full bg-surface-40">
                    <div className="h-full w-3/4 rounded-full bg-primary-40" />
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl bg-surface-20 p-3">
                  <div className="flex items-center gap-3">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-surface-80">
                      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-surface-80">Volume</span>
                  </div>
                  <div className="h-8 w-32 rounded-full bg-surface-40">
                    <div className="h-full w-2/3 rounded-full bg-primary-40" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="secondary" size="sm" className="rounded-2xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <circle cx="12" cy="12" r="5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    WiFi
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-2xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="2" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Sleep
                  </Button>
                  <Button variant="secondary" size="sm" className="rounded-2xl">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                      <path d="M18.36 6.64a9 9 0 1 1-12.73 0" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="12" y1="2" x2="12" y2="12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Power
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
