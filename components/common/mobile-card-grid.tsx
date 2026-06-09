// components/common/mobile-card-grid.tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CommonMobileCardGridProps {
  children: ReactNode
  className?: string
}

export function CommonMobileCardGrid({ children, className }: CommonMobileCardGridProps) {
  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden', className)}>
      {children}
    </div>
  )
}
