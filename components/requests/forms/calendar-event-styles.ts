// components/requests/forms/calendar-event-styles.ts
import type { LeaveCalendarEventKind } from '@/types/request'

export const CALENDAR_EVENT_CHIP_CLASSES: Record<LeaveCalendarEventKind, string> = {
  holiday: 'bg-violet-core/80 text-white',
  leave_pending: 'bg-amber-400/80 text-white',
  leave_approved: 'bg-lime-500/80 text-white',
  leave_rejected: 'bg-slate-500/60 text-slate-200',
  wfh_pending: 'bg-sky-400/80 text-white',
  wfh_approved: 'bg-sky-500/80 text-white',
  wfh_rejected: 'bg-slate-500/60 text-slate-200',
}

export interface CalendarLegendItem {
  kind: LeaveCalendarEventKind
  label: string
  description: string
}

export const CALENDAR_LEGEND_ITEMS: CalendarLegendItem[] = [
  {
    kind: 'holiday',
    label: 'Holiday',
    description: 'Company holiday — office closed',
  },
  {
    kind: 'leave_pending',
    label: 'Leave · Pending',
    description: 'Awaiting approval (amber)',
  },
  {
    kind: 'leave_approved',
    label: 'Leave · Approved',
    description: 'Confirmed time off (green)',
  },
  {
    kind: 'leave_rejected',
    label: 'Leave · Rejected',
    description: 'Not approved — shown for reference only (gray)',
  },
  {
    kind: 'wfh_pending',
    label: 'WFH · Pending',
    description: 'Work from home awaiting approval (sky blue)',
  },
  {
    kind: 'wfh_approved',
    label: 'WFH · Approved',
    description: 'Approved remote work day (sky blue)',
  },
  {
    kind: 'wfh_rejected',
    label: 'WFH · Rejected',
    description: 'Not approved — shown for reference only (gray)',
  },
]

export const CALENDAR_UI_LEGEND_ITEMS = [
  {
    id: 'unavailable',
    swatchClass: 'bg-muted ring-1 ring-inset ring-border/80 opacity-50',
    label: 'Unavailable',
    description: 'Booked leave, WFH, or holiday — cannot be selected',
  },
  {
    id: 'selected-range',
    swatchClass: 'bg-violet-core/25 ring-1 ring-violet-core/40',
    label: 'Selected range',
    description: 'Dates you are choosing for this request (purple highlight)',
  },
  {
    id: 'today',
    swatchClass: 'bg-red-500 rounded-full',
    label: 'Today',
    description: "Today's date (red circle)",
  },
] as const

export function getCalendarEventChipClass(kind?: LeaveCalendarEventKind): string {
  if (!kind) return CALENDAR_EVENT_CHIP_CLASSES.holiday
  return CALENDAR_EVENT_CHIP_CLASSES[kind]
}
