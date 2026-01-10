import { useWindowStore } from '@/store/useWindowStore'

export function useWindowActions() {
  const {
    addWindow,
    removeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    updateWindowPosition,
    updateWindowSize,
    bringToFront,
  } = useWindowStore()

  return {
    openWindow: (appId: string, title: string) => addWindow(appId, title),
    closeWindow: (id: string) => removeWindow(id),
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    restoreWindow,
    moveWindow: (id: string, x: number, y: number) => updateWindowPosition(id, x, y),
    resizeWindow: (id: string, width: number, height: number) => updateWindowSize(id, width, height),
    bringToFront,
  }
}
