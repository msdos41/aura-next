'use client'

import { useState } from 'react'
import { Circle } from 'lucide-react'
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
      <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-surface-10/95 backdrop-blur-md px-6 shadow-2xl">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 rounded-3xl hover:bg-surface-40/50"
          onMouseDown={(e) => {
            e.stopPropagation()
            setShowLauncher(!showLauncher)
          }}
        >
          <Circle className="h-6 w-6 text-surface-90" strokeWidth={2} />
        </Button>

        <div className="flex gap-1">
          {activeApps.map(app => (
            <Button
              key={app.id}
              variant="ghost"
              size="icon"
              className="h-12 w-12 rounded-3xl hover:bg-surface-40/50"
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
