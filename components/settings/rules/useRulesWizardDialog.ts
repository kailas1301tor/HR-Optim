// components/settings/rules/useRulesWizardDialog.ts
import { useState, useEffect } from 'react'
import type { PayrollRule } from '../leave-payroll-rules'

export interface UseRulesWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruleEditIndex: number | null
  payrollRules: PayrollRule[]
  onSaveRule: (index: number | null, rule: PayrollRule) => void
}

export interface UseRulesWizardDialogReturn {
  rulePayName: string
  setRulePayName: (name: string) => void
  rulePayCategory: 'Allowance' | 'Deduction'
  setRulePayCategory: (cat: 'Allowance' | 'Deduction') => void
  rulePayTrigger: string
  setRulePayTrigger: (trigger: string) => void
  rulePayCalcType: 'Fixed Amount' | 'Percentage (%)'
  setRulePayCalcType: (calcType: 'Fixed Amount' | 'Percentage (%)') => void
  rulePayValue: string
  setRulePayValue: (val: string) => void
  rulePayBase: string
  setRulePayBase: (base: string) => void
  rulePayApplyAutomatically: boolean
  setRulePayApplyAutomatically: (val: boolean) => void
  handleSavePayrollRule: (e: React.FormEvent) => void
}

export function useRulesWizardDialog({
  open,
  onOpenChange,
  ruleEditIndex,
  payrollRules,
  onSaveRule,
}: UseRulesWizardDialogProps): UseRulesWizardDialogReturn {
  const [rulePayName, setRulePayName] = useState('')
  const [rulePayCategory, setRulePayCategory] = useState<'Allowance' | 'Deduction'>('Allowance')
  const [rulePayTrigger, setRulePayTrigger] = useState('None (Fixed / Flat)')
  const [rulePayCalcType, setRulePayCalcType] = useState<'Fixed Amount' | 'Percentage (%)'>('Fixed Amount')
  const [rulePayValue, setRulePayValue] = useState('')
  const [rulePayBase, setRulePayBase] = useState('Basic Salary')
  const [rulePayApplyAutomatically, setRulePayApplyAutomatically] = useState(true)

  useEffect(() => {
    if (!open) return

    if (ruleEditIndex !== null) {
      const rule = payrollRules[ruleEditIndex]
      if (rule) {
        setRulePayName(rule.name)
        setRulePayCategory(rule.category)
        setRulePayTrigger(rule.triggerBasis)
        setRulePayCalcType(rule.calculationType)
        setRulePayValue(rule.value)
        setRulePayBase(rule.baseIfPercentage)
        setRulePayApplyAutomatically(rule.applyAutomatically)
      }
      return
    }

    setRulePayName('')
    setRulePayCategory('Allowance')
    setRulePayTrigger('None (Fixed / Flat)')
    setRulePayCalcType('Fixed Amount')
    setRulePayValue('')
    setRulePayBase('Basic Salary')
    setRulePayApplyAutomatically(true)
  }, [open, ruleEditIndex, payrollRules])

  const handleSavePayrollRule = (e: React.FormEvent): void => {
    e.preventDefault()
    if (!rulePayName.trim()) return

    const newRule: PayrollRule = {
      id: ruleEditIndex !== null ? payrollRules[ruleEditIndex]?.id || `rule-${Date.now()}` : `rule-${Date.now()}`,
      type: 'payroll',
      name: rulePayName.trim(),
      category: rulePayCategory,
      triggerBasis: rulePayTrigger,
      calculationType: rulePayCalcType,
      value: rulePayValue.trim(),
      baseIfPercentage: rulePayBase,
      applyAutomatically: rulePayApplyAutomatically,
    }
    onSaveRule(ruleEditIndex, newRule)
    onOpenChange(false)
  }

  return {
    rulePayName,
    setRulePayName,
    rulePayCategory,
    setRulePayCategory,
    rulePayTrigger,
    setRulePayTrigger,
    rulePayCalcType,
    setRulePayCalcType,
    rulePayValue,
    setRulePayValue,
    rulePayBase,
    setRulePayBase,
    rulePayApplyAutomatically,
    setRulePayApplyAutomatically,
    handleSavePayrollRule,
  }
}
