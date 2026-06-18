// components/documents/documents-skeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { DocumentCardSkeleton } from './document-card-skeleton'
import {
  uiCard,
  uiSkeletonBlock,
  uiSquircleSm,
  uiSquircleXs,
  uiSquircleNav,
} from '@/lib/ui/design-system'

interface DocumentsSkeletonProps {
  className?: string
  variant?: 'admin' | 'employee'
  showHeader?: boolean
  showStats?: boolean
  showFilters?: boolean
}

function EmployeeDocumentsSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading documents" role="status">
      <div>
        <h1 className="text-2xl font-bold text-cloud">My Documents</h1>
        <p className="text-xs text-muted-foreground mt-1">
          View and download your personal verified documents
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, idx) => (
          <DocumentCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  )
}

export function DocumentsSkeleton({
  className,
  variant = 'admin',
  showHeader = true,
  showStats = true,
  showFilters = true,
}: DocumentsSkeletonProps): React.JSX.Element {
  if (variant === 'employee') {
    return <EmployeeDocumentsSkeleton />
  }

  return (
    <div className={cn('space-y-6 animate-pulse', className)} aria-label="Loading documents" role="status">
      {showHeader && (
        <div className="space-y-2 pb-2 border-b border-border/40">
          <Skeleton className={cn('h-8 w-48', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-4 w-72', uiSquircleNav, uiSkeletonBlock)} />
        </div>
      )}

      {showStats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className={cn(uiCard, 'p-4 flex items-center justify-between')}>
              <div className="space-y-2">
                <Skeleton className={cn('h-3 w-20 rounded', uiSkeletonBlock)} />
                <Skeleton className={cn('h-8 w-12', uiSquircleSm, uiSkeletonBlock)} />
              </div>
              <Skeleton className={cn('w-10 h-10', uiSquircleXs, uiSkeletonBlock)} />
            </div>
          ))}
        </div>
      )}

      {showFilters && (
        <div className="flex flex-col lg:flex-row gap-3">
          <Skeleton className={cn('h-10 flex-1', uiSquircleSm, uiSkeletonBlock)} />
          <Skeleton className={cn('h-10 w-full lg:w-52', uiSquircleSm, uiSkeletonBlock)} />
        </div>
      )}

      {/* Grid of document card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <DocumentCardSkeleton key={idx} />
        ))}
      </div>
    </div>
  )
}
