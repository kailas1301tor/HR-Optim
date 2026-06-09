// components/requests/create-request-page-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { LeaveRequestFormSkeleton } from './forms/leave-request-form-skeleton'

export function CreateRequestPageSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading new request form" role="status">
      <Skeleton className="h-4 w-32 rounded-xl" />

      <div className="space-y-2 pb-2 border-b border-border/40">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-4 w-64 rounded-xl" />
      </div>

      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-xl" />
        ))}
      </div>

      <div className="max-w-6xl">
        <LeaveRequestFormSkeleton />
      </div>
    </div>
  )
}
