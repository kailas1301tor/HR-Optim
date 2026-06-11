// lib/mappers/leave-calendar-mapper.ts
import { parseApiDate } from '@/lib/helpers/format-api-date'
import type { Holiday } from '@/types/settings'

export function holidaysToDates(holidays: Holiday[]): Date[] {
  return holidays
    .map((holiday) => parseApiDate(holiday.date))
    .filter((date): date is Date => date !== null)
}
