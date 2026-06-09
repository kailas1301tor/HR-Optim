// hooks/use-current-employee.ts
'use client'

import { useState, useEffect } from 'react'
import { AUTH_COOKIE_NAMES, getClientCookie } from '@/lib/cookies'
import { resolveCurrentEmployeeRecord } from '@/lib/helpers/resolve-current-employee'

export interface CurrentEmployee {
  id: number
  fullName: string
  employeeCode: string
  email: string
}

export interface UseCurrentEmployeeReturn {
  employee: CurrentEmployee | null
  isLoading: boolean
  error: string | null
}

export function useCurrentEmployee(): UseCurrentEmployeeReturn {
  const [employee, setEmployee] = useState<CurrentEmployee | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function resolveEmployee(): Promise<void> {
      setIsLoading(true)
      setError(null)

      const email = getClientCookie(AUTH_COOKIE_NAMES.email)
      const username = getClientCookie(AUTH_COOKIE_NAMES.username)
      const userId = getClientCookie(AUTH_COOKIE_NAMES.userId)

      if (!email && !username && !userId) {
        setEmployee(null)
        setError('Not signed in')
        setIsLoading(false)
        return
      }

      try {
        const match = await resolveCurrentEmployeeRecord(controller.signal)

        if (controller.signal.aborted) return

        if (!match) {
          setEmployee(null)
          setError('Could not find your employee profile. Contact HR.')
          return
        }

        setEmployee({
          id: match.id,
          fullName: match.full_name,
          employeeCode: match.employee_id,
          email: match.user.email,
        })
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setEmployee(null)
        setError('Failed to load your employee profile')
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    resolveEmployee()
    return () => controller.abort()
  }, [])

  return { employee, isLoading, error }
}
