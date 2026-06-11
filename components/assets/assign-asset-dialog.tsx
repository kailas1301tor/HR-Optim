// components/assets/assign-asset-dialog.tsx
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { CommonEmptyState } from '@/components/common'
import { Loader2, Search, UserCheck } from 'lucide-react'
import { useAssignAssetDialog } from './useAssignAssetDialog'

interface AssignAssetDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  assetId: number
  onSuccess: () => void
}

export function AssignAssetDialog({ open, onOpenChange, assetId, onSuccess }: AssignAssetDialogProps) {
  const {
    searchQuery,
    isLoadingEmployees,
    isSubmitting,
    form,
    selectedEmployeeId,
    employees,
    selectedEmp,
    setSearchQuery,
    onSubmit,
  } = useAssignAssetDialog(open, onOpenChange, assetId, onSuccess)

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = form

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val)
      if (!val) {
        reset()
        setSearchQuery('')
      }
    }}>
      <DialogContent className="bg-card text-foreground border border-border/80 rounded-[32px] [corner-shape:squircle] max-w-md p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-violet-glow" /> Assign Asset
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          {/* Employee Selector Searchable Panel */}
          <div className="space-y-1.5">
            <Label className="text-xs text-slate-400">Select Employee</Label>
            
            {selectedEmp && (
              <div className="bg-violet-core/10 border border-violet-core/30 rounded-[20px] [corner-shape:squircle] p-3 flex justify-between items-center animate-in fade-in-50 duration-200">
                <div>
                  <p className="text-xs font-bold text-cloud">{selectedEmp.full_name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{selectedEmp.employee_id} • {selectedEmp.user?.email}</p>
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setValue('assign_to_employee', 0, { shouldValidate: true })}
                  className="text-xs text-slate-400 hover:text-rose-400 hover:bg-accent rounded-[16px] [corner-shape:squircle] px-2 h-7"
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
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-violet-glow" /> Loading employees...
                    </div>
                  ) : employees.length === 0 ? (
                    <CommonEmptyState
                      icon={UserCheck}
                      title="No employees match"
                      description="Try a different search term."
                      className="py-4 shadow-none border-0 bg-transparent"
                    />
                  ) : (
                    employees.map((emp) => (
                      <button
                        key={emp.id}
                        type="button"
                        onClick={() => setValue('assign_to_employee', emp.id, { shouldValidate: true })}
                        className="w-full text-left p-3 hover:bg-violet-core/5 hover:text-violet-glow focus:bg-violet-core/5 focus:text-violet-glow transition-all flex flex-col gap-0.5 outline-none cursor-pointer"
                      >
                        <span className="text-xs font-bold text-cloud">{emp.full_name}</span>
                        <span className="text-[10px] text-slate-500">{emp.employee_id} • {emp.user?.email}</span>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {errors.assign_to_employee && (
              <p className="text-[11px] text-destructive font-medium">{errors.assign_to_employee.message}</p>
            )}
          </div>

          {/* Remarks text */}
          <div className="space-y-1.5">
            <Label htmlFor="remarks" className="text-xs text-slate-400">Remarks (Optional)</Label>
            <Textarea
              id="remarks"
              placeholder="Provide assignment context, physical state or return deadlines..."
              className="bg-midnight border-border min-h-[80px]"
              {...register('remarks')}
            />
            {errors.remarks && (
              <p className="text-[11px] text-destructive font-medium">{errors.remarks.message}</p>
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
              disabled={isSubmitting || !selectedEmployeeId}
              className="bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-[20px] [corner-shape:squircle] h-10 w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" /> Assigning...
                </>
              ) : (
                'Assign Asset'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
