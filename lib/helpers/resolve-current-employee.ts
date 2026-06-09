// lib/helpers/resolve-current-employee.ts
import { AUTH_COOKIE_NAMES, getClientCookie } from '@/lib/cookies'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/components/employees/employee-table'

export function getAuthUserIdFromCookie(): number | null {
  const raw = getClientCookie(AUTH_COOKIE_NAMES.userId)
  if (!raw) return null
  const parsed = Number(raw)
  if (!Number.isFinite(parsed) || parsed <= 0) return null
  return parsed
}

function matchEmployeeByCredentials(
  employees: Employee[],
  email: string | null,
  username: string | null
): Employee | undefined {
  return employees.find((emp) => {
    const empEmail = emp.user.email?.toLowerCase() ?? ''
    const empUsername = emp.user.username?.toLowerCase() ?? ''

    if (email && empEmail === email.toLowerCase()) return true
    if (username && empUsername === username.toLowerCase()) return true
    return false
  })
}

function matchEmployeeByUserId(employees: Employee[], userId: number): Employee | undefined {
  const byEmployeePk = employees.find((emp) => emp.id === userId)
  if (byEmployeePk) return byEmployeePk

  return employees.find((emp) => emp.user.id !== undefined && emp.user.id === userId)
}

export async function resolveCurrentEmployeeRecord(
  signal?: AbortSignal
): Promise<Employee | null> {
  const email = getClientCookie(AUTH_COOKIE_NAMES.email)
  const username = getClientCookie(AUTH_COOKIE_NAMES.username)
  const userId = getAuthUserIdFromCookie()

  if (!email && !username && !userId) return null

  if (userId) {
    try {
      const employee = await employeeService.getEmployee(userId, signal)
      if (employee) return employee
    } catch {
      // Fall through to list + credential matching
    }
  }

  const { data: employees } = await employeeService.getEmployees(
    { page_size: 100 },
    signal
  )

  if (userId) {
    const byUserId = matchEmployeeByUserId(employees, userId)
    if (byUserId) return byUserId
  }

  const byCredentials = matchEmployeeByCredentials(employees, email, username)
  return byCredentials ?? null
}
