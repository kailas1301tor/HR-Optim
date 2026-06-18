// components/assets/useAssetEmployeeSearch.ts
'use client'

import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { employeeService } from '@/services/employee-service'
import type { Employee } from '@/types/employee'

const SEARCH_DEBOUNCE_MS = 300

export interface UseAssetEmployeeSearchReturn {
  employees: Employee[]
  searchQuery: string
  setSearchQuery: (query: string) => void
  isLoading: boolean
}

export function useAssetEmployeeSearch(open: boolean): UseAssetEmployeeSearchReturn {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const fetchIdRef = useRef(0)

  useEffect(() => {
    if (!open) {
      setSearchQuery('')
      setEmployees([])
      return
    }

    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadEmployees(): Promise<void> {
      setIsLoading(true)
      try {
        const response = await employeeService.getEmployeesList(
          { search: searchQuery || undefined, page_size: 50 },
          controller.signal
        )
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setEmployees(response.data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        toast.error('Failed to load employees list')
        setEmployees([])
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    const handler = setTimeout(loadEmployees, searchQuery ? SEARCH_DEBOUNCE_MS : 0)

    return () => {
      clearTimeout(handler)
      controller.abort()
    }
  }, [open, searchQuery])

  return { employees, searchQuery, setSearchQuery, isLoading }
}
