// components/settings/hr-masters/useLeaveRulesMaster.ts
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import {
  leaveRuleService,
  type LeaveRule,
  type ConfigureLeaveRulePayload,
} from '@/services/leave-rule-service'
import { employeeService } from '@/services/employee-service'
import type { LeaveType } from '@/services/leave-type-service'
import {
  formatLeaveRuleSubtitle,
  getLeaveTypeName,
} from '@/lib/mappers/leave-rule-mapper'
import { subscribeLeaveTypesInvalidation } from '@/components/settings/invalidate-leave-types'
import type { SettingsMasterItem } from '@/components/settings/shared'

export interface UseLeaveRulesMasterReturn {
  items: SettingsMasterItem[]
  leaveRules: LeaveRule[]
  leaveTypes: LeaveType[]
  editingRule: LeaveRule | null
  isLoading: boolean
  hasError: boolean
  isSubmitting: boolean
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  deleteTarget: LeaveRule | null
  setDeleteTarget: (rule: LeaveRule | null) => void
  isDeleting: boolean
  handleConfigureRule: (payload: ConfigureLeaveRulePayload) => Promise<void>
  handleOpenConfigure: () => void
  handleOpenEdit: (ruleId: number) => void
  handleOpenDelete: (ruleId: number) => void
  handleDeleteRule: () => Promise<void>
  reload: () => Promise<void>
}

export function useLeaveRulesMaster(): UseLeaveRulesMasterReturn {
  const [leaveRules, setLeaveRules] = useState<LeaveRule[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<LeaveRule | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<LeaveRule | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setHasError(false)

    try {
      const [rules, typeItems] = await Promise.all([
        leaveRuleService.getLeaveRules(),
        employeeService.getLeaveTypesFromDropdowns(),
      ])
      if (requestId !== requestIdRef.current) return
      setLeaveRules(rules)
      setLeaveTypes(typeItems.map(({ id, name }) => ({ id, name })))
    } catch (error: unknown) {
      if (requestId !== requestIdRef.current) return
      setHasError(true)
      setLeaveRules([])
      const message = error instanceof Error ? error.message : 'Failed to load leave rules'
      toast.error(message)
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  const reloadLeaveTypes = useCallback(async (): Promise<void> => {
    try {
      const typeItems = await employeeService.getLeaveTypesFromDropdowns()
      setLeaveTypes(typeItems.map(({ id, name }) => ({ id, name })))
    } catch {
      // Leave rules remain usable; type names may be stale until full reload.
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  useEffect(() => {
    return subscribeLeaveTypesInvalidation(() => {
      void reloadLeaveTypes()
    })
  }, [reloadLeaveTypes])

  const items = useMemo<SettingsMasterItem[]>(
    () =>
      leaveRules.map((rule) => {
        const typeName = getLeaveTypeName(leaveTypes, rule.leave_type)
        return {
          id: rule.id,
          name: `${typeName} Policy`,
          subtitle: [
            formatLeaveRuleSubtitle(rule),
            rule.description ?? undefined,
          ]
            .filter(Boolean)
            .join(' — '),
        }
      }),
    [leaveRules, leaveTypes],
  )

  const handleOpenConfigure = (): void => {
    setEditingRule(null)
    setIsDialogOpen(true)
  }

  const handleOpenEdit = (ruleId: number): void => {
    const rule = leaveRules.find((item) => item.id === ruleId)
    if (!rule) return
    setEditingRule(rule)
    setIsDialogOpen(true)
  }

  const handleOpenDelete = (ruleId: number): void => {
    const rule = leaveRules.find((item) => item.id === ruleId)
    if (!rule) return
    setDeleteTarget(rule)
  }

  const handleConfigureRule = async (payload: ConfigureLeaveRulePayload): Promise<void> => {
    setIsSubmitting(true)
    try {
      await leaveRuleService.configureLeaveRule({
        ...payload,
        ...(editingRule ? { id: editingRule.id } : {}),
      })
      toast.success(editingRule ? 'Leave rule updated successfully' : 'Leave rule configured successfully')
      setIsDialogOpen(false)
      setEditingRule(null)
      await reload()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to configure leave rule'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteRule = async (): Promise<void> => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await leaveRuleService.deleteLeaveRule(deleteTarget.id)
      toast.success('Leave rule deleted successfully')
      setDeleteTarget(null)
      await reload()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete leave rule'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open) setEditingRule(null)
    setIsDialogOpen(open)
  }

  return {
    items,
    leaveRules,
    leaveTypes,
    editingRule,
    isLoading,
    hasError,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen: handleDialogOpenChange,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleConfigureRule,
    handleOpenConfigure,
    handleOpenEdit,
    handleOpenDelete,
    handleDeleteRule,
    reload,
  }
}
