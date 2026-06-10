// components/attendance/attendance-sheet.tsx
'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  CommonEmptyState,
  CommonErrorState,
} from '@/components/common'
import { uiOutlineBtn, uiSkeletonBlock } from '@/lib/ui/design-system'
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Download,
  Calendar,
  Clock,
  Users,
} from 'lucide-react'
import {
  STATUS_CONFIG,
  getShiftBadgeClassName,
} from './attendance-constants'
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
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center lg:justify-between">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateDate(-1)} aria-label="Previous day">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-2 px-4 py-2 bg-midnight rounded-lg">
              <Calendar className="w-4 h-4 text-violet-glow" />
              <span className="text-sm font-medium text-cloud">{formatDate(selectedDate)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => navigateDate(1)} aria-label="Next day">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())}>
            Today
          </Button>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-64 bg-midnight border-border"
            />
          </div>
          <Select value={shiftFilter} onValueChange={setShiftFilter}>
            <SelectTrigger className="w-full sm:w-40 bg-midnight border-border">
              <SelectValue placeholder="Filter by shift" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Shifts</SelectItem>
              {shifts.map((shift) => (
                <SelectItem key={shift.id} value={String(shift.id)}>
                  {shift.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            className="gap-2 justify-center"
            onClick={handleExport}
            disabled={isExporting || isLoading}
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exporting…' : 'Export'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, config]) => (
          <div key={key} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn('w-2 h-2 rounded-full', config.dotColor)} />
              <span className="text-xs text-muted-foreground">{config.label}</span>
            </div>
            {isLoading ? (
              <Skeleton className={cn('h-8 w-12', uiSkeletonBlock)} />
            ) : (
              <p className="text-2xl font-semibold text-cloud font-mono">
                {statusCounts[key as keyof typeof statusCounts]}
              </p>
            )}
          </div>
        ))}
      </div>

      {hasError ? (
        <CommonErrorState
          title="Failed to load attendance"
          message="Please check your connection and try again."
          onRetry={handleRetry}
        />
      ) : isLoading ? (
        <div className="bg-carbon border border-border rounded-2xl overflow-hidden p-4 space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className={cn('h-12 w-full', uiSkeletonBlock)} />
          ))}
        </div>
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
              className={cn(uiOutlineBtn, 'text-xs h-9')}
            >
              Clear Filters
            </Button>
          }
        />
      ) : (
        <div className="bg-carbon border border-border rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Employee
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Shift
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Time In
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Time Out
                  </th>
                  <th className="text-left px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-slate-500">
                    Work Hours
                  </th>
                </tr>
              </thead>
              <tbody>
                {records.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    className="border-b border-border/50 hover:bg-violet-core/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-xs">
                            {record.initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-cloud">{record.employeeName}</p>
                          <p className="text-xs text-muted-foreground">{record.department}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-1 rounded-full text-[11px] font-medium',
                          getShiftBadgeClassName(record.shiftName),
                        )}
                      >
                        {record.shiftName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className={cn('w-2 h-2 rounded-full', STATUS_CONFIG[record.status].dotColor)} />
                        <span className="text-sm text-slate-300">
                          {STATUS_CONFIG[record.status].label}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-mono text-cloud">
                          {record.timeIn || '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-mono text-cloud">
                          {record.timeOut || '--:--'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono text-cloud">
                        {record.workHours || '--'}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
