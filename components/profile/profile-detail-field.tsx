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

export function ProfileDetailField({ icon: Icon, label, value, className }: ProfileDetailFieldProps) {
  return (
    <div className={cn('flex items-start gap-3 py-2 px-1', className)}>
      <div className="w-5 h-5 flex items-center justify-center shrink-0 text-violet-glow mt-0.5">
        <Icon className="w-4 h-4" aria-hidden />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
          {label}
        </p>
        <p className="text-sm font-semibold text-cloud mt-0.5 break-all leading-normal">{value}</p>
      </div>
    </div>
  )
}

