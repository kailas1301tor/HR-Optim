// components/settings/hr-masters/useHolidaysMaster.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { holidayService } from '@/services/holiday-service'
import type { Holiday } from '@/types/settings'
import type { HolidayInput } from '@/validations/holiday.schema'

export function useHolidaysMaster() {
  const [items, setItems] = useState<Holiday[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Holiday | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError,
      fetcher: () => holidayService.getHolidays(),
      onSuccess: setItems,
      errorMessage: 'Failed to load holidays',
      requestIdRef,
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const handleOpenAdd = (): void => {
    setEditingId(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (holiday: Holiday): void => {
    setEditingId(holiday.id)
    setIsDialogOpen(true)
  }

  const handleSave = async (data: HolidayInput): Promise<void> => {
    setIsSubmitting(true)
    try {
      if (editingId !== null) {
        await holidayService.updateHoliday({ id: editingId, ...data })
      } else {
        await holidayService.createHoliday(data)
      }
      setIsDialogOpen(false)
      await reload()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save holiday')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await holidayService.deleteHoliday(deleteTarget.id)
      setDeleteTarget(null)
      await reload()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete holiday')
    } finally {
      setIsDeleting(false)
    }
  }

  const editingHoliday = editingId !== null ? items.find((item) => item.id === editingId) ?? null : null

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open && !isSubmitting) {
      setEditingId(null)
    }
    if (!isSubmitting) setIsDialogOpen(open)
  }

  return {
    items,
    isLoading,
    hasError,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen: handleDialogOpenChange,
    editingHoliday,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    reload,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  }
}
