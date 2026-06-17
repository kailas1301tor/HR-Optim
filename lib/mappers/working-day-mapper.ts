// lib/mappers/working-day-mapper.ts
import type {
  BackendWorkingDayConfig,
  CreateWorkingDayConfigPayload,
  UpdateWorkingDayConfigPayload,
  WorkingDay,
  WorkingDaysViewModel,
} from '@/types/settings'

export const WEEKDAY_ORDER = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const

export type WeekdayKey = (typeof WEEKDAY_ORDER)[number]

const WEEKDAY_LABELS: Record<WeekdayKey, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
}

const DEFAULT_START: WeekdayKey = 'monday'
const DEFAULT_END: WeekdayKey = 'friday'

function weekdayIndex(key: WeekdayKey): number {
  return WEEKDAY_ORDER.indexOf(key)
}

export function normalizeWeekday(value: unknown): WeekdayKey | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    const zeroBased = Math.trunc(value)
    if (zeroBased >= 0 && zeroBased <= 6) {
      return WEEKDAY_ORDER[zeroBased]
    }
    const oneBased = zeroBased - 1
    if (oneBased >= 0 && oneBased <= 6) {
      return WEEKDAY_ORDER[oneBased]
    }
    return null
  }

  if (typeof value !== 'string') return null

  const normalized = value.trim().toLowerCase()
  if ((WEEKDAY_ORDER as readonly string[]).includes(normalized)) {
    return normalized as WeekdayKey
  }

  const shortMatch = WEEKDAY_ORDER.find((key) => key.startsWith(normalized.slice(0, 3)))
  return shortMatch ?? null
}

function resolveRangeIndices(
  startWeekDay: unknown,
  endWeekDay: unknown,
): { startIdx: number; endIdx: number } {
  const startKey = normalizeWeekday(startWeekDay) ?? DEFAULT_START
  const endKey = normalizeWeekday(endWeekDay) ?? DEFAULT_END
  let startIdx = weekdayIndex(startKey)
  let endIdx = weekdayIndex(endKey)

  if (startIdx > endIdx) {
    ;[startIdx, endIdx] = [endIdx, startIdx]
  }

  return { startIdx, endIdx }
}

export function mapBackendWorkingDayConfig(raw: unknown): BackendWorkingDayConfig | null {
  if (!raw || typeof raw !== 'object') return null

  const record = raw as Record<string, unknown>
  const idValue = record.id
  const id = typeof idValue === 'number' ? idValue : Number(idValue)
  if (!Number.isFinite(id)) return null

  const startWeekDay =
    record.start_week_day ?? record.startWeekDay ?? record.start_day ?? record.startDay
  const endWeekDay = record.end_week_day ?? record.endWeekDay ?? record.end_day ?? record.endDay

  const startKey = normalizeWeekday(startWeekDay)
  const endKey = normalizeWeekday(endWeekDay)
  if (!startKey || !endKey) return null

  return {
    id,
    start_week_day: startKey,
    end_week_day: endKey,
    is_active: typeof record.is_active === 'boolean' ? record.is_active : undefined,
    deleted: typeof record.deleted === 'boolean' ? record.deleted : undefined,
    created_at: typeof record.created_at === 'string' ? record.created_at : undefined,
    updated_at: typeof record.updated_at === 'string' ? record.updated_at : undefined,
  }
}

export function extractWorkingDayConfigs(data: unknown): BackendWorkingDayConfig[] {
  if (!data) return []
  if (Array.isArray(data)) {
    return data
      .map((entry) => mapBackendWorkingDayConfig(entry))
      .filter((entry): entry is BackendWorkingDayConfig => entry != null)
  }

  const single = mapBackendWorkingDayConfig(data)
  return single ? [single] : []
}

export function configToWeekdayRows(config: BackendWorkingDayConfig | null): WorkingDay[] {
  const { startIdx, endIdx } = resolveRangeIndices(
    config?.start_week_day ?? DEFAULT_START,
    config?.end_week_day ?? DEFAULT_END,
  )

  return WEEKDAY_ORDER.map((key, index) => ({
    id: index,
    key,
    name: WEEKDAY_LABELS[key],
    is_working_day: index >= startIdx && index <= endIdx,
  }))
}

export function rowsToUpdatePayload(
  configId: number,
  items: WorkingDay[],
): UpdateWorkingDayConfigPayload {
  const workingIndices = items
    .map((item, index) => (item.is_working_day ? index : -1))
    .filter((index) => index >= 0)

  if (workingIndices.length === 0) {
    return {
      id: configId,
      start_week_day: DEFAULT_START,
      end_week_day: DEFAULT_START,
    }
  }

  return {
    id: configId,
    start_week_day: WEEKDAY_ORDER[workingIndices[0]],
    end_week_day: WEEKDAY_ORDER[workingIndices[workingIndices.length - 1]],
  }
}

export function rowsToCreatePayload(items: WorkingDay[]): CreateWorkingDayConfigPayload {
  const payload = rowsToUpdatePayload(0, items)
  return {
    start_week_day: payload.start_week_day,
    end_week_day: payload.end_week_day,
  }
}

export function applyWeekdayToggle(
  items: WorkingDay[],
  dayIndex: number,
  isWorkingDay: boolean,
): WorkingDay[] {
  if (dayIndex < 0 || dayIndex >= items.length) return items

  const next = items.map((item, index) =>
    index === dayIndex ? { ...item, is_working_day: isWorkingDay } : item,
  )

  if (isWorkingDay) {
    const trueIndices = next
      .map((item, index) => (item.is_working_day ? index : -1))
      .filter((index) => index >= 0)

    const min = Math.min(...trueIndices)
    const max = Math.max(...trueIndices)

    return next.map((item, index) => ({
      ...item,
      is_working_day: index >= min && index <= max,
    }))
  }

  const workingIndices = next
    .map((item, index) => (item.is_working_day ? index : -1))
    .filter((index) => index >= 0)

  if (workingIndices.length === 0) {
    return next.map((item, index) => ({
      ...item,
      is_working_day: index === dayIndex ? false : item.is_working_day,
    }))
  }

  const startIdx = workingIndices[0]
  const endIdx = workingIndices[workingIndices.length - 1]

  if (dayIndex === startIdx) {
    return next.map((item, index) => ({
      ...item,
      is_working_day: index > dayIndex && index <= endIdx,
    }))
  }

  if (dayIndex === endIdx) {
    return next.map((item, index) => ({
      ...item,
      is_working_day: index >= startIdx && index < dayIndex,
    }))
  }

  if (dayIndex > startIdx && dayIndex < endIdx) {
    const keepEarly = dayIndex - startIdx >= endIdx - dayIndex
    if (keepEarly) {
      return next.map((item, index) => ({
        ...item,
        is_working_day: index >= startIdx && index < dayIndex,
      }))
    }

    return next.map((item, index) => ({
      ...item,
      is_working_day: index > dayIndex && index <= endIdx,
    }))
  }

  return next
}

export function toWorkingDaysViewModel(
  configs: BackendWorkingDayConfig[],
): WorkingDaysViewModel {
  const config = configs[0] ?? null
  return {
    configId: config?.id ?? null,
    items: configToWeekdayRows(config),
  }
}

export function mapBackendConfigToViewModel(raw: unknown): WorkingDaysViewModel {
  return toWorkingDaysViewModel(extractWorkingDayConfigs(raw))
}
