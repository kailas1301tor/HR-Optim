// components/settings/hr-masters/useShiftsList.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { shiftService } from '@/services/shift-service'
import type { FrontendShift } from '@/types/settings'

export function useShiftsList() {
  const [shifts, setShifts] = useState<FrontendShift[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError,
      fetcher: () => shiftService.getShifts(),
      onSuccess: setShifts,
      errorMessage: 'Failed to load shifts',
      requestIdRef,
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return { shifts, isLoading, hasError, reload }
}
