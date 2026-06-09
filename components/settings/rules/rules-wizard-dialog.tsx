// components/settings/rules/rules-wizard-dialog.tsx
'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRulesWizardDialog } from './useRulesWizardDialog'
import type { PayrollRule } from '../leave-payroll-rules'

interface RulesWizardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ruleEditIndex: number | null
  payrollRules: PayrollRule[]
  onSaveRule: (index: number | null, rule: PayrollRule) => void
}

export function RulesWizardDialog({
  open,
  onOpenChange,
  ruleEditIndex,
  payrollRules,
  onSaveRule,
}: RulesWizardDialogProps) {
  const {
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
  } = useRulesWizardDialog({
    open,
    onOpenChange,
    ruleEditIndex,
    payrollRules,
    onSaveRule,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl bg-card border border-border/80 rounded-2xl p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg font-sans">
            {ruleEditIndex !== null ? 'Edit Payroll Rule' : 'Configure Payroll Rule'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSavePayrollRule} className="space-y-4 pt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-pay-name" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Component Name
              </Label>
              <Input
                id="rule-pay-name"
                value={rulePayName}
                onChange={(e) => setRulePayName(e.target.value)}
                placeholder="e.g. HRA, PF"
                className="bg-midnight border-border rounded-xl text-sm"
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Category</Label>
              <Select value={rulePayCategory} onValueChange={setRulePayCategory}>
                <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Allowance">Allowance</SelectItem>
                  <SelectItem value="Deduction">Deduction</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Trigger Basis</Label>
              <Select value={rulePayTrigger} onValueChange={setRulePayTrigger}>
                <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="None (Fixed / Flat)">None (Fixed / Flat)</SelectItem>
                  <SelectItem value="Hourly Attendance">Hourly Attendance</SelectItem>
                  <SelectItem value="Late Deductions">Late Deductions</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Calculation Type</Label>
              <Select value={rulePayCalcType} onValueChange={setRulePayCalcType}>
                <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fixed Amount">Fixed Amount</SelectItem>
                  <SelectItem value="Percentage (%)">Percentage (%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rule-pay-val" className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Value
              </Label>
              <Input
                id="rule-pay-val"
                value={rulePayValue}
                onChange={(e) => setRulePayValue(e.target.value)}
                placeholder="e.g. 500 or 10"
                className="bg-midnight border-border rounded-xl text-sm"
                required
              />
            </div>
            {rulePayCalcType === 'Percentage (%)' ? (
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Percentage Base</Label>
                <Select value={rulePayBase} onValueChange={setRulePayBase}>
                  <SelectTrigger className="bg-midnight/55 border-border rounded-xl text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Basic Salary">Basic Salary</SelectItem>
                    <SelectItem value="Gross Salary">Gross Salary</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="space-y-2 flex flex-col justify-end pb-2.5">
                <div className="flex items-center gap-3">
                  <Switch checked={rulePayApplyAutomatically} onCheckedChange={setRulePayApplyAutomatically} />
                  <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
                    Auto-Apply
                  </Label>
                </div>
              </div>
            )}
          </div>

          {rulePayCalcType === 'Percentage (%)' && (
            <div className="space-y-2 flex items-center gap-3 pt-2">
              <Switch checked={rulePayApplyAutomatically} onCheckedChange={setRulePayApplyAutomatically} />
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 select-none">
                Apply Automatically
              </Label>
            </div>
          )}

          <DialogFooter className="pt-4 border-t border-border/40 flex justify-end gap-2">
            <DialogClose asChild>
              <Button type="button" variant="outline" className="h-10 rounded-xl cursor-pointer">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-5 cursor-pointer"
            >
              Save Component
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
