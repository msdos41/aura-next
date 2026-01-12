import { cn } from '@/lib/utils'

interface WindowControlProps {
  type: 'minimize' | 'maximize' | 'close'
  onClick: () => void
  className?: string
}

export function WindowControl({ type, onClick, className }: WindowControlProps) {
  const icons = {
    minimize: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="0" y="9" width="10" height="1" fill="currentColor" />
      </svg>
    ),
    maximize: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <rect x="0.5" y="0.5" width="9" height="9" stroke="currentColor" strokeWidth="1" />
      </svg>
    ),
    close: (
      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
        <path d="M1 1L9 9M9 1L1 9" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  }

  const colors = {
    minimize: 'text-white hover:bg-gray-600',
    maximize: 'text-white hover:bg-gray-600',
    close: 'text-white hover:bg-red-600',
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
        colors[type],
        className
      )}
      aria-label={type}
    >
      {icons[type]}
    </button>
  )
}
