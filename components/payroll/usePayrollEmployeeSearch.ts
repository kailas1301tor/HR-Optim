// components/payroll/usePayrollEmployeeSearch.ts
'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { toast } from 'sonner'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/types/employee'

const SEARCH_DEBOUNCE_MS = 300

export interface UsePayrollEmployeeSearchReturn {
  employees: Employee[]
  employeeSearchQuery: string
  setEmployeeSearchQuery: (query: string) => void
  isEmployeesLoading: boolean
  employeesHasError: boolean
  reloadEmployees: () => void
}

export function usePayrollEmployeeSearch(): UsePayrollEmployeeSearchReturn {
  const [allEmployees, setAllEmployees] = useState<Employee[]>([])
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [isEmployeesLoading, setIsEmployeesLoading] = useState(true)
  const [employeesHasError, setEmployeesHasError] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reloadEmployees = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(employeeSearchQuery)
    }, employeeSearchQuery ? SEARCH_DEBOUNCE_MS : 0)

    return () => window.clearTimeout(handler)
  }, [employeeSearchQuery])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadEmployees(): Promise<void> {
      setIsEmployeesLoading(true)
      setEmployeesHasError(false)
      try {
        const response = await employeeService.getEmployeesList(
          { search: debouncedSearch || undefined, page_size: 50 },
          controller.signal,
        )
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setAllEmployees(response.data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setEmployeesHasError(true)
        toast.error('Failed to load employees list')
        setAllEmployees([])
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsEmployeesLoading(false)
        }
      }
    }

    void loadEmployees()
    return () => controller.abort()
  }, [debouncedSearch, reloadToken])

  const employees = useMemo(() => {
    const query = employeeSearchQuery.trim().toLowerCase()
    if (!query || query === debouncedSearch.trim().toLowerCase()) {
      return allEmployees
    }

    return allEmployees.filter((employee) => {
      const name = employee.full_name?.toLowerCase() ?? ''
      const code = employee.employee_id?.toLowerCase() ?? ''
      const email = employee.user?.email?.toLowerCase() ?? ''
      const username = employee.user?.username?.toLowerCase() ?? ''
      return (
        name.includes(query) ||
        code.includes(query) ||
        email.includes(query) ||
        username.includes(query)
      )
    })
  }, [allEmployees, employeeSearchQuery, debouncedSearch])

  return {
    employees,
    employeeSearchQuery,
    setEmployeeSearchQuery,
    isEmployeesLoading,
    employeesHasError,
    reloadEmployees,
  }
}
