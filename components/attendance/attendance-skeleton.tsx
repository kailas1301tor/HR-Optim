// components/attendance/attendance-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { CommonMobileCardGrid } from '@/components/common'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSkeletonBlock,
  uiSquircleSm,
  uiSquircleXs,
} from '@/lib/ui/design-system'
import { AttendanceCardSkeleton } from './attendance-card-skeleton'
import { AttendanceTableSkeleton } from './attendance-table-skeleton'

interface AttendanceSkeletonProps {
  className?: string
  variant?: 'admin' | 'employee'
  showHeader?: boolean
  showStats?: boolean
  showFilters?: boolean
}

function AttendanceDateNavSkeleton() {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Skeleton className={cn('h-11 w-11 rounded-xl', uiSkeletonBlock)} />
        <Skeleton className={cn('h-11 w-44 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <Skeleton className={cn('h-11 w-11 rounded-xl', uiSkeletonBlock)} />
      </div>
      <Skeleton className={cn('h-11 w-20 rounded-xl', uiSkeletonBlock)} />
    </div>
  )
}

function AttendanceAdminStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={cn(uiCard, 'p-4 flex items-center gap-4')}>
          <Skeleton className={cn('w-10 h-10 shrink-0', uiSquircleXs, uiSkeletonBlock)} />
          <div className="space-y-2 flex-1">
            <Skeleton className={cn('h-3 w-16 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-5 w-10', uiSquircleXs, uiSkeletonBlock)} />
          </div>
        </div>
      ))}
    </div>
  )
}

function AttendanceEmployeeStatsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className={cn(uiCard, 'p-5 flex items-center gap-4')}>
          <Skeleton className={cn('w-11 h-11 shrink-0 rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <div className="space-y-2 flex-1 min-w-0">
            <Skeleton className={cn('h-2.5 w-16 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-6 w-8', uiSquircleSm, uiSkeletonBlock)} />
          </div>
        </div>
      ))}
    </div>
  )
}

function AttendanceToolbarSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-3">
      <Skeleton className={cn('h-11 flex-1 rounded-xl', uiSkeletonBlock)} />
      <Skeleton className={cn('h-11 w-full lg:w-52 rounded-xl', uiSkeletonBlock)} />
      <Skeleton className={cn('h-11 w-full lg:w-32 rounded-xl', uiSkeletonBlock)} />
      <Skeleton className={cn('h-11 w-full lg:w-36 rounded-xl', uiSkeletonBlock)} />
    </div>
  )
}

function AttendanceEmployeeTableSkeleton() {
  return (
    <div className={cn(uiCard, 'p-6 overflow-hidden')}>
      <Skeleton className={cn('h-4 w-28 rounded mb-4', uiSkeletonBlock)} />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
            <Skeleton className={cn('h-4 w-28 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-4 w-16 rounded', uiSkeletonBlock)} />
            <Skeleton className={cn('h-4 w-20 rounded-full', uiSkeletonBlock)} />
          </div>
        ))}
      </div>
    </div>
  )
}

function AdminAttendanceSkeleton({
  showHeader = true,
  showStats = true,
  showFilters = true,
}: Omit<AttendanceSkeletonProps, 'className' | 'variant'>) {
  return (
    <>
      {showHeader ? <AttendanceDateNavSkeleton /> : null}

      {showFilters ? <AttendanceToolbarSkeleton /> : null}

      {showStats ? <AttendanceAdminStatsSkeleton /> : null}

      <CommonMobileCardGrid className="lg:hidden">
        {Array.from({ length: 4 }).map((_, index) => (
          <AttendanceCardSkeleton key={index} />
        ))}
      </CommonMobileCardGrid>

      <AttendanceTableSkeleton />
    </>
  )
}

function EmployeeAttendanceSkeleton() {
  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-cloud">My Attendance</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Review your monthly attendance summary and daily status
          </p>
        </div>
        <Skeleton className={cn('h-11 w-full max-w-sm rounded-xl', uiSkeletonBlock)} />
      </div>

      <AttendanceEmployeeStatsSkeleton />
      <AttendanceEmployeeTableSkeleton />
    </>
  )
}

export function AttendanceSkeleton({
  className,
  variant = 'admin',
  showHeader = true,
  showStats = true,
  showFilters = true,
}: AttendanceSkeletonProps): React.JSX.Element {
  return (
    <div
      className={cn('space-y-6', className)}
      aria-label="Loading attendance data"
      role="status"
    >
      {variant === 'employee' ? (
        <EmployeeAttendanceSkeleton />
      ) : (
        <AdminAttendanceSkeleton
          showHeader={showHeader}
          showStats={showStats}
          showFilters={showFilters}
        />
      )}
    </div>
  )
}
