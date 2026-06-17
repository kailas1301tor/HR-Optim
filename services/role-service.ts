// services/role-service.ts
import { api } from '@/lib/api';

export interface BackendPermissionSummary {
  id: number;
  name: string;
}

export interface BackendRole {
  id: number;
  name: string;
  permissions: BackendPermissionSummary[];
}

export interface RoleResponse {
  message: string;
  results: {
    data: BackendRole[];
  };
}

export interface SingleRoleResponse {
  message: string;
  results: {
    data: BackendRole;
  };
}

export const roleService = {
  /**
   * Fetch all roles (groups) from the backend.
   */
  async getRoles(signal?: AbortSignal): Promise<BackendRole[]> {
    const response = await api.get<RoleResponse>('/api/auth/groups/', { signal })
    return response.results?.data ?? []
  },

  async getRoleById(id: number, signal?: AbortSignal): Promise<BackendRole | null> {
    const response = await api.get<SingleRoleResponse>(`/api/auth/groups/?id=${id}`, { signal })
    return response.results?.data ?? null
  },

  /**
   * Create a new role.
   */
  async createRole(name: string, permissionIds: number[]): Promise<BackendRole> {
    const payload = {
      name,
      permission_ids: permissionIds
    };
    const response = await api.post<SingleRoleResponse>('/api/auth/groups/', payload);
    return response.results.data;
  },

  /**
   * Update an existing role.
   */
  async updateRole(id: number, name: string, permissionIds: number[]): Promise<BackendRole> {
    const payload = {
      id,
      name,
      permission_ids: permissionIds
    };
    const response = await api.put<SingleRoleResponse>('/api/auth/groups/', payload);
    return response.results.data;
  },

  /**
   * Delete a role by ID.
   */
  async deleteRole(id: number): Promise<void> {
    await api.delete<void>('/api/auth/groups/', {
      params: { id }
    });
  },

  async assignPermissionsToGroup(groupId: number, permissionIds: number[]): Promise<void> {
    await api.post('/api/auth/groups/permissions/', {
      group_id: groupId,
      permission_ids: permissionIds,
    })
  },

}
