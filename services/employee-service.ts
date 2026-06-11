// services/employee-service.ts
import { api } from '@/lib/api'
import { cleanParams } from '@/lib/types'
import type {
  CreateEmployeePayload,
  DropdownData,
  DropdownResponse,
  Employee,
  EmployeeListParams,
  EmployeeListResponse,
} from '@/types/employee'

export type {
  CreateEmployeePayload,
  DropdownData,
  DropdownItem,
  DropdownResponse,
  EmployeeListParams,
} from '@/types/employee'

export const employeeService = {
  /**
   * Fetches dropdown metadata from the backend.
   */
  async getDropdowns(signal?: AbortSignal): Promise<DropdownData> {
    const response = await api.get<DropdownResponse>('/api/employee/dropdowns/', { signal });
    return response.results.data;
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
