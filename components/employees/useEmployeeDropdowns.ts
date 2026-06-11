// components/employees/useEmployeeDropdowns.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { employeeService } from '@/services/employee-service'
import type { DropdownData } from '@/types/employee'

let cachedDropdowns: DropdownData | null = null
let inflightRequest: Promise<DropdownData> | null = null

async function fetchDropdownsCached(signal?: AbortSignal): Promise<DropdownData> {
  if (cachedDropdowns) return cachedDropdowns

  if (!inflightRequest) {
    inflightRequest = employeeService
      .getDropdowns(signal)
      .then((data) => {
        cachedDropdowns = data
        return data
      })
      .finally(() => {
        inflightRequest = null
      })
  }

  return inflightRequest
}

export function invalidateEmployeeDropdowns(): void {
  cachedDropdowns = null
}

export interface UseEmployeeDropdownsReturn {
  dropdowns: DropdownData | null
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
}

export function useEmployeeDropdowns(): UseEmployeeDropdownsReturn {
  const [dropdowns, setDropdowns] = useState<DropdownData | null>(cachedDropdowns)
  const [isLoading, setIsLoading] = useState(!cachedDropdowns)
  const [hasError, setHasError] = useState(false)

  const reload = useCallback(async (signal?: AbortSignal) => {
    invalidateEmployeeDropdowns()
    setIsLoading(true)
    setHasError(false)
    try {
      const data = await fetchDropdownsCached(signal)
      if (signal?.aborted) return
      setDropdowns(data)
    } catch (error: unknown) {
      if (error instanceof Error && error.name === 'AbortError') return
      setHasError(true)
      setDropdowns(null)
    } finally {
      if (!signal?.aborted) setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    reload(controller.signal)
    return () => controller.abort()
  }, [reload])

  return { dropdowns, isLoading, hasError, reload: () => reload() }
}
