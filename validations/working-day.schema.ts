// validations/working-day.schema.ts
import { z } from 'zod'

export const workingDayConfigSchema = z.object({
  start_week_day: z.string().trim().min(1, 'Start weekday is required'),
  end_week_day: z.string().trim().min(1, 'End weekday is required'),
})

export type WorkingDayConfigInput = z.infer<typeof workingDayConfigSchema>
