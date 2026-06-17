// components/assets/return-asset-dialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CommonEmptyState } from '@/components/common'
import { cn } from '@/lib/utils'
import { uiTabChipActive, uiTabChipBase, uiTabChipInactive } from '@/lib/ui/design-system'
import { Loader2, ArrowLeft, Search, User, Building2 } from 'lucide-react'
import { useReturnAssetDialog } from './useReturnAssetDialog'

interface ReturnAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: number
  onSuccess: () => void
}

export function ReturnAssetDialog({ open, onOpenChange, assetId, onSuccess }: ReturnAssetDialogProps) {
  const {
    departments,
    employees,
    searchQuery,
    isLoadingDepts,
    isLoadingEmployees,
    isSubmitting,
    returnTarget,
    setReturnTarget,
    form,
    selectedEmployeeId,
    selectedEmp,
    setSearchQuery,
    onSubmit,
  } = useReturnAssetDialog(open, onOpenChange, assetId, onSuccess)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = form

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val)
        if (!val) reset()
      }}
    >
      <DialogContent className="bg-card text-foreground border border-border/80 rounded-[32px] [corner-shape:squircle] max-w-md p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            <ArrowLeft className="w-5 h-5 text-violet-glow" /> Return Asset
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="flex gap-2 p-1 bg-midnight/40 rounded-[20px] [corner-shape:squircle] border border-border/40">
            <button
              type="button"
              onClick={() => setReturnTarget('department')}
              className={cn(
                uiTabChipBase,
                'flex-1 flex items-center justify-center gap-1.5 min-h-10',
                returnTarget === 'department' ? uiTabChipActive : uiTabChipInactive
              )}
            >
              <Building2 className="w-3.5 h-3.5" />
              Department
            </button>
            <button
              type="button"
              onClick={() => setReturnTarget('employee')}
              className={cn(
                uiTabChipBase,
                'flex-1 flex items-center justify-center gap-1.5 min-h-10',
                returnTarget === 'employee' ? uiTabChipActive : uiTabChipInactive
              )}
            >
              <User className="w-3.5 h-3.5" />
              Employee
            </button>
          </div>

          {returnTarget === 'department' ? (
            <div className="space-y-1.5">
              <Label htmlFor="return_to_department" className="text-xs text-slate-400">
                Return to Department
              </Label>
              <Select
                disabled={isLoadingDepts}
                onValueChange={(val) => {
                  setValue('return_target', 'department', { shouldValidate: true })
                  setValue('return_to_department', Number(val), { shouldValidate: true })
                }}
              >
                <SelectTrigger className="w-full bg-midnight border-border">
                  <SelectValue placeholder={isLoadingDepts ? 'Loading...' : 'Select department...'} />
                </SelectTrigger>
                <SelectContent className="bg-popover border border-border">
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={String(dept.id)}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {'return_to_department' in errors && errors.return_to_department && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.return_to_department.message}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <Label className="text-xs text-slate-400">Return to Employee</Label>

              {selectedEmp && (
                <div className="bg-violet-core/10 border border-violet-core/30 rounded-[20px] [corner-shape:squircle] p-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold text-cloud">{selectedEmp.full_name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {selectedEmp.employee_id} • {selectedEmp.user?.email}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setValue('return_to_employee', 0, { shouldValidate: true })}
                    className="text-xs text-slate-400 hover:text-rose-400"
                  >
                    Change
                  </Button>
                </div>
              )}

              {!selectedEmp && (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <Input
                      placeholder="Search name, ID or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 bg-midnight border-border text-sm"
                    />
                  </div>
                  <div className="border border-border/50 rounded-[20px] [corner-shape:squircle] overflow-hidden max-h-[160px] overflow-y-auto bg-midnight/35 divide-y divide-border/30">
                    {isLoadingEmployees ? (
                      <div className="flex p-4 items-center justify-center gap-2 text-xs text-slate-500">
                        <Loader2 className="w-4 h-4 animate-spin text-violet-glow" /> Loading employees...
                      </div>
                    ) : employees.length === 0 ? (
                      <CommonEmptyState
                        icon={User}
                        title="No employees match"
                        description="Try a different search term."
                        className="py-4 shadow-none border-0 bg-transparent"
                      />
                    ) : (
                      employees.map((emp) => (
                        <button
                          key={emp.id}
                          type="button"
                          onClick={() => {
                            setValue('return_target', 'employee', { shouldValidate: true })
                            setValue('return_to_employee', emp.id, { shouldValidate: true })
                          }}
                          className="w-full text-left p-3 hover:bg-violet-core/5 transition-all flex flex-col gap-0.5 outline-none cursor-pointer"
                        >
                          <span className="text-xs font-bold text-cloud">{emp.full_name}</span>
                          <span className="text-[10px] text-slate-500">
                            {emp.employee_id} • {emp.user?.email}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}

              {'return_to_employee' in errors && errors.return_to_employee && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.return_to_employee.message}
                </p>
              )}
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="return_date" className="text-xs text-slate-400">Return Date</Label>
            <Input
              id="return_date"
              type="date"
              className="bg-midnight border-border"
              {...register('return_date')}
            />
            {errors.return_date && (
              <p className="text-[11px] text-destructive font-medium">{errors.return_date.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="service_cost" className="text-xs text-slate-400">
              Final Maintenance/Servicing Cost (AED — Optional)
            </Label>
            <Input
              id="service_cost"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="bg-midnight border-border"
              {...register('service_cost')}
            />
            {errors.service_cost && (
              <p className="text-[11px] text-destructive font-medium">{errors.service_cost.message}</p>
            )}
          </div>

          <DialogFooter className="flex items-center gap-2 pt-4 border-t border-border/40 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
              className="rounded-[20px] [corner-shape:squircle] h-10 w-full"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || (returnTarget === 'employee' && !selectedEmployeeId)}
              className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-[20px] [corner-shape:squircle] h-10 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Returning...
                </>
              ) : (
                'Return Asset'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
