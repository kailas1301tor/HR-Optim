// components/settings/hr-masters/shift-late-deduction-section.tsx
'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { uiInput, uiOutlineBtn, uiSelect } from '@/lib/ui/design-system'
import { FIXED_CALCULATE_TYPE } from '@/types/settings'
import type { LateDeductionPolicy } from '@/types/settings'

const DEDUCTION_TYPE_OPTIONS = [FIXED_CALCULATE_TYPE, 'Percentage'] as const

interface ShiftLateDeductionSectionProps {
  isEnabled: boolean
  onEnabledChange: (enabled: boolean) => void
  policies: LateDeductionPolicy[]
  onPolicyChange: (index: number, field: keyof LateDeductionPolicy, value: string) => void
  onAddPolicy: () => void
  onRemovePolicy: (index: number) => void
  disabled?: boolean
}

export function ShiftLateDeductionSection({
  isEnabled,
  onEnabledChange,
  policies,
  onPolicyChange,
  onAddPolicy,
  onRemovePolicy,
  disabled = false,
}: ShiftLateDeductionSectionProps) {
  return (
    <div className="space-y-4 rounded-[20px] [corner-shape:squircle] border border-border/60 p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-cloud">Late deduction</p>
          <p className="text-xs text-muted-foreground">
            Apply tiered penalties when employees arrive after scheduled start time.
          </p>
        </div>
        <Switch
          checked={isEnabled}
          onCheckedChange={onEnabledChange}
          disabled={disabled}
          aria-label="Enable late deduction policies"
        />
      </div>

      {isEnabled && (
        <div className="space-y-4">
          {policies.map((policy, index) => (
            <div
              key={`policy-${index}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-[16px] [corner-shape:squircle] border border-border/40 p-4"
            >
              <div className="space-y-2 sm:col-span-2 flex items-start justify-between gap-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Tier {index + 1}
                </Label>
                {policies.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-400"
                    onClick={() => onRemovePolicy(index)}
                    disabled={disabled}
                    aria-label={`Remove tier ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Name
                </Label>
                <Input
                  value={policy.name}
                  onChange={(e) => onPolicyChange(index, 'name', e.target.value)}
                  placeholder="Tier 1 Time"
                  className={uiInput}
                  required
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Threshold Time
                </Label>
                <Input
                  type="time"
                  value={policy.time}
                  onChange={(e) => onPolicyChange(index, 'time', e.target.value)}
                  className={uiInput}
                  required
                  disabled={disabled}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Deduction Type
                </Label>
                <Select
                  value={policy.deduction_type || undefined}
                  onValueChange={(value) => onPolicyChange(index, 'deduction_type', value)}
                  disabled={disabled}
                >
                  <SelectTrigger className={uiSelect}>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEDUCTION_TYPE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Value
                </Label>
                <Input
                  value={policy.value}
                  onChange={(e) => onPolicyChange(index, 'value', e.target.value)}
                  placeholder="100.00"
                  className={uiInput}
                  required
                  disabled={disabled}
                />
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="outline"
            className={`gap-2 ${uiOutlineBtn}`}
            onClick={onAddPolicy}
            disabled={disabled}
          >
            <Plus className="h-4 w-4" />
            Add tier
          </Button>
        </div>
      )}
    </div>
  )
}
