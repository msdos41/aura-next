'use client'

import { useState, useRef, useEffect } from 'react'
import { Image, RefreshCw } from 'lucide-react'
import { useWindowStore } from '@/store/useWindowStore'
import { useWindowActions } from '@/hooks/useWindowActions'
import { cn } from '@/lib/utils'
import { ContextMenu, type ContextMenuItem } from '@/components/ui/ContextMenu'

interface DesktopProps {
  className?: string
}

export function Desktop({ className }: DesktopProps) {
  const { settings, windows } = useWindowStore()
  const { openWindow, restoreWindow, bringToFront } = useWindowActions()
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  // Context menu handler
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  // Apply wallpaper styles
  const getWallpaperStyle = () => {
    switch (settings.wallpaperType) {
      case 'gradient':
        return `bg-gradient-to-br ${settings.wallpaper}`
      case 'solid':
        return `bg-${settings.wallpaper}`
      case 'custom':
        // Custom wallpaper applied via inline style to avoid Tailwind CSS parsing issues
        return ''
      default:
        return 'bg-gradient-to-br from-surface-90 to-surface-80'
    }
  }

  // Get inline styles for custom wallpaper
  const getCustomWallpaperStyle = () => {
    if (settings.wallpaperType === 'custom' && settings.wallpaper) {
      return {
        backgroundImage: `url('${settings.wallpaper}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    return {}
  }

  // Context menu items
  const contextMenuItems: ContextMenuItem[] = [
    {
      label: 'Change Wallpaper',
      icon: <Image className="h-4 w-4" />,
      onClick: () => {
        setShowContextMenu(false)

        const wallpaperWindow = windows.find((w) => w.appId === 'wallpaper')

        if (wallpaperWindow) {
          if (wallpaperWindow.isMinimized) {
            restoreWindow(wallpaperWindow.id)
            bringToFront(wallpaperWindow.id)
          } else if (!wallpaperWindow.isFocused) {
            bringToFront(wallpaperWindow.id)
          }
        } else {
          openWindow('wallpaper', 'Wallpaper')
        }
      }
    },
    {
      label: '-',
      onClick: () => {},
      separator: true
    },
    {
      label: 'Refresh',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: () => window.location.reload()
    }
  ]

  return (
    <div
      key={`${settings.wallpaperType}-${settings.wallpaper}-${settings.shelfPosition}`}
      className={cn(
        'relative h-full w-full',
        getWallpaperStyle(),
        settings.shelfPosition === 'bottom' && 'pb-16',
        settings.shelfPosition === 'left' && 'pl-16',
        settings.shelfPosition === 'right' && 'pr-16',
        className
      )}
      style={getCustomWallpaperStyle()}
      onContextMenu={handleContextMenu}
    >
      {/* Pattern Texture */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* Context Menu */}
      {showContextMenu && (
        <ContextMenu
          isOpen={showContextMenu}
          position={contextMenuPosition}
          onClose={() => setShowContextMenu(false)}
          items={contextMenuItems}
        />
      )}
    </div>
  )
}
