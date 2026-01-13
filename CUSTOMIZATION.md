# Customization Guide

> **Last Updated**: 2026-01-10
> **Related**: [ARCHITECTURE.md](./ARCHITECTURE.md) | [COMPONENTS.md](./COMPONENTS.md)

---

## 📚 Table of Contents

- [Adding New Apps](#adding-new-apps)
- [Creating Custom Components](#creating-custom-components)
- [Adding Custom Windows](#adding-custom-windows)
- [Modifying Window Behavior](#modifying-window-behavior)
- [Extending State Management](#extending-state-management)
- [Adding New Hooks](#adding-new-hooks)
- [Customizing the Store](#customizing-the-store)
- [Adding Workspaces](#adding-workspaces)
- [Implementing Keyboard Shortcuts](#implementing-keyboard-shortcuts)

---

## 📦 Adding New Apps

### Step 1: Register the App

Edit `src/lib/constants.ts`:

```typescript
export const DEFAULT_APPS: App[] = [
  // ... existing apps
  {
    id: 'notepad',           // Unique app ID
    name: 'Notepad',        // Display name
    icon: '📝',           // Emoji icon
    backgroundColor: '#fbbc04',  // Brand color
  },
  {
    id: 'music',
    name: 'Music Player',
    icon: '🎵',
    backgroundColor: '#ea4335',
  },
]
```

### Step 2: Create App Component

Create `src/apps/Notepad.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Notepad() {
  const [content, setContent] = useState('')

  return (
    <div className="flex h-full flex-col p-4">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing..."
        className={cn(
          'flex-1 resize-none rounded-2xl border-none bg-transparent',
          'text-surface-80 placeholder:text-surface-60'
        )}
      />
    </div>
  )
}
```

### Step 3: Add Icon Mapping

Edit `src/components/window/WindowManager.tsx`:

```typescript
icon={window.appId === 'chrome' ? '🌐' :
       window.appId === 'files' ? '📁' :
       window.appId === 'calculator' ? '🧮' :
       window.appId === 'settings' ? '⚙️' :
       window.appId === 'terminal' ? '💻' :
       window.appId === 'notepad' ? '📝' :  // Add your app
       window.appId === 'music' ? '🎵' :     // Add your app
       '🪟'}
```

### Step 4: Update Window Content

Edit `src/components/window/WindowManager.tsx`:

```typescript
// Replace the placeholder with your app
<Window
  key={window.id}
  id={window.id}
  title={window.title}
  icon={/* icon mapping */}
>
  {window.appId === 'notepad' && <Notepad />}
  {window.appId === 'music' && <MusicPlayer />}
  {/* Fallback for apps without components */}
  {!['notepad', 'music', 'chrome'].includes(window.appId) && (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <div className="mb-4 text-4xl">🚧</div>
        <div className="text-lg font-medium">App Coming Soon</div>
      </div>
    </div>
  )}
</Window>
```

### Result

Your app is now available:
- In Launcher (search for it)
- Opens as a window
- Has proper icon and background color

---

## 🧩 Creating Custom Components

### Example: Status Bar Component

Create `src/components/ui/status-bar.tsx`:

```typescript
'use client'

import { cn } from '@/lib/utils'

interface StatusBarProps {
  className?: string
  children: React.ReactNode
}

export function StatusBar({ className, children }: StatusBarProps) {
  return (
    <div
      className={cn(
        'flex items-center rounded-2xl bg-surface-20 px-3 py-1',
        'text-xs text-surface-80',
        className
      )}
    >
      {children}
    </div>
  )
}
```

**Usage**:

```tsx
import { StatusBar } from '@/components/ui/status-bar'

<StatusBar>
  <span>● Ready</span>
</StatusBar>
```

---

## 🪟 Adding Custom Windows

### Example: Modal Window

Create `src/components/ui/modal-window.tsx`:

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WindowControl } from './window-control'

interface ModalWindowProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ModalWindow({ isOpen, onClose, title, children }: ModalWindowProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className="flex max-w-md flex-col rounded-3xl bg-surface-10 shadow-m3-5"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-surface-30 px-4 py-3">
                <span className="font-medium text-surface-90">{title}</span>
                <WindowControl type="close" onClick={onClose} />
              </div>

              {/* Content */}
              <div className="p-4">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Usage**:

```tsx
import { ModalWindow } from '@/components/ui/modal-window'

function MyComponent() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <Button onClick={() => setShowModal(true)}>
        Open Modal
      </Button>

      <ModalWindow
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Confirm Action"
      >
        <p>Are you sure you want to proceed?</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button onClick={() => setShowModal(false)}>
            Confirm
          </Button>
        </div>
      </ModalWindow>
    </>
  )
}
```

---

## ⚙️ Modifying Window Behavior

### Change Default Window Size

Edit `src/lib/constants.ts`:

```typescript
// Global defaults
export const WINDOW_DEFAULT_WIDTH = 800
export const WINDOW_DEFAULT_HEIGHT = 600

// App-specific defaults (future)
export const WINDOW_SIZES = {
  calculator: { width: 300, height: 400 },
  terminal: { width: 600, height: 400 },
  chrome: { width: 1024, height: 768 },
} as const
```

Edit `src/store/useWindowStore.ts`:

```typescript
addWindow: (appId, title) => {
  const sizes = WINDOW_SIZES[appId as keyof typeof WINDOW_SIZES]

  const newWindow: WindowState = {
    id: generateId(),
    appId,
    title,
    x: 100 + get().windows.length * 50,
    y: 100 + get().windows.length * 50,
    width: sizes?.width || WINDOW_DEFAULT_WIDTH,
    height: sizes?.height || WINDOW_DEFAULT_HEIGHT,
    zIndex: get().zIndexCounter + 1,
    isMinimized: false,
    isMaximized: false,
    isFocused: true,
  }
  // ... rest of logic
}
```

### Add Window Snap to Grid

Edit `src/lib/utils.ts`:

```typescript
export function snapToGrid(x: number, y: number, gridSize: number = 20) {
  return {
    x: Math.round(x / gridSize) * gridSize,
    y: Math.round(y / gridSize) * gridSize,
  }
}
```

Edit `src/components/window/Window.tsx`:

```typescript
const handleDragStart = (e: React.MouseEvent) => {
  if (!window || window.isMaximized) return
  e.preventDefault()

  // Snap to grid
  const snapped = snapToGrid(window.x, window.y, 20)

  setIsDragging(true)
  dragOffset.current = {
    x: e.clientX - snapped.x,
    y: e.clientY - snapped.y,
  }
}
```

### Add Window Resize Limits

Edit `src/lib/constants.ts`:

```typescript
export const WINDOW_MAX_WIDTH = 1920
export const WINDOW_MAX_HEIGHT = 1080
```

Edit `src/components/window/Window.tsx`:

```typescript
import { WINDOW_MAX_WIDTH, WINDOW_MAX_HEIGHT } from '@/lib/constants'

// In handleResizeStart
if (resizeEdge?.includes('e')) {
  newWidth = clamp(
    resizeStart.current.width + deltaX,
    WINDOW_MIN_WIDTH,
    WINDOW_MAX_WIDTH
  )
}
```

---

## 🗄️ Extending State Management

### Add New State Field

Edit `src/store/useWindowStore.ts`:

```typescript
interface WindowStore {
  // Existing fields...
  windows: WindowState[]
  activeWindowId: string | null

  // New field: Window pinning
  pinnedWindows: string[]

  // Existing actions...

  // New action: Pin/Unpin window
  pinWindow: (id: string) => void
  unpinWindow: (id: string) => void
}
```

Add action implementation:

```typescript
const createDefaultSettings = (): SystemSettings => ({
  theme: 'auto',
  wallpaper: 'default',
  showShelf: true,
})

export const useWindowStore = create<WindowStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Existing state...
        windows: [],
        activeWindowId: null,

        // New state
        pinnedWindows: [],

        // Existing actions...

        // New action: Pin window
        pinWindow: (id) => {
          set((state) => ({
            pinnedWindows: [...state.pinnedWindows, id],
          }))

          get().syncToDB()
        },

        // New action: Unpin window
        unpinWindow: (id) => {
          set((state) => ({
            pinnedWindows: state.pinnedWindows.filter(pinId => pinId !== id),
          }))

          get().syncToDB()
        },
      }),
      {
        name: 'chromeos-window-storage',
        partialize: (state) => ({
          // Add new field to persistence
          pinnedWindows: state.pinnedWindows,
          windows: state.windows,
          workspaces: state.workspaces,
          settings: state.settings,
          zIndexCounter: state.zIndexCounter,
        }),
      }
    )
  )
)
```

### Use New State in Component

```typescript
import { useWindowStore } from '@/store/useWindowStore'

function PinnedWindowsIndicator() {
  const pinnedWindows = useWindowStore(state => state.pinnedWindows)

  return (
    <div>
      {pinnedWindows.length} pinned windows
    </div>
  )
}
```

---

## 🪝 Adding New Hooks

### Example: useLocalStorage Hook

Create `src/hooks/useLocalStorage.ts`:

```typescript
import { useState, useEffect } from 'react'

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
}
```

**Usage**:

```typescript
import { useLocalStorage } from '@/hooks/useLocalStorage'

function SettingsPanel() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false)

  return (
    <div>
      <input
        type="checkbox"
        checked={darkMode}
        onChange={(e) => setDarkMode(e.target.checked)}
      />
      <span>Dark Mode</span>
    </div>
  )
}
```

### Example: useKeyboardShortcuts Hook

Create `src/hooks/useKeyboardShortcuts.ts`:

```typescript
import { useEffect, useCallback } from 'react'

type ShortcutHandler = (e: KeyboardEvent) => void

interface Shortcut {
  key: string
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: ShortcutHandler
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    for (const shortcut of shortcuts) {
      const keyMatch = e.key === shortcut.key
      const ctrlMatch = shortcut.ctrl === undefined || e.ctrlKey === shortcut.ctrl
      const shiftMatch = shortcut.shift === undefined || e.shiftKey === shortcut.shift
      const altMatch = shortcut.alt === undefined || e.altKey === shortcut.alt
      const metaMatch = shortcut.meta === undefined || e.metaKey === shortcut.meta

      if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
        e.preventDefault()
        shortcut.handler(e)
        break
      }
    }
  }, [shortcuts])

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])
}
```

**Usage**:

```typescript
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useWindowActions } from '@/hooks/useWindowActions'

function MyComponent() {
  const { closeWindow, minimizeWindow } = useWindowActions()

  useKeyboardShortcuts([
    {
      key: 'w',
      ctrl: true,
      handler: () => console.log('Ctrl+W pressed'),
    },
    {
      key: 'F4',
      alt: true,
      handler: () => console.log('Alt+F4 pressed'),
    },
  ])

  return <div>My Component</div>
}
```

---

## 🏪 Customizing the Store

### Add Selectors

Create `src/store/selectors.ts`:

```typescript
import { useWindowStore } from './useWindowStore'

// Selector: Get focused window
export function useFocusedWindow() {
  return useWindowStore(state =>
    state.windows.find(w => w.id === state.activeWindowId)
  )
}

// Selector: Get windows sorted by z-index
export function useSortedWindows() {
  return useWindowStore(state =>
    [...state.windows].sort((a, b) => a.zIndex - b.zIndex)
  )
}

// Selector: Get windows by app ID
export function useWindowsByAppId(appId: string) {
  return useWindowStore(state =>
    state.windows.filter(w => w.appId === appId)
  )
}

// Selector: Get all minimized windows
export function useMinimizedWindows() {
  return useWindowStore(state =>
    state.windows.filter(w => w.isMinimized)
  )
}
```

**Usage**:

```typescript
import { useFocusedWindow } from '@/store/selectors'

function WindowInfo() {
  const focusedWindow = useFocusedWindow()

  return (
    <div>
      {focusedWindow && (
        <p>Active: {focusedWindow.title}</p>
      )}
      {!focusedWindow && (
        <p>No active window</p>
      )}
    </div>
  )
}
```

### Add Action Creators

Create `src/store/actions.ts`:

```typescript
import { useWindowStore } from './useWindowStore'

export function useWindowActions() {
  const store = useWindowStore()

  return {
    // Existing actions
    openWindow: (appId: string, title: string) => store.addWindow(appId, title),
    closeWindow: (id: string) => store.removeWindow(id),

    // Custom action: Close all windows
    closeAllWindows: () => {
      store.windows.forEach(window => store.removeWindow(window.id))
    },

    // Custom action: Minimize all except active
    minimizeAllExceptActive: () => {
      const state = store.getState()
      state.windows
        .filter(w => w.id !== state.activeWindowId)
        .forEach(w => store.minimizeWindow(w.id))
    },

    // Custom action: Cascade all windows
    cascadeWindows: () => {
      const state = store.getState()
      state.windows.forEach((w, index) => {
        store.updateWindowPosition(
          w.id,
          100 + index * 50,
          100 + index * 50
        )
      })
    },
  }
}
```

---

## 🖥️ Adding Workspaces

### Step 1: Extend Store

Edit `src/store/useWindowStore.ts`:

```typescript
// Actions already exist:
// - setActiveWorkspace(id: string) => void
// - addWorkspace(name: string) => void

// Add new action: Delete workspace
deleteWorkspace: (id: string) => void

// Add new action: Move window to workspace
moveWindowToWorkspace: (windowId: string, workspaceId: string) => void
```

**Implementation**:

```typescript
deleteWorkspace: (id) => {
  set((state) => ({
    workspaces: state.workspaces.filter(ws => ws.id !== id),
  }))

  get().syncToDB()
},

moveWindowToWorkspace: (windowId, workspaceId) => {
  set((state) => {
    // Remove from current workspace
    const updatedWorkspaces = state.workspaces.map(ws => ({
      ...ws,
      windows: ws.id === state.currentWorkspaceId
        ? ws.windows.filter(wid => wid !== windowId)
        : ws.windows,
    }))

    // Add to target workspace
    const targetWorkspace = updatedWorkspaces.find(ws => ws.id === workspaceId)
    if (targetWorkspace) {
      targetWorkspace.windows.push(windowId)
    }

    return { workspaces: updatedWorkspaces }
  })

  get().syncToDB()
},
```

### Step 2: Create Workspace Switcher

Create `src/components/shell/WorkspaceSwitcher.tsx`:

```typescript
'use client'

import { useWindowStore } from '@/store/useWindowStore'
import { cn } from '@/lib/utils'

export function WorkspaceSwitcher() {
  const { workspaces, currentWorkspaceId, setActiveWorkspace } = useWindowStore()

  return (
    <div className="flex items-center gap-2">
      {workspaces.map((workspace, index) => (
        <button
          key={workspace.id}
          onClick={() => setActiveWorkspace(workspace.id)}
          className={cn(
            'h-2 w-2 rounded-full transition-all',
            workspace.id === currentWorkspaceId
              ? 'bg-primary-40 w-8'
              : 'bg-surface-60 hover:bg-surface-80'
          )}
          aria-label={`Switch to ${workspace.name}`}
        />
      ))}
      <button
        onClick={() => setActiveWorkspace(`workspace-${Date.now()}`)}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-60 text-surface-80 hover:bg-surface-80"
        aria-label="Add workspace"
      >
        +
      </button>
    </div>
  )
}
```

### Step 3: Add to Shelf

Edit `src/components/shell/Shelf.tsx`:

```typescript
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

// In Shelf component return:
<div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-between bg-glass-light/80 backdrop-blur-md px-6 shadow-2xl">
  {/* Existing left section */}
  <div className="flex items-center gap-2">
    {/* ... */}
  </div>

  {/* New: Workspace switcher */}
  <WorkspaceSwitcher />

  {/* Existing right section */}
  <div className="flex items-center gap-4">
    {/* ... */}
  </div>
</div>
```

---

## ⌨️ Implementing Keyboard Shortcuts

### Full Implementation

Create `src/hooks/useKeyboardShortcuts.ts` (as shown above).

Then create `src/components/KeyboardShortcutsHandler.tsx`:

```typescript
'use client'

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useWindowActions, useWindowStore } from '@/store/useWindowStore'

export function KeyboardShortcutsHandler() {
  const { closeWindow, minimizeWindow, restoreWindow } = useWindowActions()
  const { activeWindowId, bringToFront } = useWindowStore()

  useKeyboardShortcuts([
    // Alt + F4: Close active window
    {
      key: 'F4',
      alt: true,
      handler: () => {
        if (activeWindowId) {
          closeWindow(activeWindowId)
        }
      },
    },

    // Win + D: Show desktop (minimize all)
    {
      key: 'd',
      meta: true,
      handler: () => {
        const state = useWindowStore.getState()
        state.windows.forEach(w => minimizeWindow(w.id))
      },
    },

    // Win + Arrow Up: Maximize
    {
      key: 'ArrowUp',
      meta: true,
      handler: () => {
        if (activeWindowId) {
          // Get current window and toggle maximize
          const window = useWindowStore.getState()
            .windows.find(w => w.id === activeWindowId)
          if (window?.isMaximized) {
            restoreWindow(activeWindowId)
          } else {
            // Need to add maximize action to useWindowActions
          }
        }
      },
    },

    // Win + Arrow Down: Minimize
    {
      key: 'ArrowDown',
      meta: true,
      handler: () => {
        if (activeWindowId) {
          minimizeWindow(activeWindowId)
        }
      },
    },

    // Escape: Close Launcher/Settings
    {
      key: 'Escape',
      handler: () => {
        // Close overlays - implement state for this
        // const { setShowLauncher, setShowQuickSettings } = useUIStore()
        // setShowLauncher(false)
        // setShowQuickSettings(false)
      },
    },
  ])

  return null // This component doesn't render anything
}
```

**Add to Root Layout**:

Edit `src/app/page.tsx`:

```typescript
import { KeyboardShortcutsHandler } from '@/components/KeyboardShortcutsHandler'

export default function Home() {
  useEffect(() => {
    document.title = 'ChromeOS Web'
  }, [])

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-surface-90">
      <KeyboardShortcutsHandler />
      <Desktop />
      <WindowManager />
      <Shelf />
      <Tray />
    </div>
  )
}
```

---

## 🎨 Customizing M3 Colors

### Override Color Palette

**Method 1: Using `@theme` directive (Tailwind v4 recommended)**

Edit `src/app/globals.css`:

```css
@import "tailwindcss";

@theme {
  --color-primary-40: #8b5cf6;  /* Override with custom purple */
  --color-primary-80: #d8b4fe;  /* Override with custom light purple */
  
  /* Add custom color scheme */
  --color-brand-10: #6366f1;
  --color-brand-20: #4f46e5;
  --color-brand-40: #4338ca;
  --color-brand-80: #a5b4fc;
  --color-brand-100: #ffffff;
}
```

**Usage**:

```tsx
<div className="bg-brand-40 text-white">
  Custom branded element
</div>
```

**Method 2: Using `tailwind.config.ts` (for non-color configs)**

Edit `tailwind.config.ts`:

```typescript
theme: {
  extend: {
    colors: {
      // Note: This won't override @theme directive colors
      // Use this for custom non-M3 color schemes
      custom: {
        10: '#6366f1',
        40: '#4338ca',
        80: '#a5b4fc',
      },
    },
  },
}
```

**Note**: Tailwind v4's `@theme` directive takes precedence over `tailwind.config.ts` for color definitions.

---

## 🚀 Common Customization Tasks

### Task 1: Change Desktop Background

Edit `src/components/shell/Desktop.tsx`:

```typescript
<div
  className={cn(
    'relative h-full w-full',
    // Option 1: Solid color
    // 'bg-blue-500',

    // Option 2: Custom gradient
    // 'bg-gradient-to-br from-blue-500 to-purple-600',

    // Option 3: Image background
    // 'bg-[url("/wallpaper.jpg")] bg-cover bg-center',

    'bg-gradient-to-br from-surface-90 to-surface-80',
    className
  )}
>
```

### Task 2: Add System Notification

Create `src/components/ui/notification.tsx`:

```typescript
'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NotificationProps {
  show: boolean
  message: string
  onClose: () => void
}

export function Notification({ show, message, onClose }: NotificationProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed right-4 top-20 z-[100] max-w-sm rounded-3xl bg-surface-10 p-4 shadow-m3-5"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 100 }}
        >
          <p className="text-sm text-surface-90">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### Task 3: Add Window Context Menu

Create `src/components/window/ContextMenu.tsx`:

```typescript
'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useWindowActions } from '@/hooks/useWindowActions'

export function WindowContextMenu({ windowId, onClose }: { windowId: string, onClose: () => void }) {
  const { closeWindow, minimizeWindow, maximizeWindow } = useWindowActions()

  return (
    <AnimatePresence>
      {/* Render context menu */}
    </AnimatePresence>
  )
}
```

---

## 🔗 Related Files

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture
- **[COMPONENTS.md](./COMPONENTS.md)** - Component reference
- **[STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)** - Store patterns
- **[STYLING.md](./STYLING.md)** - Design system

---

## 📝 Update This Guide

When you add new features, update this guide:

1. ✅ Add new app examples to "Adding New Apps"
2. ✅ Add custom component patterns
3. ✅ Document new store fields and actions
4. ✅ Add hook examples
5. ✅ Include keyboard shortcuts

---

*Last updated: 2026-01-12*
