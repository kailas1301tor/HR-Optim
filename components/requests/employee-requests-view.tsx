// components/requests/employee-requests-view.tsx
'use client'

import { useEffect, useState } from 'react'
import { FileQuestion, Plus, ShieldAlert } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { usePermissions } from '@/components/auth/permissions-provider'
import { RequestCard } from './request-card'
import { RequestsSkeleton } from './requests-skeleton'
import { CommonEmptyState, CommonFilterChips, CommonMobileCardGrid, CommonErrorBanner } from '@/components/common'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiCard } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { useEmployeeRequests, type EmployeeRequestTab } from './useEmployeeRequests'

const TAB_OPTIONS = [
  { value: 'all', label: 'All Requests' },
  { value: 'leave', label: 'Leave' },
  { value: 'salary-advance', label: 'Salary Advance' },
  { value: 'loan', label: 'Loan' },
  { value: 'document', label: 'Document' },
]

export function EmployeeRequestsView({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestIdParam = searchParams.get('requestId')

  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const [activeTab, setActiveTab] = useState<EmployeeRequestTab>('all')
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)

  const { requests, isLoading, hasError, errorMessage, reload } = useEmployeeRequests({
    employeeProfileId,
    activeTab,
    enabled: !isAuthLoading && employeeProfileId !== null,
  })

  useEffect(() => {
    if (!requestIdParam) return
    setExpandedRequestId(requestIdParam)

    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('requestId')
    const queryString = nextParams.toString()
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }, [requestIdParam, searchParams, router, pathname])

  const newRequestHref =
    activeTab === 'all' ? '/requests/new' : `/requests/new?type=${activeTab}`

  if (isAuthLoading || isLoading) {
    return <RequestsSkeleton variant="employee" />
  }

  if (!employeeProfileId) {
    return (
      <div className={cn(uiCard, 'p-8 flex flex-col items-center justify-center text-center max-w-xl mx-auto mt-12 border-amber-500/20 bg-amber-500/5')}>
        <ShieldAlert className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-semibold text-cloud mb-2">No Employee Profile Linked</h3>
        <p className="text-sm text-muted-foreground">
          This account is not linked to any employee profile. Please contact your system administrator to configure your employee profile link.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div
        className={cn(
          'flex flex-col sm:flex-row gap-4',
          embedded ? 'sm:items-center sm:justify-end' : 'sm:items-center sm:justify-between',
        )}
      >
        {!embedded ? (
          <div>
            <h1 className="text-2xl font-bold text-cloud">My Requests</h1>
            <p className="text-xs text-muted-foreground mt-1">Submit and track your personal requests</p>
          </div>
        ) : null}
        <PrimaryButton asChild className="min-h-11 text-xs">
          <Link href={newRequestHref}>
            <Plus className="w-3.5 h-3.5" />
            New Request
          </Link>
        </PrimaryButton>
      </div>

      <CommonFilterChips
        options={TAB_OPTIONS}
        value={activeTab}
        onChange={(val) => setActiveTab(val as EmployeeRequestTab)}
      />

      {hasError ? (
        <CommonErrorBanner message={errorMessage ?? 'Failed to load requests'} onRetry={reload} />
      ) : null}

      {requests.length > 0 ? (
        <CommonMobileCardGrid className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {requests.map((request, index) => (
            <RequestCard
              key={request.id}
              request={request}
              index={index}
              isExpanded={expandedRequestId === request.id}
              onToggleExpand={() =>
                setExpandedRequestId((prev) => (prev === request.id ? null : request.id))
              }
              onApprove={() => {}}
              onReject={() => {}}
              canManage={false}
            />
          ))}
        </CommonMobileCardGrid>
      ) : !hasError ? (
        <CommonEmptyState
          icon={FileQuestion}
          title="No requests found"
          description="You haven't submitted any requests under this category yet."
          actions={
            <PrimaryButton asChild className="min-h-11 text-xs">
              <Link href={newRequestHref}>
                <Plus className="w-3.5 h-3.5" />
                New Request
              </Link>
            </PrimaryButton>
          }
        />
      ) : null}
    </div>
  )
}
