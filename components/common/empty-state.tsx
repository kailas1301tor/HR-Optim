// components/common/empty-state.tsx
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { uiEmptyStateIconRing, uiEmptyStateShell } from '@/lib/ui/design-system'

interface CommonEmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function CommonEmptyState({ icon: Icon, title, description, actions, className }: CommonEmptyStateProps) {
  return (
    <div className={cn(uiEmptyStateShell, className)}>
      <div className={uiEmptyStateIconRing}>
        <Icon className="w-8 h-8 text-violet-glow/70" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-cloud mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-muted-foreground max-w-[320px] mb-6 leading-relaxed">{description}</p>
      )}
      {actions && <div className="flex flex-wrap items-center justify-center gap-2">{actions}</div>}
    </div>
  )
}
