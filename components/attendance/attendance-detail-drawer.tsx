// components/attendance/attendance-detail-drawer.tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { STATUS_CONFIG, getShiftBadgeClassName } from './attendance-constants'
import { cn } from '@/lib/utils'
import { Clock, Coffee, LogIn, LogOut, Timer, MapPin, Activity } from 'lucide-react'
import type { AttendanceRecord } from '@/types/attendance'

function formatTo12Hour(time24: string | null): string {
  if (!time24) return '--:--'
  const [h, m] = time24.split(':')
  let hours = parseInt(h, 10)
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours.toString().padStart(2, '0')}:${m} ${ampm}`
}

function timeToPercent(time: string): number {
  if (!time) return 0
  const [h, m] = time.split(':')
  return ((parseInt(h, 10) * 60 + parseInt(m, 10)) / 1440) * 100
}

interface AttendanceDetailDrawerProps {
  record: AttendanceRecord | null
  date?: string
  onClose: () => void
}

export function AttendanceDetailDrawer({ record, date, onClose }: AttendanceDetailDrawerProps) {
  if (!record) return null

  const { status, shiftName } = record
  const statusConfig = STATUS_CONFIG[status] || STATUS_CONFIG.absent

  return (
    <Sheet open={!!record} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-5xl bg-midnight border-l border-border/40 p-0 flex flex-col h-full overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <SheetHeader className="p-6 border-b border-border/40 space-y-0 text-left bg-gradient-to-b from-violet-core/5 to-transparent">
            <div className="flex justify-between items-start mb-6">
              <SheetTitle className="text-lg font-semibold text-cloud">
                Attendance Details
              </SheetTitle>
              <div
                className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 bg-card/50 border border-border/50 text-slate-300"
              >
                <div className={cn('w-1.5 h-1.5 rounded-full', statusConfig.dotColor)} />
                {statusConfig.label}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="w-14 h-14 ring-2 ring-violet-core/20">
                <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-lg">
                  {record.initials}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold text-cloud truncate">
                    {record.employeeName}
                  </h3>
                  <span className="px-1.5 py-0.5 rounded bg-violet-core/10 border border-violet-core/20 font-mono text-[10px] text-violet-glow font-semibold shrink-0">
                    {record.employeeId}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {record.department} {record.role ? `• ${record.role}` : ''}
                </p>
                {(record.email || record.phoneNumber) && (
                  <p className="text-xs text-muted-foreground/80 mt-1 truncate">
                    {record.email} {record.email && record.phoneNumber ? '•' : ''} {record.phoneNumber}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-border/40 flex items-center justify-between">
              <div className="text-xs text-slate-400">Date</div>
              <div className="text-sm font-medium text-cloud">{record.date || date || '--'}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-slate-400">First Check-in</div>
              <div className="text-sm font-mono text-cloud">{record.timeIn ? formatTo12Hour(record.timeIn) : '--:--'}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-slate-400">Last Check-out</div>
              <div className="text-sm font-mono text-cloud">{record.timeOut ? formatTo12Hour(record.timeOut) : '--:--'}</div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-slate-400">Shift</div>
              <span
                className={cn(
                  'px-2 py-0.5 rounded text-[11px] font-medium',
                  getShiftBadgeClassName(shiftName),
                )}
              >
                {shiftName}
              </span>
            </div>
          </SheetHeader>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-card/50 border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Clock className="w-4 h-4 text-emerald-400 mb-2" />
                <span className="text-lg font-mono font-medium text-cloud">
                  {record.workHours || '--'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
                  Work
                </span>
              </div>
              <div className="bg-card/50 border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Coffee className="w-4 h-4 text-orange-400 mb-2" />
                <span className="text-lg font-mono font-medium text-cloud">
                  {record.breakHours || '--'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
                  Break
                </span>
              </div>
              <div className="bg-card/50 border border-border/50 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <Timer className="w-4 h-4 text-violet-400 mb-2" />
                <span className="text-lg font-mono font-medium text-cloud">
                  {record.totalHours || '--'}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 mt-1">
                  Total
                </span>
              </div>
            </div>

            {record.timings && record.timings.length > 0 && (
              <div className="mb-8">
                <h4 className="text-sm font-medium text-cloud mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  Daily Activity (24h)
                </h4>
                <TooltipProvider>
                  <div className="relative w-full h-8 bg-slate-800/50 rounded-md border border-border/50 overflow-hidden">
                    {/* Hour ticks */}
                    {Array.from({ length: 24 }).map((_, hour) => (
                      <div 
                        key={hour} 
                        className={cn(
                          "absolute top-0 bottom-0 border-l border-border/30",
                          hour % 4 === 0 ? "border-border/60" : "border-border/20"
                        )} 
                        style={{ left: `${(hour / 24) * 100}%` }} 
                      />
                    ))}
                    {/* Activity blocks */}
                    {record.timings.map((t, idx) => {
                      const startPct = t.in ? timeToPercent(t.in) : 0;
                      const endPct = t.out ? timeToPercent(t.out) : timeToPercent('23:59');
                      const width = Math.max(0, endPct - startPct);
                      return (
                        <Tooltip key={idx}>
                          <TooltipTrigger asChild>
                            <div
                              className="absolute top-0 bottom-0 bg-violet-core/80 rounded-sm border border-violet-glow/30 hover:bg-violet-glow/80 transition-colors cursor-help"
                              style={{ left: `${startPct}%`, width: `${width}%` }}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-midnight border-border text-cloud" side="top">
                            <p className="text-xs font-medium">
                              {formatTo12Hour(t.in)} - {t.out ? formatTo12Hour(t.out) : 'Ongoing'}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                </TooltipProvider>
                <div className="relative w-full h-4 mt-1.5 text-[10px] text-slate-500 font-mono">
                  {[0, 4, 8, 12, 16, 20, 24].map((hour) => {
                    let label = '';
                    if (hour === 0) label = '12 AM';
                    else if (hour === 12) label = '12 PM';
                    else if (hour === 24) label = '11:59 PM';
                    else label = `${hour % 12} ${hour > 12 ? 'PM' : 'AM'}`;
                    
                    let classes = "absolute top-0 -translate-x-1/2 whitespace-nowrap";
                    let style: React.CSSProperties = { left: `${(hour / 24) * 100}%` };
                    
                    if (hour === 0) {
                      classes = "absolute top-0 left-0 whitespace-nowrap";
                      style = {};
                    } else if (hour === 24) {
                      classes = "absolute top-0 right-0 whitespace-nowrap";
                      style = {};
                    }
                    
                    return (
                      <span key={hour} className={classes} style={style}>
                        {label}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium text-cloud mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-violet-glow" />
                Timeline
              </h4>
              {record.timings && record.timings.length > 0 ? (
                <div className="space-y-4 pl-2 border-l-2 border-border/40 ml-2">
                  {record.timings.map((timing, idx) => (
                    <div key={idx} className="relative pl-6">
                      <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-violet-core border border-midnight" />
                      <div className="bg-card/30 border border-border/50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-xs text-slate-400">Check In</span>
                          </div>
                          <span className="text-sm font-mono text-cloud">{formatTo12Hour(timing.in)}</span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-border/30">
                          <div className="flex items-center gap-2">
                            <LogOut className="w-3.5 h-3.5 text-orange-400" />
                            <span className="text-xs text-slate-400">Check Out</span>
                          </div>
                          <span className="text-sm font-mono text-cloud">{formatTo12Hour(timing.out)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-slate-500 bg-card/30 rounded-xl border border-dashed border-border/50">
                  No timeline data available for this record.
                </div>
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
