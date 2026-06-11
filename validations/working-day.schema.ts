// validations/working-day.schema.ts
import { z } from 'zod'

export const workingDaySchema = z.object({
  name: z.string().trim().min(1, 'Day name is required'),
  is_working_day: z.boolean(),
})

export type WorkingDayInput = z.infer<typeof workingDaySchema>
