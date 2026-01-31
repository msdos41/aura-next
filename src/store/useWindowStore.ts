import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { generateId } from '@/lib/utils'
import { dbAPI } from '@/lib/db'
import type { WindowState, Workspace, SystemSettings } from '@/lib/constants'
import { DEFAULT_APPS, WINDOW_DEFAULT_WIDTH, WINDOW_DEFAULT_HEIGHT, WINDOW_Z_INDEX_BASE, WALLPAPER_WINDOW_WIDTH, WALLPAPER_WINDOW_HEIGHT, SHELF_HEIGHT, SHELF_WIDTH } from '@/lib/constants'

interface WindowStore {
  windows: WindowState[]
  activeWindowId: string | null
  zIndexCounter: number
  currentWorkspaceId: string
  workspaces: Workspace[]
  settings: SystemSettings
  deletedWindowIds: Set<string>

  addWindow: (appId: string, title: string) => void
  removeWindow: (id: string) => void
  focusWindow: (id: string) => void
  minimizeWindow: (id: string) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  updateWindowPosition: (id: string, x: number, y: number) => void
  updateWindowSize: (id: string, width: number, height: number) => void
  bringToFront: (id: string) => void
  setActiveWorkspace: (id: string) => void
  addWorkspace: (name: string) => void
  updateSettings: (settings: Partial<SystemSettings>) => void
  updateWallpaper: (wallpaper: string, wallpaperType: 'gradient' | 'solid' | 'custom') => void
  updateShelfPosition: (position: 'bottom' | 'left' | 'right') => void
  initializeFromDB: () => Promise<void>
  syncToDB: () => Promise<void>
}

const createDefaultSettings = (): SystemSettings => ({
  theme: 'auto',
  wallpaper: 'from-surface-90 to-surface-80',
  wallpaperType: 'gradient',
  showShelf: true,
  shelfPosition: 'bottom',
})

