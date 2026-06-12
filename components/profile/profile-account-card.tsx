// components/profile/profile-account-card.tsx
'use client'

import { Hash, Mail, User } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { CommonCard, CommonStatusBadge } from '@/components/common'
import { formatDisplayNameFromUsername, initialsFromName } from '@/lib/cookies'
import { uiSectionHeader, uiSquircleMd } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { CurrentUserProfile } from '@/types/auth'
import { ProfileDetailField } from './profile-detail-field'

interface ProfileAccountCardProps {
  profile: CurrentUserProfile
}

function formatProfileDisplayName(username: string, email: string): string {
  const fromUsername = formatDisplayNameFromUsername(username)
  if (fromUsername && fromUsername !== 'User') {
    if (fromUsername === fromUsername.toUpperCase() && fromUsername.length > 1) {
      return fromUsername.charAt(0) + fromUsername.slice(1).toLowerCase()
    }
    return fromUsername
  }
  return email || 'User'
}

export function ProfileAccountCard({ profile }: ProfileAccountCardProps) {
  const displayName = formatProfileDisplayName(profile.username, profile.email)
  const initials = initialsFromName(displayName)

  return (
    <div className="space-y-4">
      <div className={uiSectionHeader}>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Account</h2>
          <p className="text-xs text-muted-foreground mt-1">Your sign-in identity</p>
        </div>
      </div>

      <CommonCard className="overflow-hidden p-0">
        <div
          className={cn(
            'p-6 sm:p-8',
            'bg-gradient-to-br from-violet-core/12 via-card to-card',
          )}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 ring-4 ring-violet-core/15 shrink-0">
              <AvatarFallback
                className={cn(
                  'bg-gradient-to-br from-violet-core to-violet-glow text-white text-2xl font-semibold',
                  uiSquircleMd,
                )}
              >
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-2xl font-bold text-foreground tracking-tight truncate">
                  {displayName}
                </h3>
                <CommonStatusBadge label="Active" variant="active" />
              </div>
              {profile.email ? (
                <p className="text-sm text-muted-foreground truncate">{profile.email}</p>
              ) : null}
              <p className="text-xs font-mono text-muted-foreground/80">ID #{profile.id}</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 pt-0 sm:pt-0 border-t border-border/40">
          <div className="grid gap-3 sm:grid-cols-2">
            <ProfileDetailField icon={User} label="Username" value={profile.username} />
            <ProfileDetailField icon={Mail} label="Email" value={profile.email || '—'} />
            <ProfileDetailField
              icon={Hash}
              label="User ID"
              value={String(profile.id)}
              className="sm:col-span-2"
            />
          </div>
        </div>
      </CommonCard>
    </div>
  )
}
