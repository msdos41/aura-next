export type WallpaperType = 'gradient' | 'solid' | 'custom'

export interface WallpaperPreset {
  id: string
  name: string
  type: 'gradient' | 'solid'
  value: string // Tailwind 类名或颜色值
  preview: string // 预览颜色/渐变
}

// 预设渐变壁纸
export const GRADIENT_WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'gradient-1',
    name: 'Default',
    type: 'gradient',
    value: 'from-surface-90 to-surface-80',
    preview: 'linear-gradient(135deg, #e6e1e5 0%, #c8c4cc 100%)',
  },
  {
    id: 'gradient-2',
    name: 'Ocean',
    type: 'gradient',
    value: 'from-blue-400 to-purple-500',
    preview: 'linear-gradient(135deg, #60a5fa 0%, #a855f7 100%)',
  },
  {
    id: 'gradient-3',
    name: 'Sunset',
    type: 'gradient',
    value: 'from-orange-400 to-pink-500',
    preview: 'linear-gradient(135deg, #fb923c 0%, #ec4899 100%)',
  },
  {
    id: 'gradient-4',
    name: 'Forest',
    type: 'gradient',
    value: 'from-green-400 to-emerald-500',
    preview: 'linear-gradient(135deg, #4ade80 0%, #10b981 100%)',
  },
  {
    id: 'gradient-5',
    name: 'Midnight',
    type: 'gradient',
    value: 'from-indigo-900 to-purple-900',
    preview: 'linear-gradient(135deg, #312e81 0%, #581c87 100%)',
  },
  {
    id: 'gradient-6',
    name: 'Aurora',
    type: 'gradient',
    value: 'from-cyan-500 via-purple-500 to-pink-500',
    preview: 'linear-gradient(135deg, #06b6d4 0%, #a855f7 50%, #ec4899 100%)',
  },
]

// 预设纯色壁纸
export const SOLID_WALLPAPERS: WallpaperPreset[] = [
  {
    id: 'solid-1',
    name: 'White',
    type: 'solid',
    value: 'white',
    preview: '#ffffff',
  },
  {
    id: 'solid-2',
    name: 'Light Gray',
    type: 'solid',
    value: 'surface-95',
    preview: '#f4eff4',
  },
  {
    id: 'solid-3',
    name: 'Soft Blue',
    type: 'solid',
    value: 'blue-100',
    preview: '#dbeafe',
  },
  {
    id: 'solid-4',
    name: 'Soft Purple',
    type: 'solid',
    value: 'purple-100',
    preview: '#f3e8ff',
  },
  {
    id: 'solid-5',
    name: 'Dark Gray',
    type: 'solid',
    value: 'surface-30',
    preview: '#484649',
  },
  {
    id: 'solid-6',
    name: 'Dark Blue',
    type: 'solid',
    value: 'blue-900',
    preview: '#1e3a8a',
  },
]

// 所有预设壁纸
export const ALL_PRESETS: WallpaperPreset[] = [
  ...GRADIENT_WALLPAPERS,
  ...SOLID_WALLPAPERS,
]
