'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Desktop } from '@/components/shell/Desktop'
import { Shelf } from '@/components/shell/Shelf'
import { WindowManager } from '@/components/window/WindowManager'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useWindowStore } from '@/store/useWindowStore'

export default function Home() {
  const [isInitialized, setIsInitialized] = useState(false)
  const { initializeFromDB } = useWindowStore()

  useEffect(() => {
    document.title = 'Aura-Next'

    const minLoadingTime = 1000

    Promise.all([
      initializeFromDB(),
      new Promise(resolve => setTimeout(resolve, minLoadingTime))
    ]).then(() => {
      setIsInitialized(true)
    })
  }, [initializeFromDB])

  return (
    <>
      <AnimatePresence mode="wait">
        {!isInitialized && <LoadingSpinner key="loading" />}
      </AnimatePresence>

      <AnimatePresence>
        {isInitialized && (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="relative h-screen w-screen overflow-hidden bg-surface-90"
          >
            <Desktop />
            <WindowManager />
            <Shelf />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
