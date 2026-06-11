// components/settings/payroll/usePayRulesMaster.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { toastAndRethrow } from '@/lib/helpers/toast-and-rethrow'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import {
  formValuesToCreatePayload,
  formValuesToUpdatePayload,
} from '@/lib/mappers/pay-rule-mapper'
import { payRuleService } from '@/services/pay-rule-service'
import type { PayRule } from '@/types/settings'
import type { PayRuleInput } from '@/validations/pay-rule.schema'

export function usePayRulesMaster() {
  const [items, setItems] = useState<PayRule[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PayRule | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError,
      fetcher: () => payRuleService.getPayRules(),
      onSuccess: setItems,
      errorMessage: 'Failed to load pay rules',
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

  const handleOpenEdit = (rule: PayRule): void => {
    setEditingId(rule.id)
    setIsDialogOpen(true)
  }

  const handleSave = async (data: PayRuleInput): Promise<void> => {
    setIsSubmitting(true)
    try {
      if (editingId !== null) {
        await payRuleService.updatePayRule(formValuesToUpdatePayload(editingId, data))
      } else {
        await payRuleService.createPayRule(formValuesToCreatePayload(data))
      }
      setIsDialogOpen(false)
      await reload()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to save pay rule')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (!deleteTarget) return
    setIsDeleting(true)
    try {
      await payRuleService.deletePayRule(deleteTarget.id)
      setDeleteTarget(null)
      await reload()
    } catch (error: unknown) {
      toastAndRethrow(error, 'Failed to delete pay rule')
    } finally {
      setIsDeleting(false)
    }
  }

  const editingRule = editingId !== null ? items.find((item) => item.id === editingId) ?? null : null

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
    editingRule,
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
