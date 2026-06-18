// components/profile/profile-quick-actions.tsx
'use client'

import Link from 'next/link'
import { ChevronRight, Lock, BellRing } from 'lucide-react'

export function ProfileQuickActions(): React.JSX.Element {
  return (
    <section className="space-y-4">
      <div className="border-b border-border/40 pb-2">
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Quick Actions
        </h3>
      </div>

      <div className="space-y-2">
        <Link
          href="/settings?tab=security"
          className="group flex min-h-12 items-center justify-between rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-border/30 hover:bg-muted/10"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-muted-foreground transition-all duration-200 group-hover:border-violet-core/30 group-hover:bg-violet-core/10 group-hover:text-violet-glow">
              <Lock className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 transition-colors group-hover:text-foreground">
                Change Password
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Update your sign-in credentials
              </p>
            </div>
          </div>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-violet-glow"
            aria-hidden
          />
        </Link>

        <Link
          href="/settings?tab=system"
          className="group flex min-h-12 items-center justify-between rounded-xl border border-transparent p-2.5 transition-all duration-200 hover:border-border/30 hover:bg-muted/10"
        >
          <div className="flex min-w-0 items-center gap-3.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border/50 bg-muted/20 text-muted-foreground transition-all duration-200 group-hover:border-violet-core/30 group-hover:bg-violet-core/10 group-hover:text-violet-glow">
              <BellRing className="h-4.5 w-4.5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-200 transition-colors group-hover:text-foreground">
                Notifications
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                Configure email and alert preferences
              </p>
            </div>
          </div>
          <ChevronRight
            className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-violet-glow"
            aria-hidden
          />
        </Link>
      </div>
    </section>
  )
}

