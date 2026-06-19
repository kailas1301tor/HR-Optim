// validations/leave-rule.schema.ts
import * as z from 'zod'
import { LIMIT_DESCRIPTION, requiredTrimmedString } from './field-limits'

export const leaveRuleSchema = z.object({
  leave_type: z.coerce.number().min(1, { message: 'Leave type is required' }),
  max_days: z.coerce.number().min(0, { message: 'Max days must be 0 or greater' }),
  is_carry_forward: z.boolean(),
  carry_forward_limit: z.coerce.number().min(0, { message: 'Carry forward limit must be 0 or greater' }),
  accrual_rate: z.coerce.number().min(0, { message: 'Accrual rate must be 0 or greater' }),
  accrual_frequency: z.string().min(1, { message: 'Accrual frequency is required' }),
  is_paid_leave: z.boolean(),
  description: requiredTrimmedString('Description', LIMIT_DESCRIPTION),
  is_document_required: z.boolean().default(false),
})

export type LeaveRuleInput = z.infer<typeof leaveRuleSchema>
