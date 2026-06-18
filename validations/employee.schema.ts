// validations/employee.schema.ts
import { z } from 'zod'
import {
  LIMIT_ACCOUNT_NUMBER,
  LIMIT_ADDRESS,
  LIMIT_EMPLOYEE_ID,
  LIMIT_FULL_NAME,
  LIMIT_IFSC,
  LIMIT_PHONE,
  LIMIT_SHORT_NAME,
  LIMIT_USERNAME,
  requiredTrimmedString,
} from './field-limits'

export const employeeSchema = z.object({
  id: z.string().optional(),
  username: requiredTrimmedString('Username', LIMIT_USERNAME),
  email: z.string().min(1, 'Email is required').trim().email('Invalid email address'),
  full_name: requiredTrimmedString('Full name', LIMIT_FULL_NAME),
  phone_number: requiredTrimmedString('Phone number', LIMIT_PHONE),
  role: z.string().min(1, 'Role is required'),
  department: z.string().min(1, 'Department is required'),
  designation: z.string().min(1, 'Designation is required'),
  employee_id: requiredTrimmedString('Employee ID', LIMIT_EMPLOYEE_ID),
  status: z.string().min(1, 'Status is required'),
  shift: z.string().min(1, 'Shift is required'),
  joined_date: z.string().min(1, 'Joined date is required'),
  employee_type: z.string().min(1, 'Employee type is required'),
  basic_salary: z.string().min(1, 'Basic salary is required'),
  accommodation: z.string().min(1, 'Accommodation is required'),
  date_of_birth: z.string().min(1, 'Date of birth is required'),
  nationality: z.string().min(1, 'Nationality is required'),
  address: requiredTrimmedString('Address', LIMIT_ADDRESS),

  bank_name: requiredTrimmedString('Bank name', LIMIT_SHORT_NAME),
  account_number: requiredTrimmedString('Account number', LIMIT_ACCOUNT_NUMBER),
  ifsc: requiredTrimmedString('IFSC code', LIMIT_IFSC),
  branch: requiredTrimmedString('Branch', LIMIT_SHORT_NAME),
})

export type EmployeeInput = z.infer<typeof employeeSchema>
