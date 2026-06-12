'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiSquircleSm } from '@/lib/ui/design-system'

const actionBtnClass =
  'min-h-11 text-xs font-semibold tracking-tight shadow-sm transition-all active:scale-[0.98]'

interface RequestActionButtonsProps {
  onApprove: () => void
  onReject: () => void
  className?: string
  compact?: boolean
}

export function RequestActionButtons({
  onApprove,
  onReject,
  className,
  compact = false,
}: RequestActionButtonsProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-2 gap-1.5',
        compact ? 'w-full sm:w-[140px] sm:shrink-0' : 'w-full',
        className,
      )}
    >
      <Button
        type="button"
        variant="ghost"
        onClick={onReject}
        aria-label="Reject request"
        className={cn(
          actionBtnClass,
          compact ? 'px-2' : 'w-full',
          uiSquircleSm,
          'border border-border/60 bg-white text-foreground',
          'shadow-[0_2px_10px_rgba(15,23,42,0.06)]',
          'hover:bg-muted/40 hover:text-foreground',
          'dark:bg-card dark:hover:bg-muted/30',
        )}
      >
        Reject
      </Button>
      <Button
        type="button"
        variant="ghost"
        onClick={onApprove}
        aria-label="Approve request"
        className={cn(
          actionBtnClass,
          compact ? 'px-2' : 'w-full',
          uiSquircleSm,
          'bg-[#34C759] text-white hover:bg-[#2DB84E] hover:text-white',
          'shadow-[0_4px_16px_rgba(52,199,89,0.22)]',
        )}
      >
        Approve
      </Button>
    </div>
  )
}
