// components/settings/hr-masters/useLeaveRulesMaster.ts
'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'
import { toast } from 'sonner'
import {
  leaveRuleService,
  type LeaveRule,
  type ConfigureLeaveRulePayload,
} from '@/services/leave-rule-service'
import { leaveTypeService, type LeaveType } from '@/services/leave-type-service'
import {
  formatLeaveRuleSubtitle,
  getLeaveTypeName,
} from '@/lib/mappers/leave-rule-mapper'
import type { SettingsMasterItem } from '@/components/settings/shared'

export interface UseLeaveRulesMasterReturn {
  items: SettingsMasterItem[]
  leaveTypes: LeaveType[]
  editingRule: LeaveRule | null
  isLoading: boolean
  hasError: boolean
  isSubmitting: boolean
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  handleConfigureRule: (payload: ConfigureLeaveRulePayload) => Promise<void>
  handleOpenConfigure: () => void
  handleOpenEdit: (ruleId: number) => void
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
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setHasError(false)

    try {
      const [rules, types] = await Promise.all([
        leaveRuleService.getLeaveRules(),
        leaveTypeService.getLeaveTypes(),
      ])
      if (requestId !== requestIdRef.current) return
      setLeaveRules(rules)
      setLeaveTypes(types)
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

  useEffect(() => {
    reload()
  }, [reload])

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

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open) setEditingRule(null)
    setIsDialogOpen(open)
  }

  return {
    items,
    leaveTypes,
    editingRule,
    isLoading,
    hasError,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen: handleDialogOpenChange,
    handleConfigureRule,
    handleOpenConfigure,
    handleOpenEdit,
    reload,
  }
}
