// components/settings/hr-masters/useWorkingDaysMaster.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { workingDayService } from '@/services/working-day-service'
import type { WorkingDay } from '@/types/settings'

export function useWorkingDaysMaster() {
  const [items, setItems] = useState<WorkingDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [updatingId, setUpdatingId] = useState<number | null>(null)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (options?: { showLoading?: boolean }): Promise<void> => {
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError,
      fetcher: () => workingDayService.getWorkingDays(),
      onSuccess: setItems,
      errorMessage: 'Failed to load working days',
      requestIdRef,
      showLoading: options?.showLoading ?? true,
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const handleToggle = async (day: WorkingDay, isWorkingDay: boolean): Promise<void> => {
    const previousValue = day.is_working_day
    setUpdatingId(day.id)
    setItems((current) =>
      current.map((entry) =>
        entry.id === day.id ? { ...entry, is_working_day: isWorkingDay } : entry
      )
    )

    try {
      await workingDayService.updateWorkingDay({
        id: day.id,
        name: day.name,
        is_working_day: isWorkingDay,
      })
    } catch (error: unknown) {
      setItems((current) =>
        current.map((entry) =>
          entry.id === day.id ? { ...entry, is_working_day: previousValue } : entry
        )
      )
      toastAndRethrow(error, 'Failed to update working day')
      await reload({ showLoading: false })
    } finally {
      setUpdatingId(null)
    }
  }

  return {
    items,
    isLoading,
    hasError,
    updatingId,
    reload,
    handleToggle,
  }
}
