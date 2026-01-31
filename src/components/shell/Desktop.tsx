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
  const { initializeFromDB, settings, windows } = useWindowStore()
  const { openWindow, restoreWindow, bringToFront } = useWindowActions()
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  // 初始化 IndexedDB
  useEffect(() => {
    initializeFromDB()
  }, [initializeFromDB])

  // 右键菜单处理
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setContextMenuPosition({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  // 应用壁纸样式
  const getWallpaperStyle = () => {
    switch (settings.wallpaperType) {
      case 'gradient':
        return `bg-gradient-to-br ${settings.wallpaper}`
      case 'solid':
        return `bg-${settings.wallpaper}`
      case 'custom':
        // 自定义壁纸通过内联样式应用，避免 Tailwind CSS 解析问题
        return ''
      default:
        return 'bg-gradient-to-br from-surface-90 to-surface-80'
    }
  }

  // 获取自定义壁纸的内联样式
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

  // 右键菜单项
  const contextMenuItems: ContextMenuItem[] = [
    {
      label: '更改壁纸',
      icon: <Image className="h-4 w-4" />,
      onClick: () => {
        setShowContextMenu(false)

        // 检查壁纸窗口是否已存在
        const wallpaperWindow = windows.find((w) => w.appId === 'wallpaper')

        if (wallpaperWindow) {
          // 如果窗口已存在但最小化了，恢复它
          if (wallpaperWindow.isMinimized) {
            restoreWindow(wallpaperWindow.id)
            bringToFront(wallpaperWindow.id)
          } else if (!wallpaperWindow.isFocused) {
            // 如果窗口存在但未聚焦，置顶
            bringToFront(wallpaperWindow.id)
          }
        } else {
          // 如果窗口不存在，打开新窗口
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
      label: '刷新',
      icon: <RefreshCw className="h-4 w-4" />,
      onClick: () => window.location.reload()
    }
  ]

  return (
    <div
      key={`${settings.wallpaperType}-${settings.wallpaper}`}
      className={cn(
        'relative h-full w-full',
        getWallpaperStyle(),
        className
      )}
      style={getCustomWallpaperStyle()}
      onContextMenu={handleContextMenu}
    >
      {/* 图案纹理 */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      {/* 右键菜单 */}
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
