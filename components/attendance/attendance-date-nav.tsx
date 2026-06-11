// components/attendance/attendance-date-nav.tsx
'use client'

import { Button } from '@/components/ui/button'
import { uiOutlineBtn } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface AttendanceDateNavProps {
  formattedDate: string
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
}

export function AttendanceDateNav({
  formattedDate,
  onPrevious,
  onNext,
  onToday,
}: AttendanceDateNavProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onPrevious}
          className="min-h-11 min-w-11"
          aria-label="Previous day"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-2 px-4 py-2 bg-midnight rounded-[20px] [corner-shape:squircle] min-h-11">
          <Calendar className="w-4 h-4 text-violet-glow" aria-hidden />
          <span className="text-sm font-medium text-cloud">{formattedDate}</span>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={onNext}
          className="min-h-11 min-w-11"
          aria-label="Next day"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onToday}
        className={cn(uiOutlineBtn, 'min-h-11')}
      >
        Today
      </Button>
    </div>
  )
}
