# ChromeOS-Web Architecture Documentation

> **Project**: ChromeOS-Web Replica
> **Last Updated**: 2026-01-31
> **Framework**: Next.js 16 + React 19 + Zustand + Tailwind CSS 4.0

---

## 📚 Table of Contents

This documentation is organized into separate files for easier maintenance and updates:

1. **[COMPONENTS.md](./COMPONENTS.md)** - All React components, their props, and relationships
2. **[STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)** - Zustand store, hooks, and persistence
3. **[DATA-FLOW.md](./DATA-FLOW.md)** - Visual diagrams of data flow and interactions
4. **[STYLING.md](./STYLING.md)** - M3 design system, Tailwind configuration, and theming
5. **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - How to add apps, windows, and customize the system

---

## 🏗️ Architecture Overview

### High-Level Structure

```
aura-next/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── globals.css         # Global styles & M3 design tokens
│   │   ├── layout.tsx          # Root layout with providers
│   │   ├── page.tsx            # Home page (Desktop OS)
│   │   └── proxy.ts           # API proxy for static assets
│   │
│   ├── components/             # React components
│   │   ├── shell/             # OS shell UI
│   │   │   ├── Desktop.tsx     # Workspace area + right-click menu
│   │   │   ├── Shelf.tsx      # Taskbar (bottom/left/right positions)
│   │   │   ├── Launcher.tsx    # App drawer overlay (dynamic positioning)
│   │   │   ├── Calendar.tsx    # Calendar component (dynamic positioning)
│   │   │   └── SystemTrayPanel.tsx # System tray panel (dynamic positioning)
│   │   ├── apps/              # Application components
│   │   │   └── WallpaperApp.tsx # Wallpaper changer (Phase 1)
│   │   ├── ui/                # Reusable UI components (M3 styled)
│   │   │   ├── button.tsx      # Button with variants
│   │   │   ├── slider.tsx      # Slider component
│   │   │   ├── ContextMenu.tsx # Right-click context menu
│   │   │   └── window/            # Window system
│   │   │       ├── Window.tsx       # Draggable/resizable window
│   │   │       └── WindowManager.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useSystemTime.ts    # Real-time clock
│   │   └── useWindowActions.ts
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── constants.ts        # M3 colors, window configs, app registry
│   │   ├── db.ts              # IndexedDB wrapper
│   │   ├── wallpapers.ts      # Wallpaper presets (Phase 1)
│   │   └── utils.ts           # Helper functions
│   │
│   └── store/                # State management
│       └── useWindowStore.ts  # Zustand store for windows/workspaces
│
├── .next/                    # Next.js build output
├── node_modules/              # Dependencies
├── next.config.ts            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.ts        # Tailwind CSS + M3 theme
├── postcss.config.js         # PostCSS configuration
└── package.json             # Dependencies and scripts
```

### Core Technologies

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 | SSR, routing, caching |
| **UI Library** | React 19 | Component rendering |
| **Styling** | Tailwind CSS 4.0 | Utility-first styling |
| **State** | Zustand | Client state management |
| **Persistence** | IndexedDB | Browser storage |
| **Animations** | Framer Motion | Transitions and gestures |
| **Type Safety** | TypeScript | Type definitions |

### Application Flow

```
User Action
    ↓
Component (e.g., Shelf.tsx, Desktop.tsx)
    ↓
Hook (useWindowActions)
    ↓
Store (useWindowStore)
    ↓
State Update (Zustand)
    ↓
Component Re-render
    ↓
Persistence (IndexedDB)
```

---

## 🎯 Key Concepts

### 1. Window System
Windows are managed by `useWindowStore` with the following lifecycle:

```
[Create] → [Focus] → [Minimize/Maximize] → [Close]
    ↑           ↓              ↓                 ↓
    └──────────┴──────────────┴─────────────────┘
                    (Restore)
```

### 2. Component Communication
- **Props**: Parent → Child (unidirectional)
- **Store**: Global state accessible from anywhere
- **Hooks**: Abstractions for store operations
- **Events**: User interactions trigger state changes

### 3. State Persistence
```
Component → Hook → Store → persist middleware → IndexedDB
                                           ↓
                                   localStorage (fallback)
```

---

## 📊 Data Flow Summary

| Operation | Trigger | Handler | Effect |
|-----------|---------|----------|--------|
| **Open App** | Click Launcher | `openWindow()` | Creates window state |
| **Focus Window** | Click Window | `focusWindow()` | Updates `isFocused` |
| **Bring to Front** | Click Window | `bringToFront()` | Increments z-index |
| **Minimize** | Click Button | `minimizeWindow()` | Sets `isMinimized: true` |
| **Close** | Click X | `closeWindow()` | Removes from state |
| **Open Calendar** | Click Date Button | `setShowCalendar(true)` | Shows calendar overlay |
| **Close Calendar** | Click Date Button/Outside | `setShowCalendar(false)` | Hides calendar overlay |
| **Open System Tray** | Click Time/WiFi/Battery | `setShowSystemTray(true)` | Shows system tray panel |
| **Close System Tray** | Click Outside | `setShowSystemTray(false)` | Hides system tray panel |
| **Change Shelf Position** | Right-click Shelf → Select Position | `updateSettings({ shelfPosition })` | Moves shelf to bottom/left/right |
| **Persist** | State Change | `syncToDB()` | Saves to IndexedDB |

