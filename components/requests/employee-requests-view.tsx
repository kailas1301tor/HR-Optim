// components/requests/employee-requests-view.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { FileQuestion, Plus, ShieldAlert } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import Link from 'next/link'
import { usePermissions } from '@/components/auth/permissions-provider'
import { employeeSelfService } from '@/services/employee-self-service'
import {
  mapLeaveRequest,
  mapSalaryAdvanceRequest,
  mapLoanRequest,
  mapDocumentRequest,
} from '@/lib/mappers/request-mapper'
import { mapDashboardAllRequest } from '@/lib/mappers/employee-self-service-mapper'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import {
  invalidateClientFetch,
  shouldFinalizeClientFetch,
} from '@/lib/helpers/client-fetch-lifecycle'
import { RequestCard } from './request-card'
import { RequestsSkeleton } from './requests-skeleton'
import { CommonEmptyState, CommonFilterChips, CommonMobileCardGrid, CommonErrorBanner } from '@/components/common'
import { uiCard, uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import type { Request } from '@/types/request'

type RequestTab = 'all' | 'leave' | 'salary-advance' | 'loan' | 'document'

const TAB_OPTIONS = [
  { value: 'all', label: 'All Requests' },
  { value: 'leave', label: 'Leave' },
  { value: 'salary-advance', label: 'Salary Advance' },
  { value: 'loan', label: 'Loan' },
  { value: 'document', label: 'Document' },
]

export function EmployeeRequestsView() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const requestIdParam = searchParams.get('requestId')

  const { employeeProfileId, isLoading: isAuthLoading } = usePermissions()
  const [activeTab, setActiveTab] = useState<RequestTab>('all')
  const [requests, setRequests] = useState<Request[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadToken, setReloadToken] = useState(0)
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    if (!requestIdParam) return
    setExpandedRequestId(requestIdParam)

    // Clean up query param
    const nextParams = new URLSearchParams(searchParams.toString())
    nextParams.delete('requestId')
    const queryString = nextParams.toString()
    router.replace(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }, [requestIdParam, searchParams, router, pathname])

  useEffect(() => {
    if (isAuthLoading) return
    if (!employeeProfileId) {
      setIsLoading(false)
      return
    }

    const profileId = employeeProfileId
    const fetchId = ++fetchIdRef.current
    const controller = new AbortController()

    async function loadRequests() {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage('')
      try {
        const scopedParams = { employeeId: profileId, signal: controller.signal }

        if (activeTab === 'all') {
          const allItems = await employeeSelfService.getAllRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          const mapped = allItems.map(mapDashboardAllRequest)
          mapped.sort((a, b) => {
            const dateA = a?.submittedAt ? new Date(a.submittedAt).getTime() : 0
            const dateB = b?.submittedAt ? new Date(b.submittedAt).getTime() : 0
            return dateB - dateA
          })
          setRequests(mapped)
          return
        }

        if (activeTab === 'leave') {
          const res = await employeeSelfService.getLeaveRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapLeaveRequest))
          return
        }

        if (activeTab === 'salary-advance') {
          const res = await employeeSelfService.getSalaryAdvanceRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapSalaryAdvanceRequest))
          return
        }

        if (activeTab === 'loan') {
          const res = await employeeSelfService.getLoanRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapLoanRequest))
          return
        }

        if (activeTab === 'document') {
          const res = await employeeSelfService.getDocumentRequests(scopedParams)
          if (fetchId !== fetchIdRef.current) return
          setRequests((Array.isArray(res) ? res : []).map(mapDocumentRequest))
        }
      } catch (error) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setRequests([])
        setHasError(true)
        setErrorMessage(getApiErrorMessage(error, 'Failed to load requests. Please try again.'))
      } finally {
        if (shouldFinalizeClientFetch({ signal: controller.signal, fetchId, fetchIdRef })) {
          setIsLoading(false)
        }
      }
    }

    void loadRequests()

    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [activeTab, employeeProfileId, isAuthLoading, reloadToken])

  const handleRetry = () => setReloadToken((prev) => prev + 1)

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cloud">My Requests</h1>
          <p className="text-xs text-muted-foreground mt-1">Submit and track your personal requests</p>
        </div>
        <PrimaryButton asChild className="min-h-11 text-xs">
          <Link href={newRequestHref}>
            <Plus className="w-3.5 h-3.5" />
            Create Request
          </Link>
        </PrimaryButton>
      </div>

      <CommonFilterChips
        options={TAB_OPTIONS}
        value={activeTab}
        onChange={(val) => setActiveTab(val as RequestTab)}
      />

      {hasError ? (
        <CommonErrorBanner message={errorMessage} onRetry={handleRetry} />
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
      ) : (
        <CommonEmptyState
          icon={FileQuestion}
          title="No requests found"
          description="You haven't submitted any requests under this category yet."
          actions={
            <PrimaryButton asChild className="min-h-11 text-xs">
              <Link href={newRequestHref}>
                <Plus className="w-3.5 h-3.5" />
                Create Request
              </Link>
            </PrimaryButton>
          }
        />
      )}
    </div>
  )
}
