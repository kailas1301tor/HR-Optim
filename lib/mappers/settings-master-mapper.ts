// lib/mappers/settings-master-mapper.ts
import type { SettingsMasterItem } from '@/types/settings'

export function toMasterItem(record: { id: number; name: string }): SettingsMasterItem {
  return { id: record.id, name: record.name }
}

export function toMasterItems(records: Array<{ id: number; name: string }>): SettingsMasterItem[] {
  return records.map(toMasterItem)
}
