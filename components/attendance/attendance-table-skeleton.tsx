// components/attendance/attendance-table-skeleton.tsx
'use client'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock, uiTableShell } from '@/lib/ui/design-system'

const TABLE_COLUMN_COUNT = 6

export function AttendanceTableSkeleton() {
  return (
    <div className={cn(uiTableShell, 'hidden lg:block')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {Array.from({ length: TABLE_COLUMN_COUNT }).map((_, index) => (
                <th key={index} className="px-4 py-3 text-left">
                  <Skeleton className={cn('h-3 rounded w-16', uiSkeletonBlock)} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className={cn('w-8 h-8 rounded-full shrink-0', uiSkeletonBlock)} />
                    <div className="space-y-1.5 flex-1">
                      <Skeleton className={cn('h-3 rounded w-28', uiSkeletonBlock)} />
                      <Skeleton className={cn('h-2 rounded w-36', uiSkeletonBlock)} />
                    </div>
                  </div>
                </td>
                {Array.from({ length: TABLE_COLUMN_COUNT - 1 }).map((_, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3">
                    <Skeleton className={cn('h-4 rounded w-20', uiSkeletonBlock)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
