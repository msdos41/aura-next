'use client'

import { useState, useRef } from 'react'
import { Circle, Wifi, Battery, AlignLeft, AlignCenterHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Launcher } from '@/components/shell/Launcher'
import { Calendar } from '@/components/shell/Calendar'
import { SystemTrayPanel } from '@/components/shell/SystemTrayPanel'
import { ContextMenu, type ContextMenuItem } from '@/components/ui/ContextMenu'
import { DEFAULT_APPS, type ShelfPosition } from '@/lib/constants'
import { useWindowStore } from '@/store/useWindowStore'
import { useSystemTime } from '@/hooks/useSystemTime'
import { useWindowActions } from '@/hooks/useWindowActions'
import { cn } from '@/lib/utils'

export function Shelf() {
  const [showLauncher, setShowLauncher] = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showSystemTray, setShowSystemTray] = useState(false)
  const [showShelfContextMenu, setShowShelfContextMenu] = useState(false)
  const [shelfMenuPosition, setShelfMenuPosition] = useState({ x: 0, y: 0 })
  const { time, date, day } = useSystemTime()
  const { settings, updateSettings, windows } = useWindowStore()
  const { openWindow, restoreWindow, bringToFront, minimizeWindow } = useWindowActions()
  const { shelfPosition } = settings

  const lastClickTimestampsRef = useRef<Record<string, number>>({})
  const DEBOUNCE_MS = 300

  const handleAppClick = (appId: string) => {
    const lastClickTime = lastClickTimestampsRef.current[appId]
    const now = Date.now()

    if (lastClickTime && now - lastClickTime < DEBOUNCE_MS) {
      return
    }

    lastClickTimestampsRef.current[appId] = now

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

  const handleShelfContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShelfMenuPosition({ x: e.clientX, y: e.clientY })
    setShowShelfContextMenu(true)
  }

  const shelfMenuItems: ContextMenuItem[] = [
    {
      label: 'Bottom',
      icon: <AlignCenterHorizontal className="h-4 w-4" />,
      onClick: () => updateSettings({ shelfPosition: 'bottom' as ShelfPosition })
    },
    {
      label: 'Left',
      icon: <AlignLeft className="h-4 w-4" />,
      onClick: () => updateSettings({ shelfPosition: 'left' as ShelfPosition })
    },
    {
      label: 'Right',
      icon: <AlignLeft className="h-4 w-4 rotate-180" />,
      onClick: () => updateSettings({ shelfPosition: 'right' as ShelfPosition })
    }
  ]

  const activeApps = DEFAULT_APPS.filter(app =>
    windows.some(w => w.appId === app.id)
  )

  return (
    <>
      <div
        className={cn(
          'fixed z-50 flex items-center justify-between bg-surface-10/95 backdrop-blur-md shadow-2xl transition-all duration-300 ease-in-out',
          shelfPosition === 'bottom' && 'bottom-0 left-0 right-0 h-16 flex-row px-6',
          shelfPosition === 'left' && 'left-0 top-0 bottom-0 flex-col py-6',
          shelfPosition === 'right' && 'right-0 top-0 bottom-0 flex-col py-6'
        )}
        style={{
          width: shelfPosition === 'bottom' ? undefined : '64px'
        }}
        onContextMenu={handleShelfContextMenu}
      >
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-3xl hover:bg-surface-40/50"
            onMouseDown={(e) => {
              if (e.button !== 0) return
              e.stopPropagation()
              setShowLauncher(!showLauncher)
            }}
          >
            <Circle className="h-6 w-6 text-surface-90" strokeWidth={2} />
          </Button>
        </div>

        <div className={cn('flex gap-1', shelfPosition !== 'bottom' && 'flex-col')}>
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

        <div className={cn('flex items-center gap-4', shelfPosition !== 'bottom' && 'flex-col gap-1')}>
          <Button
            variant="ghost"
            size="icon"
            className="h-12 w-12 rounded-3xl hover:bg-surface-40/50"
            onMouseDown={(e) => {
              if (e.button !== 0) return
              e.stopPropagation()
              setShowCalendar(!showCalendar)
              setShowSystemTray(false)
            }}
          >
            <span className="text-lg font-medium text-surface-90">{day}</span>
          </Button>

          <div
            className={cn(
              'flex items-center gap-3 rounded-xl p-2 hover:bg-surface-40/50 cursor-pointer',
              shelfPosition !== 'bottom' && 'flex-col gap-1'
            )}
            onMouseDown={(e) => {
              if (e.button !== 0) return
              e.stopPropagation()
              setShowSystemTray(!showSystemTray)
              setShowCalendar(false)
            }}
          >
            <span className="text-sm font-medium text-surface-90">{time}</span>
            <Wifi className="h-5 w-5 text-surface-90" strokeWidth={2} />
            <Battery className="h-5 w-5 text-surface-90" strokeWidth={2} />
          </div>
        </div>
      </div>

      <Launcher
        isOpen={showLauncher}
        onClose={() => setShowLauncher(false)}
        onAppSelect={handleAppClick}
        shelfPosition={shelfPosition}
      />

      <Calendar
        isOpen={showCalendar}
        onClose={() => setShowCalendar(false)}
        shelfPosition={shelfPosition}
      />

      <SystemTrayPanel
        isOpen={showSystemTray}
        onClose={() => setShowSystemTray(false)}
        shelfPosition={shelfPosition}
      />

      {showShelfContextMenu && (
        <ContextMenu
          isOpen={showShelfContextMenu}
          position={shelfMenuPosition}
          onClose={() => setShowShelfContextMenu(false)}
          items={shelfMenuItems}
        />
      )}
    </>
  )
}
