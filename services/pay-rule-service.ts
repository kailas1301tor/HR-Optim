// services/pay-rule-service.ts
import { api } from '@/lib/api'
import type { StringDropdownItem } from '@/lib/types'
import type {
  CreatePayRulePayload,
  PayRule,
  PayRuleChoices,
  UpdatePayRulePayload,
} from '@/types/settings'

interface PayRuleListResponse {
  message: string
  results: {
    data: PayRule[]
  }
}

interface SinglePayRuleResponse {
  message: string
  results: {
    data: PayRule
  }
}

interface PayRuleChoicesResponse {
  message: string
  results: {
    data: Record<string, unknown>
  }
}

function normalizeChoiceList(raw: unknown): StringDropdownItem[] {
  if (!Array.isArray(raw)) return []

  return raw
    .map((entry) => {
      if (typeof entry === 'string') {
        return { id: entry, name: entry }
      }
      if (entry && typeof entry === 'object') {
        const record = entry as Record<string, unknown>
        const apiValue = String(record.value ?? record.id ?? record.name ?? record.label ?? '')
        const label = String(record.label ?? record.name ?? record.value ?? apiValue)
        return { id: apiValue, name: label }
      }
      const fallback = String(entry)
      return { id: fallback, name: fallback }
    })
    .filter((item) => item.id.length > 0)
}

function mapChoicesResponse(data: Record<string, unknown>): PayRuleChoices {
  const pick = (...keys: string[]): StringDropdownItem[] => {
    for (const key of keys) {
      if (key in data) return normalizeChoiceList(data[key])
    }
    return []
  }

  return {
    category_choices: pick('category_choices', 'categories', 'category'),
    trigger_basis_choices: pick('trigger_basis_choices', 'trigger_basis', 'trigger_bases'),
    calculate_type_choices: pick('calculate_type_choices', 'calculate_types', 'calculate_type'),
    base_choices: pick('base_choices', 'bases', 'base'),
  }
}

export const payRuleService = {
  async getPayRuleChoices(signal?: AbortSignal): Promise<PayRuleChoices> {
    const response = await api.get<PayRuleChoicesResponse>('/api/master/pay-rules/choices/', { signal })
    return mapChoicesResponse(response.results?.data ?? {})
  },

  async getPayRules(signal?: AbortSignal): Promise<PayRule[]> {
    const response = await api.get<PayRuleListResponse>('/api/master/pay-rules/', { signal })
    return response.results?.data ?? []
  },

  async createPayRule(payload: CreatePayRulePayload): Promise<PayRule> {
    const response = await api.post<SinglePayRuleResponse>('/api/master/pay-rules/', payload)
    return response.results.data
  },

  async updatePayRule(payload: UpdatePayRulePayload): Promise<PayRule> {
    const response = await api.put<SinglePayRuleResponse>('/api/master/pay-rules/', payload)
    return response.results.data
  },

  async deletePayRule(id: number): Promise<void> {
    await api.delete('/api/master/pay-rules/', { params: { id } })
  },
}
