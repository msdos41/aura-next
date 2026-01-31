export const WINDOW_MIN_WIDTH = 400
export const WINDOW_MIN_HEIGHT = 300
export const WINDOW_DEFAULT_WIDTH = 800
export const WINDOW_DEFAULT_HEIGHT = 600
export const WINDOW_Z_INDEX_BASE = 1000
export const MAX_Z_INDEX = 9999

export const SHELF_HEIGHT = 64
export const SHELF_WIDTH = 64
export const LAUNCHER_MAX_HEIGHT = 600
export const TRAY_HEIGHT = 32

export const WALLPAPER_WINDOW_WIDTH = 800
export const WALLPAPER_WINDOW_HEIGHT = 700

export type ShelfPosition = 'bottom' | 'left' | 'right'

export const M3_COLORS = {
  primary: {
    0: '#000000',
    10: '#21005d',
    20: '#381e72',
    30: '#4f378b',
    40: '#6750a4',
    50: '#7d5260',
    60: '#9c6b5e',
    70: '#b78b91',
    80: '#d0bcff',
    90: '#eaddff',
    95: '#f5eff7',
    99: '#fcf8ff',
    100: '#ffffff',
  },
  secondary: {
    0: '#000000',
    10: '#1d192b',
    20: '#322f37',
    30: '#49454f',
    40: '#625b71',
    50: '#7a7289',
    60: '#938f99',
    70: '#ada9b4',
    80: '#c8c4cc',
    90: '#e4e1e9',
    95: '#f3eff7',
    99: '#fbfcff',
    100: '#ffffff',
  },
  surface: {
    0: '#000000',
    10: '#1c1b1f',
    20: '#313033',
    30: '#484649',
    40: '#605d62',
    50: '#79747e',
    70: '#ada9b4',
    80: '#c8c4cc',
    90: '#e6e1e5',
    95: '#f4eff4',
    99: '#fffbff',
    100: '#ffffff',
  },
}

export type M3Color = keyof typeof M3_COLORS

export interface WindowState {
  id: string
  appId: string
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isMinimized: boolean
  isMaximized: boolean
  isFocused: boolean
}

export interface Workspace {
  id: string
  name: string
  windows: string[]
}

export interface SystemSettings {
  theme: 'light' | 'dark' | 'auto'
  wallpaper: string
  wallpaperType: 'gradient' | 'solid' | 'custom'
  showShelf: boolean
  shelfPosition: ShelfPosition
}

export interface App {
  id: string
  name: string
  icon: string
  backgroundColor?: string
}

export const DEFAULT_APPS: App[] = [
  { id: 'chrome', name: 'Chrome', icon: '🌐', backgroundColor: '#4285f4' },
  { id: 'files', name: 'Files', icon: '📁', backgroundColor: '#1a73e8' },
  { id: 'calculator', name: 'Calculator', icon: '🧮', backgroundColor: '#34a853' },
  { id: 'settings', name: 'Settings', icon: '⚙️', backgroundColor: '#5f6368' },
  { id: 'terminal', name: 'Terminal', icon: '💻', backgroundColor: '#202124' },
]

export const DB_NAME = 'chromeos-web'
export const DB_VERSION = 1
