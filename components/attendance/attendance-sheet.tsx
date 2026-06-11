// components/attendance/attendance-sheet.tsx
'use client'

import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorBanner,
  CommonErrorState,
  CommonMobileCardGrid,
} from '@/components/common'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { AttendanceDateNav } from './attendance-date-nav'
import { AttendanceStatsCards } from './attendance-stats-cards'
import { AttendanceToolbar } from './attendance-toolbar'
import { AttendanceTable } from './attendance-table'
import { AttendanceTableSkeleton } from './attendance-table-skeleton'
import { AttendanceCard } from './attendance-card'
import { AttendanceCardSkeleton } from './attendance-card-skeleton'
import { useAttendanceSheet } from './useAttendanceSheet'

export function AttendanceSheet() {
  const {
    searchQuery,
    setSearchQuery,
    selectedDate,
    setSelectedDate,
    shiftFilter,
    setShiftFilter,
    records,
    statusCounts,
    shifts,
    shiftsError,
    reloadShifts,
    isLoading,
    isExporting,
    hasError,
    formatDate,
    navigateDate,
    handleExport,
    handleRetry,
    handleClearFilters,
  } = useAttendanceSheet()

  return (
    <div className="space-y-6">
      <AttendanceDateNav
        formattedDate={formatDate(selectedDate)}
        onPrevious={() => navigateDate(-1)}
        onNext={() => navigateDate(1)}
        onToday={() => setSelectedDate(new Date())}
      />

      {shiftsError && (
        <CommonErrorBanner
          message="Shift options could not be loaded. The shift filter may be unavailable."
          onRetry={() => void reloadShifts()}
        />
      )}

      <AttendanceToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        shiftFilter={shiftFilter}
        onShiftChange={setShiftFilter}
        shifts={shifts}
        shiftsError={shiftsError}
        isExporting={isExporting}
        isLoading={isLoading}
        onExport={handleExport}
      />

      <AttendanceStatsCards statusCounts={statusCounts} isLoading={isLoading} />

      {hasError ? (
        <CommonErrorState
          title="Failed to load attendance"
          message="Please check your connection and try again."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <>
          <CommonMobileCardGrid>
            {Array.from({ length: 4 }).map((_, idx) => (
              <AttendanceCardSkeleton key={idx} />
            ))}
          </CommonMobileCardGrid>
          <AttendanceTableSkeleton />
        </>
      ) : records.length === 0 ? (
        <CommonEmptyState
          icon={Users}
          title="No attendance records found"
          description="Try adjusting the date, shift filter, or search query."
          actions={
            <Button
              type="button"
              variant="outline"
              onClick={handleClearFilters}
              className={cn(uiOutlineBtn, 'text-xs min-h-11')}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          <CommonMobileCardGrid>
            {records.map((record, index) => (
              <AttendanceCard key={record.id} record={record} index={index} />
            ))}
          </CommonMobileCardGrid>
          <AttendanceTable records={records} />
        </>
      )}
    </div>
  )
}
