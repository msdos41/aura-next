'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarProps {
  isOpen: boolean
  onClose: () => void
}

export function Calendar({ isOpen, onClose }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState<Date | null>(null)
  const today = useRef<Date | null>(null)

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const getMonthName = (month: number) => {
    return new Date(2024, month).toLocaleDateString('en-US', { month: 'long' })
  }

  const isToday = (day: number) => {
    if (!currentDate || !today.current) return false
    return (
      day === today.current.getDate() &&
      currentDate.getMonth() === today.current.getMonth() &&
      currentDate.getFullYear() === today.current.getFullYear()
    )
  }

  const prevMonth = () => {
    if (!currentDate) return
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    if (!currentDate) return
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const daysInMonth = currentDate ? getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth()) : 0
  const firstDay = currentDate ? getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth()) : 0

  const calendarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!currentDate) {
      const now = new Date()
      setCurrentDate(now)
      today.current = now
    }
  }, [])

  useEffect(() => {
    if (!isOpen) {
      setCurrentDate(new Date())
    }
  }, [isOpen])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const renderDays = () => {
    const days = []
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

    dayNames.forEach((name) => {
      days.push(
        <div
          key={`day-${name}`}
          className="text-center text-xs font-medium text-surface-90 py-1"
        >
          {name}
        </div>
      )
    })

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`blank-${i}`} />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(day)
      days.push(
        <button
          key={day}
          onClick={() => onClose()}
          className={cn(
            'h-9 w-9 mx-auto rounded-full flex items-center justify-center text-sm text-surface-90 transition-colors hover:bg-surface-30 hover:text-surface-100',
            isCurrentDay && 'bg-primary-40 text-surface-10 hover:bg-primary-50'
          )}
        >
          {day}
        </button>
      )
    }

    return days
  }

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
            ref={calendarRef}
            className="fixed z-50 w-80 rounded-3xl bg-surface-10 p-4 shadow-m3-5"
            style={{ bottom: '80px', right: '6px' }}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
          >
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={prevMonth}
                className="rounded-xl p-2 text-surface-80 transition-colors hover:bg-surface-20"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <div className="text-lg font-medium text-surface-90">
                {currentDate && `${getMonthName(currentDate.getMonth())} ${currentDate.getFullYear()}`}
              </div>
              <button
                onClick={nextMonth}
                className="rounded-xl p-2 text-surface-80 transition-colors hover:bg-surface-20"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1">{renderDays()}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
