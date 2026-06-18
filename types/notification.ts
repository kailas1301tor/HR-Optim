// types/notification.ts

export interface NotificationSettings {
  email_notification_enabled: boolean
  inapp_notification_enabled: boolean
}

export type UpdateNotificationSettingsPayload = NotificationSettings

export interface Notification {
  id: number
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface GetNotificationsResponse {
  success: boolean
  data: Notification[]
}

export interface MarkReadResponse {
  success: boolean
  message: string
}
