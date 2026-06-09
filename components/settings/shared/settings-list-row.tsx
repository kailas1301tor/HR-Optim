// components/settings/shared/settings-list-row.tsx
'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SettingsListRowProps {
  label: ReactNode
  actions: ReactNode
  isSelected?: boolean
  onClick?: () => void
  className?: string
}

export function SettingsListRow({
  label,
  actions,
  isSelected = false,
  onClick,
  className,
}: SettingsListRowProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick()
              }
            }
          : undefined
      }
      className={cn(
        'flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 transition-all group',
        isSelected ? 'border-violet-core/40 bg-violet-core/5' : 'hover:border-violet-core/40',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="min-w-0 flex-1">{label}</div>
      <div
        className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        {actions}
      </div>
    </div>
  )
}
