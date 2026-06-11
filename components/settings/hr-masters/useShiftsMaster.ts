// components/settings/hr-masters/useShiftsMaster.ts
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { invalidateAttendanceShifts } from '@/components/attendance/useAttendanceShifts'
import { shiftService } from '@/services/shift-service'
import type { FrontendShift } from '@/types/settings'

export interface UseShiftsMasterProps {
  onRefresh: () => Promise<void>
}

export interface UseShiftsMasterReturn {
  isShiftModalOpen: boolean
  setIsShiftModalOpen: (open: boolean) => void
  editingShift: FrontendShift | null
  isSubmitting: boolean
  shiftName: string
  setShiftName: (name: string) => void
  shiftStartTime: string
  setShiftStartTime: (time: string) => void
  shiftEndTime: string
  setShiftEndTime: (time: string) => void
  shiftStandardHours: string
  setShiftStandardHours: (hours: string) => void
  deleteTarget: FrontendShift | null
  setDeleteTarget: (shift: FrontendShift | null) => void
  isDeleting: boolean
  handleOpenAdd: () => void
  handleOpenEdit: (shift: FrontendShift) => void
  handleSaveShift: (e: React.FormEvent) => Promise<void>
  handleDeleteShift: () => Promise<void>
}

export function useShiftsMaster({ onRefresh }: UseShiftsMasterProps): UseShiftsMasterReturn {
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<FrontendShift | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form fields
  const [shiftName, setShiftName] = useState('')
  const [shiftStartTime, setShiftStartTime] = useState('09:00')
  const [shiftEndTime, setShiftEndTime] = useState('18:00')
  const [shiftStandardHours, setShiftStandardHours] = useState('9')

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<FrontendShift | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const resetForm = (): void => {
    setShiftName('')
    setShiftStartTime('09:00')
    setShiftEndTime('18:00')
    setShiftStandardHours('9')
    setEditingShift(null)
  }

  const handleOpenAdd = (): void => {
    resetForm()
    setIsShiftModalOpen(true)
  }

  const handleOpenEdit = (shift: FrontendShift): void => {
    setShiftName(shift.name)
    setShiftStartTime(shift.startTime)
    setShiftEndTime(shift.endTime)
    setShiftStandardHours(String(shift.standardWorkHours))
    setEditingShift(shift)
    setIsShiftModalOpen(true)
  }

  const handleSaveShift = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!shiftName.trim()) return

    setIsSubmitting(true)
    try {
      const payload = {
        name: shiftName.trim().toUpperCase(),
        start_time: `${shiftStartTime}:00`,
        end_time: `${shiftEndTime}:00`,
        standard_work_hours: shiftStandardHours,
      }

      if (editingShift) {
        await shiftService.updateShift({ id: editingShift.id, ...payload })
        toast.success('Shift updated successfully')
      } else {
        await shiftService.createShift(payload)
        toast.success('Shift created successfully')
      }
      setIsShiftModalOpen(false)
      resetForm()
      invalidateAttendanceShifts()
      await onRefresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save shift'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteShift = async (): Promise<void> => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await shiftService.deleteShift(deleteTarget.id)
      toast.success('Shift deleted successfully')
      setDeleteTarget(null)
      invalidateAttendanceShifts()
      await onRefresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete shift'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = useCallback((open: boolean): void => {
    if (!open && !isSubmitting) {
      resetForm()
    }
    if (!isSubmitting) setIsShiftModalOpen(open)
  }, [isSubmitting])

  return {
    isShiftModalOpen,
    setIsShiftModalOpen: handleDialogOpenChange,
    editingShift,
    isSubmitting,
    shiftName,
    setShiftName,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    shiftStandardHours,
    setShiftStandardHours,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleSaveShift,
    handleDeleteShift,
  }
}
