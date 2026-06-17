// components/profile/profile-page.tsx
'use client'

import { CommonErrorState } from '@/components/common'
import { ProfileHero } from './profile-hero'
import { ProfileDetails } from './profile-details'
import { ProfilePageSkeleton } from './profile-page-skeleton'
import { ProfileQuickActions } from './profile-quick-actions'
import { useProfilePage } from './useProfilePage'

export function ProfilePage(): React.JSX.Element {
  const { status, authProfile, employeeDetail, errorMessage, handleRetry } = useProfilePage()

  if (status === 'loading') {
    return <ProfilePageSkeleton />
  }

  if (status === 'error' || !authProfile) {
    return (
      <CommonErrorState
        title="Could not load profile"
        message={errorMessage ?? 'Failed to load your profile'}
        onRetry={handleRetry}
      />
    )
  }

  return (
    <div className="space-y-8">
      {/* Profile Identity Hero */}
      <ProfileHero profile={authProfile} employee={employeeDetail} />

      {/* Profile Info Details List */}
      <ProfileDetails profile={authProfile} employee={employeeDetail} />

      {/* Quick Actions List */}
      <ProfileQuickActions />
    </div>
  )
}



