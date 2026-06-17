// components/settings/system-settings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Palette } from 'lucide-react'
import { CommonErrorBanner } from '@/components/common'
import { useSystemSettings } from './useSystemSettings'
import { useNotificationSettings } from './useNotificationSettings'

export function SystemSettings() {
  const { lang, theme, setTheme, mounted } = useSystemSettings()
  const {
    status: notificationStatus,
    settings,
    updatingKey,
    handleToggle,
    handleRetry,
  } = useNotificationSettings()

  const isNotificationLoading = notificationStatus === 'loading'
  const isNotificationError = notificationStatus === 'error'
  const showNotificationToggles = notificationStatus === 'success' && settings !== null
  const showNotificationSkeleton = isNotificationLoading || isNotificationError

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">System Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure system notification preferences, localization, and system theme</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base text-cloud font-semibold flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-violet-glow" />
              Notification Channels
            </CardTitle>
            <CardDescription className="text-xs">
              Choose how you receive alerts and transactional updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isNotificationError ? (
              <CommonErrorBanner
                message="Could not load notification settings. Please try again."
                onRetry={handleRetry}
              />
            ) : null}

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-xs font-semibold text-slate-200">Email Notifications</Label>
                <p className="text-[10px] text-slate-400">Receive transactional emails and daily task summaries</p>
              </div>
              {showNotificationSkeleton ? (
                <Skeleton className={cn('h-5 w-9 rounded-full', uiSkeletonBlock)} />
              ) : showNotificationToggles ? (
                <Switch
                  checked={settings.email_notification_enabled}
                  disabled={updatingKey === 'email_notification_enabled'}
                  onCheckedChange={(checked) => handleToggle('email_notification_enabled', checked)}
                  aria-label="Toggle email notifications"
                />
              ) : null}
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label className="text-xs font-semibold text-slate-200">In-app Notifications</Label>
                <p className="text-[10px] text-slate-400">Show alerts inside the HRMS application</p>
              </div>
              {showNotificationSkeleton ? (
                <Skeleton className={cn('h-5 w-9 rounded-full', uiSkeletonBlock)} />
              ) : showNotificationToggles ? (
                <Switch
                  checked={settings.inapp_notification_enabled}
                  disabled={updatingKey === 'inapp_notification_enabled'}
                  onCheckedChange={(checked) => handleToggle('inapp_notification_enabled', checked)}
                  aria-label="Toggle in-app notifications"
                />
              ) : null}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-cloud font-semibold flex items-center gap-2">
                <Palette className="h-4.5 w-4.5 text-violet-glow" />
                Localization & Display
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400">Default Language</Label>
                <Select value={lang} disabled>
                  <SelectTrigger className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-xs text-slate-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English (US)">English (US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">Preferred Theme</Label>
                {!mounted ? (
                  <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                ) : (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-midnight border-border rounded-[20px] [corner-shape:squircle] text-xs text-slate-300 cursor-pointer">
                      <SelectValue placeholder="Select theme..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border/80 rounded-[20px] [corner-shape:squircle]">
                      <SelectItem value="dark" className="cursor-pointer">Dark (Command Center)</SelectItem>
                      <SelectItem value="light" className="cursor-pointer">Light Mode</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
