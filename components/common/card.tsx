// components/common/card.tsx
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { uiCard, uiCardInteractive } from '@/lib/ui/design-system'

interface CommonCardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
  accentBorder?: string
}

export function CommonCard({ children, className, interactive = false, accentBorder }: CommonCardProps) {
  return (
    <div className={cn(interactive ? uiCardInteractive : uiCard, accentBorder, className)}>
      {children}
    </div>
  )
}
