// lib/mappers/asset-mapper.ts
import { isAssetInService } from '@/lib/helpers/asset-status'
import type { AssetDropdowns, Asset, CreateAssetPayload } from '@/types/asset'
import type { AssetInput } from '@/validations/asset.schema'

interface DepartmentLike {
  id: number
  name: string
}

export function assetToFormValues(
  asset: Asset,
  dropdowns: AssetDropdowns | null,
  departments: DepartmentLike[]
): AssetInput {
  const typeId = dropdowns?.asset_types.find((t) => t.name === asset.asset_type)?.id
  const categoryId = dropdowns?.asset_categories.find((c) => c.name === asset.asset_category)?.id
  const deptId = departments.find(
    (d) => d.name.toUpperCase() === asset.department?.toUpperCase()
  )?.id
  const statusId = dropdowns?.asset_status.find((s) => s.name === asset.status)?.id

  return {
    id: asset.id,
    name: asset.name,
    serial_number: asset.serial_number || '',
    asset_type: typeId ?? 0,
    asset_category: categoryId ?? 0,
    department: deptId ?? 0,
    location: asset.location || '',
    sub_location: asset.sub_location || '',
    purchase_cost: asset.purchase_cost || '',
    purchase_date: asset.purchase_date || '',
    warranty_period: asset.warranty_period ? String(asset.warranty_period) : '',
    service_due_date: asset.service_due_date || '',
    status: statusId ?? 0,
  }
}

export function defaultAssetFormValues(): AssetInput {
  return {
    name: '',
    serial_number: '',
    asset_type: 0,
    asset_category: 0,
    department: 0,
    location: '',
    sub_location: '',
    purchase_cost: '',
    purchase_date: '',
    warranty_period: '',
    service_due_date: '',
    status: 0,
  }
}

export function formValuesToPayload(data: AssetInput): CreateAssetPayload {
  return {
    name: data.name,
    serial_number: data.serial_number || null,
    asset_type: data.asset_type || null,
    asset_category: data.asset_category || null,
    department: data.department || null,
    location: data.location || null,
    sub_location: data.sub_location || null,
    purchase_cost: data.purchase_cost ? parseFloat(data.purchase_cost) : null,
    purchase_date: data.purchase_date || null,
    warranty_period: data.warranty_period ? parseInt(data.warranty_period, 10) : null,
    service_due_date: data.service_due_date || null,
    status: data.status || null,
  }
}

export function computePageAssetStats(
  assets: Asset[],
  totalCount: number,
  totalPages: number,
  isFiltered: boolean
) {
  const inServiceCount = assets.filter((a) => isAssetInService(a.status)).length
  const totalValue = assets.reduce(
    (sum, a) => sum + (a.purchase_cost ? parseFloat(a.purchase_cost) : 0),
    0
  )
  const utilizationDenominator = Math.max(assets.length, 1)
  const utilizationRate = Math.round((inServiceCount / utilizationDenominator) * 100)
  const isPageScoped = isFiltered || totalPages > 1

  return {
    totalCount,
    inServiceCount,
    utilizationRate,
    totalValue,
    totalValueLabel: `AED ${totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
    isPageScoped,
  }
}
