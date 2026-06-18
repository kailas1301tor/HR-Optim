// components/settings/settings-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import {
  uiCard,
  uiSectionHeader,
  uiSkeletonBlock,
  uiSquircleSm,
} from '@/lib/ui/design-system'

interface SettingsSkeletonProps {
  className?: string
  showHeader?: boolean
}

const TAB_WIDTHS = ['w-40', 'w-44', 'w-36', 'w-28', 'w-40', 'w-28', 'w-36']

function SettingsMasterCardSkeleton({ rowCount = 4 }: { rowCount?: number }) {
  return (
    <div className={cn(uiCard, 'p-0 overflow-hidden')}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 border-b border-border/40">
        <Skeleton className={cn('h-5 w-32 rounded', uiSkeletonBlock)} />
        <Skeleton className={cn('h-9 w-16 rounded-xl', uiSkeletonBlock)} />
      </div>
      <div className="p-4 space-y-2">
        {Array.from({ length: rowCount }).map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-midnight border border-border/60 rounded-[20px] [corner-shape:squircle] p-3"
          >
            <Skeleton className={cn('h-4 w-36 rounded', uiSkeletonBlock)} />
            <div className="flex items-center gap-2">
              <Skeleton className={cn('h-8 w-8 rounded-xl', uiSkeletonBlock)} />
              <Skeleton className={cn('h-8 w-8 rounded-xl', uiSkeletonBlock)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export function SettingsSkeleton({
  className,
  showHeader = true,
}: SettingsSkeletonProps): React.JSX.Element {
  return (
    <div className={cn('space-y-6', className)} aria-label="Loading settings" role="status">
      {showHeader ? (
        <div className="space-y-2 pb-2 border-b border-border/40">
          <Skeleton className={cn('h-8 w-48 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-72 rounded', uiSkeletonBlock)} />
        </div>
      ) : null}

      <div className="bg-midnight/60 border border-border/40 p-1.5 rounded-[20px] [corner-shape:squircle] flex flex-wrap gap-1.5 w-full">
        {TAB_WIDTHS.map((width, index) => (
          <Skeleton
            key={index}
            className={cn('h-9 rounded-xl shrink-0', width, uiSquircleSm, uiSkeletonBlock)}
          />
        ))}
      </div>

      <div className="space-y-6 outline-none">
        <div className={uiSectionHeader}>
          <Skeleton className={cn('h-6 w-56 rounded', uiSkeletonBlock)} />
          <Skeleton className={cn('h-3 w-80 max-w-full rounded mt-2', uiSkeletonBlock)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SettingsMasterCardSkeleton rowCount={4} />
          <SettingsMasterCardSkeleton rowCount={4} />
        </div>

        <SettingsMasterCardSkeleton rowCount={5} />
      </div>
    </div>
  )
}
