// components/common/error-state.tsx
'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiErrorStateShell, uiOutlineBtn } from '@/lib/ui/design-system'

interface CommonErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
}

export function CommonErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try again',
  className,
}: CommonErrorStateProps) {
  return (
    <div className={cn(uiErrorStateShell, className)}>
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
        <AlertCircle className="w-7 h-7 text-red-400" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-cloud mb-1">{title}</h3>
      <p className="text-xs text-red-300/90 max-w-sm mb-5 leading-relaxed">{message}</p>
      {onRetry && (
        <Button type="button" variant="outline" onClick={onRetry} className={cn(uiOutlineBtn, 'gap-2 text-xs')}>
          <RefreshCw className="w-3.5 h-3.5" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
