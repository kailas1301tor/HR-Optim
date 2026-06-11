'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock } from '@/lib/ui/design-system'

// Generate attendance data for heatmap (12 weeks)
function generateAttendanceData() {
  const data: { date: string; value: number }[] = []
  const today = new Date()
  
  for (let week = 11; week >= 0; week--) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(today)
      date.setDate(date.getDate() - (week * 7 + (6 - day)))
      
      // Skip weekends with lower probability
      const isWeekend = day === 0 || day === 6
      const value = isWeekend 
        ? Math.random() > 0.7 ? Math.floor(Math.random() * 30) : 0
        : Math.floor(Math.random() * 70) + 30
      
      data.push({
        date: date.toISOString().split('T')[0],
        value,
      })
    }
  }
  
  return data
}

function getColorIntensity(value: number): string {
  if (value === 0) return 'bg-midnight'
  if (value < 25) return 'bg-violet-core/20'
  if (value < 50) return 'bg-violet-core/40'
  if (value < 75) return 'bg-violet-core/60'
  return 'bg-violet-core'
}

export function AttendanceHeatmap() {
  const [mounted, setMounted] = useState(false)
  const [attendanceData, setAttendanceData] = useState<{ date: string; value: number }[]>([])

  useEffect(() => {
    setAttendanceData(generateAttendanceData())
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6 min-h-[220px]">
        <h3 className="text-lg font-semibold text-cloud mb-1">Attendance Overview</h3>
        <p className="text-sm text-muted-foreground mb-6">Last 12 weeks attendance distribution</p>
        <Skeleton className={cn('h-[120px] w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    )
  }

  const weeks = []
  for (let i = 0; i < 12; i++) {
    weeks.push(attendanceData.slice(i * 7, (i + 1) * 7))
  }

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[32px] [corner-shape:squircle] p-6"
    >
      <h3 className="text-lg font-semibold text-cloud mb-1">Attendance Overview</h3>
      <p className="text-sm text-muted-foreground mb-6">Last 12 weeks attendance distribution</p>

      <div className="flex gap-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 text-[10px] text-slate-500 pt-6">
          {days.map((day) => (
            <div key={day} className="h-3 flex items-center">{day}</div>
          ))}
        </div>

        {/* Heatmap grid */}
        <div className="flex-1 overflow-x-auto">
          <div className="flex gap-1">
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {weekIndex % 4 === 0 && (
                  <div className="h-5 text-[10px] text-slate-500">
                    {new Date(week[0]?.date).toLocaleDateString('en-US', { month: 'short' })}
                  </div>
                )}
                {weekIndex % 4 !== 0 && <div className="h-5" />}
                {week.map((day, dayIndex) => (
                  <motion.div
                    key={`${weekIndex}-${dayIndex}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (weekIndex * 7 + dayIndex) * 0.002 }}
                    className={cn(
                      'w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-1 hover:ring-violet-glow',
                      getColorIntensity(day.value)
                    )}
                    title={`${day.date}: ${day.value}% attendance`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
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
