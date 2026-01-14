import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function constrainWindow(
  x: number,
  y: number,
  width: number,
  height: number,
  containerWidth: number,
  containerHeight: number
): { x: number; y: number } {
  return {
    x: clamp(x, 0, containerWidth - width),
    y: clamp(y, 0, containerHeight - height),
  }
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function formatDay(date: Date): string {
  return date.getDate().toString()
}

export function isMobile(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth < 768
}

export function isTablet(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 768 && window.innerWidth < 1024
}

export function isDesktop(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth >= 1024
}
