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

      {/* Split-pane grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Profile details tabs */}
        <div className="lg:col-span-8 space-y-6">
          <ProfileDetails profile={authProfile} employee={employeeDetail} />
        </div>

        {/* Sidebar for stats and actions */}
        <div className="lg:col-span-4 space-y-6 lg:border-l lg:border-border/30 lg:pl-8">
          {employeeDetail && (
            <div className="space-y-4">
              <div className="border-b border-border/40 pb-2">
                <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Employment Status
                </h3>
              </div>
              <div className="space-y-3.5 text-xs sm:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Employment Type</span>
                  <span className="font-bold text-slate-200">{employeeDetail.employee_type || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Assigned Shift</span>
                  <span className="font-bold text-slate-200">{employeeDetail.shift || '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Joining Date</span>
                  <span className="font-bold text-slate-200">{employeeDetail.joined_date || '—'}</span>
                </div>
              </div>
            </div>
          )}

          <ProfileQuickActions />
        </div>
      </div>
    </div>
  )
}




