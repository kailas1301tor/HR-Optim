// components/profile/profile-detail-field.tsx
'use client'

import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ProfileDetailFieldProps {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}

export function ProfileDetailField({
  icon: Icon,
  label,
  value,
  className,
}: ProfileDetailFieldProps): React.JSX.Element {
  return (
    <div
      className={cn(
        'group flex items-start gap-4 rounded-xl border border-transparent p-3.5 transition-all duration-200 hover:border-border/30 hover:bg-muted/10',
        className
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-muted-foreground transition-colors group-hover:border-violet-core/30 group-hover:bg-violet-core/10 group-hover:text-violet-glow">
        <Icon className="h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-110" aria-hidden />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/85 transition-colors group-hover:text-violet-glow/80">
          {label}
        </p>
        <p
          className="truncate text-sm font-semibold tracking-wide text-foreground sm:whitespace-normal sm:text-base"
          title={value}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

