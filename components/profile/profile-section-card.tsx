// components/profile/profile-section-card.tsx
'use client'

import type { ReactNode } from 'react'
import { uiSectionHeader } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

interface ProfileSectionCardProps {
  title: string
  children: ReactNode
  className?: string
}

export function ProfileSectionCard({
  title,
  children,
  className,
}: ProfileSectionCardProps): React.JSX.Element {
  return (
    <section className={cn('space-y-4', className)}>
      <div className={uiSectionHeader}>
        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  )
}
