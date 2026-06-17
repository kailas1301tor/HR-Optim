// validations/field-limits.ts
import { z } from 'zod'

export const LIMIT_SHORT_NAME = 100
export const LIMIT_USERNAME = 150
export const LIMIT_FULL_NAME = 100
export const LIMIT_DOCUMENT_NUMBER = 50
export const LIMIT_REASON = 500
export const LIMIT_DESCRIPTION = 2000
export const LIMIT_PURPOSE = 500
export const LIMIT_ADDRESS = 500
export const LIMIT_REMARKS = 500
export const LIMIT_COVERAGE = 1000
export const LIMIT_PHONE = 20
export const LIMIT_ACCOUNT_NUMBER = 34
export const LIMIT_IFSC = 11
export const LIMIT_EMPLOYEE_ID = 50
export const LIMIT_WORKFLOW_STEP = 200

export const requiredTrimmedString = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, { message: `${label} is required` })
    .max(max, { message: `${label} must not exceed ${max} characters` })

export const optionalTrimmedString = (label: string, max: number) =>
  z
    .string()
    .max(max, { message: `${label} must not exceed ${max} characters` })
    .optional()
    .or(z.literal(''))

export const minTrimmedString = (label: string, min: number, max: number) =>
  z
    .string()
    .trim()
    .min(min, { message: `${label} must be at least ${min} characters` })
    .max(max, { message: `${label} must not exceed ${max} characters` })
