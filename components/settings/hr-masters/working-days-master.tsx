// components/settings/hr-masters/working-days-master.tsx
'use client'

import { CalendarRange } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonErrorState } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiCard, uiSkeletonBlock } from '@/lib/ui/design-system'
import { useWorkingDaysMaster } from './useWorkingDaysMaster'

const WEEKDAY_SKELETON_COUNT = 7

export function WorkingDaysMaster() {
  const { items, isLoading, hasError, updatingDayIndex, reload, handleToggle } = useWorkingDaysMaster()

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load working days"
        message="Please check your connection and try again."
        onRetry={reload}
        className="min-h-[200px]"
      />
    )
  }

  return (
    <div className={cn(uiCard, 'p-5 space-y-4')}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-cloud">Working Days</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Toggle which weekdays count as working days for leave planning.
          </p>
        </div>
        <CalendarRange className="h-5 w-5 text-violet-glow shrink-0" aria-hidden />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: WEEKDAY_SKELETON_COUNT }).map((_, index) => (
            <Skeleton
              key={index}
              className={cn('h-12 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((day) => (
            <div
              key={day.key}
              className="flex items-center justify-between rounded-[20px] [corner-shape:squircle] border border-border/60 bg-midnight/40 px-4 py-3"
            >
              <Label htmlFor={`working-day-${day.key}`} className="text-sm font-medium text-slate-200">
                {day.name}
              </Label>
              <Switch
                id={`working-day-${day.key}`}
                checked={day.is_working_day}
                disabled={updatingDayIndex === day.id}
                onCheckedChange={(checked) => handleToggle(day, checked)}
                aria-label={`${day.name} working day`}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
