// components/settings/roles/roles-skeletons.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'

export const RoleCardSkeleton = () => (
  <div className="bg-midnight border border-border/60 rounded-[20px] [corner-shape:squircle] p-4 flex flex-col justify-between min-h-[120px]">
    <div className="space-y-3">
      <Skeleton className={cn('h-4 w-1/3 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      <Skeleton className={cn('h-3 w-3/4 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      <Skeleton className={cn('h-3 w-2/3 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
    </div>
  </div>
)

export const ExplorerSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div key={i} className="flex items-center justify-between p-3.5 rounded-[20px] [corner-shape:squircle] border border-border/40 bg-midnight">
        <div className="space-y-2 flex-1">
          <Skeleton className={cn('h-3 w-1/2 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <Skeleton className={cn('h-2.5 w-1/4 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        </div>
        <Skeleton className={cn('h-5 w-5 rounded-full', uiSkeletonBlock)} />
      </div>
    ))}
  </div>
)

export const FormSkeleton = () => (
  <Card className="bg-card/35 backdrop-blur border border-border/80 shadow-lg">
    <CardHeader className="pb-4 border-b border-border/40">
      <div className="flex items-center gap-4">
        <Skeleton className={cn('h-9 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <div className="space-y-2 flex-1">
          <Skeleton className={cn('h-5 w-1/4 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          <Skeleton className={cn('h-3 w-1/3 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        </div>
      </div>
    </CardHeader>
    <CardContent className="pt-6 space-y-6">
      <div className="space-y-2">
        <Skeleton className={cn('h-3 w-16 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
      <div className="space-y-3">
        <Skeleton className={cn('h-3 w-32 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 9 }).map((_, i) => (
            <Skeleton key={i} className={cn('h-12 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
)
