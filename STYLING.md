# Styling Documentation (Material Design 3)

> **Last Updated**: 2026-01-10
> **Related**: [ARCHITECTURE.md](./ARCHITECTURE.md) | [COMPONENTS.md](./COMPONENTS.md)

---

## 📚 Table of Contents

- [Design System Overview](#design-system-overview)
- [M3 Color Palette](#m3-color-palette)
- [Typography](#typography)
- [Elevation & Shadows](#elevation--shadows)
- [Border Radius](#border-radius)
- [Glassmorphism](#glassmorphism)
- [Tailwind Configuration](#tailwind-configuration)
- [Custom Styling](#custom-styling)
- [Theme Switching](#theme-switching)

---

## 🎨 Design System Overview

ChromeOS-Web uses **Material Design 3 (M3)** as the design language.

### Core Principles

1. **Dynamic Color**: Tonal palettes that adapt to light/dark modes
2. **Emphasis**: Clear visual hierarchy through elevation and color
3. **Motion**: Smooth, natural animations
4. **Roundness**: `rounded-3xl` (24px) for all components
5. **Glassmorphism**: Translucent overlays with blur effects

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `border-radius` | 24px | All components |
| `shadow-m3-1` | Small elevation | Cards, buttons |
| `shadow-m3-5` | Large elevation | Windows, overlays |
| `backdrop-blur-md` | 12px blur | Glass effects |
| `glass-light` | `rgba(255,255,255,0.8)` | Light mode glass |
| `glass-dark` | `rgba(28,27,31,0.8)` | Dark mode glass |

---

## 🌈 M3 Color Palette

### Color Scales

M3 uses **tonal scales** (0-100) where:
- `0` = Pure black
- `50` = Neutral tone
- `100` = Pure white

### Primary Palette (Purple)

```
Primary-0:    #000000  ───┐
Primary-10:   #21005d     │
Primary-20:   #381e72     │
Primary-30:   #4f378b     │
Primary-40:   #6750a4     ├─ Tonal range (use for UI)
Primary-50:   #7d5260     │
Primary-60:   #9c6b5e     │
Primary-70:   #b78b91     │
Primary-80:   #d0bcff     │
Primary-90:   #eaddff     │
Primary-95:   #f5eff7     │
Primary-99:   #fcf8ff     │
Primary-100:  #ffffff  ───┘
```

### Secondary Palette (Gray)

```
Secondary-0:    #000000  ───┐
Secondary-10:   #1d192b     │
Secondary-20:   #322f37     │
Secondary-30:   #49454f     ├─ Neutral tones (surface, text)
Secondary-40:   #625b71     │
Secondary-50:   #7a7289     │
Secondary-60:   #938f99     │
Secondary-70:   #ada9b4     │
Secondary-80:   #c8c4cc     │
Secondary-90:   #e4e1e9     │
Secondary-95:   #f3eff7     │
Secondary-99:   #fbfcff     │
Secondary-100:  #ffffff  ───┘
```

### Surface Palette (Backgrounds)

```
Surface-0:    #000000  ───┐
Surface-10:   #1c1b1f     │
Surface-20:   #313033     │
Surface-30:   #484649     ├─ Backgrounds
Surface-40:   #605d62     │
Surface-50:   #79747e     │
Surface-70:   #ada9b4     │
Surface-80:   #c8c4cc     │
Surface-90:   #e6e1e5     │
Surface-95:   #f4eff4     │
Surface-99:   #fffbff     │
Surface-100:  #ffffff  ───┘
```

### Usage Guidelines

| Color | Purpose | Example |
|-------|---------|---------|
| `primary-40` | Primary buttons, active states | Shelf search icon, Launcher search |
| `secondary-40` | Secondary buttons | Quick Settings buttons |
| `surface-10` | Window backgrounds | Window content |
| `surface-20` | Input backgrounds | Launcher search input |
| `surface-30` | Borders | Window borders, input borders |
| `surface-40` | Hover backgrounds | Button hover, slider track |
| `surface-60` | Disabled text | Placeholder text |
| `surface-80` | Primary text | Window titles, labels |
| `surface-90` | Desktop background | Desktop gradient |

---

## ✍️ Typography

### Font Family

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI',
  'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
  'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
```

### Font Sizes

| Scale | Tailwind Class | Usage |
|-------|---------------|-------|
| `text-xs` | 12px | Captions, metadata |
| `text-sm` | 14px | Secondary text, labels |
| `text-base` | 16px | Body text (default) |
| `text-lg` | 18px | Subtitles |
| `text-xl` | 20px | Large labels |
| `text-2xl` | 24px | Headings |
| `text-4xl` | 36px | Large headings |

### Font Weights

| Weight | Tailwind Class | Usage |
|--------|---------------|-------|
| `font-normal` | 400 | Body text |
| `font-medium` | 500 | Headings, important text |
| `font-semibold` | 600 | Emphasized text |

### Usage Examples

```tsx
// Window title
<span className="text-sm font-medium text-surface-80">
  Chrome Browser
</span>

// Clock
<div className="text-sm font-medium text-surface-90">
  3:45 PM
</div>

// Placeholder
<input
  placeholder="Search apps..."
  className="placeholder:text-surface-60"
/>
```

---

## 🏔️ Elevation & Shadows

### M3 Shadow System

```
Level 1 (shadow-m3-1):
  0 1px 2px rgba(0, 0, 0, 0.3)
  0 1px 3px 1px rgba(0, 0, 0, 0.15)
  └─ Use for: Cards, buttons, small UI

Level 2 (shadow-m3-2):
  0 1px 2px rgba(0, 0, 0, 0.3)
  0 2px 6px 2px rgba(0, 0, 0, 0.15)
  └─ Use for: Elevated cards

Level 3 (shadow-m3-3):
  0 4px 8px 3px rgba(0, 0, 0, 0.15)
  0 1px 3px rgba(0, 0, 0, 0.3)
  └─ Use for: Medium elevation

Level 4 (shadow-m3-4):
  0 6px 10px 4px rgba(0, 0, 0, 0.15)
  0 2px 3px rgba(0, 0, 0, 0.3)
  └─ Use for: Windows, large components

Level 5 (shadow-m3-5):
  0 8px 12px 6px rgba(0, 0, 0, 0.15)
  0 4px 4px rgba(0, 0, 0, 0.3)
  └─ Use for: Focused windows, overlays
```

### Elevation in Components

| Component | Elevation | Shadow |
|-----------|-----------|--------|
| Button | Level 1 | `shadow-m3-1` |
| Card | Level 2 | `shadow-m3-2` |
| Window (normal) | Level 4 | `shadow-m3-4` |
| Window (focused) | Level 5 | `shadow-m3-5` |
| Overlay/Modal | Level 5 | `shadow-m3-5` |
| Launcher | Level 5 | `shadow-m3-5` |

### Visual Hierarchy

```
┌─────────────────────────────────────────┐
│  High Elevation (Level 5)           │
│  - Focused windows                  │
│  - Overlays (Launcher, Quick Settings)│
│  shadow-m3-5                       │
├─────────────────────────────────────────┤
│  Medium Elevation (Level 4)         │
│  - Unfocused windows                │
│  shadow-m3-4                       │
├─────────────────────────────────────────┤
│  Low Elevation (Level 2)           │
│  - Cards, elevated buttons          │
│  shadow-m3-2                       │
├─────────────────────────────────────────┤
│  Base Elevation (Level 0-1)        │
│  - Standard buttons                 │
│  - Shelf, Tray                     │
│  shadow-m3-1                       │
└─────────────────────────────────────────┘
```

---

## 🔳 Border Radius

### M3 Rounded Corners

All ChromeOS-Web components use `rounded-3xl` (24px) by default.

### Radius Scale

| Radius | Tailwind Class | Pixels | Usage |
|--------|---------------|---------|-------|
| `rounded-xl` | 12px | Small components |
| `rounded-2xl` | 16px | Cards, buttons |
| `rounded-3xl` | 24px | **Default** - All components |
| `rounded-4xl` | 32px | Large overlays |
| `rounded-full` | 9999px | Circles, buttons |

### Component Examples

```tsx
// Window container
<div className="rounded-3xl shadow-m3-4">
  Window Content
</div>

// Button
<Button className="rounded-3xl">
  Click Me
</Button>

// Launcher app icon
<div className="rounded-2xl">
  Icon
</div>

// Window control button (circle)
<button className="rounded-full">
  Icon
</button>
```

### Visual Comparison

```
rounded-xl (12px):  ┌────────┐
                    │        │
                    └────────┘

rounded-2xl (16px): ┌──────────┐
                    │          │
                    └──────────┘

rounded-3xl (24px): ┌──────────────┐ ← Default (ChromeOS-Web)
                    │              │
                    └──────────────┘

rounded-4xl (32px): ┌──────────────────┐
                    │                  │
                    └──────────────────┘
```

---

## 🔮 Glassmorphism

### Glass Classes

Defined in `src/app/globals.css`:

```css
@layer components {
  .glass {
    background-color: rgba(255, 255, 255, 0.7);
    backdrop-filter: blur(12px);
  }

  .glass-dark {
    background-color: rgba(28, 27, 31, 0.8);
    backdrop-filter: blur(12px);
  }

  .glass-light {
    background-color: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(12px);
  }
}
```

### Glassmorphism Formula

```
glass effect = {
  background: rgba(r, g, b, opacity)
  backdrop-filter: blur(radius)
  border: 1px solid rgba(255, 255, 255, 0.1)
}
```

### Usage Examples

#### Shelf (Bottom Taskbar)

```tsx
<div className="bg-glass-light/80 backdrop-blur-md">
  Shelf Content
</div>
```

**Result**: Light, semi-transparent background with blur

#### Tray (System Tray)

```tsx
<div className="bg-glass-light/80 backdrop-blur-md">
  Tray Content
</div>
```

**Result**: Same as Shelf (consistent glass)

#### Launcher Overlay

```tsx
<motion.div className="rounded-lg bg-gray-900 shadow-m3-5">
  Launcher Content
</motion.div>
```

**Result**: Compact dark panel (40% width, 66.67% height, left-aligned, no backdrop)

**Launcher Features**:
- Dark background (#111827) for better visibility during testing
- 8px border radius (consistent with windows)
- Left-aligned positioning (above Shelf button)
- Click-outside-to-close functionality
- Z-index: 10000 (always above windows)
- Compact size (40% width x 66.67% height of screen)

#### Quick Settings Panel

```tsx
<motion.div className="rounded-3xl bg-surface-10 shadow-m3-5">
  Quick Settings
</motion.div>
```

**Result**: Solid panel (no glass, but same radius/shadow)

### Backdrop Blur Levels

| Blur | Tailwind Class | Usage |
|------|---------------|-------|
| `blur-sm` | 4px | Subtle blur |
| `blur-md` | 12px | Standard glass (default) |
| `blur-lg` | 16px | Heavy blur |
| `blur-xl` | 24px | Maximum blur |

### Opacity Levels

| Opacity | Tailwind Class | Usage |
|---------|---------------|-------|
| `bg-white/10` | 10% | Very subtle overlay |
| `bg-white/20` | 20% | Backdrop overlay |
| `bg-white/70` | 70% | Light glass |
| `bg-white/80` | 80% | Standard glass |
| `bg-white/95` | 95% | Near-opaque glass |

---

## ⚙️ Tailwind Configuration

### File: `tailwind.config.ts`

### Extended Theme

```typescript
theme: {
  extend: {
    borderRadius: {
      '3xl': '24px',    // M3 standard
      '4xl': '32px',    // Large radius
    },
    colors: {
      primary: { /* 0-100 tonal scale */ },
      secondary: { /* 0-100 tonal scale */ },
      surface: { /* 0-100 tonal scale */ },
      glass: {
        light: 'rgba(255, 255, 255, 0.7)',
        dark: 'rgba(30, 30, 30, 0.7)',
      },
    },
    boxShadow: {
      'm3-1': '0 1px 2px rgba(0, 0, 0, 0.3), 0 1px 3px 1px rgba(0, 0, 0, 0.15)',
      'm3-2': '0 1px 2px rgba(0, 0, 0, 0.3), 0 2px 6px 2px rgba(0, 0, 0, 0.15)',
      'm3-3': '0 4px 8px 3px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.3)',
      'm3-4': '0 6px 10px 4px rgba(0, 0, 0, 0.15), 0 2px 3px rgba(0, 0, 0, 0.3)',
      'm3-5': '0 8px 12px 6px rgba(0, 0, 0, 0.15), 0 4px 4px rgba(0, 0, 0, 0.3)',
    },
    backdropBlur: {
      xs: '2px',  // Small blur
    },
  },
}
```

### Content Paths

```typescript
content: [
  './pages/**/*.{js,ts,jsx,tsx,mdx}',
  './components/**/*.{js,ts,jsx,tsx,mdx}',
  './app/**/*.{js,ts,jsx,tsx,mdx}',
],
```

### Plugins

```typescript
plugins: [],  // No custom plugins yet
```

---

## 🎨 Custom Styling

### Adding New Colors

**Step 1**: Add to `tailwind.config.ts`

```typescript
colors: {
  accent: {
    10: '#1a237e',
    20: '#283593',
    40: '#3949ab',
    80: '#7986cb',
    100: '#ffffff',
  },
}
```

**Step 2**: Use in components

```tsx
<div className="bg-accent-40 text-white">
  Custom Colored Element
</div>
```

### Adding New Shadows

**Step 1**: Add to `tailwind.config.ts`

```typescript
shadowBox: {
  'custom-glow': '0 0 20px rgba(103, 80, 164, 0.5)',
}
```

**Step 2**: Use in components

```tsx
<div className="shadow-custom-glow">
  Glowing Element
</div>
```

### Adding New Border Radius

**Step 1**: Add to `tailwind.config.ts`

```typescript
borderRadius: {
  '5xl': '40px',  // Custom radius
}
```

**Step 2**: Use in components

```tsx
<div className="rounded-5xl">
  Extra Rounded
</div>
```

### Creating Custom Classes

**Option 1**: Add to `src/app/globals.css`

```css
@layer components {
  .custom-card {
    @apply rounded-3xl bg-surface-10 shadow-m3-3;
    transition: all 0.2s ease;
  }

  .custom-card:hover {
    @apply shadow-m3-4 -translate-y-1;
  }
}
```

**Option 2**: Use directly in components

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "rounded-3xl bg-surface-10 shadow-m3-3",
  "transition-all duration-200 ease",
  "hover:shadow-m3-4 hover:-translate-y-1"
)}>
  Custom Card
</div>
```

---

## 🌓 Theme Switching

### Current Theme System

**Note**: Full dark mode is **not yet implemented**. System defaults to light theme.

### Current Structure

```typescript
// lib/constants.ts
export interface SystemSettings {
  theme: 'light' | 'dark' | 'auto'  // Defined but not used
  wallpaper: string
  showShelf: boolean
}
```

### Future Implementation Plan

**Step 1**: Create dark color palette

```typescript
// tailwind.config.ts
colors: {
  primary: {
    // Light mode (current)
    light: { /* current palette */ },
    // Dark mode (to be added)
    dark: { /* inverted palette */ },
  },
}
```

**Step 2**: Add theme provider

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light')

  return (
    <html lang="en" className={theme}>
      <body>{children}</body>
    </html>
  )
}
```

**Step 3**: Add theme toggle

```tsx
<Button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
  Toggle Theme
</Button>
```

### Manual Dark Mode (Current)

To manually add dark mode:

```css
/* app/globals.css */
.dark {
  /* Override colors */
  --background: 20 14% 4%;
  --foreground: 0 0% 98%;
}

.dark body {
  background-color: rgb(28, 27, 31);
  color: rgb(255, 255, 255);
}
```

```tsx
// Usage
<html lang="en" className="dark">
```

---

## 📏 Spacing & Layout

### Spacing Scale

| Tailwind | CSS | Usage |
|----------|-----|-------|
| `p-4` | 16px | Standard padding |
| `p-6` | 24px | Large padding |
| `gap-2` | 8px | Small gaps |
| `gap-3` | 12px | Medium gaps |
| `gap-4` | 16px | Large gaps |

### Component Spacing

```tsx
// Window header
<div className="h-12 px-4">  // 48px height, 16px padding
  Window Title
</div>

// Shelf items
<div className="flex gap-2 px-6">  // 8px gap, 24px padding
  Shelf Items
</div>

// Launcher
<div className="p-6">  // 24px padding
  Launcher Content
</div>
```

---

## 🎭 Animations

### Framer Motion Transitions

#### Window Open/Close

```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.15 }}
>
  Window Content
</motion.div>
```

#### Launcher Slide Up

```tsx
<motion.div
  initial={{ opacity: 0, y: 20, scale: 0.95 }}
  animate={{ opacity: 1, y: 0, scale: 1 }}
  exit={{ opacity: 0, y: 20, scale: 0.95 }}
  transition={{ duration: 0.2 }}
>
  Launcher Panel
</motion.div>
```

#### Backdrop Fade

```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
>
  Backdrop
</motion.div>
```

### CSS Transitions

```css
/* Global smooth transitions */
* {
  transition: background-color 0.2s ease,
              border-color 0.2s ease,
              color 0.2s ease;
}
```

---

## 🔗 Related Files

- **[COMPONENTS.md](./COMPONENTS.md)** - Component styling examples
- **[CUSTOMIZATION.md](./CUSTOMIZATION.md)** - How to add custom styles
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - System architecture

---

## 📚 Design References

- **[Material Design 3](https://m3.material.io/)** - Official M3 guidelines
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[Framer Motion](https://www.framer.com/motion/)** - Animation library

---

*Last updated: 2026-01-12*
