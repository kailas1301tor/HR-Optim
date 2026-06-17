// components/settings/hr-masters/useWorkingDaysMaster.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { applyWeekdayToggle } from '@/lib/mappers/working-day-mapper'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { workingDayService } from '@/services/working-day-service'
import type { WorkingDay } from '@/types/settings'

export function useWorkingDaysMaster() {
  const [configId, setConfigId] = useState<number | null>(null)
  const [items, setItems] = useState<WorkingDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [updatingDayIndex, setUpdatingDayIndex] = useState<number | null>(null)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (options?: { showLoading?: boolean }): Promise<void> => {
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError,
      fetcher: () => workingDayService.getWorkingDays(),
      onSuccess: (viewModel) => {
        setConfigId(viewModel.configId)
        setItems(viewModel.items)
      },
      errorMessage: 'Failed to load working days',
      requestIdRef,
      showLoading: options?.showLoading ?? true,
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const handleToggle = async (day: WorkingDay, isWorkingDay: boolean): Promise<void> => {
    const previousItems = items
    const previousConfigId = configId
    const nextItems = applyWeekdayToggle(items, day.id, isWorkingDay)

    setUpdatingDayIndex(day.id)
    setItems(nextItems)

    try {
      const saved = await workingDayService.saveWorkingDays(configId, nextItems)
      setConfigId(saved.configId)
      setItems(saved.items)
    } catch (error: unknown) {
      setConfigId(previousConfigId)
      setItems(previousItems)
      toastAndRethrow(error, 'Failed to update working day')
      await reload({ showLoading: false })
    } finally {
      setUpdatingDayIndex(null)
    }
  }

  return {
    items,
    isLoading,
    hasError,
    updatingDayIndex,
    reload,
    handleToggle,
  }
}