---

## 🔗 File Dependencies

### Core Dependency Graph

```
app/page.tsx
├── components/shell/Desktop.tsx
│   ├── components/ui/ContextMenu.tsx
│   ├── store/useWindowStore.ts
│   ├── hooks/useWindowActions.ts
│   └── lib/utils.ts
├── components/shell/Shelf.tsx
│   ├── components/ui/button.tsx
│   ├── components/ui/ContextMenu.tsx (shelf right-click menu)
│   ├── components/shell/Launcher.tsx
│   │   ├── lib/constants.ts
│   │   └── lib/utils.ts
│   ├── components/shell/Calendar.tsx
│   │   ├── store/useWindowStore.ts (shelfPosition)
│   │   └── lib/utils.ts
│   ├── components/shell/SystemTrayPanel.tsx
│   │   ├── store/useWindowStore.ts (shelfPosition)
│   │   └── lib/utils.ts
│   ├── store/useWindowStore.ts
│   ├── hooks/useSystemTime.ts
│   │   └── lib/utils.ts
│   └── hooks/useWindowActions.ts
│       └── store/useWindowStore.ts
└── components/window/WindowManager.tsx
    ├── store/useWindowStore.ts
    ├── components/window/Window.tsx
    │   ├── components/ui/window-control.tsx
    │   ├── hooks/useWindowActions.ts
    │   ├── store/useWindowStore.ts
    │   ├── lib/utils.ts
    │   └── lib/constants.ts
    └── components/apps/WallpaperApp.tsx
        ├── lib/wallpapers.ts
        ├── store/useWindowStore.ts
        └── lib/utils.ts
```

---

## 🎨 Design System

### Material Design 3 (M3)
- **Color Palette**: Tonal scales (0-100) for primary, secondary, surface
  - **Implementation**: Defined in `src/app/globals.css` using Tailwind v4 `@theme` directive
  - **Shelf Theme**: M3 dark background (`surface-10` #1c1b1f) with high contrast
- **Border Radius**: `rounded-3xl` (24px) for all components
- **Shadows**: 5-level elevation system (`shadow-m3-1` to `shadow-m3-5`)
- **Typography**: Inter font family (Google Fonts)

### Glassmorphism
- **Effect**: `backdrop-blur-md` + `bg-white/80`
- **Usage**: Shelf, Tray, Launcher overlays
- **Base Class**: `.glass-light` in `globals.css`
- **Shelf Update**: Now uses M3 dark theme (`bg-surface-10/95`) while retaining glassmorphism blur effect

---

## 🚀 Quick Reference

### Path Aliases
```typescript
@/components/*  → src/components/*
@/hooks/*      → src/hooks/*
@/lib/*        → src/lib/*
@/store/*      → src/store/*
```

### Common Patterns

**1. Store Access**
```typescript
import { useWindowStore } from '@/store/useWindowStore'

const windows = useWindowStore(state => state.windows)
const { addWindow, removeWindow } = useWindowStore()
```

**2. Hook Usage**
```typescript
import { useWindowActions } from '@/hooks/useWindowActions'

const { openWindow, closeWindow } = useWindowActions()
```

**3. Utility Functions**
```typescript
import { cn } from '@/lib/utils'
import { formatTime, generateId } from '@/lib/utils'

className={cn('base-class', condition && 'conditional-class')}
```

---

## 📝 Updating This Documentation

### When to Update

- ✅ Adding new components
- ✅ Modifying store structure
- ✅ Changing data flow
- ✅ Adding new features
- ✅ Refactoring architecture

### Update Guidelines

1. Keep ASCII diagrams updated with structure changes
2. Update file lists when adding/removing files
3. Document new hooks and their purposes
4. Update dependency graphs
5. Add customization examples for new features

### Version Control

```
ARCHITECTURE.md - Main overview (update rarely)
COMPONENTS.md - Component docs (update often)
STATE-MANAGEMENT.md - Store docs (update often)
DATA-FLOW.md - Diagrams (update on flow changes)
STYLING.md - Design system (update on theme changes)
CUSTOMIZATION.md - Guides (update on API changes)
```

---

## 📚 Next Steps

1. Read **[COMPONENTS.md](./COMPONENTS.md)** to understand all components
2. Study **[DATA-FLOW.md](./DATA-FLOW.md)** to visualize interactions
3. Check **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** to start modifying
4. Reference **[STATE-MANAGEMENT.md](./STATE-MANAGEMENT.md)** for state patterns

---

## 🔗 Related Files

- **[README.md](./README.md)** - Project overview and getting started
- **[CURRENT_STATUS.md](./CURRENT_STATUS.md)** - Project status and progress
- **[BUG_FIXES.md](./BUG_FIXES.md)** - Bug fixes and known issues
- **[package.json](./package.json)** - Dependencies and scripts
- **[tsconfig.json](./tsconfig.json)** - TypeScript configuration

---

*Documentation maintained alongside codebase. Last updated: 2026-01-31*
