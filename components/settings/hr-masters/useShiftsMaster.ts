// components/settings/hr-masters/useShiftsMaster.ts
import { useState, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { invalidateAttendanceShifts } from '@/components/attendance/useAttendanceShifts'
import { invalidateEmployeeDropdowns } from '@/components/employees/useEmployeeDropdowns'
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
  isLoadingEdit: boolean
  editLoadError: string | null
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
  handleOpenEdit: (shift: FrontendShift) => Promise<void>
  handleRetryEditLoad: () => Promise<void>
  handleSaveShift: (e: React.FormEvent) => Promise<void>
  handleDeleteShift: () => Promise<void>
}

function formatTimeValue(time: string | undefined, fallback: string): string {
  const trimmed = (time ?? '').trim()
  return trimmed || fallback
}

function formatStandardHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return '8'
  return String(hours)
}

function normalizePolicyForForm(
  policy: LateDeductionPolicy,
  fallbackTime: string,
): LateDeductionPolicy {
  return {
    id: policy.id,
    name: policy.name ?? '',
    time: formatTimeValue(policy.time, fallbackTime),
    deduction_type: policy.deduction_type || FIXED_CALCULATE_TYPE,
    value: policy.value ?? '',
  }
}

function hasUsableShiftFields(shift: FrontendShift): boolean {
  return Boolean(shift.name.trim() && shift.startTime && shift.endTime)
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
  const [isLoadingEdit, setIsLoadingEdit] = useState(false)
  const [editLoadError, setEditLoadError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const editFetchIdRef = useRef(0)
  const pendingEditShiftRef = useRef<FrontendShift | null>(null)

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
    setEditLoadError(null)
    pendingEditShiftRef.current = null
  }

  const handleOpenAdd = (): void => {
    resetForm()
    setIsShiftModalOpen(true)
  }

  const populateFormFromShift = (shift: FrontendShift): void => {
    const startTime = formatTimeValue(shift.startTime, '09:00')
    const endTime = formatTimeValue(shift.endTime, '18:00')

    setShiftName(shift.name ?? '')
    setShiftStartTime(startTime)
    setShiftEndTime(endTime)
    setShiftStandardHours(formatStandardHours(shift.standardWorkHours))
    setIsLateDeductionRequired(shift.isLateDeductionRequired)
    setLateDeductionPolicies(
      shift.lateDeductionPolicies.length > 0
        ? shift.lateDeductionPolicies.map((policy) => normalizePolicyForForm(policy, startTime))
        : [createEmptyPolicy(startTime)],
    )
  }

  const handleOpenEdit = async (shift: FrontendShift): Promise<void> => {
    const fetchId = ++editFetchIdRef.current
    pendingEditShiftRef.current = shift
    setEditingShift(shift)
    setIsShiftModalOpen(true)
    setIsLoadingEdit(true)
    setEditLoadError(null)

    try {
      const detail = await shiftService.getShiftById(shift.id)
      if (fetchId !== editFetchIdRef.current) return

      if (detail && hasUsableShiftFields(detail)) {
        populateFormFromShift(detail)
        setEditingShift(detail)
        return
      }

      populateFormFromShift(shift)
      setEditingShift(shift)
      const message = 'Could not load full shift details. Showing cached values.'
      setEditLoadError(message)
      toast.error('Could not load full shift details')
    } catch (error: unknown) {
      if (fetchId !== editFetchIdRef.current) return
      populateFormFromShift(shift)
      setEditingShift(shift)
      const message = error instanceof Error ? error.message : 'Failed to load shift details'
      setEditLoadError(`${message}. Showing cached values.`)
      toast.error(message)
    } finally {
      if (fetchId === editFetchIdRef.current) {
        setIsLoadingEdit(false)
      }
    }
  }

  const handleRetryEditLoad = async (): Promise<void> => {
    const shift = pendingEditShiftRef.current ?? editingShift
    if (!shift) return
    await handleOpenEdit(shift)
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
      invalidateEmployeeDropdowns()
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
      invalidateEmployeeDropdowns()
      await onRefresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete shift'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = useCallback((open: boolean): void => {
    if (!open) {
      editFetchIdRef.current += 1
      setIsLoadingEdit(false)
      if (!isSubmitting) {
        resetForm()
      }
    }
    if (!isSubmitting) setIsShiftModalOpen(open)
  }, [isSubmitting])

  return {
    isShiftModalOpen,
    setIsShiftModalOpen: handleDialogOpenChange,
    editingShift,
    isLoadingEdit,
    editLoadError,
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
    handleRetryEditLoad,
    handleSaveShift,
    handleDeleteShift,
  }
}
