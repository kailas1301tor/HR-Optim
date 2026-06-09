// components/common/status-badge.tsx
import { cn } from '@/lib/utils'
import { statusBadgeClasses, type StatusBadgeVariant } from '@/lib/ui/design-system'

interface CommonStatusBadgeProps {
  label: string
  variant: StatusBadgeVariant
  className?: string
}

export function CommonStatusBadge({ label, variant, className }: CommonStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide',
        statusBadgeClasses[variant],
        className
      )}
    >
      {label}
    </span>
  )
}
