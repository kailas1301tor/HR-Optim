// lib/mappers/leave-calendar-mapper.ts
import { eachDayOfInterval, startOfDay } from 'date-fns'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import type { LeaveCalendarEvent, LeaveCalendarViewModel } from '@/types/request'
import type { Holiday } from '@/types/settings'

const HOLIDAY_LIST_KEYS = [
  'holidays',
  'holiday_list',
  'company_holidays',
  'holiday_dates',
  'holiday_events',
  'events',
] as const

const LEAVE_LIST_KEYS = [
  'leave_requests',
  'existing_leaves',
  'approved_leaves',
  'leaves',
  'existing_leave',
  'leave_dates',
  'booked_leaves',
  'approved_leave',
] as const

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function pickList(raw: Record<string, unknown>, keys: readonly string[]): unknown[] {
  for (const key of keys) {
    const list = asList(raw[key])
    if (list.length > 0) return list
  }
  return []
}

function pickString(raw: Record<string, unknown>, keys: readonly string[]): string | null {
  for (const key of keys) {
    const val = raw[key]
    if (typeof val === 'string' && val.trim()) return val.trim()
  }
  return null
}

function mapHolidayEvents(items: unknown[]): LeaveCalendarEvent[] {
  const events: LeaveCalendarEvent[] = []

  for (const item of items) {
    const rec = asRecord(item)
    if (!rec) continue

    const dateStr = pickString(rec, ['date', 'holiday_date', 'holidayDate'])
    if (!dateStr) continue

    const parsed = parseApiDate(dateStr)
    if (!parsed) continue

    const label = pickString(rec, ['name', 'holiday_name', 'title', 'label']) ?? 'Holiday'
    events.push({ date: formatApiDate(parsed), label })
  }

  return events
}

function expandLeaveRange(fromDate: string, toDate: string): Date[] {
  const from = parseApiDate(fromDate)
  const to = parseApiDate(toDate)
  if (!from || !to) return []

  const start = from <= to ? from : to
  const end = from <= to ? to : from

  return eachDayOfInterval({ start: startOfDay(start), end: startOfDay(end) })
}

function addUniqueDates(target: Date[], seen: Set<string>, dates: Date[]): void {
  for (const date of dates) {
    const key = formatApiDate(date)
    if (seen.has(key)) continue
    seen.add(key)
    target.push(date)
  }
}

function mapExistingLeaveDates(items: unknown[]): Date[] {
  const dates: Date[] = []
  const seen = new Set<string>()

  for (const item of items) {
    if (typeof item === 'string') {
      const parsed = parseApiDate(item)
      if (parsed) addUniqueDates(dates, seen, [parsed])
      continue
    }

    const rec = asRecord(item)
    if (!rec) continue

    const fromDate = pickString(rec, ['from_date', 'start_date', 'date'])
    const toDate = pickString(rec, ['to_date', 'end_date'])

    if (fromDate && toDate) {
      addUniqueDates(dates, seen, expandLeaveRange(fromDate, toDate))
      continue
    }

    if (fromDate) {
      const parsed = parseApiDate(fromDate)
      if (parsed) addUniqueDates(dates, seen, [parsed])
    }
  }

  return dates
}

function isLeaveLikeRecord(rec: Record<string, unknown>): boolean {
  return Boolean(pickString(rec, ['from_date', 'start_date', 'to_date', 'end_date']))
}

function isHolidayLikeRecord(rec: Record<string, unknown>): boolean {
  const hasDate = Boolean(pickString(rec, ['date', 'holiday_date', 'holidayDate']))
  return hasDate && !isLeaveLikeRecord(rec)
}

function mapLeaveCalendarArray(payload: unknown[]): LeaveCalendarViewModel {
  const holidayItems = payload.filter((item) => {
    const rec = asRecord(item)
    return rec ? isHolidayLikeRecord(rec) : false
  })

  const leaveItems = payload.filter((item) => {
    const rec = asRecord(item)
    return rec ? isLeaveLikeRecord(rec) : typeof item === 'string'
  })

  return {
    holidayEvents: mapHolidayEvents(holidayItems),
    existingLeaveDates: mapExistingLeaveDates(leaveItems),
  }
}

export function mapLeaveCalendarFromApi(raw: unknown): LeaveCalendarViewModel {
  const empty: LeaveCalendarViewModel = { holidayEvents: [], existingLeaveDates: [] }

  const root = asRecord(raw)
  let payload: unknown = raw

  if (root?.results !== undefined) {
    const results = asRecord(root.results)
    payload = results?.data ?? raw
  } else if (root?.data !== undefined) {
    payload = root.data
  }

  if (Array.isArray(payload)) {
    return mapLeaveCalendarArray(payload)
  }

  const data = asRecord(payload)
  if (!data) return empty

  const holidayItems = pickList(data, HOLIDAY_LIST_KEYS)
  const leaveItems = pickList(data, LEAVE_LIST_KEYS)

  const holidayEvents = mapHolidayEvents(holidayItems)
  const existingLeaveDates = mapExistingLeaveDates(leaveItems)

  return { holidayEvents, existingLeaveDates }
}

/** @deprecated Used by settings masters only — leave form uses leave-calendar API */
export function holidaysToDates(holidays: Holiday[]): Date[] {
  return holidays
    .map((holiday) => parseApiDate(holiday.date))
    .filter((date): date is Date => date !== null)
}
