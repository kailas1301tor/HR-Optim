// components/profile/profile-detail-field.tsx
'use client'

import type { LucideIcon } from 'lucide-react'
import { uiSquircleMd } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

interface ProfileDetailFieldProps {
  icon: LucideIcon
  label: string
  value: string
  className?: string
}

export function ProfileDetailField({ icon: Icon, label, value, className }: ProfileDetailFieldProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3.5 p-4 bg-muted/30 border border-border/50',
        uiSquircleMd,
        className,
      )}
    >
      <div
        className={cn(
          'w-10 h-10 flex items-center justify-center shrink-0 text-violet-glow',
          uiSquircleMd,
          'bg-violet-core/10 border border-violet-core/20',
        )}
      >
        <Icon className="w-4.5 h-4.5" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <p className="text-sm font-semibold text-foreground mt-1 break-all">{value}</p>
      </div>
    </div>
  )
}
