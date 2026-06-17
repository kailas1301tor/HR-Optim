// components/settings/hr-masters/shifts-master.tsx
'use client'

import { useMemo } from 'react'
import { Clock, Edit3, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  SettingsMasterCard,
  SettingsFormDialog,
  SettingsDeleteDialog,
} from '@/components/settings/shared'
import { uiInput, uiSkeletonBlock } from '@/lib/ui/design-system'
import { CommonErrorBanner, CommonErrorState } from '@/components/common'
import { useShiftsMaster } from './useShiftsMaster'
import { useShiftsList } from './useShiftsList'
import { ShiftLateDeductionSection } from './shift-late-deduction-section'
export function ShiftsMaster() {
  const { shifts, isLoading, hasError, reload } = useShiftsList()
  const {
    isShiftModalOpen,
    setIsShiftModalOpen,
    editingShift,
    isLoadingEdit,
    editLoadError,
    isSubmitting,
    shiftName,
    setShiftName,
    shiftStartTime,
    setShiftStartTime,
    shiftEndTime,
    setShiftEndTime,
    shiftStandardHours,
    setShiftStandardHours,
    isLateDeductionRequired,
    setIsLateDeductionRequired,
    lateDeductionPolicies,
    handlePolicyChange,
    handleAddPolicy,
    handleRemovePolicy,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleRetryEditLoad,
    handleSaveShift,
    handleDeleteShift,
  } = useShiftsMaster({ onRefresh: reload })

  const items = useMemo(
    () =>
      shifts.map((shift) => ({
        id: shift.id,
        name: shift.name,
        subtitle: `${shift.startTime} – ${shift.endTime} | ${shift.standardWorkHours} hrs${
          shift.isLateDeductionRequired
            ? ` | Late deduction: ${shift.lateDeductionPolicies.length} tier(s)`
            : ''
        }`,
      })),
    [shifts]
  )

  const findShift = (id: number) => shifts.find((shift) => shift.id === id)

  if (hasError) {
    return (
      <CommonErrorState
        title="Failed to load shifts"
        message="Please check your connection and try again."
        onRetry={reload}
        className="min-h-[200px]"
      />
    )
  }

  return (
    <>
      <SettingsMasterCard
        title="Shifts"
        items={items}
        isLoading={isLoading}
        emptyIcon={Clock}
        emptyTitle="No shifts found"
        emptyDescription="Add your first shift schedule to get started."
        onAdd={handleOpenAdd}
        onEdit={(item) => {
          const shift = findShift(item.id)
          if (shift) handleOpenEdit(shift)
        }}
        onDelete={(item) => {
          const shift = findShift(item.id)
          if (shift) setDeleteTarget(shift)
        }}
        renderActions={(item) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-violet-glow hover:bg-violet-core/20 border border-border/20 rounded-[16px] [corner-shape:squircle]"
              onClick={() => {
                const shift = findShift(item.id)
                if (shift) handleOpenEdit(shift)
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
                const shift = findShift(item.id)
                if (shift) setDeleteTarget(shift)
              }}
              aria-label={`Delete ${item.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      <SettingsFormDialog
        open={isShiftModalOpen}
        onOpenChange={setIsShiftModalOpen}
        title={editingShift ? 'Edit Shift' : 'Add Shift'}
        description={
          editingShift
            ? 'Update the shift configuration below.'
            : 'Configure a new shift schedule.'
        }
        isSubmitting={isSubmitting || isLoadingEdit}
        size="xl"
        onSubmit={handleSaveShift}
      >
        {isLoadingEdit ? (
          <div className="space-y-4" aria-busy="true" aria-label="Loading shift details">
            <div className={`h-10 w-full rounded-xl ${uiSkeletonBlock}`} />
            <div className={`h-10 w-full rounded-xl ${uiSkeletonBlock}`} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className={`h-10 w-full rounded-xl ${uiSkeletonBlock}`} />
              <div className={`h-10 w-full rounded-xl ${uiSkeletonBlock}`} />
            </div>
            <div className={`h-24 w-full rounded-2xl ${uiSkeletonBlock}`} />
          </div>
        ) : (
          <>
        {editLoadError && (
          <CommonErrorBanner
            message={editLoadError}
            onRetry={() => void handleRetryEditLoad()}
            className="mb-4"
          />
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shift-name" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Shift Name
            </Label>
            <Input
              id="shift-name"
              value={shiftName ?? ''}
              onChange={(e) => setShiftName(e.target.value)}
              placeholder="e.g. MORNING"
              className={uiInput}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shift-standard-hours" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Standard Work Hours
            </Label>
            <Input
              id="shift-standard-hours"
              type="number"
              step="0.5"
              value={shiftStandardHours ?? '8'}
              onChange={(e) => setShiftStandardHours(e.target.value)}
              className={uiInput}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="shift-start" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Start Time
            </Label>
            <Input
              id="shift-start"
              type="time"
              value={shiftStartTime ?? '09:00'}
              onChange={(e) => setShiftStartTime(e.target.value)}
              className={uiInput}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shift-end" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              End Time
            </Label>
            <Input
              id="shift-end"
              type="time"
              value={shiftEndTime ?? '18:00'}
              onChange={(e) => setShiftEndTime(e.target.value)}
              className={uiInput}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        <ShiftLateDeductionSection
          isEnabled={isLateDeductionRequired}
          onEnabledChange={setIsLateDeductionRequired}
          policies={lateDeductionPolicies}
          onPolicyChange={handlePolicyChange}
          onAddPolicy={handleAddPolicy}
          onRemovePolicy={handleRemovePolicy}
          disabled={isSubmitting}
        />
          </>
        )}
      </SettingsFormDialog>

      <SettingsDeleteDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        itemName={deleteTarget?.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteShift}
      />
    </>
  )
}
