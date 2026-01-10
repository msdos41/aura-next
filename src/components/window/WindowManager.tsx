'use client'

import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/useWindowStore'
import { Window } from './Window'

export function WindowManager() {
  const windows = useWindowStore(state => state.windows)

  return (
    <AnimatePresence>
      {windows
        .sort((a, b) => a.zIndex - b.zIndex)
        .map(window => (
          <Window
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.appId === 'chrome' ? '🌐' : 
                   window.appId === 'files' ? '📁' :
                   window.appId === 'calculator' ? '🧮' :
                   window.appId === 'settings' ? '⚙️' :
                   window.appId === 'terminal' ? '💻' : '🪟'}
          >
            <div className="flex h-full items-center justify-center text-surface-80">
              <div className="text-center">
                <div className="mb-4 text-4xl">🚧</div>
                <div className="text-lg font-medium">App Coming Soon</div>
                <div className="text-sm text-surface-60">
                  {window.title} is under development
                </div>
              </div>
            </div>
          </Window>
        ))}
    </AnimatePresence>
  )
}
