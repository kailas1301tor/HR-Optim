// validations/attendance.schema.ts
import { z } from 'zod'
import { LIMIT_REASON, requiredTrimmedString } from './field-limits'

export const lateReasonSchema = z.object({
  reason: requiredTrimmedString('Reason', LIMIT_REASON),
})

export type LateReasonFormInput = z.infer<typeof lateReasonSchema>
