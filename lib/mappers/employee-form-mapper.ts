// lib/mappers/employee-form-mapper.ts
import type { CreateEmployeePayload, DropdownData, DropdownItem } from '@/types/employee'
import type { Employee } from '@/types/employee'
import type { EmployeeInput } from '@/validations/employee.schema'

export function findIdByName(list: DropdownItem[] | undefined, name: string): string {
  if (!list?.length || !name) return list?.[0] ? String(list[0].id) : ''
  const match = list.find((item) => item.name.toLowerCase() === name.toLowerCase())
  return match ? String(match.id) : String(list[0].id)
}

export function findNameByPreference(list: DropdownItem[] | undefined, preferred: string): string {
  if (!list?.length) return preferred
  const match = list.find((item) => item.name.toLowerCase() === preferred.toLowerCase())
  return match?.name ?? list[0].name
}

export function employeeToFormValues(employee: Employee, dropdowns: DropdownData): EmployeeInput {
  return {
    id: String(employee.id),
    username: employee.user?.username || '',
    email: employee.user?.email || '',
    full_name: employee.full_name,
    phone_number: employee.phone_number,
    role: employee.role_name
      ? findIdByName(dropdowns.roles, employee.role_name)
      : String(employee.role),
    department: findIdByName(dropdowns.departments, employee.department),
    designation: findIdByName(dropdowns.designations, employee.designation),
    employee_id: employee.employee_id,
    status: employee.status,
    shift: findIdByName(dropdowns.shifts, employee.shift),
    joined_date: employee.joined_date ? employee.joined_date.split('T')[0] : '',
    employee_type: findIdByName(dropdowns.employee_types, employee.employee_type),
    basic_salary: employee.basic_salary,
    accommodation: employee.accommodation,
    date_of_birth: employee.date_of_birth ? employee.date_of_birth.split('T')[0] : '',
    nationality: findIdByName(dropdowns.nationalities, employee.nationality),
    address: employee.address,
    bank_name: employee.bank_details?.bank_name || '',
    account_number: employee.bank_details?.account_number || '',
    ifsc: employee.bank_details?.ifsc || '',
    branch: employee.bank_details?.branch || '',
  }
}

export function defaultFormValues(dropdowns: DropdownData): EmployeeInput {
  return {
    id: '',
    username: '',
    email: '',
    full_name: '',
    phone_number: '',
    role: dropdowns.roles[0] ? String(dropdowns.roles[0].id) : '',
    department: dropdowns.departments[0] ? String(dropdowns.departments[0].id) : '',
    designation: dropdowns.designations[0] ? String(dropdowns.designations[0].id) : '',
    employee_id: '',
    status: dropdowns.status_choices.length
      ? findNameByPreference(dropdowns.status_choices, 'Active')
      : '',
    shift: dropdowns.shifts[0] ? String(dropdowns.shifts[0].id) : '',
    joined_date: new Date().toISOString().split('T')[0],
    employee_type: dropdowns.employee_types[0] ? String(dropdowns.employee_types[0].id) : '',
    basic_salary: '',
    accommodation: dropdowns.accommodation_choices.length
      ? findNameByPreference(dropdowns.accommodation_choices, 'Not provided')
      : '',
    date_of_birth: '',
    nationality: dropdowns.nationalities[0] ? String(dropdowns.nationalities[0].id) : '',
    address: '',
    bank_name: '',
    account_number: '',
    ifsc: '',
    branch: '',
  }
}

export function formValuesToPayload(data: EmployeeInput): CreateEmployeePayload {
  return {
    username: data.username.trim(),
    email: data.email.trim(),
    full_name: data.full_name.trim(),
    phone_number: data.phone_number.trim(),
    role: Number(data.role),
    department: Number(data.department),
    designation: Number(data.designation),
    employee_id: data.employee_id.trim(),
    status: data.status,
    shift: Number(data.shift),
    joined_date: data.joined_date,
    employee_type: Number(data.employee_type),
    basic_salary: data.basic_salary,
    accommodation: data.accommodation,
    date_of_birth: data.date_of_birth,
    nationality: Number(data.nationality),
    address: data.address.trim(),
    bank_details: {
      bank_name: data.bank_name.trim(),
      account_number: data.account_number.trim(),
      ifsc: data.ifsc.trim(),
      branch: data.branch.trim(),
    },
  }
}

export function resolveActiveInactiveStatus(
  dropdowns: DropdownData | null,
  active: boolean
): string {
  const choices = dropdowns?.status_choices ?? []
  const target = active ? 'active' : 'inactive'
  const match = choices.find((item) => item.name.toLowerCase() === target)
  return match?.name ?? (active ? 'Active' : 'Inactive')
}
