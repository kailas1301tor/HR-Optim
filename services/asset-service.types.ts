// services/asset-service.types.ts
export type {
  AddAMCPayload,
  Asset,
  AssetAMC,
  AssetDisposal,
  AssetDocument,
  AssetDropdowns,
  AssetHistoryEntry,
  AssetListParams,
  AssignAssetPayload,
  BackendAsset,
  CreateAssetPayload,
  DisposeAssetPayload,
  DropdownItem,
  ReturnAssetPayload,
  ScheduleMaintenancePayload,
  StringDropdownItem,
  TransferAssetPayload,
} from '@/types/asset'

import type { Asset, AssetDisposal, AssetDocument, AssetAMC, AssetHistoryEntry, AssetDropdowns } from '@/types/asset'

export interface AssignmentHistoryRaw {
  id: number
  action?: string
  created_at?: string
  date?: string
  transferred_to_employee_name?: string
  transferred_to_department_name?: string
  remarks?: string
}

export interface MaintenanceHistoryRaw {
  id: number
  action?: string
  created_at?: string
  date?: string
  service_provider_name?: string
  service_provider?: number
  estimated_cost?: string
  remarks?: string
}

export interface AssetHistoryRawData {
  assignment_history?: AssignmentHistoryRaw[]
  maintenance_history?: MaintenanceHistoryRaw[]
}

export interface AssetDropdownsResponse {
  message: string
  results: {
    data: AssetDropdowns
  }
}

export interface AssetListResponse {
  message: string
  results: {
    total_count: number
    total_pages: number
    current_page: number
    item_per_page: number
    data: Asset[]
  }
}

export interface SingleAssetResponse {
  message: string
  results: {
    data: Asset
  }
}

export interface AssetHistoryResponse {
  message: string
  results: {
    data: AssetHistoryEntry[] | AssetHistoryRawData
  }
}

export interface AssetDocumentsResponse {
  message: string
  results: {
    data: AssetDocument[]
  }
}

export interface SingleDocumentResponse {
  message: string
  results: {
    data: AssetDocument
  }
}

export interface AssetAMCResponse {
  message: string
  results: {
    data: AssetAMC[]
  }
}

export interface SingleAMCResponse {
  message: string
  results: {
    data: AssetAMC
  }
}

export interface AssetDisposalResponse {
  message: string
  results: {
    data: AssetDisposal | AssetDisposal[]
  }
}

export interface SingleDisposalResponse {
  message: string
  results: {
    data: AssetDisposal
  }
}
