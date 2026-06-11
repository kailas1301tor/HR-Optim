// components/employees/useEmployeeDropdowns.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { createModuleCache } from '@/lib/hooks/create-module-cache'
import { employeeService } from '@/services/employee-service'
import type { DropdownData } from '@/types/employee'

const employeeDropdownsCache = createModuleCache<DropdownData>()

async function fetchDropdownsCached(): Promise<DropdownData> {
  return employeeDropdownsCache.fetch(() => employeeService.getDropdowns())
}

export function invalidateEmployeeDropdowns(): void {
  employeeDropdownsCache.invalidate()
}

export interface UseEmployeeDropdownsReturn {
  dropdowns: DropdownData | null
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useEmployeeDropdowns(): UseEmployeeDropdownsReturn {
  const [dropdowns, setDropdowns] = useState<DropdownData | null>(employeeDropdownsCache.read())
  const [isLoading, setIsLoading] = useState(!employeeDropdownsCache.read())
  const [hasError, setHasError] = useState(false)

  const reload = useCallback(async () => {
    invalidateEmployeeDropdowns()
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchDropdownsCached()
      setDropdowns(data)
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      setHasError(true)
      setDropdowns(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    const cached = employeeDropdownsCache.read()

    if (cached) {
      setDropdowns(cached)
      setIsLoading(false)
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    setHasError(false)
    fetchDropdownsCached()
      .then((data) => {
        if (active) setDropdowns(data)
      })
      .catch(() => {
        if (active) {
          setHasError(true)
          setDropdowns(null)
        }
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return { dropdowns, isLoading, hasError, reload }
}
