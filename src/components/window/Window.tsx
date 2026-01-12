'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WindowControl } from '@/components/ui/window-control'
import { useWindowActions } from '@/hooks/useWindowActions'
import { useWindowStore } from '@/store/useWindowStore'
import { constrainWindow } from '@/lib/utils'
import { WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT } from '@/lib/constants'

interface WindowProps {
  id: string
  title: string
  icon?: string
  children: React.ReactNode
}

export function Window({ id, title, icon, children }: WindowProps) {
  const window = useWindowStore(state => state.windows.find(w => w.id === id))
  const { closeWindow, focusWindow, minimizeWindow, maximizeWindow, restoreWindow, moveWindow, resizeWindow, bringToFront } = useWindowActions()

  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [resizeEdge, setResizeEdge] = useState<string | null>(null)

  const dragOffset = useRef({ x: 0, y: 0 })
  const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!window || window.isMaximized) return

      if (isDragging) {
        const newX = e.clientX - dragOffset.current.x
        const newY = e.clientY - dragOffset.current.y

        if (containerRef.current) {
          const containerRect = containerRef.current.parentElement?.getBoundingClientRect()
          if (containerRect) {
            const constrained = constrainWindow(
              newX,
              newY,
              window.width,
              window.height,
              containerRect.width,
              containerRect.height
            )
            moveWindow(id, constrained.x, constrained.y)
          }
        }
      }

      if (isResizing) {
        const deltaX = e.clientX - resizeStart.current.x
        const deltaY = e.clientY - resizeStart.current.y

        let newWidth = resizeStart.current.width
        let newHeight = resizeStart.current.height

        if (resizeEdge?.includes('e')) {
          newWidth = Math.max(WINDOW_MIN_WIDTH, resizeStart.current.width + deltaX)
        }
        if (resizeEdge?.includes('w')) {
          newWidth = Math.max(WINDOW_MIN_WIDTH, resizeStart.current.width - deltaX)
        }
        if (resizeEdge?.includes('s')) {
          newHeight = Math.max(WINDOW_MIN_HEIGHT, resizeStart.current.height + deltaY)
        }
        if (resizeEdge?.includes('n')) {
          newHeight = Math.max(WINDOW_MIN_HEIGHT, resizeStart.current.height - deltaY)
        }

        resizeWindow(id, newWidth, newHeight)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
      setResizeEdge(null)
    }

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, resizeEdge, window, id, moveWindow, resizeWindow])

  const handleWindowClick = () => {
    bringToFront(id)
    focusWindow(id)
  }

  const handleDragStart = (e: React.MouseEvent) => {
    if (!window || window.isMaximized) return
    e.preventDefault()
    setIsDragging(true)
    dragOffset.current = {
      x: e.clientX - window.x,
      y: e.clientY - window.y,
    }
  }

  const handleResizeStart = (edge: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!window || window.isMaximized) return
    setIsResizing(true)
    setResizeEdge(edge)
    resizeStart.current = {
      width: window.width,
      height: window.height,
      x: e.clientX,
      y: e.clientY,
    }
  }

  if (!window || window.isMinimized) return null

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        'absolute flex flex-col overflow-hidden rounded-lg shadow-m3-4',
        window.isFocused && 'shadow-m3-5'
      )}
      style={{
        left: window.isMaximized ? 0 : window.x,
        top: window.isMaximized ? 0 : window.y,
        width: window.isMaximized ? '100%' : window.width,
        height: window.isMaximized ? 'calc(100vh - 64px)' : window.height,
        zIndex: window.zIndex,
        backgroundColor: '#f5f5f5',
      }}
      onClick={handleWindowClick}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="window-header flex h-12 shrink-0 items-center justify-between border-b border-gray-600 px-4"
        style={{ backgroundColor: '#333333' }}
        onMouseDown={handleDragStart}
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">{icon || '🪟'}</span>
          <span className="text-sm font-medium" style={{ color: '#ffffff' }}>{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <WindowControl type="minimize" onClick={() => minimizeWindow(id)} />
          <WindowControl
            type={window.isMaximized ? 'maximize' : 'maximize'}
            onClick={() => window.isMaximized ? restoreWindow(id) : maximizeWindow(id)}
          />
          <WindowControl type="close" onClick={() => closeWindow(id)} />
        </div>
      </div>

      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#f5f5f5' }}>
        {children}
      </div>

      {!window.isMaximized && (
        <>
          <div
            className="absolute right-0 top-0 h-full w-1 cursor-e-resize hover:bg-primary-40/50"
            onMouseDown={handleResizeStart('e')}
          />
          <div
            className="absolute bottom-0 right-0 h-1 w-full cursor-n-resize hover:bg-primary-40/50"
            onMouseDown={handleResizeStart('s')}
          />
          <div
            className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize hover:bg-primary-40/50"
            onMouseDown={handleResizeStart('se')}
          />
        </>
      )}
    </motion.div>
  )
}
