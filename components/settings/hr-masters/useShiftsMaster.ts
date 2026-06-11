// components/settings/hr-masters/useShiftsMaster.ts
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { invalidateAttendanceShifts } from '@/components/attendance/useAttendanceShifts'
import { shiftService } from '@/services/shift-service'
import type { FrontendShift, LateDeductionPolicy } from '@/types/settings'
import { FIXED_CALCULATE_TYPE } from '@/types/settings'

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
  isLateDeductionRequired: boolean
  setIsLateDeductionRequired: (enabled: boolean) => void
  lateDeductionPolicies: LateDeductionPolicy[]
  handlePolicyChange: (index: number, field: keyof LateDeductionPolicy, value: string) => void
  handleAddPolicy: () => void
  handleRemovePolicy: (index: number) => void
  deleteTarget: FrontendShift | null
  setDeleteTarget: (shift: FrontendShift | null) => void
  isDeleting: boolean
  handleOpenAdd: () => void
  handleOpenEdit: (shift: FrontendShift) => void
  handleSaveShift: (e: React.FormEvent) => Promise<void>
  handleDeleteShift: () => Promise<void>
}

function createEmptyPolicy(startTime: string): LateDeductionPolicy {
  return {
    name: 'Tier 1 Time',
    time: startTime,
    deduction_type: FIXED_CALCULATE_TYPE,
    value: '',
  }
}

export function useShiftsMaster({ onRefresh }: UseShiftsMasterProps): UseShiftsMasterReturn {
  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false)
  const [editingShift, setEditingShift] = useState<FrontendShift | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [shiftName, setShiftName] = useState('')
  const [shiftStartTime, setShiftStartTime] = useState('09:00')
  const [shiftEndTime, setShiftEndTime] = useState('18:00')
  const [shiftStandardHours, setShiftStandardHours] = useState('9')
  const [isLateDeductionRequired, setIsLateDeductionRequired] = useState(false)
  const [lateDeductionPolicies, setLateDeductionPolicies] = useState<LateDeductionPolicy[]>([
    createEmptyPolicy('09:15'),
  ])

  const [deleteTarget, setDeleteTarget] = useState<FrontendShift | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const resetForm = (): void => {
    setShiftName('')
    setShiftStartTime('09:00')
    setShiftEndTime('18:00')
    setShiftStandardHours('9')
    setIsLateDeductionRequired(false)
    setLateDeductionPolicies([createEmptyPolicy('09:15')])
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
    setIsLateDeductionRequired(shift.isLateDeductionRequired)
    setLateDeductionPolicies(
      shift.lateDeductionPolicies.length > 0
        ? shift.lateDeductionPolicies
        : [createEmptyPolicy(shift.startTime)],
    )
    setEditingShift(shift)
    setIsShiftModalOpen(true)
  }

  const handlePolicyChange = (index: number, field: keyof LateDeductionPolicy, value: string): void => {
    setLateDeductionPolicies((prev) =>
      prev.map((policy, policyIndex) =>
        policyIndex === index ? { ...policy, [field]: value } : policy,
      ),
    )
  }

  const handleAddPolicy = (): void => {
    setLateDeductionPolicies((prev) => [
      ...prev,
      createEmptyPolicy(shiftStartTime),
    ])
  }

  const handleRemovePolicy = (index: number): void => {
    setLateDeductionPolicies((prev) => prev.filter((_, policyIndex) => policyIndex !== index))
  }

  const handleSaveShift = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!shiftName.trim()) return

    if (isLateDeductionRequired) {
      const invalidPolicy = lateDeductionPolicies.some(
        (policy) =>
          !policy.name.trim() ||
          !policy.time ||
          !policy.deduction_type ||
          !policy.value.trim(),
      )
      if (invalidPolicy || lateDeductionPolicies.length === 0) {
        toast.error('Complete all late deduction policy fields')
        return
      }
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: shiftName.trim().toUpperCase(),
        start_time: `${shiftStartTime}:00`,
        end_time: `${shiftEndTime}:00`,
        standard_work_hours: shiftStandardHours,
        is_late_deduction_required: isLateDeductionRequired,
        late_deduction_policies: isLateDeductionRequired ? lateDeductionPolicies : [],
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
    isLateDeductionRequired,
    setIsLateDeductionRequired,
    lateDeductionPolicies,
    handlePolicyChange,
    handleAddPolicy,
    handleRemovePolicy,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleSaveShift,
    handleDeleteShift,
  }
}
