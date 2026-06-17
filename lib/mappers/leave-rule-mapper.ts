// lib/mappers/leave-rule-mapper.ts
import type { LeaveRule } from '@/services/leave-rule-service'
import type { LeaveRuleInput } from '@/validations/leave-rule.schema'

export function formatLeaveRuleSubtitle(rule: LeaveRule): string {
  const parts = [
    `${rule.max_days} days max`,
    `${rule.accrual_rate} accrual/${rule.accrual_frequency}`,
  ]

  if (rule.is_carry_forward && rule.carry_forward_limit) {
    parts.push(`Carry forward up to ${rule.carry_forward_limit}`)
  }

  parts.push(rule.is_paid_leave ? 'Paid' : 'Unpaid')

  return parts.join(' · ')
}

export function getLeaveTypeName(leaveTypes: { id: number; name: string }[], leaveTypeId: number): string {
  const match = leaveTypes.find((type) => type.id === leaveTypeId)
  return match?.name ?? `Type #${leaveTypeId}`
}

function parseNumericField(value: string | null | undefined, fallback = 0): number {
  if (value === null || value === undefined || value === '') return fallback
  const parsed = Number(value)
  return Number.isNaN(parsed) ? fallback : parsed
}

function normalizeAccrualFrequency(value: string): 'monthly' | 'yearly' {
  return value.toLowerCase() === 'yearly' ? 'yearly' : 'monthly'
}

export function mapLeaveRuleToFormValues(rule: LeaveRule): LeaveRuleInput {
  return {
    leave_type: rule.leave_type,
    max_days: parseNumericField(rule.max_days),
    is_carry_forward: rule.is_carry_forward,
    carry_forward_limit: parseNumericField(rule.carry_forward_limit),
    accrual_rate: parseNumericField(rule.accrual_rate),
    accrual_frequency: normalizeAccrualFrequency(rule.accrual_frequency),
    is_paid_leave: rule.is_paid_leave,
    description: rule.description?.trim() || 'Leave policy',
  }
}
