// validations/settings-master.schema.ts
import { z } from 'zod'
import {
  LIMIT_ADDRESS,
  LIMIT_DESCRIPTION,
  LIMIT_SHORT_NAME,
  LIMIT_WORKFLOW_STEP,
  requiredTrimmedString,
} from './field-limits'

export const masterNameSchema = requiredTrimmedString('Name', LIMIT_SHORT_NAME)

export const masterNameWithDescriptionSchema = z.object({
  name: requiredTrimmedString('Name', LIMIT_SHORT_NAME),
  description: z
    .string()
    .trim()
    .max(LIMIT_DESCRIPTION, { message: `Description must not exceed ${LIMIT_DESCRIPTION} characters` })
    .optional()
    .or(z.literal('')),
})

export const branchSchema = z.object({
  name: requiredTrimmedString('Name', LIMIT_SHORT_NAME),
  address: z
    .string()
    .trim()
    .max(LIMIT_ADDRESS, { message: `Address must not exceed ${LIMIT_ADDRESS} characters` })
    .optional()
    .or(z.literal('')),
})

export const designationSchema = z.object({
  name: requiredTrimmedString('Name', LIMIT_SHORT_NAME),
  description: z
    .string()
    .trim()
    .max(LIMIT_DESCRIPTION, { message: `Description must not exceed ${LIMIT_DESCRIPTION} characters` })
    .optional()
    .or(z.literal('')),
  departmentId: z.string().min(1, { message: 'Department is required' }),
})

export const vendorSchema = z.object({
  name: requiredTrimmedString('Name', LIMIT_SHORT_NAME),
  assetTypeId: z.string().min(1, { message: 'Asset type is required' }),
})

export const shiftPolicySchema = z.object({
  name: requiredTrimmedString('Policy name', LIMIT_SHORT_NAME),
  fromMinutes: z.coerce.number().min(0, { message: 'From minutes is required' }),
  toMinutes: z.coerce.number().min(0, { message: 'To minutes is required' }),
  value: requiredTrimmedString('Value', LIMIT_SHORT_NAME),
})

export const shiftSchema = z.object({
  name: requiredTrimmedString('Shift name', LIMIT_SHORT_NAME),
  startTime: z.string().min(1, { message: 'Start time is required' }),
  endTime: z.string().min(1, { message: 'End time is required' }),
})

export const roleNameSchema = requiredTrimmedString('Role name', LIMIT_SHORT_NAME)

export const workflowNameSchema = requiredTrimmedString('Workflow name', LIMIT_SHORT_NAME)

export const workflowStepSchema = requiredTrimmedString('Step', LIMIT_WORKFLOW_STEP)
