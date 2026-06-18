// components/common/module-restricted-state.tsx
'use client'

import { ShieldOff } from 'lucide-react'
import { cn } from '@/lib/utils'
import { uiErrorStateShell } from '@/lib/ui/design-system'
import { MODULE_LABELS, type ModuleKey } from '@/lib/permissions/module-permissions'

interface ModuleRestrictedStateProps {
  moduleKey?: ModuleKey
  moduleName?: string
  className?: string
}

export function ModuleRestrictedState({
  moduleKey,
  moduleName,
  className,
}: ModuleRestrictedStateProps) {
  const label =
    moduleName ?? (moduleKey ? MODULE_LABELS[moduleKey] : 'this module')

  return (
    <div className={cn(uiErrorStateShell, className)}>
      <div className="w-14 h-14 rounded-[32px] [corner-shape:squircle] bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
        <ShieldOff className="w-7 h-7 text-amber-400" aria-hidden />
      </div>
      <h3 className="text-base font-semibold text-cloud mb-1">You are restricted</h3>
      <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
        You do not have permission to access {label}. Contact your administrator if you
        need access.
      </p>
    </div>
  )
}
