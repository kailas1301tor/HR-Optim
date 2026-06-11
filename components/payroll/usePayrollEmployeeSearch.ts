// components/payroll/usePayrollEmployeeSearch.ts
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { toast } from 'sonner'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/types/employee'

export interface UsePayrollEmployeeSearchReturn {
  employees: Employee[]
  isEmployeesLoading: boolean
  employeesHasError: boolean
  reloadEmployees: () => void
}

export function usePayrollEmployeeSearch(): UsePayrollEmployeeSearchReturn {
  const [employees, setEmployees] = useState<Employee[]>([])
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
        const response = await employeeService.getEmployees(
          { page_size: 50 },
          controller.signal,
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

    void loadEmployees()
    return () => controller.abort()
  }, [reloadToken])

  return {
    employees,
    isEmployeesLoading,
    employeesHasError,
    reloadEmployees,
  }
}
