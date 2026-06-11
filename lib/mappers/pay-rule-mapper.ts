// lib/mappers/pay-rule-mapper.ts
import type { CreatePayRulePayload, PayRule, UpdatePayRulePayload } from '@/types/settings'
import { FIXED_CALCULATE_TYPE } from '@/types/settings'
import type { PayRuleInput } from '@/validations/pay-rule.schema'

export function isFixedCalculateType(calculateType: string): boolean {
  return calculateType === FIXED_CALCULATE_TYPE
}

export function payRuleToFormValues(rule: PayRule): PayRuleInput {
  return {
    name: rule.name,
    category: rule.category,
    trigger_basis: rule.trigger_basis,
    calculate_type: rule.calculate_type,
    value: rule.value,
    base: rule.base ?? '',
  }
}

function buildPayloadFields(input: PayRuleInput): CreatePayRulePayload {
  const payload: CreatePayRulePayload = {
    name: input.name.trim(),
    category: input.category,
    trigger_basis: input.trigger_basis,
    calculate_type: input.calculate_type,
    value: input.value.trim(),
  }

  if (!isFixedCalculateType(input.calculate_type) && input.base?.trim()) {
    payload.base = input.base.trim()
  }

  return payload
}

export function formValuesToCreatePayload(input: PayRuleInput): CreatePayRulePayload {
  return buildPayloadFields(input)
}

export function formValuesToUpdatePayload(id: number, input: PayRuleInput): UpdatePayRulePayload {
  return { id, ...buildPayloadFields(input) }
}

export function formatPayRuleSubtitle(rule: PayRule): string {
  const valueLabel = isFixedCalculateType(rule.calculate_type)
    ? rule.value
    : `${rule.value}% of ${rule.base ?? '—'}`
  return `${rule.category} | ${rule.calculate_type} (${valueLabel})`
}
