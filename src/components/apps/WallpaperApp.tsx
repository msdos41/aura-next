'use client'

import { useRef } from 'react'
import { Check, Upload } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  GRADIENT_WALLPAPERS,
  SOLID_WALLPAPERS,
  type WallpaperPreset,
} from '@/lib/wallpapers'
import { useWindowStore } from '@/store/useWindowStore'

export function WallpaperApp() {
  const { settings, updateWallpaper } = useWindowStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // 选择预设壁纸（不关闭窗口）
  const handleSelectPreset = (wallpaper: WallpaperPreset) => {
    updateWallpaper(wallpaper.value, wallpaper.type)
  }

  // 上传自定义图片（不关闭窗口）
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请选择图片文件')
      return
    }

    // 验证文件大小（2MB 限制）
    const MAX_SIZE = 2 * 1024 * 1024
    if (file.size > MAX_SIZE) {
      alert('图片大小不能超过 2MB')
      return
    }

    // 读取文件
    const reader = new FileReader()
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string
      updateWallpaper(dataUrl, 'custom')
    }
    reader.onerror = () => {
      alert('图片上传失败')
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex h-full flex-col">
      {/* 内容区域 */}
      <div className="p-6 overflow-y-auto flex-1">
        <div className="space-y-6">
          {/* 渐变壁纸 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-surface-80 dark:text-surface-90">
              渐变壁纸
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {GRADIENT_WALLPAPERS.map((wallpaper) => (
                <WallpaperCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  isSelected={
                    settings.wallpaperType === 'gradient' &&
                    settings.wallpaper === wallpaper.value
                  }
                  onSelect={() => handleSelectPreset(wallpaper)}
                />
              ))}
            </div>
          </div>

          {/* 纯色壁纸 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-surface-80 dark:text-surface-90">
              纯色壁纸
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {SOLID_WALLPAPERS.map((wallpaper) => (
                <WallpaperCard
                  key={wallpaper.id}
                  wallpaper={wallpaper}
                  isSelected={
                    settings.wallpaperType === 'solid' &&
                    settings.wallpaper === wallpaper.value
                  }
                  onSelect={() => handleSelectPreset(wallpaper)}
                />
              ))}
            </div>
          </div>

          {/* 自定义壁纸 */}
          <div>
            <h3 className="mb-3 text-sm font-medium text-surface-80 dark:text-surface-90">
              自定义壁纸
            </h3>
            <div
              className={cn(
                'flex h-32 items-center justify-center rounded-2xl border-2 border-dashed transition-all',
                'border-surface-40 hover:border-surface-60',
                'dark:border-surface-40 dark:hover:border-surface-60',
              )}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-40/20">
                  <Upload className="h-6 w-6 text-primary-40" />
                </div>
                <p className="text-sm text-surface-80 dark:text-surface-90">
                  点击上传图片
                </p>
                <p className="text-xs text-surface-60">
                  支持 JPG, PNG, WebP（最大 2MB）
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// 壁纸卡片组件
function WallpaperCard({
  wallpaper,
  isSelected,
  onSelect,
}: {
  wallpaper: WallpaperPreset
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      className={cn(
        'relative h-32 w-full cursor-pointer rounded-2xl border-2 transition-all',
        'border-transparent hover:scale-105 hover:shadow-m3-3',
        isSelected && 'border-primary-40 shadow-m3-4',
      )}
      style={{ background: wallpaper.preview }}
      onClick={onSelect}
    >
      {/* 壁纸名称 */}
      <div className="absolute bottom-2 left-2 rounded-lg bg-black/50 px-2 py-1">
        <p className="text-xs text-white">{wallpaper.name}</p>
      </div>

      {/* 选中标记 */}
      {isSelected && (
        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary-40 text-white">
          <Check className="h-4 w-4" />
        </div>
      )}
    </button>
  )
}
