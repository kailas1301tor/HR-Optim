// components/requests/requests-list.tsx
'use client'

import Link from 'next/link'
import { FileQuestion, Plus } from 'lucide-react'
import { CommonEmptyState } from '@/components/common'
import { Button } from '@/components/ui/button'
import { PrimaryButton } from '@/components/ui/primary-button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { RequestCard } from './request-card'
import { RequestCardSkeleton } from './request-card-skeleton'
import { RequestsPageHeader } from './requests-page-header'
import { RequestsStatsCards } from './requests-stats-cards'
import { RequestsToolbar } from './requests-toolbar'
import { statusConfig, typeConfig } from './requests-constants'
import { useRequestsList } from './useRequestsList'

export function RequestsList() {
  const {
    filteredRequests,
    statusCounts,
    isLoading,
    isCountsLoading,
    searchQuery,
    statusFilter,
    typeFilter,
    expandedRequest,
    setSearchQuery,
    setStatusFilter,
    setTypeFilter,
    handleToggleExpand,
    handleApprovePlaceholder,
    handleRejectPlaceholder,
    handleClearFilters,
    employeeFilter,
    employees,
    isEmployeesLoading,
    setEmployeeFilter,
  } = useRequestsList()

  const newRequestHref =
    typeFilter === 'all' ? '/requests/new' : `/requests/new?type=${typeFilter}`

  const statusLabel =
    statusFilter === 'all' ? 'any status' : statusConfig[statusFilter].label

  const emptyDescription =
    typeFilter !== 'all'
      ? `No ${typeConfig[typeFilter]?.label ?? typeFilter} requests with status "${statusLabel}".`
      : `No requests with status "${statusLabel}".`

  return (
    <div className="space-y-6">
      <RequestsPageHeader typeFilter={typeFilter} />

      <RequestsStatsCards
        statusCounts={statusCounts}
        statusFilter={statusFilter}
        isCountsLoading={isCountsLoading}
        onStatusChange={setStatusFilter}
      />

      <RequestsToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        employeeFilter={employeeFilter}
        employees={employees}
        isEmployeesLoading={isEmployeesLoading}
        onEmployeeChange={setEmployeeFilter}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <RequestCardSkeleton key={idx} />
          ))}
        </div>
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredRequests.map((request, index) => (
            <RequestCard
              key={request.id}
              request={request}
              index={index}
              isExpanded={expandedRequest === request.id}
              onToggleExpand={() => handleToggleExpand(request.id)}
              onApprove={handleApprovePlaceholder}
              onReject={handleRejectPlaceholder}
            />
          ))}
        </div>
      ) : (
        <CommonEmptyState
          icon={FileQuestion}
          title="No requests found"
          description={emptyDescription}
          actions={
            <>
              <PrimaryButton asChild className="h-9 text-xs">
                <Link href={newRequestHref}>
                  <Plus className="w-3.5 h-3.5" />
                  Create first request
                </Link>
              </PrimaryButton>
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
                className={cn(uiOutlineBtn, 'h-9 text-xs')}
              >
                Clear Filters
              </Button>
            </>
          }
        />
      )}
    </div>
  )
}
