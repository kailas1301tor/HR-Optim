// lib/helpers/asset-assignment.ts
import type { Asset } from '@/types/asset'
import { isAssetInService } from '@/lib/helpers/asset-status'

export type AssetAssignmentKind = 'employee' | 'department'

export interface AssetAssignmentDisplay {
  kind: AssetAssignmentKind
  label: string
}

function resolveAssignedLabel(asset: Asset): string | null {
  return (
    asset.assigned?.trim() ||
    asset.assigned_to_employee_name?.trim() ||
    asset.employee_name?.trim() ||
    null
  )
}

export function getAssetAssignmentKind(asset: Asset): AssetAssignmentKind | null {
  if ((asset.assigned_to_employee ?? 0) > 0) return 'employee'
  if ((asset.assigned_department ?? 0) > 0) return 'department'
  return null
}

export function getAssetAssignmentDisplay(asset: Asset): AssetAssignmentDisplay | null {
  const kind = getAssetAssignmentKind(asset)
  const label = resolveAssignedLabel(asset)

  if (kind) {
    return { kind, label: label || 'Assigned' }
  }

  if (label) {
    return { kind: 'employee', label }
  }

  if (isAssetInService(asset.status)) {
    return { kind: 'employee', label: 'Assigned' }
  }

  return null
}

/** Display label for assignee (employee or department assignment). */
export function getAssignedEmployeeDisplay(asset: Asset): string | null {
  return getAssetAssignmentDisplay(asset)?.label ?? null
}
