// validations/request-action.schema.ts
import { z } from 'zod'
import { LIMIT_REASON, minTrimmedString } from './field-limits'

export const rejectReasonSchema = z.object({
  reason: minTrimmedString('Rejection reason', 3, LIMIT_REASON),
})

export type RejectReasonInput = z.infer<typeof rejectReasonSchema>
