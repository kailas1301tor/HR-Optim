'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { CommonEmptyState } from '@/components/common'
import { Calendar } from 'lucide-react'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import type { DashboardAttendanceDay } from '@/types/dashboard'

function getColorIntensity(value: number, max: number): string {
  if (value === 0 || max === 0) return 'bg-midnight'
  const ratio = value / max
  if (ratio < 0.25) return 'bg-violet-core/20'
  if (ratio < 0.5) return 'bg-violet-core/40'
  if (ratio < 0.75) return 'bg-violet-core/60'
  return 'bg-violet-core'
}

interface AttendanceHeatmapProps {
  days: DashboardAttendanceDay[]
  isLoading?: boolean
}

export function AttendanceHeatmap({ days, isLoading = false }: AttendanceHeatmapProps) {
  const { weeks, maxPresent } = useMemo(() => {
    const max = Math.max(...days.map((d) => d.presentCount), 1)
    const weekChunks: DashboardAttendanceDay[][] = []
    for (let i = 0; i < days.length; i += 7) {
      weekChunks.push(days.slice(i, i + 7))
    }
    return { weeks: weekChunks.slice(-12), maxPresent: max }
  }, [days])

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6 min-h-[220px]">
        <h3 className="text-lg font-semibold text-cloud mb-1">Attendance Overview</h3>
        <p className="text-sm text-muted-foreground mb-6">Recent attendance distribution</p>
        <Skeleton className={cn('h-[120px] w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    )
  }

  if (days.length === 0) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6">
        <h3 className="text-lg font-semibold text-cloud mb-1">Attendance Overview</h3>
        <CommonEmptyState icon={Calendar} title="No attendance data" description="Attendance overview is not available yet." />
      </div>
    )
  }

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <h3 className="text-lg font-semibold text-cloud mb-1">Attendance Overview</h3>
      <p className="text-sm text-muted-foreground mb-6">Recent attendance distribution</p>

      <div className="flex gap-2">
        <div className="flex flex-col gap-1 text-[10px] text-slate-500 pt-6">
          {dayLabels.map((day) => (
            <div key={day} className="h-3 flex items-center">
              {day}
            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {weekIndex % 4 === 0 && week[0]?.date ? (
                  <div className="h-5 text-[10px] text-slate-500">
                    {new Date(week[0].date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                ) : (
                  <div className="h-5" />
                )}
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                    className={cn(
                      'w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-violet-glow',
                      getColorIntensity(day.presentCount, maxPresent),
                    )}
                    title={`${day.date}: ${day.presentCount} present`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 mt-4 text-[10px] text-slate-500">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 rounded-sm bg-midnight" />
          <div className="w-3 h-3 rounded-sm bg-violet-core/20" />
          <div className="w-3 h-3 rounded-sm bg-violet-core/40" />
          <div className="w-3 h-3 rounded-sm bg-violet-core/60" />
          <div className="w-3 h-3 rounded-sm bg-violet-core" />
        </div>
        <span>More</span>
      </div>
    </motion.div>
  )
}
