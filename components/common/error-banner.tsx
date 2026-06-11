// components/common/error-banner.tsx
import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiErrorBanner, uiOutlineBtn } from '@/lib/ui/design-system'

interface CommonErrorBannerProps {
  message: string
  className?: string
  onRetry?: () => void
  retryLabel?: string
}

export function CommonErrorBanner({
  message,
  className,
  onRetry,
  retryLabel = 'Retry',
}: CommonErrorBannerProps) {
  return (
    <div
      className={cn(uiErrorBanner, 'flex items-center justify-between gap-3', className)}
      role="alert"
    >
      <div className="flex items-center gap-2 min-w-0">
        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
        <span className="text-sm">{message}</span>
      </div>
      {onRetry && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onRetry}
          className={cn(uiOutlineBtn, 'shrink-0 h-8 text-xs')}
        >
          {retryLabel}
        </Button>
      )}
    </div>
  )
}
