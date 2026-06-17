// components/payroll/usePayrollActions.ts
'use client'

import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { downloadBlob } from '@/lib/helpers/download-blob'
import { payrollService } from '@/services/payroll-service'
import type {
  AddPayrollAdjustmentPayload,
  GeneratePayrollPayload,
  PayrollAdjustmentType,
  PayrollExportParams,
  PayrollRecord,
} from '@/types/payroll'

export interface UsePayrollActionsProps {
  onSuccess: () => void
  exportParams: PayrollExportParams
}

export interface UsePayrollActionsReturn {
  isGenerateOpen: boolean
  setIsGenerateOpen: (open: boolean) => void
  isGenerating: boolean
  handleGenerate: (payload: GeneratePayrollPayload) => Promise<void>
  adjustmentTarget: PayrollRecord | null
  setAdjustmentTarget: (record: PayrollRecord | null) => void
  isAdjusting: boolean
  handleAddAdjustment: (input: {
    adjustment_type: PayrollAdjustmentType
    description: string
    amount: string
    reason: string
  }) => Promise<void>
  isFinalizing: boolean
  handleFinalize: (payrollIds: number[]) => Promise<void>
  handleExportWps: () => Promise<void>
  handleExportDepartmentSummary: () => Promise<void>
  isExporting: boolean
}

export function usePayrollActions({ onSuccess, exportParams }: UsePayrollActionsProps): UsePayrollActionsReturn {
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [adjustmentTarget, setAdjustmentTarget] = useState<PayrollRecord | null>(null)
  const [isAdjusting, setIsAdjusting] = useState(false)
  const [isFinalizing, setIsFinalizing] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  const handleGenerate = useCallback(
    async (payload: GeneratePayrollPayload) => {
      setIsGenerating(true)
      try {
        await payrollService.generatePayroll(payload)
        toast.success('Payroll generated successfully')
        setIsGenerateOpen(false)
        onSuccess()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to generate payroll'
        toast.error(message)
      } finally {
        setIsGenerating(false)
      }
    },
    [onSuccess],
  )

  const handleAddAdjustment = useCallback(
    async (input: {
      adjustment_type: PayrollAdjustmentType
      description: string
      amount: string
      reason: string
    }) => {
      if (!adjustmentTarget) return

      setIsAdjusting(true)
      try {
        const payload: AddPayrollAdjustmentPayload = {
          payroll: adjustmentTarget.id,
          adjustment_type: input.adjustment_type,
          description: input.description.trim(),
          amount: input.amount.trim(),
          reason: input.reason.trim(),
        }
        await payrollService.addAdjustment(payload)
        toast.success('Adjustment added successfully')
        setAdjustmentTarget(null)
        onSuccess()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to add adjustment'
        toast.error(message)
      } finally {
        setIsAdjusting(false)
      }
    },
    [adjustmentTarget, onSuccess],
  )

  const handleFinalize = useCallback(
    async (payrollIds: number[]) => {
      if (payrollIds.length === 0) return

      setIsFinalizing(true)
      try {
        await payrollService.finalizePayroll({ payroll_ids: payrollIds })
        toast.success(
          payrollIds.length === 1
            ? 'Payroll finalized successfully'
            : `${payrollIds.length} payroll records finalized`,
        )
        onSuccess()
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'Failed to finalize payroll'
        toast.error(message)
      } finally {
        setIsFinalizing(false)
      }
    },
    [onSuccess],
  )

  const handleExportWps = useCallback(async () => {
    setIsExporting(true)
    try {
      const { blob, filename } = await payrollService.exportPayrollExcel(exportParams)
      downloadBlob(blob, filename)
      toast.success('Payroll export downloaded')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to export payroll'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }, [exportParams])

  const handleExportDepartmentSummary = useCallback(async () => {
    setIsExporting(true)
    try {
      const { blob, filename } = await payrollService.exportDepartmentSummary(exportParams)
      downloadBlob(blob, filename)
      toast.success('Department summary downloaded')
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to export department summary'
      toast.error(message)
    } finally {
      setIsExporting(false)
    }
  }, [exportParams])

  return {
    isGenerateOpen,
    setIsGenerateOpen,
    isGenerating,
    handleGenerate,
    adjustmentTarget,
    setAdjustmentTarget,
    isAdjusting,
    handleAddAdjustment,
    isFinalizing,
    handleFinalize,
    handleExportWps,
    handleExportDepartmentSummary,
    isExporting,
  }
}
