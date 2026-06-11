// services/pay-rule-service.ts
import { api } from '@/lib/api'
import type { DropdownItem } from '@/lib/types'
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

function normalizeChoiceList(raw: unknown): DropdownItem[] {
  if (!Array.isArray(raw)) return []

  return raw.map((entry, index) => {
    if (typeof entry === 'string') {
      return { id: index + 1, name: entry }
    }
    if (entry && typeof entry === 'object') {
      const record = entry as Record<string, unknown>
      const name = String(record.name ?? record.label ?? record.value ?? '')
      const id = Number(record.id ?? index + 1)
      return { id: Number.isFinite(id) ? id : index + 1, name }
    }
    return { id: index + 1, name: String(entry) }
  }).filter((item) => item.name.length > 0)
}

function mapChoicesResponse(data: Record<string, unknown>): PayRuleChoices {
  const pick = (...keys: string[]): DropdownItem[] => {
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
