// lib/hooks/create-master-crud-hook.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import type { SettingsMasterItem } from '@/types/settings'

interface MasterCrudServices {
  getAll: () => Promise<Array<{ id: number; name: string }>>
  create: (name: string) => Promise<unknown>
  update: (id: number, name: string) => Promise<unknown>
  delete: (id: number) => Promise<unknown>
}

export function createMasterCrudHook(
  services: MasterCrudServices,
  labels: { entity: string; loadError: string; saveError: string; deleteError: string },
  invalidateCaches?: () => void
) {
  return function useMasterCrud() {
    const [items, setItems] = useState<SettingsMasterItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)
    const requestIdRef = useRef(0)

    const reload = useCallback(async (): Promise<void> => {
      await loadMasterList({
        setLoading: setIsLoading,
        setHasError,
        fetcher: services.getAll,
        onSuccess: (data) => setItems(data.map((item) => ({ id: item.id, name: item.name }))),
        errorMessage: labels.loadError,
        requestIdRef,
      })
    }, [])

    useEffect(() => {
      reload()
    }, [reload])

    const handleSave = async (id: number | null, name: string): Promise<void> => {
      try {
        if (id !== null) {
          await services.update(id, name)
        } else {
          await services.create(name)
        }
        invalidateCaches?.()
        await reload()
      } catch (error: unknown) {
        toastAndRethrow(error, labels.saveError)
      }
    }

    const handleDelete = async (id: number): Promise<void> => {
      try {
        await services.delete(id)
        invalidateCaches?.()
        await reload()
      } catch (error: unknown) {
        toastAndRethrow(error, labels.deleteError)
      }
    }

    return { items, isLoading, hasError, reload, handleSave, handleDelete }
  }
}
