'use client'

import { useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Slider } from '@/components/ui/slider'
import { Sun, Volume2, Wifi, Power, Moon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SystemTrayPanelProps {
  isOpen: boolean
  onClose: () => void
  shelfPosition: 'bottom' | 'left' | 'right'
}

export function SystemTrayPanel({ isOpen, onClose, shelfPosition }: SystemTrayPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null)

  const getPositionStyle = () => {
    switch (shelfPosition) {
      case 'bottom':
        return { bottom: '80px', right: '24px' }
      case 'left':
        return { bottom: '24px', left: '80px' }
      case 'right':
        return { bottom: '24px', right: '80px' }
      default:
        return {}
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            className="fixed z-50 w-80 rounded-3xl bg-surface-10 p-4 shadow-m3-5"
            style={getPositionStyle()}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-2xl bg-surface-20 p-3">
                <div className="flex items-center gap-3">
                  <Sun className="h-5 w-5 text-surface-80" />
                  <span className="text-sm text-surface-80">Brightness</span>
                </div>
                <div className="w-32">
                  <Slider defaultValue={[75]} max={100} step={1} />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-surface-20 p-3">
                <div className="flex items-center gap-3">
                  <Volume2 className="h-5 w-5 text-surface-80" />
                  <span className="text-sm text-surface-80">Volume</span>
                </div>
                <div className="w-32">
                  <Slider defaultValue={[67]} max={100} step={1} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl px-3 py-3 text-sm transition-colors hover:bg-surface-20',
                    'text-surface-80'
                  )}
                >
                  <Wifi className="mb-1 h-5 w-5" />
                  <span className="text-xs">WiFi</span>
                </button>
                <button
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl px-3 py-3 text-sm transition-colors hover:bg-surface-20',
                    'text-surface-80'
                  )}
                >
                  <Moon className="mb-1 h-5 w-5" />
                  <span className="text-xs">Sleep</span>
                </button>
                <button
                  className={cn(
                    'flex flex-col items-center justify-center rounded-2xl px-3 py-3 text-sm transition-colors hover:bg-surface-20',
                    'text-surface-80'
                  )}
                >
                  <Power className="mb-1 h-5 w-5" />
                  <span className="text-xs">Power</span>
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
