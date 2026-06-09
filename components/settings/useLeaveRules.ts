// components/settings/useLeaveRules.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { leaveRuleService, type LeaveRule, type ConfigureLeaveRulePayload } from '@/services/leave-rule-service'
import { leaveTypeService, type LeaveType } from '@/services/leave-type-service'

export interface UseLeaveRulesReturn {
  leaveRules: LeaveRule[]
  leaveTypes: LeaveType[]
  isLoading: boolean
  isSubmitting: boolean
  isDialogOpen: boolean
  setIsDialogOpen: (open: boolean) => void
  handleConfigureRule: (payload: ConfigureLeaveRulePayload) => Promise<void>
  getLeaveTypeName: (leaveTypeId: number) => string
  reload: () => Promise<void>
}

export function useLeaveRules(): UseLeaveRulesReturn {
  const [leaveRules, setLeaveRules] = useState<LeaveRule[]>([])
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const reload = useCallback(async (): Promise<void> => {
    setIsLoading(true)
    try {
      const [rules, types] = await Promise.all([
        leaveRuleService.getLeaveRules(),
        leaveTypeService.getLeaveTypes(),
      ])
      setLeaveRules(rules)
      setLeaveTypes(types)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load leave rules'
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const getLeaveTypeName = useCallback(
    (leaveTypeId: number): string => {
      const match = leaveTypes.find((t) => t.id === leaveTypeId)
      return match?.name ?? `Type #${leaveTypeId}`
    },
    [leaveTypes]
  )

  const handleConfigureRule = async (payload: ConfigureLeaveRulePayload): Promise<void> => {
    setIsSubmitting(true)
    try {
      await leaveRuleService.configureLeaveRule(payload)
      toast.success('Leave rule configured successfully')
      setIsDialogOpen(false)
      await reload()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to configure leave rule'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    leaveRules,
    leaveTypes,
    isLoading,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleConfigureRule,
    getLeaveTypeName,
    reload,
  }
}
