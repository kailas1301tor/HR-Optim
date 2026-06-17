// components/profile/profile-hero.tsx
'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CommonStatusBadge } from '@/components/common'
import { initialsFromName } from '@/lib/cookies'
import { uiSquircleMd } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { CurrentUserProfile } from '@/types/auth'
import type { Employee } from '@/types/employee'

interface ProfileHeroProps {
  profile: CurrentUserProfile
  employee: Employee | null
}

export function ProfileHero({ profile, employee }: ProfileHeroProps): React.JSX.Element {
  const displayName = employee?.full_name || profile.username || 'User'
  const initials = initialsFromName(displayName)
  const jobTitle = employee?.designation || 'System User'
  const departmentName = employee?.department || 'Operations'

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border/30">
      {/* Avatar */}
      <Avatar className="w-28 h-28 ring-4 ring-border/20 shadow-2xl shrink-0">
        <AvatarFallback
          className={cn(
            'bg-gradient-to-br from-violet-core to-violet-glow text-white text-3xl font-bold',
            uiSquircleMd
          )}
        >
          {initials}
        </AvatarFallback>
      </Avatar>

      {/* Identity */}
      <div className="space-y-2 text-center sm:text-left min-w-0 flex-1 mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5">
          <h2 className="text-2xl font-extrabold text-cloud tracking-tight truncate">
            {displayName}
          </h2>
          <div className="inline-flex justify-center">
            <CommonStatusBadge label="Active" variant="active" />
          </div>
        </div>
        <p className="text-base font-semibold text-violet-glow">{jobTitle}</p>
        <p className="text-sm text-muted-foreground">{departmentName}</p>
      </div>
    </div>
  )
}
