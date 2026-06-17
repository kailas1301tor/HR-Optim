// validations/holiday.schema.ts
import { z } from 'zod'
import { LIMIT_SHORT_NAME, requiredTrimmedString } from './field-limits'

export const holidaySchema = z.object({
  name: requiredTrimmedString('Holiday name', LIMIT_SHORT_NAME),
  date: z.string().trim().min(1, 'Date is required'),
})

export type HolidayInput = z.infer<typeof holidaySchema>
