// components/profile/profile-page.tsx
'use client'

import { CommonErrorState } from '@/components/common'
import { ProfileAccountCard } from './profile-account-card'
import { ProfilePageHeader } from './profile-page-header'
import { ProfilePageSkeleton } from './profile-page-skeleton'
import { ProfileQuickActions } from './profile-quick-actions'
import { useProfilePage } from './useProfilePage'

export function ProfilePage() {
  const { status, authProfile, errorMessage, handleRetry } = useProfilePage()

  if (status === 'loading') {
    return (
      <div className="space-y-6">
        <ProfilePageHeader />
        <div className="max-w-3xl">
          <ProfilePageSkeleton />
        </div>
      </div>
    )
  }

  if (status === 'error' || !authProfile) {
    return (
      <div className="space-y-6">
        <ProfilePageHeader />
        <CommonErrorState
          title="Could not load profile"
          message={errorMessage ?? 'Failed to load your profile'}
          onRetry={handleRetry}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <ProfilePageHeader />
      <div className="max-w-3xl space-y-8">
        <ProfileAccountCard profile={authProfile} />
        <ProfileQuickActions />
      </div>
    </div>
  )
}
