// types/employee.ts
import type { DropdownItem, StringDropdownItem } from '@/lib/types'

export type { DropdownItem }

export interface DropdownData {
  roles: DropdownItem[]
  departments: DropdownItem[]
  designations: (DropdownItem & { department_id?: number })[]
  shifts: DropdownItem[]
  employee_types: DropdownItem[]
  nationalities: DropdownItem[]
  status_choices: DropdownItem[]
  accommodation_choices: DropdownItem[]
  leave_types: (DropdownItem & { is_document_required?: boolean; is_paid_leave?: boolean })[]
  onboarding_document_types: DropdownItem[]
  offboarding_document_types: DropdownItem[]
  frequency_choices: StringDropdownItem[]
}

export interface DropdownResponse {
  message: string
  results: {
    data: DropdownData
  }
}

export interface CreateEmployeePayload {
  username: string
  email: string
  full_name: string
  phone_number: string
  role: number
  department: number
  designation: number
  employee_id: string
  status: string
  shift: number
  joined_date: string
  employee_type: number
  basic_salary: string
  accommodation: string
  date_of_birth: string
  nationality: number
  address: string
  is_tl?: boolean
  is_manual_attendance_enabled?: boolean
  bank_details: {
    bank_name: string
    account_number: string
    ifsc: string
    branch: string
  }
}

export interface EmployeeListParams {
  page?: number
  page_size?: number
  search?: string
  department?: number | string
  status?: string
  [key: string]: string | number | boolean | undefined | null
}

/** Slim picker row from `/api/employee/employees-list/`. */
export interface EmployeeListWireItem {
  id: number
  name?: string
  full_name?: string
  employee_id?: string
  user?: EmployeeUser
}

export interface EmployeeListResponse {
  message: string
  results: {
    total_count: number
    total_pages: number
    current_page: number
    item_per_page: number
    data: Employee[]
  }
}

export interface EmployeeListPickerResponse {
  message: string
  results: {
    total_count: number
    total_pages: number
    current_page: number
    item_per_page: number
    data: EmployeeListWireItem[]
  }
}

export interface EmployeeUser {
  id?: number
  username: string
  email: string
}

export interface EmployeeBankDetails {
  bank_name: string
  account_number: string
  ifsc: string
  branch: string
}

export interface Employee {
  id: number
  user: EmployeeUser
  bank_details: EmployeeBankDetails
  full_name: string
  phone_number: string
  employee_id: string
  role: number
  role_name?: string
  department: string
  designation: string
  status: string
  shift: string
  employee_type: string
  nationality: string
  joined_date: string
  basic_salary: string
  accommodation: string
  date_of_birth: string
  address: string
  is_tl?: boolean
  is_manual_attendance_enabled?: boolean
}
