// components/common/error-banner.tsx
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiErrorBanner } from '@/lib/ui/design-system'

interface CommonErrorBannerProps {
  message: string
  className?: string
}

export function CommonErrorBanner({ message, className }: CommonErrorBannerProps) {
  return (
    <div className={cn(uiErrorBanner, 'flex items-center gap-2', className)} role="alert">
      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
      <span>{message}</span>
    </div>
  )
}
