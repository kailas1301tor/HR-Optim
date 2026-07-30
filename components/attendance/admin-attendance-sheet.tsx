// components/attendance/admin-attendance-sheet.tsx
'use client'

import { useState } from 'react'
import { Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  CommonEmptyState,
  CommonErrorState,
  CommonMobileCardGrid,
} from '@/components/common'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { AttendanceDateRangeNav } from './attendance-date-range-nav'
import { AttendanceStatsCards } from './attendance-stats-cards'
import { AttendanceToolbar } from './attendance-toolbar'
import { AttendanceTable } from './attendance-table'
import { AttendanceTableSkeleton } from './attendance-table-skeleton'
import { AttendanceCard } from './attendance-card'
import { AttendanceCardSkeleton } from './attendance-card-skeleton'
import { AttendanceSkeleton } from './attendance-skeleton'
import { AttendanceDetailDrawer } from './attendance-detail-drawer'
import { useAttendanceSheet } from './useAttendanceSheet'
import { usePermissions } from '@/components/auth/permissions-provider'
import { isInitialDataLoading } from '@/lib/helpers/is-initial-data-loading'
import { formatDisplayDate } from '@/lib/helpers/format-api-date'
import { toAttendanceRecord } from '@/lib/mappers/attendance-mapper'
import type { AttendanceRecord, TeamAttendanceDay, TeamAttendanceEmployee } from '@/types/attendance'

export function AdminAttendanceSheet() {
  const { canManage } = usePermissions()
  const canManageAttendance = canManage('attendance')
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null)

  const {
    searchQuery,
    setSearchQuery,
    startDate,
    endDate,
    isRangeMode,
    setDateRange,
    setToday,
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
    formatDateRangeLabel,
    navigatePeriod,
    handleExport,
    handleDeptExport,
    handleRetry,
    handleClearFilters,
  } = useAttendanceSheet()

  const handleDayClick = (
    employee: TeamAttendanceEmployee,
    day: TeamAttendanceDay,
  ): void => {
    setSelectedRecord(toAttendanceRecord(employee, day))
  }

  if (isInitialDataLoading(isLoading, records.length, hasError)) {
    return (
      <AttendanceSkeleton
        variant="admin"
        showHeader={true}
        showStats={true}
        showFilters={true}
      />
    )
  }

  return (
    <div className="space-y-6">
      <AttendanceDateRangeNav
        startDate={startDate}
        endDate={endDate}
        rangeLabel={formatDateRangeLabel()}
        isRangeMode={isRangeMode}
        onPrevious={() => navigatePeriod(-1)}
        onNext={() => navigatePeriod(1)}
        onToday={setToday}
        onDateRangeChange={setDateRange}
      />

      {shiftsError && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-xs text-red-400">
          Shift options could not be loaded. The shift filter may be unavailable.
        </div>
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
        canExport={!isLoading && records.length > 0}
        onExport={handleExport}
        onDeptExport={handleDeptExport}
        canManage={canManageAttendance}
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
          description="Try adjusting the date range, shift filter, or search query."
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
            {records.map((employee, index) => (
              <AttendanceCard
                key={employee.id}
                employee={employee}
                index={index}
                isRangeMode={isRangeMode}
                onDayClick={handleDayClick}
              />
            ))}
          </CommonMobileCardGrid>
          <AttendanceTable
            records={records}
            isRangeMode={isRangeMode}
            onDayClick={handleDayClick}
          />
        </>
      )}

      <AttendanceDetailDrawer
        record={selectedRecord}
        attendanceDate={selectedRecord?.date}
        date={
          selectedRecord?.date
            ? formatDisplayDate(selectedRecord.date)
            : undefined
        }
        canManage={canManageAttendance}
        onLateReasonSubmitted={handleRetry}
        onClose={() => setSelectedRecord(null)}
      />
    </div>
  )
}
