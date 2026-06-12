// components/profile/profile-quick-actions.tsx
'use client'

import Link from 'next/link'
import { ChevronRight, Lock, Settings } from 'lucide-react'
import { uiSectionHeader, uiSquircleMd } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

export function ProfileQuickActions() {
  return (
    <div className="space-y-4">
      <div className={uiSectionHeader}>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
          <p className="text-xs text-muted-foreground mt-1">Manage your account preferences</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/settings?tab=security"
          className={cn(
            'group flex items-center gap-3.5 p-4 transition-colors hover:bg-muted/40',
            uiSquircleMd,
            'border border-border/60 bg-card',
          )}
        >
          <div
            className={cn(
              'w-10 h-10 flex items-center justify-center shrink-0 text-violet-glow',
              uiSquircleMd,
              'bg-violet-core/10 border border-violet-core/20',
            )}
          >
            <Lock className="w-4.5 h-4.5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Change Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">Update your sign-in credentials</p>
          </div>
          <ChevronRight
            className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>

        <Link
          href="/settings?tab=system"
          className={cn(
            'group flex items-center gap-3.5 p-4 transition-colors hover:bg-muted/40',
            uiSquircleMd,
            'border border-border/60 bg-card',
          )}
        >
          <div
            className={cn(
              'w-10 h-10 flex items-center justify-center shrink-0 text-violet-glow',
              uiSquircleMd,
              'bg-violet-core/10 border border-violet-core/20',
            )}
          >
            <Settings className="w-4.5 h-4.5" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="text-xs text-muted-foreground mt-0.5">Configure email and alert preferences</p>
          </div>
          <ChevronRight
            className="w-4 h-4 text-muted-foreground shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  )
}
