// components/common/page-header.tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { uiPageHeaderBorder } from '@/lib/ui/design-system'

interface CommonPageHeaderProps {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
  className?: string
}

export function CommonPageHeader({ title, subtitle, action, className }: CommonPageHeaderProps) {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4', uiPageHeaderBorder, className)}>
      <div>
        <h1 className="text-2xl font-semibold text-cloud mb-1 tracking-tight">{title}</h1>
        {subtitle && <div className="text-sm text-muted-foreground">{subtitle}</div>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
