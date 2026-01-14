import { useState, useEffect } from 'react'
import { formatTime, formatDate, formatDay } from '@/lib/utils'

export function useSystemTime() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')
  const [day, setDay] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(formatTime(now))
      setDate(formatDate(now))
      setDay(formatDay(now))
    }

    update()
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [])

  return { time, date, day }
}
