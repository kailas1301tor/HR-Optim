// components/profile/profile-hero.tsx
'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CommonStatusBadge } from '@/components/common'
import { formatDisplayNameFromUsername, initialsFromName } from '@/lib/cookies'
import { formatPersonName } from '@/lib/helpers/format-display-text'
import { uiSquircleLg } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { CurrentUserProfile } from '@/types/auth'
import type { Employee } from '@/types/employee'
import { Briefcase, Building2, Calendar } from 'lucide-react'

interface ProfileHeroProps {
  profile: CurrentUserProfile
  employee: Employee | null
}

export function ProfileHero({ profile, employee }: ProfileHeroProps): React.JSX.Element {
  const displayName =
    employee?.full_name ||
    formatPersonName(formatDisplayNameFromUsername(profile.username)) ||
    'User'
  const initials = initialsFromName(displayName)
  const jobTitle = employee?.designation || 'System User'
  const departmentName = employee?.department || 'Operations'
  const joinedYear = employee?.joined_date ? new Date(employee.joined_date).getFullYear() : null

  return (
    <div className="flex w-full flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-border/40 pb-6">
      {/* Avatar */}
      <Avatar className={cn(
        "h-20 w-20 sm:h-24 sm:w-24 shrink-0 shadow-lg ring-2 ring-border/20 relative z-10",
        uiSquircleLg
      )}>
        <AvatarFallback
          className={cn(
            'border border-border/50 bg-violet-core text-xl font-bold text-white sm:text-3xl shadow-inner',
            uiSquircleLg
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Profile identity info details */}
      <div className="flex-1 space-y-2 py-1 text-left">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">
            {displayName}
          </h2>
          <div className="flex gap-1.5">
            <CommonStatusBadge label="Active" variant="active" />
            {joinedYear && (
              <span className="inline-flex items-center gap-1 rounded-full border border-border/50 bg-muted/20 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Calendar className="h-3 w-3" /> Since {joinedYear}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-slate-200">
            <Briefcase className="h-4 w-4 shrink-0 text-violet-glow" />
            <span>{jobTitle}</span>
          </div>
          <span className="hidden h-1.5 w-1.5 rounded-full bg-border sm:inline-block" />
          <div className="flex items-center gap-1.5">
            <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
            <span>{departmentName}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

