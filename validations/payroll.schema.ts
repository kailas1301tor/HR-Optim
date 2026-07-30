// validations/payroll.schema.ts
import { z } from 'zod'
import {
  LIMIT_DESCRIPTION,
  LIMIT_REASON,
  LIMIT_SHORT_NAME,
  requiredTrimmedString,
} from './field-limits'

export const payrollAdjustmentSchema = z.object({
  adjustment_type: z.enum(['Allowance', 'Deduction']),
  description: requiredTrimmedString('Description', LIMIT_SHORT_NAME),
  amount: z
    .string()
    .trim()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: 'Amount must be greater than zero',
    }),
  reason: requiredTrimmedString('Reason', LIMIT_REASON),
})

export const generatePayrollSchema = z.object({
  month: z.coerce
    .number()
    .int({ message: 'Month must be a whole number' })
    .min(1, { message: 'Month must be between 1 and 12' })
    .max(12, { message: 'Month must be between 1 and 12' }),
  year: z.coerce
    .number()
    .int({ message: 'Year must be a whole number' })
    .min(2000, { message: 'Year must be between 2000 and 2100' })
    .max(2100, { message: 'Year must be between 2000 and 2100' }),
})

export type PayrollAdjustmentFormInput = z.infer<typeof payrollAdjustmentSchema>
export type GeneratePayrollFormInput = z.infer<typeof generatePayrollSchema>
