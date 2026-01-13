# Aura-Next

A high-fidelity web-based replica of Chrome OS built with Next.js 16, featuring Material Design 3 aesthetics and a complete window management system.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack enabled)
- **React**: React 19+ with React Compiler
- **Styling**: Tailwind CSS 4.0+ with M3 design tokens
- **State Management**: Zustand with IndexedDB persistence
- **Animations**: Framer Motion
- **Storage**: IndexedDB for window/app state persistence

## Project Structure

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
│   │   │   ├── Desktop.tsx     # Workspace area
│   │   │   ├── Shelf.tsx      # Bottom taskbar
│   │   │   ├── Launcher.tsx    # App drawer overlay
│   │   │   └── Tray.tsx       # System tray
│   │   ├── ui/                # Reusable UI components (M3 styled)
│   │   │   ├── button.tsx      # Button with variants
│   │   │   └── window-control.tsx
│   │   └── window/            # Window system
│   │       ├── Window.tsx       # Draggable/resizable window
│   │       └── WindowManager.tsx
│   │
│   ├── hooks/                 # Custom React hooks
│   │   ├── useSystemTime.ts    # Real-time clock
│   │   └── useWindowActions.ts
│   │
│   ├── lib/                   # Utility libraries
│   │   ├── constants.ts        # M3 colors, window configs, app registry
│   │   ├── db.ts              # IndexedDB wrapper
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

## Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
@/components/* → src/components/*
@/hooks/*       → src/hooks/*
@/lib/*         → src/lib/*
@/store/*       → src/store/*
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev      # Start development server with Turbopack
```

Visit `http://localhost:3000` to see the application.

### Production Build

```bash
npm run build    # Build for production
npm start        # Start production server
```

## Features

### Foundation Phase (Complete)

✅ Window Management System
- Draggable windows with boundary constraints
- Resizable windows (all edges/corners)
- Minimize/Maximize/Close functionality
- Z-index stacking (click to bring to front)
- Window persistence (IndexedDB)
- High-contrast window design (dark header, light body)
- 8px border radius for cleaner look

✅ Shell UI
- Desktop workspace with wallpaper
- Shelf (bottom taskbar) with app launcher button (Circle icon from Lucide React)
- M3 dark theme background (surface-10 #1c1b1f, 95% opacity)
- System tray with clock
- Quick settings panel
- Launcher overlay with app grid (dark theme, 40% width, 66.67% height)
- Centered active app icons
- Minimize/restore window via shelf icon click
- High contrast design (light icons on dark background)

✅ Material Design 3
- Tonal color palette system
- Rounded-3xl (24px) border radius
- Glassmorphism effects
- Custom shadows and elevations

✅ State Management
- Zustand store with devtools
- IndexedDB persistence for all state
- Workspace support (virtual desktops)

## Available Apps

Default apps registered in the system:

| App | Icon | Description |
|-----|------|-------------|
| Chrome | 🌐 | Web browser (coming soon) |
| Files | 📁 | File manager (coming soon) |
| Calculator | 🧮 | Calculator (coming soon) |
| Settings | ⚙️ | System settings (coming soon) |
| Terminal | 💻 | Terminal emulator (coming soon) |

## Configuration

### Material Design 3 Theme

Edit `tailwind.config.ts` to customize the M3 color palette:

```typescript
colors: {
  primary: { /* Tonal scale 0-100 */ },
  secondary: { /* Tonal scale 0-100 */ },
  surface: { /* Tonal scale 0-100 */ },
}
```

### Window Defaults

Edit `src/lib/constants.ts` to configure window behavior:

```typescript
export const WINDOW_MIN_WIDTH = 400
export const WINDOW_MIN_HEIGHT = 300
export const WINDOW_DEFAULT_WIDTH = 800
export const WINDOW_DEFAULT_HEIGHT = 600
```

## Development Notes

### Adding New Apps

1. Create app component in `src/apps/` or inline in window content
2. Add app to `DEFAULT_APPS` in `src/lib/constants.ts`
3. Window will automatically render with your app icon

### Custom Storage

The IndexedDB wrapper provides these APIs:

```typescript
import { dbAPI } from '@/lib/db'

dbAPI.getAllWindows()
dbAPI.putWindow(window)
dbAPI.deleteWindow(id)
dbAPI.getSettings()
dbAPI.putSettings(settings)
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

ISC

## Future Roadmap

### Sprint 2: Core Features
- Chrome Browser with real iframe support
- Calculator app
- Files App with virtual file system
- Settings panel
- Terminal emulator

### Sprint 3: Advanced Features
- Snap layouts (quarter/half screen)
- Keyboard shortcuts (Win+Arrows)
- Multi-monitor/virtual desktop switching
- Window persistence across sessions
- Toast notifications

### Sprint 4: Polish
- All ChromeOS default apps
- Adaptive UI (mobile/tablet modes)
- Accessibility audit (WCAG AA)
- Performance optimization
- Comprehensive testing