export const useWindowStore = create<WindowStore>()(
  devtools(
    persist(
      (set, get) => ({
        windows: [],
        activeWindowId: null,
        zIndexCounter: WINDOW_Z_INDEX_BASE,
        currentWorkspaceId: 'default',
        workspaces: [
          {
            id: 'default',
            name: 'Desktop',
            windows: [],
          },
        ],
        settings: createDefaultSettings(),
        deletedWindowIds: new Set(),

        addWindow: (appId, title) => {
          const windowWidth = appId === 'wallpaper'
            ? WALLPAPER_WINDOW_WIDTH
            : WINDOW_DEFAULT_WIDTH
          const windowHeight = appId === 'wallpaper'
            ? WALLPAPER_WINDOW_HEIGHT
            : WINDOW_DEFAULT_HEIGHT

          const shelfPosition = get().settings.shelfPosition
          let initialX: number
          let initialY: number

          if (appId === 'wallpaper') {
            if (shelfPosition === 'bottom') {
              initialX = Math.round((window.innerWidth - windowWidth) / 2)
              initialY = Math.round((window.innerHeight - SHELF_HEIGHT - windowHeight) / 2)
            } else if (shelfPosition === 'left') {
              initialX = Math.round((window.innerWidth - SHELF_WIDTH - windowWidth) / 2) + SHELF_WIDTH
              initialY = Math.round((window.innerHeight - windowHeight) / 2)
            } else {
              initialX = Math.round((window.innerWidth - SHELF_WIDTH - windowWidth) / 2)
              initialY = Math.round((window.innerHeight - windowHeight) / 2)
            }
          } else {
            if (shelfPosition === 'left') {
              initialX = 100 + get().windows.length * 50 + SHELF_WIDTH
              initialY = 100 + get().windows.length * 50
            } else {
              initialX = 100 + get().windows.length * 50
              initialY = 100 + get().windows.length * 50
            }
          }

          const newWindow: WindowState = {
            id: generateId(),
            appId,
            title,
            x: initialX,
            y: initialY,
            width: windowWidth,
            height: windowHeight,
            zIndex: get().zIndexCounter + 1,
            isMinimized: false,
            isMaximized: false,
            isFocused: true,
          }

          set((state) => ({
            windows: [...state.windows.map(w => ({ ...w, isFocused: false })), newWindow],
            activeWindowId: newWindow.id,
            zIndexCounter: state.zIndexCounter + 1,
            workspaces: state.workspaces.map(ws =>
              ws.id === state.currentWorkspaceId
                ? { ...ws, windows: [...ws.windows, newWindow.id] }
                : ws
            ),
          }))

          get().syncToDB()
        },

        removeWindow: (id) => {
          set((state) => ({
            windows: state.windows.filter(w => w.id !== id),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
            workspaces: state.workspaces.map(ws =>
              ws.id === state.currentWorkspaceId
                ? { ...ws, windows: ws.windows.filter(wid => wid !== id) }
                : ws
            ),
            deletedWindowIds: new Set([...state.deletedWindowIds, id]),
          }))

          get().syncToDB()
        },

        focusWindow: (id) => {
          const window = get().windows.find(w => w.id === id)
          if (window) {
            set((state) => ({
              windows: state.windows.map(w => ({
                ...w,
                isFocused: w.id === id,
              })),
              activeWindowId: id,
            }))
          }
        },

        minimizeWindow: (id) => {
          set((state) => ({
            windows: state.windows.map(w =>
              w.id === id ? { ...w, isMinimized: true, isFocused: false } : w
            ),
            activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
          }))

          get().syncToDB()
        },

        maximizeWindow: (id) => {
          set((state) => ({
            windows: state.windows.map(w =>
              w.id === id ? { ...w, isMaximized: true } : w
            ),
          }))

          get().syncToDB()
        },

        restoreWindow: (id) => {
          set((state) => ({
            windows: state.windows.map(w =>
              w.id === id ? { ...w, isMinimized: false, isMaximized: false, isFocused: true } : w
            ),
            activeWindowId: id,
          }))

          get().syncToDB()
        },

        updateWindowPosition: (id, x, y) => {
          set((state) => ({
            windows: state.windows.map(w =>
              w.id === id ? { ...w, x, y } : w
            ),
          }))

          get().syncToDB()
        },

        updateWindowSize: (id, width, height) => {
          set((state) => ({
            windows: state.windows.map(w =>
              w.id === id ? { ...w, width, height } : w
            ),
          }))

          get().syncToDB()
        },

        bringToFront: (id) => {
          set((state) => {
            const maxZ = Math.max(...state.windows.map(w => w.zIndex), state.zIndexCounter)
            return {
              windows: state.windows.map(w => ({
                ...w,
                zIndex: w.id === id ? maxZ + 1 : w.zIndex,
                isFocused: w.id === id,
              })),
              zIndexCounter: maxZ + 1,
              activeWindowId: id,
            }
          })

          get().syncToDB()
        },

        setActiveWorkspace: (id) => {
          const workspace = get().workspaces.find(w => w.id === id)
          if (workspace) {
            set((state) => ({
              currentWorkspaceId: id,
              windows: workspace.windows.map(wid =>
                state.windows.find(w => w.id === wid)!
              ).filter(Boolean),
            }))
          }
        },

        addWorkspace: (name) => {
          const newWorkspace: Workspace = {
            id: generateId(),
            name,
            windows: [],
          }
          set((state) => ({
            workspaces: [...state.workspaces, newWorkspace],
          }))

          get().syncToDB()
        },

        updateSettings: (settings) => {
          set((state) => ({
            settings: { ...state.settings, ...settings },
          }))

          get().syncToDB()
        },

        updateWallpaper: (wallpaper, wallpaperType) => {
          set((state) => ({
            settings: {
              ...state.settings,
              wallpaper,
              wallpaperType,
            },
          }))

          get().syncToDB()
        },

        updateShelfPosition: (position) => {
          set((state) => ({
            settings: {
              ...state.settings,
              shelfPosition: position,
            },
          }))

          get().syncToDB()
        },

        initializeFromDB: async () => {
          try {
            const [windows, workspaces, settings] = await Promise.all([
              dbAPI.getAllWindows(),
              dbAPI.getAllWorkspaces(),
              dbAPI.getSettings(),
            ])

            set({
              windows: windows || [],
              workspaces: workspaces || get().workspaces,
              settings: {
                ...createDefaultSettings(),
                ...(settings || {})
              },
              zIndexCounter: Math.max(...(windows || []).map(w => w.zIndex), WINDOW_Z_INDEX_BASE),
            })
          } catch (error) {
            console.error('Failed to initialize from DB:', error)
          }
        },

        syncToDB: async () => {
          try {
            const state = get()
            await Promise.all([
              ...Array.from(state.deletedWindowIds).map((id: string) => dbAPI.deleteWindow(id)),
              ...state.windows.map(w => dbAPI.putWindow(w)),
              dbAPI.putSettings(state.settings),
            ])
            set((state) => ({ deletedWindowIds: new Set() }))
          } catch (error) {
            console.error('Failed to sync to DB:', error)
          }
        },
      }),
      {
        name: 'chromeos-window-storage',
        partialize: (state) => ({
          windows: state.windows,
          workspaces: state.workspaces,
          settings: state.settings,
          zIndexCounter: state.zIndexCounter,
        }),
      }
    )
  )
)
