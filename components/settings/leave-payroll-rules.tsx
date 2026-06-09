// components/settings/leave-payroll-rules.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, Edit3 } from 'lucide-react'
import { CommonStatusBadge } from '@/components/common'
import { uiSectionHeader } from '@/lib/ui/design-system'
import { RulesWizardDialog } from './rules/rules-wizard-dialog'

export interface PayrollRule {
  id: string
  type: 'payroll'
  name: string
  category: 'Allowance' | 'Deduction'
  triggerBasis: string
  calculationType: 'Fixed Amount' | 'Percentage (%)'
  value: string
  baseIfPercentage: string
  applyAutomatically: boolean
}

export type Rule = PayrollRule

interface LeavePayrollRulesProps {
  payrollRules: PayrollRule[]
  setPayrollRules: (rules: PayrollRule[]) => void
}

export function LeavePayrollRules({
  payrollRules,
  setPayrollRules,
}: LeavePayrollRulesProps) {
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false)
  const [ruleEditIndex, setRuleEditIndex] = useState<number | null>(null)

  const handleOpenConfigureRules = (): void => {
    setRuleEditIndex(null)
    setIsRulesModalOpen(true)
  }

  const handleOpenEditRule = (index: number): void => {
    setRuleEditIndex(index)
    setIsRulesModalOpen(true)
  }

  const handleSaveRule = (index: number | null, rule: PayrollRule): void => {
    if (index !== null) {
      const updated = [...payrollRules]
      updated[index] = rule
      setPayrollRules(updated)
    } else {
      setPayrollRules([...payrollRules, rule])
    }
  }

  return (
    <div className="space-y-6 outline-none">
      <div className={uiSectionHeader}>
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-cloud">Payroll Rules Configuration</h2>
          <CommonStatusBadge variant="draft" label="Preview — not persisted" />
        </div>
        <p className="text-xs text-muted-foreground mt-1">Configure salary components and payroll policies (local preview)</p>
      </div>

      <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Active Payroll Rules</CardTitle>
          <Button
            type="button"
            onClick={handleOpenConfigureRules}
            className="bg-primary hover:bg-primary/95 text-white font-semibold cursor-pointer shadow-lg shadow-primary/20"
          >
            <Plus className="h-4 w-4 mr-1" />
            Configure Payroll Rule
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {payrollRules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No payroll rules configured yet.
            </p>
          ) : (
            payrollRules.map((rule, index) => (
              <div
                key={rule.id}
                className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-3 hover:border-violet-core/40 transition-all group"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-200">{rule.name}</span>
                  <span className="text-xs text-slate-400">
                    {rule.category} | {rule.calculationType} ({rule.value}
                    {rule.calculationType === 'Percentage (%)' ? `% of ${rule.baseIfPercentage}` : ''})
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => handleOpenEditRule(index)}
                    aria-label="Edit payroll rule"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-lg cursor-pointer"
                    onClick={() => setPayrollRules(payrollRules.filter((_, i) => i !== index))}
                    aria-label="Delete payroll rule"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <RulesWizardDialog
        open={isRulesModalOpen}
        onOpenChange={setIsRulesModalOpen}
        ruleEditIndex={ruleEditIndex}
        payrollRules={payrollRules}
        onSaveRule={handleSaveRule}
      />
    </div>
  )
}
