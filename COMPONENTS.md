# Components Documentation

> **Last Updated**: 2026-01-10
> **Related**: [ARCHITECTURE.md](./ARCHITECTURE.md)

---

## 📚 Table of Contents

- [App Layer](#app-layer)
- [Shell Components](#shell-components)
- [Window Components](#window-components)
- [UI Components](#ui-components)
- [Component Props Reference](#component-props-reference)

---

## 🖥️ App Layer

### `src/app/page.tsx`

**Purpose**: Root page component that assembles the entire ChromeOS interface.

**Imports**:
```typescript
import { Desktop } from '@/components/shell/Desktop'
import { Shelf } from '@/components/shell/Shelf'
import { Tray } from '@/components/shell/Tray'
import { WindowManager } from '@/components/window/WindowManager'
```

**Structure**:
```tsx
<div className="relative h-screen w-screen overflow-hidden bg-surface-90">
  <Desktop />        {/* Background workspace */}
  <WindowManager />   {/* All windows */}
  <Shelf />          {/* Bottom taskbar */}
  <Tray />           {/* Top system tray */}
</div>
```

**Z-Index Layering**:
1. Desktop (`z-index: auto`)
2. WindowManager (windows: `z-index: 1000+`)
3. Shelf (`z-index: 50`)
4. Tray (`z-index: 50`)

**Customization**:
- Modify background color in `bg-surface-90` class
- Add new shell components here
- Change z-index values if needed

---

### `src/app/layout.tsx`

**Purpose**: Root layout wrapper for all pages.

**Features**:
- Inter font from Google Fonts
- HTML structure and metadata
- Global CSS import

**Customization**:
- Change font: `const inter = Inter({ subsets: ['latin'] })`
- Add global providers (Theme, Toast, etc.)

---

### `src/app/globals.css`

**Purpose**: Global styles and CSS utilities.

**Key Sections**:
- `@layer base`: Global resets and body styles
- `@layer components`: Glassmorphism classes
- `@layer utilities`: Custom utilities

**Custom Classes**:
- `.glass`: White transparent with blur
- `.glass-dark`: Dark transparent with blur
- `.glass-light`: Light transparent with blur

**Customization**:
- Modify scrollbar styles (`::-webkit-scrollbar`)
- Add new component classes
- Adjust transition timings

---

## 🖥️ Shell Components

### `src/components/shell/Desktop.tsx`

**Purpose**: Workspace area with background pattern.

**Props**:
```typescript
interface DesktopProps {
  className?: string  // Additional CSS classes
}
```

**Responsibilities**:
- Renders background with gradient
- Adds subtle pattern overlay
- Initializes IndexedDB on mount

**Imports**:
```typescript
import { useWindowStore } from '@/store/useWindowStore'
import { cn } from '@/lib/utils'
```

**State Management**:
```typescript
const { initializeFromDB } = useWindowStore()

useEffect(() => {
  initializeFromDB()
}, [initializeFromDB])
```

**Customization**:
- Change gradient: `from-surface-90 to-surface-80`
- Modify pattern SVG URL
- Add desktop icons

**Diagram**:
```
┌─────────────────────────────────────────┐
│         Desktop (full screen)          │
│  ┌─────┐  ┌─────┐  ┌─────┐      │
│  │ Win1│  │ Win2│  │ Win3│      │  ← Windows overlay
│  └─────┘  └─────┘  └─────┘      │
│  [background pattern]                 │
└─────────────────────────────────────────┘
```

---

### `src/components/shell/Shelf.tsx`

**Purpose**: Bottom taskbar with app launcher and active apps.

**Features**:
- App launcher button (search icon)
- Active app indicators
- Real-time clock display
- Opens Launcher overlay

**Props**: None (self-contained)

**Imports**:
```typescript
import { Button } from '@/components/ui/button'
import { Launcher } from '@/components/shell/Launcher'
import { DEFAULT_APPS } from '@/lib/constants'
import { useWindowStore } from '@/store/useWindowStore'
import { useSystemTime } from '@/hooks/useSystemTime'
import { useWindowActions } from '@/hooks/useWindowActions'
```

**State**:
```typescript
const [showLauncher, setShowLauncher] = useState(false)
const { time, date } = useSystemTime()
const { windows } = useWindowStore()
const { openWindow, restoreWindow } = useWindowActions()
```

**Key Functions**:

`handleAppClick(appId: string)`
- Checks if window is minimized → restores it
- Otherwise → opens new window
- Closes launcher

`activeApps` (computed)
- Filters DEFAULT_APPS by non-minimized windows

**UI Layout**:
```
┌─────────────────────────────────────────┐
│  [🔍] [🌐] [📁] [🧮] [⚙️]      │  ← App icons
│                                   │
│                         3:45 PM    │  ← Clock (right)
│                         Jan 10     │
└─────────────────────────────────────────┘
```

**Customization**:
- Change height: `h-16`
- Modify glass effect: `bg-glass-light/80`
- Add more tray items

---

### `src/components/shell/Launcher.tsx`

**Purpose**: App drawer overlay for searching and launching apps.

**Props**:
```typescript
interface LauncherProps {
  isOpen: boolean          // Show/hide overlay
  onClose: () => void    // Close callback
  onAppSelect: (appId: string) => void  // App selection callback
}
```

**Features**:
- Search input with real-time filtering
- 6-column app grid
- Smooth animations (Framer Motion)
- Dark theme background (#111827) for better visibility
- Compact size (40% width, 66.67% height of screen)
- Left-aligned position (above Shelf button)
- Click-outside-to-close functionality
- No full-screen overlay

**Imports**:
```typescript
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DEFAULT_APPS } from '@/lib/constants'
```

**State**:
```typescript
const [searchQuery, setSearchQuery] = useState('')
const filteredApps = DEFAULT_APPS.filter(app =>
  app.name.toLowerCase().includes(searchQuery.toLowerCase())
)
```

**UI Layout**:
```
┌─────────────────────────────────────────┐
│  Search apps...  [____________]       │
│                                     │
│  ┌───┐ ┌───┐ ┌───┐ ┌───┐     │
│  │🌐 │ │📁 │ │🧮 │ │⚙️ │     │  ← App grid
│  │Chr │ │Fil │ │Cal │ │Set │     │
│  └───┘ └───┘ └───┘ └───┘     │
│  ┌───┐ ┌───┐                 │
│  │💻 │                         │
│  └───┘                         │
└─────────────────────────────────────────┘
```

**Customization**:
- Change grid columns: `grid-cols-6`
- Modify app icon size: `h-12 w-12`
- Adjust animation: modify `motion.div` props

---

### `src/components/shell/Tray.tsx`

**Purpose**: System tray at top-right with clock and quick settings.

**Features**:
- WiFi and battery indicators
- Clickable clock
- Quick settings panel
- Brightness/Volume sliders
- WiFi/Sleep/Power buttons

**Props**: None (self-contained)

**Imports**:
```typescript
import { AnimatePresence, motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useSystemTime } from '@/hooks/useSystemTime'
```

**State**:
```typescript
const [showQuickSettings, setShowQuickSettings] = useState(false)
const { time, date } = useSystemTime()
```

**UI Layout**:
```
┌─────────────────────────────────────────┐
│                    📶 🔋 🕑 3:45 PM│  ← Tray bar
│                                     │
│            ┌─────────────┐           │
│            │ Quick       │           │  ← Quick Settings
│            │ Settings    │           │    (overlay)
│            │ [☀] ██████  │           │
│            │ [🔊] █████  │           │
│            │ [WiFi] [Sleep] [Power]│
│            └─────────────┘           │
└─────────────────────────────────────────┘
```

**Customization**:
- Add more indicators (VPN, etc.)
- Connect sliders to actual settings
- Add more quick actions

---

## 🪟 Window Components

### `src/components/window/Window.tsx`

**Purpose**: Individual draggable, resizable window component.

**Props**:
```typescript
interface WindowProps {
  id: string              // Window ID (from store)
  title: string           // Window title
  icon?: string           // App icon emoji
  children: ReactNode     // Window content
}
```

**Features**:
- ✅ Dragging (via title bar)
- ✅ Resizing (right/bottom edges)
- ✅ Minimize/Maximize/Close buttons
- ✅ Click to focus (bring to front)
- ✅ Constrain to screen bounds
- ✅ Smooth open/close animations

**Imports**:
```typescript
import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { WindowControl } from '@/components/ui/window-control'
import { useWindowActions } from '@/hooks/useWindowActions'
import { useWindowStore } from '@/store/useWindowStore'
import { constrainWindow } from '@/lib/utils'
import { WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT } from '@/lib/constants'
```

**Key State**:
```typescript
const window = useWindowStore(state => state.windows.find(w => w.id === id))
const [isDragging, setIsDragging] = useState(false)
const [isResizing, setIsResizing] = useState(false)
const [resizeEdge, setResizeEdge] = useState<string | null>(null)
```

**Key Refs**:
```typescript
const dragOffset = useRef({ x: 0, y: 0 })
const resizeStart = useRef({ width: 0, height: 0, x: 0, y: 0 })
const containerRef = useRef<HTMLDivElement>(null)
```

**Handlers**:

`handleDragStart(e: MouseEvent)`
- Records offset from window position
- Prevents default behavior
- Starts dragging state

`handleResizeStart(edge: string)`
- Records initial dimensions
- Sets resize edge (e, s, se, w, n)
- Starts resizing state

`handleMouseMove(e: MouseEvent)`
- Updates position while dragging
- Updates size while resizing
- Calls `constrainWindow` for bounds

**UI Structure**:
```
┌─────────────────────────────────────────┐
│ [🪟] Chrome Browser     [_][□][×] │  ← Header (drag area)
├─────────────────────────────────────────┤
│                                     │
│         Window Content                 │  ← Body (children)
│                                     │
│                                     │
├─────────────────────────────────────────┤
│             ← → ↓                    │  ← Resize handles (if not maximized)
└─────────────────────────────────────────┘
```

**Resize Handles**:
- Right edge: `cursor-e-resize`
- Bottom edge: `cursor-n-resize`
- Bottom-right corner: `cursor-se-resize`

**Customization**:
- Add more resize edges (left, top)
- Change snap behavior
- Add window tabs
- Add status bar

---

### `src/components/window/WindowManager.tsx`

**Purpose**: Renders all windows and manages z-index ordering.

**Features**:
- Sorts windows by z-index
- Maps window IDs to icons
- AnimatePresence for transitions
- Renders "App Coming Soon" placeholder

**Imports**:
```typescript
import { AnimatePresence } from 'framer-motion'
import { useWindowStore } from '@/store/useWindowStore'
import { Window } from './Window'
```

**Logic**:
```typescript
const windows = useWindowStore(state => state.windows)

// Sort by z-index for proper layering
windows.sort((a, b) => a.zIndex - b.zIndex)

// Map app IDs to icons
icon = window.appId === 'chrome' ? '🌐' :
       window.appId === 'files' ? '📁' :
       window.appId === 'calculator' ? '🧮' :
       window.appId === 'settings' ? '⚙️' :
       window.appId === 'terminal' ? '💻' : '🪟'
```

**Customization**:
- Add app-specific content components
- Change icon mapping
- Add window list view (Expose)
- Add snap indicators

---

## 🎨 UI Components

### `src/components/ui/button.tsx`

**Purpose**: Reusable button component with variants.

**Props**:
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children: ReactNode
}
```

**Variants**:

**Variant**:
- `default`: Primary purple (`bg-primary-40`)
- `secondary`: Secondary gray (`bg-secondary-40`)
- `outline`: Bordered (`border-surface-60`)
- `ghost`: Hover effect only (`hover:bg-surface-40`)
- `link`: Underlined text (`text-primary-60`)

**Size**:
- `default`: `h-10 px-6`
- `sm`: `h-9 px-4`
- `lg`: `h-12 px-8`
- `icon`: `h-10 w-10`

**Features**:
- M3 rounded corners (`rounded-3xl`)
- Focus ring for accessibility
- Disabled state handling
- Full button HTML attributes

**Usage**:
```tsx
<Button variant="default" size="default">
  Click Me
</Button>

<Button variant="ghost" size="icon" onClick={handleClick}>
  <Icon />
</Button>
```

**Customization**:
- Add new variants in `buttonVariants`
- Modify color classes
- Add loading state
- Add ripple effect

---

### `src/components/ui/window-control.tsx`

**Purpose**: Window control buttons (minimize, maximize, close).

**Props**:
```typescript
interface WindowControlProps {
  type: 'minimize' | 'maximize' | 'close'
  onClick: () => void
  className?: string
}
```

**Icons**:
- `minimize`: Horizontal line
- `maximize`: Square outline
- `close`: X mark

**Colors**:
- `minimize` / `maximize`: `text-surface-80` → `hover:bg-surface-40`
- `close`: `text-surface-80` → `hover:bg-red-600 hover:text-white`

**Features**:
- Round shape (`rounded-full`)
- Hover color change
- Close button turns red on hover
- ARIA labels for accessibility

**Usage**:
```tsx
<WindowControl type="minimize" onClick={minimizeWindow} />
<WindowControl type="maximize" onClick={maximizeWindow} />
<WindowControl type="close" onClick={closeWindow} />
```

**Customization**:
- Change icon SVGs
- Add more control types
- Modify hover colors
- Add tooltips

---

## 🔗 Component Relationships

### Dependency Graph

```
app/page.tsx (Root)
├── components/shell/Desktop.tsx
│   ├── store/useWindowStore
│   └── lib/utils
├── components/shell/Shelf.tsx
│   ├── components/ui/button.tsx
│   ├── components/shell/Launcher.tsx
│   │   └── lib/constants
│   ├── store/useWindowStore
│   ├── hooks/useSystemTime.ts
│   │   └── lib/utils
│   └── hooks/useWindowActions.ts
│       └── store/useWindowStore
├── components/shell/Tray.tsx
│   ├── lib/utils
│   ├── components/ui/button.tsx
│   └── hooks/useSystemTime.ts
└── components/window/WindowManager.tsx
    ├── store/useWindowStore
    └── components/window/Window.tsx
        ├── components/ui/window-control.tsx
        ├── hooks/useWindowActions.ts
        ├── store/useWindowStore
        ├── lib/utils
        └── lib/constants
```

### Communication Flow

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │ Click
       ▼
┌─────────────┐
│  Component  │
└──────┬──────┘
       │ useHook()
       ▼
┌─────────────┐
│    Hook     │  (useWindowActions, useSystemTime)
└──────┬──────┘
       │ useStore()
       ▼
┌─────────────┐
│   Store     │  (useWindowStore)
└──────┬──────┘
       │ setState()
       ▼
┌─────────────┐
│ Re-render   │
└──────┬──────┘
       │ syncToDB()
       ▼
┌─────────────┐
│  IndexedDB  │
└─────────────┘
```

---

## 📝 Component Props Reference

### Desktop
```typescript
interface DesktopProps {
  className?: string
}
```

### Shelf
No props (self-contained)

### Launcher
```typescript
interface LauncherProps {
  isOpen: boolean
  onClose: () => void
  onAppSelect: (appId: string) => void
}
```

### Tray
No props (self-contained)

### Window
```typescript
interface WindowProps {
  id: string
  title: string
  icon?: string
  children: ReactNode
}
```

### WindowManager
No props (self-contained)

### Button
```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  children: ReactNode
}
```

### WindowControl
```typescript
interface WindowControlProps {
  type: 'minimize' | 'maximize' | 'close'
  onClick: () => void
  className?: string
}
```

---

*Last updated: 2026-01-12*
