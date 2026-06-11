// validations/pay-rule.schema.ts
import { z } from 'zod'
import { FIXED_CALCULATE_TYPE } from '@/types/settings'

export const payRuleSchema = z
  .object({
    name: z.string().trim().min(1, 'Rule name is required'),
    category: z.string().trim().min(1, 'Category is required'),
    trigger_basis: z.string().trim().min(1, 'Trigger basis is required'),
    calculate_type: z.string().trim().min(1, 'Calculation type is required'),
    value: z
      .string()
      .trim()
      .min(1, 'Value is required')
      .refine((val) => !Number.isNaN(Number(val)), 'Value must be a valid number'),
    base: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.calculate_type !== FIXED_CALCULATE_TYPE && !data.base?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Base is required for percentage calculation',
        path: ['base'],
      })
    }
  })

export type PayRuleInput = z.infer<typeof payRuleSchema>
