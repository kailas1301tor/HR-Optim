// components/requests/forms/leave-request-form-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCard, uiCalendarShell, uiSkeletonBlock } from '@/lib/ui/design-system'

export function LeaveRequestFormSkeleton() {
  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-5 lg:items-stretch gap-5 lg:gap-6 lg:min-h-[520px]"
      aria-label="Loading leave request form"
      role="status"
    >
      <div className={cn(uiCalendarShell, 'lg:col-span-3 flex flex-col min-h-[320px] lg:min-h-0')}>
        <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-6 lg:py-5 border-b border-border/40">
          <Skeleton className={cn('h-8 w-36 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <div className="flex items-center gap-1">
            <Skeleton className={cn('size-8 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
            <Skeleton className={cn('h-8 w-14 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
            <Skeleton className={cn('size-8 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          </div>
        </div>
        <div className="flex-1 p-4 space-y-3">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={`head-${i}`} className={cn('h-4 rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)} />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <Skeleton key={`cell-${i}`} className={cn('h-12 rounded-[16px] [corner-shape:squircle]', uiSkeletonBlock)} />
            ))}
          </div>
        </div>
      </div>

      <div className={cn(uiCard, 'lg:col-span-2 p-5 flex flex-col gap-4')}>
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className={cn('h-10 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        </div>
        <Skeleton className={cn('h-10 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <Skeleton className={cn('h-14 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton className={cn('h-10 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        </div>
        <Skeleton className={cn('h-14 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <Skeleton className={cn('h-24 rounded-[20px] [corner-shape:squircle] flex-1', uiSkeletonBlock)} />
        <div className="flex justify-end gap-2 pt-4 border-t border-border/40">
          <Skeleton className={cn('h-10 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-32 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        </div>
      </div>
    </div>
  )
}
