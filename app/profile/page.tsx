// app/profile/page.tsx
import { Suspense } from 'react'
import { AppShell } from '@/components/layout/app-shell'
import { ProfilePage } from '@/components/profile/profile-page'
import { CommonPageSkeleton } from '@/components/common'

export default function ProfileRoutePage() {
  return (
    <AppShell>
      <Suspense fallback={<CommonPageSkeleton />}>
        <ProfilePage />
      </Suspense>
    </AppShell>
  )
}

export const metadata = {
  title: 'My Profile',
  description: 'View your account details',
}
