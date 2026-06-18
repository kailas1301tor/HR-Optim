// app/profile/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { ProfilePage } from '@/components/profile/profile-page'
import { ProfilePageHeader } from '@/components/profile/profile-page-header'
import { ProfilePageSkeleton } from '@/components/profile/profile-page-skeleton'

export default function ProfileRoutePage(): React.JSX.Element {
  return (
    <AppShell>
      <div className="space-y-4 sm:space-y-6">
        <ProfilePageHeader />
        <div className="w-full">
          <Suspense fallback={<ProfilePageSkeleton />}>
            <ProfilePage />
          </Suspense>
        </div>
      </div>
    </AppShell>
  )
}

export const metadata = {
  title: 'My Profile',
  description: 'View your account details',
}
