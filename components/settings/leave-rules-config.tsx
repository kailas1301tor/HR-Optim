// components/settings/leave-rules-config.tsx
'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { Plus } from 'lucide-react'
import { useLeaveRules } from './useLeaveRules'
import { LeaveRuleFormDialog } from './leave-rule-form-dialog'

export function LeaveRulesConfig() {
  const {
    leaveRules,
    leaveTypes,
    isLoading,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    handleConfigureRule,
    getLeaveTypeName,
  } = useLeaveRules()

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">Leave Rules Configuration</h2>
        <p className="text-xs text-slate-400 mt-1">
          Configure company-wide leave policies synced with the HRMS backend
        </p>
      </div>

      <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base text-cloud font-semibold">Active Leave Rules</CardTitle>
          <Button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="bg-primary hover:bg-primary/95 text-white font-semibold cursor-pointer shadow-lg shadow-primary/20 gap-2"
          >
            <Plus className="h-4 w-4" />
            Configure Leave Rule
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, idx) => (
              <Skeleton key={idx} className={cn('h-16 w-full rounded-xl', uiSkeletonBlock)} />
            ))
          ) : leaveRules.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">
              No leave rules configured yet. Add your first policy above.
            </p>
          ) : (
            leaveRules.map((rule) => (
              <div
                key={rule.id}
                className="flex items-center justify-between bg-midnight border border-border/60 rounded-xl p-4 hover:border-violet-core/40 transition-all"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-slate-200">
                    {getLeaveTypeName(rule.leave_type)} Policy
                  </span>
                  <span className="text-xs text-slate-400">
                    {rule.max_days} days max · {rule.accrual_rate} accrual/{rule.accrual_frequency}
                    {rule.is_carry_forward ? ` · Carry forward up to ${rule.carry_forward_limit}` : ''}
                    {' · '}{rule.is_paid_leave ? 'Paid' : 'Unpaid'}
                  </span>
                  {rule.description && (
                    <span className="text-xs text-slate-500">{rule.description}</span>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <LeaveRuleFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        leaveTypes={leaveTypes}
        isSubmitting={isSubmitting}
        onSubmit={handleConfigureRule}
      />
    </div>
  )
}
