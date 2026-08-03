// lib/helpers/calendar-blocked-dates.test.ts
import { describe, expect, it } from 'vitest'
import { formatApiDate } from '@/lib/helpers/format-api-date'
import {
  buildBlockedDateSet,
  buildBlockedDatesFromCalendar,
  isBlockedDate,
  mergeBlockedDateSets,
  rangeOverlapsBlocked,
  toDatePickerDisabledMatchers,
} from './calendar-blocked-dates'

describe('calendar-blocked-dates', () => {
  const blocked = buildBlockedDateSet([
    new Date(2026, 6, 16),
    new Date(2026, 6, 17),
    new Date(2026, 0, 1),
  ])

  it('detects blocked single dates', () => {
    expect(isBlockedDate('2026-07-16', blocked)).toBe(true)
    expect(isBlockedDate('2026-07-18', blocked)).toBe(false)
  })

  it('detects range overlap with blocked dates', () => {
    expect(rangeOverlapsBlocked('2026-07-15', '2026-07-18', blocked)).toBe(true)
    expect(rangeOverlapsBlocked('2026-07-18', '2026-07-20', blocked)).toBe(false)
    expect(rangeOverlapsBlocked('2026-07-17', '2026-07-15', blocked)).toBe(true)
  })

  it('returns false for empty blocked set', () => {
    expect(rangeOverlapsBlocked('2026-07-15', '2026-07-18', new Set())).toBe(false)
  })

  it('merges blocked date sets', () => {
    const merged = mergeBlockedDateSets(
      buildBlockedDateSet([new Date(2026, 6, 16)]),
      buildBlockedDateSet([new Date(2026, 6, 17)]),
    )
    expect(merged.has('2026-07-16')).toBe(true)
    expect(merged.has('2026-07-17')).toBe(true)
    expect(merged.size).toBe(2)
  })

  it('builds blocked dates from leave and holidays', () => {
    const dates = buildBlockedDatesFromCalendar(
      [new Date(2026, 5, 16)],
      [{ date: '2026-01-01', label: 'New Year', kind: 'holiday' }],
    )
    const keys = dates.map((date) => formatApiDate(date))
    expect(keys).toContain('2026-06-16')
    expect(keys).toContain('2026-01-01')
  })

  it('creates date picker matchers for blocked dates', () => {
    const matchers = toDatePickerDisabledMatchers(blocked)
    expect(matchers.length).toBe(1)
    const matcher = matchers[0]
    expect(typeof matcher).toBe('function')
    if (typeof matcher === 'function') {
      expect(matcher(new Date(2026, 6, 16))).toBe(true)
      expect(matcher(new Date(2026, 6, 18))).toBe(false)
    }
  })
})
