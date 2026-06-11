// components/settings/payroll/usePayRuleChoices.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { payRuleService } from '@/services/pay-rule-service'
import type { PayRuleChoices } from '@/types/settings'

const EMPTY_CHOICES: PayRuleChoices = {
  category_choices: [],
  trigger_basis_choices: [],
  calculate_type_choices: [],
  base_choices: [],
}

export function usePayRuleChoices() {
  const [choices, setChoices] = useState<PayRuleChoices>(EMPTY_CHOICES)
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    const requestId = ++requestIdRef.current
    setIsLoading(true)
    setHasError(false)

    try {
      const data = await payRuleService.getPayRuleChoices()
      if (requestId !== requestIdRef.current) return
      setChoices(data)
    } catch {
      if (requestId !== requestIdRef.current) return
      setHasError(true)
      toast.error('Failed to load pay rule options')
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    choices,
    isLoading,
    hasError,
    reload,
  }
}
