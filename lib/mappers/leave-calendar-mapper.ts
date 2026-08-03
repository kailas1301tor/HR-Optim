// lib/mappers/leave-calendar-mapper.ts
import { eachDayOfInterval, startOfDay } from 'date-fns'
import { formatApiDate, parseApiDate } from '@/lib/helpers/format-api-date'
import type {
  LeaveCalendarEvent,
  LeaveCalendarEventKind,
  LeaveCalendarViewModel,
} from '@/types/request'
import type { Holiday } from '@/types/settings'

const HOLIDAY_LIST_KEYS = [
  'holidays',
  'holiday_list',
  'company_holidays',
  'holiday_dates',
  'holiday_events',
  'events',
] as const

const LEGACY_LEAVE_LIST_KEYS = [
  'leave_requests',
  'existing_leaves',
  'approved_leaves',
  'leaves',
  'existing_leave',
  'leave_dates',
  'booked_leaves',
  'approved_leave',
] as const

interface RequestBucketConfig {
  keys: readonly string[]
  kind: LeaveCalendarEventKind
  statusLabel: string
  blocksSelection: boolean
  isWfh: boolean
}

const LEAVE_REQUEST_BUCKETS: RequestBucketConfig[] = [
  {
    keys: ['pending_leave_requests'],
    kind: 'leave_pending',
    statusLabel: 'Pending',
    blocksSelection: true,
    isWfh: false,
  },
  {
    keys: ['approved_leave_requests'],
    kind: 'leave_approved',
    statusLabel: 'Approved',
    blocksSelection: true,
    isWfh: false,
  },
  {
    keys: ['rejected_leave_requests'],
    kind: 'leave_rejected',
    statusLabel: 'Rejected',
    blocksSelection: false,
    isWfh: false,
  },
  {
    keys: ['deleted_leave_requests'],
    kind: 'leave_rejected',
    statusLabel: 'Deleted',
    blocksSelection: false,
    isWfh: false,
  },
]

const WFH_REQUEST_BUCKETS: RequestBucketConfig[] = [
  {
    keys: ['pending_wfh_requests'],
    kind: 'wfh_pending',
    statusLabel: 'Pending',
    blocksSelection: true,
    isWfh: true,
  },
  {
    keys: ['approved_wfh_requests'],
    kind: 'wfh_approved',
    statusLabel: 'Approved',
    blocksSelection: true,
    isWfh: true,
  },
  {
    keys: ['rejected_wfh_requests'],
    kind: 'wfh_rejected',
    statusLabel: 'Rejected',
    blocksSelection: false,
    isWfh: true,
  },
  {
    keys: ['deleted_wfh_requests'],
    kind: 'wfh_rejected',
    statusLabel: 'Deleted',
    blocksSelection: false,
    isWfh: true,
  },
]

const ALL_REQUEST_BUCKETS = [...LEAVE_REQUEST_BUCKETS, ...WFH_REQUEST_BUCKETS]

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  return value as Record<string, unknown>
}

function asList(value: unknown): unknown[] {
  return Array.isArray(value) ? value : []
}

function mergeLists(raw: Record<string, unknown>, keys: readonly string[]): unknown[] {
  const merged: unknown[] = []
  for (const key of keys) {
    merged.push(...asList(raw[key]))
  }
  return merged
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
    events.push({ date: formatApiDate(parsed), label, kind: 'holiday' })
  }

  return events
}

function buildRequestLabel(
  rec: Record<string, unknown>,
  config: RequestBucketConfig,
): string {
  if (config.isWfh) {
    return `Work From Home (${config.statusLabel})`
  }

  const leaveType = pickString(rec, ['leave_type', 'leaveType', 'type']) ?? 'Leave'
  return `${leaveType} (${config.statusLabel})`
}

function mapRequestEventsFromBuckets(
  data: Record<string, unknown>,
  buckets: RequestBucketConfig[],
): LeaveCalendarEvent[] {
  const events: LeaveCalendarEvent[] = []

  for (const bucket of buckets) {
    const items = mergeLists(data, bucket.keys)
    for (const item of items) {
      const rec = asRecord(item)
      if (!rec) continue

      const fromDate = pickString(rec, ['from_date', 'start_date', 'date'])
      const toDate = pickString(rec, ['to_date', 'end_date']) ?? fromDate
      if (!fromDate || !toDate) continue

      const label = buildRequestLabel(rec, bucket)
      const days = expandLeaveRange(fromDate, toDate)

      for (const day of days) {
        events.push({
          date: formatApiDate(day),
          label,
          kind: bucket.kind,
        })
      }
    }
  }

  return events
}

