'use client'

import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface ContextMenuItem {
  label: string
  icon?: React.ReactNode
  onClick: () => void
  disabled?: boolean
  separator?: boolean
}

export interface ContextMenuProps {
  isOpen: boolean
  items: ContextMenuItem[]
  position: { x: number; y: number }
  onClose: () => void
}

export function ContextMenu({ isOpen, items, position, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)
  const MENU_WIDTH = 200
  const PADDING = 10

  // 计算智能定位，防止超出屏幕
  const calculatePosition = () => {
    let x = position.x
    let y = position.y

    // 防止超出右边界
    if (x + MENU_WIDTH + PADDING > window.innerWidth) {
      x = window.innerWidth - MENU_WIDTH - PADDING
    }

    // 防止超出下边界（估算菜单高度）
    const estimatedHeight = items.length * 40 + 20
    if (y + estimatedHeight + PADDING > window.innerHeight) {
      y = window.innerHeight - estimatedHeight - PADDING
    }

    return { x, y }
  }

  const adjustedPosition = calculatePosition()

  // 点击外部关闭
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
        ref={menuRef}
        className={cn(
          'fixed z-[10001] min-w-[200px] rounded-xl p-1 shadow-m3-4',
          'bg-white text-surface-80',  // 浅色模式
          'dark:bg-surface-10 dark:text-surface-90',  // 深色模式
        )}
        style={{
          left: adjustedPosition.x,
          top: adjustedPosition.y,
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        {items.map((item, index) => (
          <div key={index}>
            {item.separator ? (
              <div className="h-px bg-surface-30 my-1 dark:bg-surface-40" />
            ) : (
              <button
                className={cn(
                  'flex w-full items-center justify-start gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors',
                  'hover:bg-primary-40/20',  // hover 效果
                  item.disabled && 'opacity-50 cursor-not-allowed',  // 禁用状态
                )}
                onClick={() => {
                  if (!item.disabled) {
                    item.onClick()
                    onClose()
                  }
                }}
                disabled={item.disabled}
              >
                {item.icon && <span className="h-4 w-4">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            )}
          </div>
        ))}
        </motion.div>
        )}
    </AnimatePresence>
  )
}
