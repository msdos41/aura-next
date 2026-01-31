'use client'

import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
}

export function LoadingSpinner({ className }: LoadingSpinnerProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-surface-90 z-100">
      <Loader2 
        className={cn('size-20 animate-spin text-surface-40', className)} 
        strokeWidth={3}
        role="status"
        aria-label="Loading"
      />
    </div>
  )
}