function mapBlockingDatesFromBuckets(
  data: Record<string, unknown>,
  buckets: RequestBucketConfig[],
): Date[] {
  const dates: Date[] = []
  const seen = new Set<string>()

  for (const bucket of buckets) {
    if (!bucket.blocksSelection) continue

    const items = mergeLists(data, bucket.keys)
    for (const item of items) {
      const rec = asRecord(item)
      if (!rec) continue

      const fromDate = pickString(rec, ['from_date', 'start_date', 'date'])
      const toDate = pickString(rec, ['to_date', 'end_date']) ?? fromDate
      if (!fromDate || !toDate) continue

      addUniqueDates(dates, seen, expandLeaveRange(fromDate, toDate))
    }
  }

  return dates
}

function mapLegacyLeaveEvents(items: unknown[]): LeaveCalendarEvent[] {
  const events: LeaveCalendarEvent[] = []

  for (const item of items) {
    if (typeof item === 'string') {
      const parsed = parseApiDate(item)
      if (!parsed) continue
      events.push({
        date: formatApiDate(parsed),
        label: 'Leave (Approved)',
        kind: 'leave_approved',
      })
      continue
    }

    const rec = asRecord(item)
    if (!rec) continue

    const fromDate = pickString(rec, ['from_date', 'start_date', 'date'])
    const toDate = pickString(rec, ['to_date', 'end_date']) ?? fromDate
    if (!fromDate || !toDate) continue

    const leaveType = pickString(rec, ['leave_type', 'leaveType', 'type']) ?? 'Leave'
    const status = pickString(rec, ['status'])?.toLowerCase() ?? 'approved'
    const kind: LeaveCalendarEventKind =
      status === 'pending'
        ? 'leave_pending'
        : status === 'rejected'
          ? 'leave_rejected'
          : 'leave_approved'
    const statusLabel =
      status === 'pending' ? 'Pending' : status === 'rejected' ? 'Rejected' : 'Approved'
    const label = `${leaveType} (${statusLabel})`
    const days = expandLeaveRange(fromDate, toDate)

    for (const day of days) {
      events.push({ date: formatApiDate(day), label, kind })
    }
  }

  return events
}

function mapLegacyBlockingDates(items: unknown[]): Date[] {
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

    const status = pickString(rec, ['status'])?.toLowerCase() ?? 'approved'
    if (status === 'rejected') continue

    const fromDate = pickString(rec, ['from_date', 'start_date', 'date'])
    const toDate = pickString(rec, ['to_date', 'end_date']) ?? fromDate
    if (!fromDate || !toDate) continue

    addUniqueDates(dates, seen, expandLeaveRange(fromDate, toDate))
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

  const requestEvents = mapLegacyLeaveEvents(leaveItems)

  return {
    holidayEvents: mapHolidayEvents(holidayItems),
    requestEvents,
    existingLeaveDates: mapLegacyBlockingDates(leaveItems),
  }
}

export function mapLeaveCalendarFromApi(raw: unknown): LeaveCalendarViewModel {
  const empty: LeaveCalendarViewModel = {
    holidayEvents: [],
    requestEvents: [],
    existingLeaveDates: [],
  }

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

  const holidayItems = mergeLists(data, HOLIDAY_LIST_KEYS)
  const holidayEvents = mapHolidayEvents(holidayItems.length > 0 ? holidayItems : pickList(data, HOLIDAY_LIST_KEYS))

  const requestEvents = mapRequestEventsFromBuckets(data, ALL_REQUEST_BUCKETS)
  const blockingDates = mapBlockingDatesFromBuckets(data, ALL_REQUEST_BUCKETS)

  if (requestEvents.length > 0 || blockingDates.length > 0) {
    return { holidayEvents, requestEvents, existingLeaveDates: blockingDates }
  }

  const legacyLeaveItems = pickList(data, LEGACY_LEAVE_LIST_KEYS)
  if (legacyLeaveItems.length === 0) {
    return { holidayEvents, requestEvents: [], existingLeaveDates: [] }
  }

  return {
    holidayEvents,
    requestEvents: mapLegacyLeaveEvents(legacyLeaveItems),
    existingLeaveDates: mapLegacyBlockingDates(legacyLeaveItems),
  }
}

/** @deprecated Used by settings masters only — leave form uses leave-calendar API */
export function holidaysToDates(holidays: Holiday[]): Date[] {
  return holidays
    .map((holiday) => parseApiDate(holiday.date))
    .filter((date): date is Date => date !== null)
}
