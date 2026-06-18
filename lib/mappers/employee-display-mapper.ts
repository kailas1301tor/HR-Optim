// lib/mappers/employee-display-mapper.ts
import { formatPersonName, formatTitleLabel } from '@/lib/helpers/format-display-text'
import type { Employee } from '@/types/employee'

export function formatEmployeeForDisplay(employee: Employee): Employee {
  return {
    ...employee,
    full_name: formatPersonName(employee.full_name),
    department: formatTitleLabel(employee.department),
    designation: formatTitleLabel(employee.designation),
    status: formatTitleLabel(employee.status),
    role_name: employee.role_name ? formatTitleLabel(employee.role_name) : employee.role_name,
  }
}

export function formatEmployeesForDisplay(employees: Employee[]): Employee[] {
  return employees.map(formatEmployeeForDisplay)
}
