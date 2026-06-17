// components/requests/admin-requests-list.tsx
'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { FileQuestion } from 'lucide-react'
import {
  CommonEmptyState,
  CommonErrorBanner,
  CommonErrorState,
  CommonMobileCardGrid,
  CommonPagination,
} from '@/components/common'
import { Button } from '@/components/ui/button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { RequestCard } from './request-card'
import { RequestCardSkeleton } from './request-card-skeleton'
import { RequestsPageHeader } from './requests-page-header'
import { RequestsStatsCards } from './requests-stats-cards'
import { RequestsToolbar } from './requests-toolbar'
import { statusConfig, typeConfig } from './requests-constants'
import { useRequestsList } from './useRequestsList'
import { useRequestActions } from './useRequestActions'
import { RequestActionDialogs } from './request-action-dialogs'
import { RequestsSkeleton } from './requests-skeleton'
import { usePermissions } from '@/components/auth/permissions-provider'
import { isInitialDataLoading } from '@/lib/helpers/is-initial-data-loading'

export function AdminRequestsList() {
  const { canManage } = usePermissions()
  const canManageRequests = canManage('requests')

  const {
    paginatedRequests,
    statusCounts,
    isLoading,
    isCountsLoading,
    countsHasError,
    hasError,
    localSearch,
    setLocalSearch,
    statusFilter,
    typeFilter,
    expandedRequest,
    setStatusFilter,
    setTypeFilter,
    handleToggleExpand,
    handleClearFilters,
    handleRetry,
    reloadCounts,
    employeeFilter,
    employees,
    isEmployeesLoading,
    employeesHasError,
    employeeSearchQuery,
    setEmployeeSearchQuery,
    setEmployeeFilter,
    updateQueryParams,
    totalPages,
    pageParam,
  } = useRequestsList()

  const handleActionSuccess = () => {
    handleRetry()
  }

  const {
    approveTarget,
    rejectTarget,
    isRejectDialogOpen,
    isSubmitting,
    rejectReason,
    rejectReasonError,
    isRejectReasonValid,
    setRejectReason,
    handleApprove,
    handleOpenReject,
    handleCloseApprove,
    handleCloseReject,
    handleConfirmApprove,
    handleConfirmReject,
  } = useRequestActions(handleActionSuccess)

  const statusLabel =
    statusFilter === 'all' ? 'any status' : statusConfig[statusFilter].label

  const emptyDescription =
    typeFilter !== 'all'
      ? `No ${typeConfig[typeFilter]?.label ?? typeFilter} requests with status "${statusLabel}".`
      : `No requests with status "${statusLabel}".`

  const handlePageChange = (page: number) => {
    updateQueryParams({ page: page <= 1 ? null : String(page) })
  }

  if (isInitialDataLoading(isLoading, paginatedRequests.length, hasError)) {
    return <RequestsSkeleton variant="admin" />
  }

  return (
    <div className="space-y-6">
      <RequestsPageHeader />

      <RequestsStatsCards
        statusCounts={statusCounts}
        statusFilter={statusFilter}
        isCountsLoading={isCountsLoading}
        countsHasError={countsHasError}
        onRetryCounts={reloadCounts}
        onStatusChange={setStatusFilter}
      />

      {employeesHasError && (
        <CommonErrorBanner
          message="Employee filter options could not be loaded."
          onRetry={handleRetry}
        />
      )}

      <RequestsToolbar
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        employeeFilter={employeeFilter}
        employees={employees}
        isEmployeesLoading={isEmployeesLoading}
        employeeSearchQuery={employeeSearchQuery}
        onEmployeeSearchChange={setEmployeeSearchQuery}
        onEmployeeChange={setEmployeeFilter}
      />

      {hasError ? (
        <CommonErrorState
          title="Failed to load requests"
          message="Please check your connection and try again."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <CommonMobileCardGrid className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 4 }).map((_, idx) => (
            <RequestCardSkeleton key={idx} showActions={canManageRequests} />
          ))}
        </CommonMobileCardGrid>
      ) : paginatedRequests.length > 0 ? (
        <>
          <CommonMobileCardGrid className="lg:grid lg:grid-cols-2 xl:grid-cols-3">
            {paginatedRequests.map((request, index) => (
              <RequestCard
                key={request.id}
                request={request}
                index={index}
                isExpanded={expandedRequest === request.id}
                onToggleExpand={() => handleToggleExpand(request.id)}
                onApprove={() => handleApprove(request)}
                onReject={() => handleOpenReject(request)}
                canManage={canManageRequests}
              />
            ))}
          </CommonMobileCardGrid>
          {totalPages > 1 && (
            <CommonPagination
              currentPage={pageParam}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <CommonEmptyState
          icon={FileQuestion}
          title="No requests found"
          description={emptyDescription}
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className={cn(uiOutlineBtn, 'min-h-11 text-xs')}
            >
              Clear Filters
            </Button>
          }
        />
      )}

      <RequestActionDialogs
        approveTarget={approveTarget}
        isRejectOpen={isRejectDialogOpen}
        rejectTarget={rejectTarget}
        rejectReason={rejectReason}
        rejectReasonError={rejectReasonError}
        isRejectReasonValid={isRejectReasonValid}
        isSubmitting={isSubmitting}
        onRejectReasonChange={setRejectReason}
        onApproveDialogChange={(open) => !open && handleCloseApprove()}
        onRejectDialogChange={(open) => !open && handleCloseReject()}
        onConfirmApprove={handleConfirmApprove}
        onConfirmReject={handleConfirmReject}
      />
    </div>
  )
}
