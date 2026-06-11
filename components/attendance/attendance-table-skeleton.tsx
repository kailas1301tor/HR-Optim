// components/attendance/attendance-table-skeleton.tsx
'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock, uiTableShell } from '@/lib/ui/design-system'

export function AttendanceTableSkeleton() {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block p-4 space-y-3')}>
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className={cn('h-12 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      ))}
    </div>
  )
}
