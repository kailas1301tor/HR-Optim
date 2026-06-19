// lib/helpers/resolve-current-employee.ts
import { loadCachedUserProfile } from '@/components/auth/permissions-provider'
import { formatDisplayNameFromUsername } from '@/lib/cookies'
import { formatPersonName } from '@/lib/helpers/format-display-text'
import type { Employee } from '@/components/employees/employee-table'
import type { CurrentUserProfile } from '@/types/auth'

function buildEmployeeFromProfile(profile: CurrentUserProfile): Employee | null {
  const employeeProfileId = profile.employee_profile_id
  if (!employeeProfileId) return null

  const fullName = formatPersonName(
    profile.fullName ||
      formatDisplayNameFromUsername(profile.username) ||
      profile.email ||
      'User',
  )

  return {
    id: employeeProfileId,
    user: {
      id: profile.id,
      username: profile.username,
      email: profile.email,
    },
    full_name: fullName,
    employee_id: '',
    bank_details: { bank_name: '', account_number: '', ifsc: '', branch: '' },
    phone_number: '',
    role: 0,
    department: '',
    designation: profile.designation || '',
    status: 'Active',
    shift: '',
    employee_type: '',
    nationality: '',
    joined_date: '',
    basic_salary: '',
    accommodation: '',
    date_of_birth: '',
    address: '',
  }
}

/**
 * Resolves the signed-in user's employee record from `/api/auth/profile/`.
 * Uses `employee_profile_id` from the auth profile — no employees-list or detail calls.
 */
export async function resolveCurrentEmployeeRecord(
  _signal?: AbortSignal
): Promise<Employee | null> {
  const profile = await loadCachedUserProfile()
  return buildEmployeeFromProfile(profile)
}
