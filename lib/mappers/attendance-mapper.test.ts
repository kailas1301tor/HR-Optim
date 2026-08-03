// lib/mappers/attendance-mapper.test.ts
import { describe, expect, it } from 'vitest'
import { normalizeAttendanceStatus } from './attendance-mapper'

describe('normalizeAttendanceStatus', () => {
  it('maps half day leave variants', () => {
    expect(normalizeAttendanceStatus('On a Half Day Leave')).toBe('half_day_leave')
    expect(normalizeAttendanceStatus('Half Day Leave')).toBe('half_day_leave')
    expect(normalizeAttendanceStatus('half-day leave')).toBe('half_day_leave')
  })

  it('maps work from home variants', () => {
    expect(normalizeAttendanceStatus('Work From Home')).toBe('wfh')
    expect(normalizeAttendanceStatus('WFH')).toBe('wfh')
    expect(normalizeAttendanceStatus('workfromhome')).toBe('wfh')
    expect(normalizeAttendanceStatus('work-from-home')).toBe('wfh')
  })

  it('maps late and work from home compound status', () => {
    expect(normalizeAttendanceStatus('Late & Work From Home')).toBe('late_wfh')
  })

  it('maps standard statuses', () => {
    expect(normalizeAttendanceStatus('Present')).toBe('present')
    expect(normalizeAttendanceStatus('Late')).toBe('late')
    expect(normalizeAttendanceStatus('Absent')).toBe('absent')
    expect(normalizeAttendanceStatus('On Leave')).toBe('leave')
    expect(normalizeAttendanceStatus('Holiday')).toBe('holiday')
    expect(normalizeAttendanceStatus('Weekend')).toBe('weekend')
  })

  it('falls back to absent for unknown statuses', () => {
    expect(normalizeAttendanceStatus('Unknown Status')).toBe('absent')
    expect(normalizeAttendanceStatus('')).toBe('absent')
  })
})
