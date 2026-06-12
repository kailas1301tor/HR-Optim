// services/employee-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'
import { departmentService } from '@/services/department-service'
import { designationService } from '@/services/designation-service'
import { shiftService } from '@/services/shift-service'
import type {
  CreateEmployeePayload,
  DropdownData,
  DropdownItem,
  DropdownResponse,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
} from '@/types/employee'
import type { Department } from '@/types/settings'

export type {
  CreateEmployeePayload,
  DropdownData,
  DropdownItem,
  DropdownResponse,
  EmployeeListParams,
} from '@/types/employee'

function normalizeDropdownData(data: Partial<DropdownData> | null | undefined): DropdownData {
  return {
    roles: data?.roles ?? [],
    departments: data?.departments ?? [],
    designations: data?.designations ?? [],
    shifts: data?.shifts ?? [],
    employee_types: data?.employee_types ?? [],
    nationalities: data?.nationalities ?? [],
    status_choices: data?.status_choices ?? [],
    accommodation_choices: data?.accommodation_choices ?? [],
  };
}

/**
 * Some backends return the combined dropdown payload with `departments`,
 * `designations`, or `shifts` empty. Backfill those from their dedicated
 * master endpoints so the employee form selects always have options.
 */
async function backfillEmptyMasters(
  data: DropdownData,
  signal?: AbortSignal,
): Promise<DropdownData> {
  const needsDepartments = data.departments.length === 0;
  const needsShifts = data.shifts.length === 0;
  const needsDesignations = data.designations.length === 0;

  if (!needsDepartments && !needsShifts && !needsDesignations) {
    return data;
  }

  const [departments, shifts] = await Promise.all([
    needsDepartments
      ? departmentService.getDepartments(signal).catch(() => [])
      : Promise.resolve(data.departments),
    needsShifts
      ? shiftService
          .getShifts(signal)
          .then((items) => items.map<DropdownItem>(({ id, name }) => ({ id, name })))
          .catch(() => [])
      : Promise.resolve(data.shifts),
  ]);

  const resolvedDepartments = (departments as DropdownItem[]).map<DropdownItem>(
    ({ id, name }) => ({ id, name }),
  );

  let designations = data.designations;
  if (needsDesignations && resolvedDepartments.length > 0) {
    const perDepartment = await Promise.all(
      resolvedDepartments.map((dept) =>
        designationService
          .getDesignations(dept.id)
          .then((items) =>
            items.map((item) => ({ id: item.id, name: item.name, department_id: item.department })),
          )
          .catch(() => []),
      ),
    );
    designations = perDepartment.flat();
  }

  return {
    ...data,
    departments: resolvedDepartments,
    shifts: shifts as DropdownItem[],
    designations,
  };
}

function dropdownDepartmentsToDepartments(items: DropdownItem[]): Department[] {
  return items.map(({ id, name }) => ({ id, name, description: '' }))
}

export const employeeService = {
  /**
   * Fetches dropdown metadata from the backend.
   */
  async getDropdowns(signal?: AbortSignal): Promise<DropdownData> {
    const response = await api.get<DropdownResponse>('/api/employee/dropdowns/', { signal });
    const normalized = normalizeDropdownData(response.results?.data);
    return backfillEmptyMasters(normalized, signal);
  },

  /**
   * Departments from employee dropdowns — avoids master department permissions.
   */
  async getDepartmentsFromDropdowns(signal?: AbortSignal): Promise<Department[]> {
    const dropdowns = await this.getDropdowns(signal)
    return dropdownDepartmentsToDepartments(dropdowns.departments)
  },

  /**
   * Shifts from employee dropdowns — avoids master shift permissions.
   */
  async getShiftsFromDropdowns(signal?: AbortSignal): Promise<DropdownItem[]> {
    const response = await api.get<DropdownResponse>('/api/employee/dropdowns/', { signal })
    return normalizeDropdownData(response.results?.data).shifts
  },

  /**
   * Fetches the employee list from the backend.
   * Bubbles up errors directly to the caller.
   */
  async getEmployees(params: EmployeeListParams, signal?: AbortSignal): Promise<{
    data: Employee[];
    total_count: number;
    total_pages: number;
    current_page: number;
  }> {
    const response = await api.get<EmployeeListResponse>('/api/employee/employees/', { 
      params: cleanParams(params),
      signal,
    });
    return {
      data: response.results?.data || [],
      total_count: response.results?.total_count || 0,
      total_pages: response.results?.total_pages || 1,
      current_page: response.results?.current_page || 1,
    };
  },

  /**
   * Fetches a single employee detail from the backend.
   */
  async getEmployee(id: number, signal?: AbortSignal): Promise<Employee> {
    const response = await api.get<{ results: { data: Employee } }>(`/api/employee/employees/${id}/`, { signal });
    return response.results.data;
  },

  /**
   * Creates a new employee on the backend.
   */
  async createEmployee(payload: CreateEmployeePayload): Promise<Employee> {
    const response = await api.post<{ results: { data: Employee } }>('/api/employee/employees/', payload);
    return response.results.data;
  },

  /**
   * Updates an existing employee on the backend.
   */
  async updateEmployee(payload: Partial<CreateEmployeePayload> & { id: number }): Promise<Employee> {
    const response = await api.put<{ results: { data: Employee } }>('/api/employee/employees/', payload);
    return response.results.data;
  },

  /**
   * Deletes an employee from the backend.
   */
  async deleteEmployee(id: number): Promise<void> {
    await api.delete('/api/employee/employees/', { params: { id } });
  }
};
