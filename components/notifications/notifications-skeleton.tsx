// components/notifications/notifications-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { uiSkeletonBlock, uiSquircleSm, uiSquircleNav } from '@/lib/ui/design-system'

export function NotificationsSkeleton(): React.JSX.Element {
  return (
    <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg animate-pulse" aria-label="Loading notifications" role="status">
      <CardHeader className="pb-3 border-b border-border/40 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className={cn('h-4 w-4 rounded-lg', uiSkeletonBlock)} />
          <Skeleton className={cn('h-5 w-32 rounded', uiSkeletonBlock)} />
        </div>
        <Skeleton className={cn('h-3 w-64 rounded', uiSkeletonBlock)} />
      </CardHeader>
      <CardContent className="p-0 divide-y divide-border/30">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 flex items-start gap-4">
            <Skeleton className={cn('h-9 w-9 rounded-lg shrink-0', uiSkeletonBlock)} />
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex justify-between items-center gap-4">
                <Skeleton className={cn('h-3.5 w-1/3 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-2.5 w-12 rounded', uiSkeletonBlock)} />
              </div>
              <Skeleton className={cn('h-3 w-3/4 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-2.5 w-24 rounded', uiSkeletonBlock)} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
