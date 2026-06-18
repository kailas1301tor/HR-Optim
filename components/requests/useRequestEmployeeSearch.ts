// components/requests/useRequestEmployeeSearch.ts
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/types/employee'

const SEARCH_DEBOUNCE_MS = 300

export interface UseRequestEmployeeSearchReturn {
  employees: Employee[]
  employeeSearchQuery: string
  setEmployeeSearchQuery: (query: string) => void
  isEmployeesLoading: boolean
  employeesHasError: boolean
  reloadEmployees: () => void
}

export function useRequestEmployeeSearch(): UseRequestEmployeeSearchReturn {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('')
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(true)
  const [employeesHasError, setEmployeesHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reloadEmployees = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadEmployees(): Promise<void> {
      setIsEmployeesLoading(true)
      setEmployeesHasError(false)
      try {
        const response = await employeeService.getEmployeesList(
          { search: employeeSearchQuery || undefined, page_size: 50 },
          controller.signal
        )
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setEmployees(response.data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setEmployeesHasError(true)
        toast.error('Failed to load employees list')
        setEmployees([])
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsEmployeesLoading(false)
        }
      }
    }

    const handler = setTimeout(() => void loadEmployees(), employeeSearchQuery ? SEARCH_DEBOUNCE_MS : 0)

    return () => {
      clearTimeout(handler)
      controller.abort()
    }
  }, [employeeSearchQuery, reloadToken])

  return {
    employees,
    employeeSearchQuery,
    setEmployeeSearchQuery,
    isEmployeesLoading,
    employeesHasError,
    reloadEmployees,
  }
}
