// components/requests/requests-page-header.tsx
'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import { CommonPageHeader } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import type { RequestTypeFilter } from '@/types/request'

interface RequestsPageHeaderProps {
  typeFilter: RequestTypeFilter
  canManage?: boolean
}

export function RequestsPageHeader({ typeFilter, canManage = false }: RequestsPageHeaderProps) {
  const newRequestHref =
    typeFilter === 'all' ? '/requests/new' : `/requests/new?type=${typeFilter}`

  return (
    <CommonPageHeader
      title="Requests"
      subtitle="Review and manage employee requests and approvals"
      action={
        canManage ? (
        <PrimaryButton asChild>
          <Link href={newRequestHref} aria-label="Create new request">
            <Plus className="w-4 h-4" />
            New Request
          </Link>
        </PrimaryButton>
        ) : undefined
      }
    />
  )
}
