'use client'

import { useEffect } from 'react'
import { Desktop } from '@/components/shell/Desktop'
import { Shelf } from '@/components/shell/Shelf'
import { WindowManager } from '@/components/window/WindowManager'

export default function Home() {
  useEffect(() => {
    document.title = 'Aura-Next'
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-surface-90">
      <Desktop />
      <WindowManager />
      <Shelf />
    </div>
  )
}
