// components/profile/profile-quick-actions.tsx
'use client'

import Link from 'next/link'
import { ChevronRight, Lock, Settings } from 'lucide-react'

export function ProfileQuickActions(): React.JSX.Element {
  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-border/30">
        <h3 className="text-xs font-bold uppercase tracking-wider text-violet-glow">
          Quick Actions
        </h3>
      </div>

      <div className="divide-y divide-border/20">
        <Link
          href="/settings?tab=security"
          className="group flex items-center justify-between py-3.5 hover:bg-muted/10 px-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-violet-glow bg-violet-core/10 border border-violet-core/20 rounded-lg">
              <Lock className="w-4 h-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-cloud group-hover:text-violet-glow transition-colors">
                Change Password
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Update your sign-in credentials
              </p>
            </div>
          </div>
          <ChevronRight
            className="w-4 h-4 text-slate-500 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>

        <Link
          href="/settings?tab=system"
          className="group flex items-center justify-between py-3.5 hover:bg-muted/10 px-2 rounded-lg transition-colors"
        >
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-8 h-8 flex items-center justify-center shrink-0 text-violet-glow bg-violet-core/10 border border-violet-core/20 rounded-lg">
              <Settings className="w-4 h-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-cloud group-hover:text-violet-glow transition-colors">
                Notifications
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                Configure email and alert preferences
              </p>
            </div>
          </div>
          <ChevronRight
            className="w-4 h-4 text-slate-500 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
      </div>
    </div>
  )
}


