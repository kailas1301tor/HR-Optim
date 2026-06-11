// validations/holiday.schema.ts
import { z } from 'zod'

export const holidaySchema = z.object({
  name: z.string().trim().min(1, 'Holiday name is required'),
  date: z.string().trim().min(1, 'Date is required'),
})

export type HolidayInput = z.infer<typeof holidaySchema>
