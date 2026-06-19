// services/notification-service.ts
import { api, ApiError } from '@/lib/api'
import type { ApiSingleResponse } from '@/lib/types'
import type {
  GetNotificationsResponse,
  MarkReadResponse,
  Notification,
  NotificationSettings,
  UpdateNotificationSettingsPayload,
} from '@/types/notification'

const NOTIFICATION_SETTINGS_ENDPOINT = '/api/employee/notification-settings/'

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  email_notification_enabled: false,
  inapp_notification_enabled: false,
}

function unwrapBooleanField(value: unknown): boolean | null {
  if (typeof value === 'boolean') return value
  if (value && typeof value === 'object' && 'value' in value) {
    const nested = (value as { value: unknown }).value
    return typeof nested === 'boolean' ? nested : null
  }
  return null
}

function parseSettingsRecord(record: Record<string, unknown>): NotificationSettings | null {
  const email = unwrapBooleanField(record.email_notification_enabled)
  const inapp = unwrapBooleanField(record.inapp_notification_enabled)
  if (email === null || inapp === null) return null
  return {
    email_notification_enabled: email,
    inapp_notification_enabled: inapp,
  }
}

function unwrapNotificationSettings(data: unknown): NotificationSettings | null {
  if (!data || typeof data !== 'object') return null

  const record = data as Record<string, unknown>
  const direct = parseSettingsRecord(record)
  if (direct) return direct

  const wrapped = data as ApiSingleResponse<Record<string, unknown>>
  const nested = wrapped.results?.data
  if (nested && typeof nested === 'object') {
    return parseSettingsRecord(nested as Record<string, unknown>)
  }

  return null
}

export const notificationService = {
  /**
   * Fetches the current user's notification channel preferences.
   * GET /api/employee/notification-settings/ (Bearer auth via api client).
   */
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await api.get<unknown>(NOTIFICATION_SETTINGS_ENDPOINT)
      const settings = unwrapNotificationSettings(response)
      if (!settings) {
        throw new Error('Invalid notification settings response')
      }
      return settings
    } catch (error) {
      if (error instanceof ApiError && (error.status === 403 || error.status === 404 || error.status === 405)) {
        return DEFAULT_NOTIFICATION_SETTINGS
      }
      throw error
    }
  },

  /**
   * Updates notification channel preferences.
   * POST /api/employee/notification-settings/ with JSON body.
   */
  async updateNotificationSettings(
    payload: UpdateNotificationSettingsPayload,
    signal?: AbortSignal,
  ): Promise<NotificationSettings> {
    const response = await api.post<unknown>(NOTIFICATION_SETTINGS_ENDPOINT, payload, { signal })
    const settings = unwrapNotificationSettings(response)
    if (!settings) {
      return payload
    }
    return settings
  },

  /**
   * Fetches user notifications.
   * GET /api/notifications/ (Bearer auth via api client).
   */
  async getNotifications(signal?: AbortSignal): Promise<Notification[]> {
    const response = await api.get<GetNotificationsResponse>('/api/notifications/', { signal })
    return response.data ?? []
  },

  /**
   * Marks a notification as read.
   * POST /api/notifications/read/ with { id }.
   */
  async markAsRead(id: number): Promise<boolean> {
    try {
      const response = await api.post<MarkReadResponse>('/api/notifications/read/', { id })
      return response.success ?? false
    } catch (error) {
      console.warn(`🔴 Network error marking notification ${id} as read:`, error)
      return false
    }
  },
}
