'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Launcher } from '@/components/shell/Launcher'
import { DEFAULT_APPS } from '@/lib/constants'
import { useWindowStore } from '@/store/useWindowStore'
import { useSystemTime } from '@/hooks/useSystemTime'
import { useWindowActions } from '@/hooks/useWindowActions'

export function Shelf() {
  const [showLauncher, setShowLauncher] = useState(false)
  const { time, date } = useSystemTime()
  const { windows } = useWindowStore()
  const { openWindow, restoreWindow, bringToFront, minimizeWindow } = useWindowActions()

  const handleAppClick = (appId: string) => {
    const existingWindow = windows.find(w => w.appId === appId)
    
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        restoreWindow(existingWindow.id)
        bringToFront(existingWindow.id)
      } else {
        minimizeWindow(existingWindow.id)
      }
    } else {
      const app = DEFAULT_APPS.find(a => a.id === appId)
      if (app) {
        openWindow(appId, app.name)
      }
    }
    setShowLauncher(false)
  }

  const activeApps = DEFAULT_APPS.filter(app =>
    windows.some(w => w.appId === app.id)
  )

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-glass-light/80 backdrop-blur-md px-6 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-3xl hover:bg-primary-40/20"
          onMouseDown={(e) => {
            e.stopPropagation()
            setShowLauncher(!showLauncher)
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-primary-40">
            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
            <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </Button>

        <div className="flex gap-1">
          {activeApps.map(app => (
            <Button
              key={app.id}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-3xl hover:bg-primary-40/20"
              onClick={() => handleAppClick(app.id)}
            >
              <span className="text-2xl">{app.icon}</span>
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-surface-90">{time}</div>
            <div className="text-xs text-surface-60">{date}</div>
          </div>
        </div>
      </div>

      <Launcher
        isOpen={showLauncher}
        onClose={() => setShowLauncher(false)}
        onAppSelect={handleAppClick}
      />
    </>
  )
}
