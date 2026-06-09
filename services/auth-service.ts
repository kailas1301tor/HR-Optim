// services/auth-service.ts
import { api } from '@/lib/api'

export interface LoginResponse {
  message: string
  results: {
    data: {
      refresh: string
      access: string
      user_id: number
      username: string
      email: string
      has_password_changed: boolean
    }
  }
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    return await api.post<LoginResponse>(
      '/api/auth/login/',
      { username, password },
      { skipAuthHeader: true, skipSessionRedirect: true }
    )
  },

  async setPassword(password: string, confirmPassword: string, token?: string): Promise<{ message: string }> {
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return await api.post<{ message: string }>(
      '/api/employee/set-password/',
      {
        new_password: password,
        confirm_new_password: confirmPassword,
      },
      { headers, skipAuthHeader: true, skipSessionRedirect: true }
    )
  },

  async persistSession(
    token: string,
    username: string,
    email: string,
    userId?: number
  ): Promise<void> {
    const response = await fetch('/api/auth/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, username, email, userId }),
    })

    if (!response.ok) {
      throw new Error('Failed to persist session')
    }
  },

  async logout(): Promise<void> {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch {
      // Proceed with redirect even if session clear fails
    }
    window.location.href = '/login'
  },
}
