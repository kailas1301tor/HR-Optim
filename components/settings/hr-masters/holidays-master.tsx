// components/settings/hr-masters/holidays-master.tsx
'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CalendarDays, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CommonErrorState, CommonFormFieldError } from '@/components/common'
import {
  SettingsMasterCard,
  SettingsFormDialog,
  SettingsDeleteDialog,
} from '@/components/settings/shared'
import { uiInput } from '@/lib/ui/design-system'
import { holidaySchema, type HolidayInput } from '@/validations/holiday.schema'
import { useHolidaysMaster } from './useHolidaysMaster'

export function HolidaysMaster() {
  const {
    items,
    isLoading,
    hasError,
    isSubmitting,
    isDialogOpen,
    setIsDialogOpen,
    editingHoliday,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    reload,
    handleOpenAdd,
    handleOpenEdit,
    handleSave,
    handleDelete,
  } = useHolidaysMaster()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HolidayInput>({
    resolver: zodResolver(holidaySchema),
    defaultValues: { name: '', date: '' },
  })

  useEffect(() => {
    if (!isDialogOpen) return
    reset({
      name: editingHoliday?.name ?? '',
      date: editingHoliday?.date ?? '',
    })
  }, [isDialogOpen, editingHoliday, reset])

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load holidays"
        message="Please check your connection and try again."
        onRetry={reload}
        className="min-h-[200px]"
      />
    )
  }

  return (
    <>
      <SettingsMasterCard
        title="Holidays"
        items={items.map((holiday) => ({
          id: holiday.id,
          name: holiday.name,
          subtitle: holiday.date,
        }))}
        isLoading={isLoading}
        emptyIcon={CalendarDays}
        emptyTitle="No holidays found"
        emptyDescription="Add company holidays for leave calendar planning."
        onAdd={handleOpenAdd}
        onEdit={(item) => {
          const holiday = items.find((entry) => entry.id === item.id)
          if (holiday) handleOpenEdit(holiday)
        }}
        onDelete={(item) => {
          const holiday = items.find((entry) => entry.id === item.id)
          if (holiday) setDeleteTarget(holiday)
        }}
        renderActions={(item) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => {
                const holiday = items.find((entry) => entry.id === item.id)
                if (holiday) handleOpenEdit(holiday)
              }}
              aria-label={`Edit ${item.name}`}
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-red-400 hover:bg-red-500/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => {
                const holiday = items.find((entry) => entry.id === item.id)
                if (holiday) setDeleteTarget(holiday)
              }}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <SettingsFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        title={editingHoliday ? 'Edit Holiday' : 'Add Holiday'}
        description="Configure a named holiday with a specific date."
        isSubmitting={isSubmitting}
        onSubmit={handleSubmit(handleSave)}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="holiday-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Holiday Name
            </Label>
            <Input
              id="holiday-name"
              {...register('name')}
              placeholder="e.g. National Day"
              className={uiInput}
              disabled={isSubmitting}
            />
            {errors.name?.message && <CommonFormFieldError message={errors.name.message} />}
          </div>
          <div className="space-y-2">
            <Label htmlFor="holiday-date" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Date
            </Label>
            <Input
              id="holiday-date"
              type="date"
              {...register('date')}
              className={uiInput}
              disabled={isSubmitting}
            />
            {errors.date?.message && <CommonFormFieldError message={errors.date.message} />}
          </div>
        </div>
      </SettingsFormDialog>

      <SettingsDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  )
}
