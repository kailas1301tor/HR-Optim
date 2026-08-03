// lib/mappers/leave-calendar-mapper.test.ts
import { describe, expect, it } from 'vitest'
import { formatApiDate } from '@/lib/helpers/format-api-date'
import { mapLeaveCalendarFromApi } from './leave-calendar-mapper'

const sampleApiResponse = {
  message: 'Success',
  results: {
    data: {
      holidays: [
        { id: 2, name: 'new year', date: '2026-01-01' },
        { id: 1, name: 'Christmas Day', date: '2026-12-25' },
      ],
      pending_leave_requests: [
        {
          id: 609,
          leave_type: 'Annual Leave',
          from_date: '2026-06-16',
          to_date: '2026-06-16',
          status: 'Pending',
        },
        {
          id: 608,
          leave_type: 'Annual Leave',
          from_date: '2026-06-16',
          to_date: '2026-06-16',
          status: 'Pending',
        },
        {
          id: 5,
          leave_type: 'Annual Leave',
          from_date: '2026-06-25',
          to_date: '2026-06-25',
          status: 'Pending',
        },
      ],
      approved_leave_requests: [
        {
          id: 612,
          leave_type: 'Annual Leave',
          from_date: '2026-06-17',
          to_date: '2026-06-17',
          status: 'Approved',
        },
        {
          id: 611,
          leave_type: 'Annual Leave',
          from_date: '2026-06-17',
          to_date: '2026-06-17',
          status: 'Approved',
        },
        {
          id: 607,
          leave_type: 'Sick Leave',
          from_date: '2026-06-15',
          to_date: '2026-06-17',
          status: 'Approved',
        },
        {
          id: 606,
          leave_type: 'Sick Leave',
          from_date: '2026-05-12',
          to_date: '2026-05-14',
          status: 'Approved',
        },
      ],
      rejected_leave_requests: [
        {
          id: 610,
          leave_type: 'Annual Leave',
          from_date: '2026-06-16',
          to_date: '2026-06-16',
          status: 'Rejected',
        },
      ],
      deleted_leave_requests: [],
      pending_wfh_requests: [
        {
          id: 3,
          from_date: '2026-07-09',
          to_date: '2026-07-10',
          status: 'Pending',
        },
      ],
      approved_wfh_requests: [
        {
          id: 2,
          from_date: '2026-07-15',
          to_date: '2026-07-15',
          status: 'Approved',
        },
      ],
      rejected_wfh_requests: [],
      deleted_wfh_requests: [],
    },
  },
}

function eventDates(events: { date: string }[]): string[] {
  return [...new Set(events.map((event) => event.date))].sort()
}

describe('mapLeaveCalendarFromApi', () => {
  it('maps holidays from leave-calendar API', () => {
    const result = mapLeaveCalendarFromApi(sampleApiResponse)

    expect(eventDates(result.holidayEvents)).toEqual(['2026-01-01', '2026-12-25'])
    expect(result.holidayEvents[0]).toMatchObject({
      label: 'new year',
      kind: 'holiday',
    })
  })

  it('maps leave requests from all status buckets with labels', () => {
    const result = mapLeaveCalendarFromApi(sampleApiResponse)
    const leaveDates = eventDates(
      result.requestEvents.filter((event) => event.kind?.startsWith('leave_')),
    )

    expect(leaveDates).toEqual(
      expect.arrayContaining([
        '2026-05-12',
        '2026-05-13',
        '2026-05-14',
        '2026-06-15',
        '2026-06-16',
        '2026-06-17',
        '2026-06-25',
      ]),
    )

    const jun16Events = result.requestEvents.filter((event) => event.date === '2026-06-16')
    expect(jun16Events.some((event) => event.label === 'Annual Leave (Pending)')).toBe(true)
    expect(jun16Events.some((event) => event.label === 'Annual Leave (Rejected)')).toBe(true)
    expect(jun16Events.some((event) => event.label === 'Sick Leave (Approved)')).toBe(true)
  })

  it('maps WFH requests from status buckets', () => {
    const result = mapLeaveCalendarFromApi(sampleApiResponse)
    const wfhEvents = result.requestEvents.filter((event) => event.kind?.startsWith('wfh_'))

    expect(wfhEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          date: '2026-07-09',
          label: 'Work From Home (Pending)',
          kind: 'wfh_pending',
        }),
        expect.objectContaining({
          date: '2026-07-10',
          label: 'Work From Home (Pending)',
          kind: 'wfh_pending',
        }),
        expect.objectContaining({
          date: '2026-07-15',
          label: 'Work From Home (Approved)',
          kind: 'wfh_approved',
        }),
      ]),
    )
  })

  it('derives blocking dates from approved and pending leave/WFH only', () => {
    const result = mapLeaveCalendarFromApi(sampleApiResponse)
    const blockingDates = result.existingLeaveDates.map((date) => formatApiDate(date))

    expect(blockingDates).toEqual(
      expect.arrayContaining([
        '2026-05-12',
        '2026-05-13',
        '2026-05-14',
        '2026-06-15',
        '2026-06-16',
        '2026-06-17',
        '2026-06-25',
        '2026-07-09',
        '2026-07-10',
        '2026-07-15',
      ]),
    )
  })

  it('returns empty model for invalid payload', () => {
    expect(mapLeaveCalendarFromApi(null)).toEqual({
      holidayEvents: [],
      requestEvents: [],
      existingLeaveDates: [],
    })
  })
})
