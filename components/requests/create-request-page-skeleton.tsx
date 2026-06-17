// components/requests/create-request-page-skeleton.tsx
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { LeaveRequestFormSkeleton } from './forms/leave-request-form-skeleton'

export function CreateRequestPageSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading new request form" role="status">
      <div className={cn(uiSkeletonBlock, 'h-4 w-32 rounded-[20px] [corner-shape:squircle]')} />

      <div className="space-y-2 pb-2 border-b border-border/40">
        <div className={cn(uiSkeletonBlock, 'h-8 w-48 rounded-[20px] [corner-shape:squircle]')} />
        <div className={cn(uiSkeletonBlock, 'h-4 w-64 rounded-[20px] [corner-shape:squircle]')} />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={cn(uiSkeletonBlock, 'h-9 w-28 rounded-[20px] [corner-shape:squircle]')} />
        ))}
      </div>

      <div className="max-w-6xl">
        <LeaveRequestFormSkeleton />
      </div>
    </div>
  )
}
