// components/common/pagination.tsx
'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { uiOutlineBtn } from '@/lib/ui/design-system'

interface CommonPaginationProps {
  currentPage: number
  totalPages: number
  totalCount?: number
  onPageChange: (page: number) => void
  isLoading?: boolean
  className?: string
  compact?: boolean
}

export function CommonPagination({
  currentPage,
  totalPages,
  totalCount,
  onPageChange,
  isLoading = false,
  className,
  compact = false,
}: CommonPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div
      className={cn(
        'flex flex-col sm:flex-row items-center justify-between gap-3',
        compact ? 'px-1' : 'px-4 sm:px-6 py-4 border-t border-border',
        className
      )}
    >
      <p className={cn('text-muted-foreground text-center sm:text-left', compact ? 'text-xs' : 'text-sm')}>
        Page <span className="font-medium text-cloud">{currentPage}</span> of{' '}
        <span className="font-medium text-cloud">{totalPages}</span>
        {totalCount !== undefined && (
          <>
            {' · '}
            <span className="font-medium text-cloud">{totalCount}</span> total
          </>
        )}
      </p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isLoading}
          onClick={() => onPageChange(currentPage - 1)}
          className={cn(uiOutlineBtn, 'text-xs', compact ? 'h-8' : 'h-9')}
        >
          {compact ? 'Prev' : 'Previous'}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages || isLoading}
          onClick={() => onPageChange(currentPage + 1)}
          className={cn(uiOutlineBtn, 'text-xs', compact ? 'h-8' : 'h-9')}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
