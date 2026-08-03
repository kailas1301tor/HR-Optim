// lib/helpers/calendar-blocked-dates.ts
import { eachDayOfInterval, startOfDay } from 'date-fns'
import type { Matcher } from 'react-day-picker'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import type { LeaveCalendarEvent } from '@/types/request'

export const BLOCKED_RANGE_MESSAGE =
  'Selected dates overlap with existing leave, WFH, or a holiday'

export function buildBlockedDateSet(dates: Date[]): Set<string> {
  const blocked = new Set<string>()
  for (const date of dates) {
    blocked.add(formatApiDate(date))
  }
  return blocked
}

export function mergeBlockedDateSets(...sets: Set<string>[]): Set<string> {
  const merged = new Set<string>()
  for (const set of sets) {
    for (const date of set) {
      merged.add(date)
    }
  }
  return merged
}

export function buildBlockedDatesFromCalendar(
  existingLeaveDates: Date[],
  holidayEvents: LeaveCalendarEvent[],
): Date[] {
  const seen = new Set<string>()
  const dates: Date[] = []

  const addDate = (date: Date): void => {
    const key = formatApiDate(date)
    if (seen.has(key)) return
    seen.add(key)
    dates.push(date)
  }

  for (const date of existingLeaveDates) {
    addDate(date)
  }

  for (const event of holidayEvents) {
    const parsed = parseApiDate(event.date)
    if (parsed) addDate(parsed)
  }

  return dates
}

export function isBlockedDate(dateStr: string, blocked: Set<string>): boolean {
  return blocked.has(dateStr)
}

export function rangeOverlapsBlocked(
  from: string,
  to: string,
  blocked: Set<string>,
): boolean {
  if (!from || !to || blocked.size === 0) return false

  const fromDate = parseApiDate(from)
  const toDate = parseApiDate(to)
  if (!fromDate || !toDate) return false

  const start = fromDate <= toDate ? fromDate : toDate
  const end = fromDate <= toDate ? toDate : fromDate

  const days = eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) })
  return days.some((day) => blocked.has(formatApiDate(day)))
}

export function toDatePickerDisabledMatchers(blocked: Set<string>): Matcher[] {
  if (blocked.size === 0) return []

  return [
    (date: Date) => blocked.has(formatApiDate(startOfDay(date))),
  ]
}
