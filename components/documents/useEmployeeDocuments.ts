// components/documents/useEmployeeDocuments.ts
'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { employeeSelfService } from '@/services/employee-self-service'
import { invalidateClientFetch } from '@/lib/helpers/client-fetch-lifecycle'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import type { EmployeeDocument } from '@/types/document'

export interface UseEmployeeDocumentsReturn {
  documents: EmployeeDocument[]
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  reload: () => void
}

export function useEmployeeDocuments(options: {
  employeeProfileId: number | null
  enabled: boolean
}): UseEmployeeDocumentsReturn {
  const { employeeProfileId, enabled } = options
  const [documents, setDocuments] = useState<EmployeeDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const reload = useCallback(() => {
    setReloadToken((token) => token + 1)
  }, [])

  useEffect(() => {
    if (!enabled || !employeeProfileId) {
      setIsLoading(!enabled)
      setHasError(false)
      setErrorMessage(null)
      setDocuments([])
      return
    }

    const profileId = employeeProfileId
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    const load = async () => {
      setIsLoading(true)
      setHasError(false)
      setErrorMessage(null)

      try {
        const result = await employeeSelfService.getDocuments({
          employeeId: profileId,
          signal: controller.signal,
        })
        if (fetchId !== fetchIdRef.current) return
        setDocuments(Array.isArray(result) ? result : [])
      } catch (error: unknown) {
        if (controller.signal.aborted) return
        if (fetchId !== fetchIdRef.current) return
        setDocuments([])
        setHasError(true)
        setErrorMessage(getApiErrorMessage(error, 'Failed to load your documents. Please try again.'))
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void load()
    return () => invalidateClientFetch(fetchIdRef, controller)
  }, [employeeProfileId, enabled, reloadToken])

  return { documents, isLoading, hasError, errorMessage, reload }
}
