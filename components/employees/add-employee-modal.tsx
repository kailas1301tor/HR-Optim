// components/employees/add-employee-modal.tsx
'use client'

import { FormProvider } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { PrimaryButton } from '@/components/ui/primary-button'
import { cn } from '@/lib/utils'
import { type DropdownData } from '@/types/employee'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog'
import type { Employee } from './employee-table-types'
import { BasicInfoStep } from './wizard/basic-info-step'
import { EmploymentDetailsStep } from './wizard/employment-details-step'
import { PersonalInfoStep } from './wizard/personal-info-step'
import { BankInfoStep } from './wizard/bank-info-step'
import { toast } from 'sonner'
import { useAddEmployeeModal } from './useAddEmployeeModal'
import { uiDialog, uiOutlineBtn, uiSkeletonBlock } from '@/lib/ui/design-system'

interface AddEmployeeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (employee: Employee) => void
  editEmployee?: Employee | null
}

export function AddEmployeeModal({ open, onOpenChange, onSuccess, editEmployee }: AddEmployeeModalProps) {
  const {
    addStep,
    isLoading,
    dropdowns,
    isEditMode,
    methods,
    setAddStep,
    onSubmit,
    handleNextStep,
  } = useAddEmployeeModal(open, onOpenChange, onSuccess, editEmployee)

  const { handleSubmit } = methods

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(uiDialog, 'max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto')}>
        <DialogHeader>
          <DialogTitle className="text-cloud font-semibold text-lg">
            {isEditMode ? 'Edit Employee Details' : 'Add Employee'}
          </DialogTitle>
          <div className="flex items-center gap-1.5 pt-2">
            {[1, 2, 3, 4].map((s) => (
              <span key={s} className={cn('h-1.5 flex-1 rounded-full', addStep >= s ? 'bg-violet-core' : 'bg-slate-700')} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Step {addStep} of 4</p>
        </DialogHeader>

        {isLoading && !dropdowns ? (
          <div className="space-y-5 py-6">
            <div className="space-y-2">
              <Skeleton className={cn('h-3 w-1/4 rounded', uiSkeletonBlock)} />
              <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className={cn('h-3 w-1/3 rounded', uiSkeletonBlock)} />
                  <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form
              onSubmit={handleSubmit(onSubmit, (fieldErrors) => {
                const errMsgs = Object.entries(fieldErrors)
                  .map(([key, fieldError]) => {
                    const message = fieldError?.message
                    return `${key}: ${typeof message === 'string' ? message : 'Invalid field'}`
                  })
                  .join(', ')
                toast.error('Form validation failed. Please check all steps.', {
                  description: errMsgs,
                })
              })}
              className="space-y-4 pt-4"
              autoComplete="off"
            >
              {addStep === 1 && <BasicInfoStep isEditMode={isEditMode} dropdowns={dropdowns} />}
              {addStep === 2 && <EmploymentDetailsStep isEditMode={isEditMode} dropdowns={dropdowns} />}
              {addStep === 3 && <PersonalInfoStep isEditMode={isEditMode} dropdowns={dropdowns} />}
              {addStep === 4 && <BankInfoStep isEditMode={isEditMode} />}

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2 pt-4 border-t border-border/40">
                {addStep > 1 ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setAddStep(addStep - 1)}
                    className={cn(uiOutlineBtn, 'text-xs min-h-11 w-full sm:w-auto')}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                ) : (
                  <div className="hidden sm:block" />
                )}
                <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className={cn(uiOutlineBtn, 'text-xs min-h-11')} disabled={isLoading}>
                      Cancel
                    </Button>
                  </DialogClose>
                  {addStep === 4 ? (
                    <PrimaryButton type="submit" isLoading={isLoading} className="text-xs min-h-11">
                      {isEditMode ? 'Update Details' : 'Add Employee'}
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton type="button" onClick={handleNextStep} className="text-xs min-h-11">
                      Next
                    </PrimaryButton>
                  )}
                </div>
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  )
}
