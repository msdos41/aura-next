# State Management Documentation

> **Last Updated**: 2026-01-10
> **Related**: [ARCHITECTURE.md](./ARCHITECTURE.md) | [DATA-FLOW.md](./DATA-FLOW.md)

---

## 📚 Table of Contents

- [Overview](#overview)
- [Store Structure](#store-structure)
- [Zustand Store](#zustand-store)
- [Hooks](#hooks)
- [Persistence](#persistence)
- [State Mutation Patterns](#state-mutation-patterns)

---

## 🎯 Overview

ChromeOS-Web uses **Zustand** as the primary state management solution, with dual persistence:

```
Zustand Store
    ├── localStorage (via persist middleware)
    │
    └── IndexedDB (via custom sync)
```

### Why Zustand?

- ✅ Lightweight (<1KB)
- ✅ No Provider needed
- ✅ TypeScript-first
- ✅ DevTools support
- ✅ Middleware support (persist, devtools)

### Data Layers

| Layer | Technology | Purpose | Size Limit |
|-------|-----------|---------|-------------|
| **In-Memory** | Zustand Store | Active state | Unbounded |
| **Session** | localStorage | Quick recovery | 5-10MB |
| **Persistent** | IndexedDB | Window history | ~250MB+ |

---

## 🏗️ Store Structure

### State Schema

```typescript
interface WindowStore {
  // Window Management
  windows: WindowState[]           // All open windows
  activeWindowId: string | null   // Currently focused window
  zIndexCounter: number           // Next z-index value

  // Workspace Management
  currentWorkspaceId: string       // Active workspace ID
  workspaces: Workspace[]         // All workspaces

  // System Settings
  settings: SystemSettings        // User preferences

  // Actions
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
  initializeFromDB: () => Promise<void>
  syncToDB: () => Promise<void>
}
```

### Window State

```typescript
interface WindowState {
  id: string              // Unique window ID (e.g., "a3f8x2b")
  appId: string          // Application ID (e.g., "chrome")
  title: string          // Window title (e.g., "Chrome Browser")
  x: number             // X position in pixels
  y: number             // Y position in pixels
  width: number         // Window width in pixels
  height: number        // Window height in pixels
  zIndex: number       // Z-index for layering
  isMinimized: boolean // Is window minimized?
  isMaximized: boolean // Is window maximized?
  isFocused: boolean   // Is window focused?
}
```

### Workspace State

```typescript
interface Workspace {
  id: string          // Workspace ID
  name: string        // Workspace display name
  windows: string[]   // Array of window IDs
}
```

### System Settings

```typescript
interface SystemSettings {
  theme: 'light' | 'dark' | 'auto'
  wallpaper: string
  showShelf: boolean
}
```

---

## 🏪 Zustand Store

### File: `src/store/useWindowStore.ts`

### Middleware Stack

```
┌─────────────────────────────┐
│     devtools             │  ← Redux DevTools integration
├─────────────────────────────┤
│     persist             │  ← localStorage persistence
├─────────────────────────────┤
│     Zustand Core        │  ← State & mutations
└─────────────────────────────┘
```

### Store Initialization

```typescript
export const useWindowStore = create<WindowStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Default state
        windows: [],
        activeWindowId: null,
        zIndexCounter: WINDOW_Z_INDEX_BASE,
        currentWorkspaceId: 'default',
        workspaces: [{ id: 'default', name: 'Desktop', windows: [] }],
        settings: createDefaultSettings(),

        // Actions...
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
```

### DevTools Configuration

- Store Name: `chromeos-window-storage`
- Action Tracing: Enabled
- State Inspection: Enabled

Open Redux DevTools to inspect:
- Actions log
- State timeline
- Time travel debugging

### Persist Configuration

```typescript
{
  name: 'chromeos-window-storage',  // localStorage key
  partialize: (state) => ({      // Selective persistence
    windows: state.windows,
    workspaces: state.workspaces,
    settings: state.settings,
    zIndexCounter: state.zIndexCounter,
  }),
}
```

**What's NOT Persisted**:
- `activeWindowId` (will be restored from DB)
- Functions (actions)

---

## 🪝 Hooks

### File: `src/hooks/useWindowActions.ts`

**Purpose**: Abstraction layer for window operations.

**Benefits**:
- Centralized action imports
- Consistent API
- Easy to mock in tests

### API

```typescript
const {
  openWindow,      // Alias for addWindow
  closeWindow,     // Alias for removeWindow
  focusWindow,
  minimizeWindow,
  maximizeWindow,
  restoreWindow,
  moveWindow,      // Alias for updateWindowPosition
  resizeWindow,    // Alias for updateWindowSize
  bringToFront,
} = useWindowActions()
```

### Usage Example

```typescript
import { useWindowActions } from '@/hooks/useWindowActions'

function AppLauncher() {
  const { openWindow, closeWindow } = useWindowActions()

  return (
    <button onClick={() => openWindow('chrome', 'Chrome Browser')}>
      Open Chrome
    </button>
  )
}
```

---

### File: `src/hooks/useSystemTime.ts`

**Purpose**: Real-time clock hook.

**API**:
```typescript
const { time, date } = useSystemTime()

// Returns:
// time: "3:45 PM"
// date: "Jan 10"
```

**Format**:
- Time: 12-hour format with AM/PM
- Date: Short month + day

**Update Frequency**: Every 1000ms (1 second)

**Implementation**:
```typescript
export function useSystemTime() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(formatTime(now))
      setDate(formatDate(now))
    }

    update()  // Initial update
    const interval = setInterval(update, 1000)

    return () => clearInterval(interval)
  }, [])

  return { time, date }
}
```

---

## 💾 Persistence

### Dual-Layer Strategy

```
┌─────────────────────────────────────┐
│         Component                │
│         (useWindowStore)           │
└──────────────┬──────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│      Zustand Store               │  ← In-memory state
└──────┬─────────────────┬─────────┘
       │                 │
       │                 │
       ▼                 ▼
┌─────────────┐   ┌─────────────┐
│  localStorage│   │  IndexedDB  │
│  (persist)  │   │  (syncToDB)│
└─────────────┘   └─────────────┘
```

### IndexedDB API

**File**: `src/lib/db.ts`

### Database Schema

```typescript
interface ChromeOSDB extends DBSchema {
  windows: {
    key: string
    value: WindowState
  }
  workspaces: {
    key: string
    value: Workspace
  }
  settings: {
    key: string
    value: SystemSettings & { key: string }
  }
}
```

### Object Stores

| Store | Key Path | Value Type | Indexes |
|-------|-----------|-------------|----------|
| `windows` | `id` | `WindowState` | None |
| `workspaces` | `id` | `Workspace` | None |
| `settings` | `key` | `SystemSettings` | None |

### API Methods

#### Windows

```typescript
// Get all windows
await dbAPI.getAllWindows(): Promise<WindowState[]>

// Get single window
await dbAPI.getWindow(id: string): Promise<WindowState | undefined>

// Save window
await dbAPI.putWindow(window: WindowState): Promise<void>

// Delete window
await dbAPI.deleteWindow(id: string): Promise<void>

// Clear all windows
await dbAPI.clearWindows(): Promise<void>
```

#### Workspaces

```typescript
// Get all workspaces
await dbAPI.getAllWorkspaces(): Promise<Workspace[]>

// Save workspace
await dbAPI.putWorkspace(workspace: Workspace): Promise<void>

// Delete workspace
await dbAPI.deleteWorkspace(id: string): Promise<void>
```

#### Settings

```typescript
// Get system settings
await dbAPI.getSettings(): Promise<SystemSettings | undefined>

// Save system settings
await dbAPI.putSettings(settings: SystemSettings): Promise<void>
```

### Initialization Flow

```
App Mounts
    │
    ▼
Desktop.tsx → initializeFromDB()
    │
    ▼
useWindowStore → initializeFromDB()
    │
    ├─────────────────────────────────┐
    │                              │
    ▼                              ▼
IndexedDB.getAllWindows()    IndexedDB.getWorkspaces()
    │                              │
    ├─────────────────────────────────┤
    │                              │
    ▼                              ▼
[windows array]              [workspaces array]
    │                              │
    └──────────┬───────────────────┘
               │
               ▼
         set({
           windows: dbWindows,
           workspaces: dbWorkspaces,
           settings: dbSettings,
           zIndexCounter: maxDBZIndex
         })
               │
               ▼
         Components Re-render
```

### Sync to DB Flow

```
Component calls action (e.g., openWindow)
    │
    ▼
useWindowStore → addWindow()
    │
    ▼
  set({ windows: [...newWindows] })
    │
    ▼
Persist middleware → localStorage
    │
    ▼
syncToDB() → IndexedDB.putWindow()
    │
    ▼
  Database Updated
```

### Persistence Timing

| Operation | localStorage | IndexedDB |
|-----------|-------------|------------|
| **State Change** | Immediate (synchronous) | Async (next tick) |
| **App Load** | Instant (rehydrates) | Async (2-50ms) |
| **Window Open** | Saved | Saved |
| **Window Close** | Saved | Saved |
| **Window Move** | Saved | Saved |

---

## 🔄 State Mutation Patterns

### 1. Add Window

```typescript
addWindow: (appId, title) => {
  const newWindow: WindowState = {
    id: generateId(),           // Random ID
    appId,                     // App identifier
    title,                     // Display title
    x: 100 + windows.length * 50,  // Cascade position
    y: 100 + windows.length * 50,
    width: WINDOW_DEFAULT_WIDTH,
    height: WINDOW_DEFAULT_HEIGHT,
    zIndex: zIndexCounter + 1,  // Increment z-index
    isMinimized: false,
    isMaximized: false,
    isFocused: true,          // New window is focused
  }

  set((state) => ({
    windows: [
      ...state.windows.map(w => ({ ...w, isFocused: false })),  // Unfocus others
      newWindow                                                  // Add new
    ],
    activeWindowId: newWindow.id,
    zIndexCounter: state.zIndexCounter + 1,
    workspaces: state.workspaces.map(ws =>
      ws.id === state.currentWorkspaceId
        ? { ...ws, windows: [...ws.windows, newWindow.id] }
        : ws
    ),
  }))

  get().syncToDB()  // Persist to IndexedDB
}
```

### 2. Remove Window

```typescript
removeWindow: (id) => {
  set((state) => ({
    windows: state.windows.filter(w => w.id !== id),  // Filter out
    activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    workspaces: state.workspaces.map(ws =>
      ws.id === state.currentWorkspaceId
        ? { ...ws, windows: ws.windows.filter(wid => wid !== id) }
        : ws
    ),
  }))

  get().syncToDB()
}
```

### 3. Focus Window

```typescript
focusWindow: (id) => {
  set((state) => ({
    windows: state.windows.map(w => ({
      ...w,
      isFocused: w.id === id,  // Toggle focus
    })),
    activeWindowId: id,
  }))
  // Note: No DB sync (temporary state)
}
```

### 4. Bring to Front

```typescript
bringToFront: (id) => {
  set((state) => {
    const maxZ = Math.max(...state.windows.map(w => w.zIndex), state.zIndexCounter)
    return {
      windows: state.windows.map(w => ({
        ...w,
        zIndex: w.id === id ? maxZ + 1 : w.zIndex,  // Update z-index
        isFocused: w.id === id,
      })),
      zIndexCounter: maxZ + 1,
      activeWindowId: id,
    }
  })

  get().syncToDB()
}
```

### 5. Update Window Position

```typescript
updateWindowPosition: (id, x, y) => {
  set((state) => ({
    windows: state.windows.map(w =>
      w.id === id ? { ...w, x, y } : w  // Update position
    ),
  }))

  get().syncToDB()
}
```

---

## 🎯 Store Access Patterns

### Select Entire State

```typescript
const store = useWindowStore()
console.log(store.windows)
console.log(store.activeWindowId)
```

### Select Specific State (Recommended)

```typescript
// Single selector
const windows = useWindowStore(state => state.windows)
const activeWindowId = useWindowStore(state => state.activeWindowId)

// Multiple selectors
const { windows, activeWindowId } = useWindowStore(state => ({
  windows: state.windows,
  activeWindowId: state.activeWindowId,
}))

// Computed selector
const focusedWindow = useWindowStore(state =>
  state.windows.find(w => w.id === state.activeWindowId)
)
```

### Access Actions

```typescript
const { addWindow, removeWindow } = useWindowStore()
```

### Combined (State + Actions)

```typescript
const windows = useWindowStore(state => state.windows)
const { addWindow } = useWindowStore()
```

---

## 🐛 Debugging State Issues

### Using Redux DevTools

1. Install Redux DevTools extension
2. Open DevTools
3. Select `chromeos-window-storage` store
4. Inspect:
   - **State Tab**: Current state tree
   - **Actions Tab**: Action history
   - **Diff Tab**: State changes
   - **Timeline Tab**: Time travel

### Common Issues

#### Issue 1: Windows not persisting
**Cause**: IndexedDB initialization failed
**Fix**: Check console for "Failed to sync to DB"
**Solution**: Clear browser data and reload

#### Issue 2: Z-index conflicts
**Cause**: `zIndexCounter` not incrementing
**Fix**: Check `bringToFront` action in DevTools
**Solution**: Reset store with `dbAPI.clearWindows()`

#### Issue 3: State not updating
**Cause**: Incorrect selector usage
**Fix**: Ensure you're using `state => state.value` pattern
**Solution**: Use `const windows = useWindowStore(state => state.windows)`

---

## 📊 Performance Considerations

### Re-render Optimization

**❌ Bad**: Selects entire store
```typescript
const store = useWindowStore()
// Re-renders on ANY state change
```

**✅ Good**: Selects specific values
```typescript
const windows = useWindowStore(state => state.windows)
// Re-renders only when windows change
```

### Persistence Throttling

**Current**: Every state change triggers DB sync
**Potential**: Implement debouncing

```typescript
// Future optimization
const syncToDB = debounce(async () => {
  await dbAPI.putWindow(window)
}, 500)
```

---

## 🔗 Related Files

- **[COMPONENTS.md](./COMPONENTS.md)** - Component usage of store
- **[DATA-FLOW.md](./DATA-FLOW.md)** - Visual data flow
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - Adding new state

---

*Last updated: 2026-01-10*
