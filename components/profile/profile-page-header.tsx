// components/profile/profile-page-header.tsx
'use client'

import { CommonPageHeader } from '@/components/common'

export function ProfilePageHeader() {
  return (
    <CommonPageHeader
      title="My Profile"
      subtitle="Manage your account identity and preferences"
      className="pb-2 sm:pb-4"
    />
  )
}
