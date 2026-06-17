// lib/helpers/load-profile-employee-detail.ts
import { ApiError } from '@/lib/api'
import { canViewModule } from '@/lib/permissions/module-permissions'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/types/employee'

export async function loadProfileEmployeeDetail(
  employeeProfileId: number,
  permissions: Set<string>,
  signal?: AbortSignal,
): Promise<Employee | null> {
  if (!canViewModule(permissions, 'employees')) {
    return null
  }

  try {
    return await employeeService.getEmployee(employeeProfileId, signal)
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err
    }

    const status = err instanceof ApiError ? err.status : undefined
    console.warn(
      `Could not fetch employee detail for profile page${status ? ` (${status})` : ''}`,
    )
    return null
  }
}
