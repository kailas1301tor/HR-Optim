// components/settings/system-settings.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Bell, Shield, Palette } from 'lucide-react'
import { useSystemSettings } from './useSystemSettings'

interface SystemSettingsProps {
  notifications: {
    emailAlerts: boolean
    documentExpiry: boolean
    leaveRequests: boolean
    payrollUpdates: boolean
    systemUpdates: boolean
  }
  setNotifications: (notifs: SystemSettingsProps['notifications']) => void
}

export function SystemSettings({ notifications, setNotifications }: SystemSettingsProps) {
  const {
    lang,
    setLang,
    theme,
    setTheme,
    mounted,
    handleToggleNotification,
  } = useSystemSettings({ notifications, setNotifications })

  return (
    <div className="space-y-6 outline-none">
      <div className="pb-1 border-b border-border/40">
        <h2 className="text-lg font-semibold text-cloud">System Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Configure system notification preferences, localization, and system theme</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Notification Preferences */}
        <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
          <CardHeader>
            <CardTitle className="text-base text-cloud font-semibold flex items-center gap-2">
              <Bell className="h-4.5 w-4.5 text-violet-glow" />
              Notification Channels
            </CardTitle>
            <CardDescription className="text-xs">Configure where and when you receive automated emails and push alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold text-slate-200">Email Notifications</Label>
                <p className="text-[10px] text-slate-400">Receive transactional emails and daily task summaries</p>
              </div>
              <Switch
                checked={notifications.emailAlerts}
                onCheckedChange={(checked) => handleToggleNotification('emailAlerts', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold text-slate-200">Document Expiry Alerts</Label>
                <p className="text-[10px] text-slate-400">Alert managers 30 days before document or visa expiration</p>
              </div>
              <Switch
                checked={notifications.documentExpiry}
                onCheckedChange={(checked) => handleToggleNotification('documentExpiry', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold text-slate-200">Leave Requests Updates</Label>
                <p className="text-[10px] text-slate-400">Notify when leave applications are submitted or approved</p>
              </div>
              <Switch
                checked={notifications.leaveRequests}
                onCheckedChange={(checked) => handleToggleNotification('leaveRequests', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold text-slate-200">Payroll Processing Notices</Label>
                <p className="text-[10px] text-slate-400">Notify upon payroll draft generation or final releases</p>
              </div>
              <Switch
                checked={notifications.payrollUpdates}
                onCheckedChange={(checked) => handleToggleNotification('payrollUpdates', checked)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-xs font-semibold text-slate-200">System Activity Logs</Label>
                <p className="text-[10px] text-slate-400">Audit system events, backups, and security triggers</p>
              </div>
              <Switch
                checked={notifications.systemUpdates}
                onCheckedChange={(checked) => handleToggleNotification('systemUpdates', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Configurations */}
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
                <Select value={lang} onValueChange={setLang}>
                  <SelectTrigger className="bg-midnight border-border rounded-xl text-xs text-slate-300"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English (US)">English (US)</SelectItem>
                    <SelectItem value="English (UK)">English (UK)</SelectItem>
                    <SelectItem value="Arabic">Arabic (العربية)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans">Preferred Theme</Label>
                {!mounted ? (
                  <Skeleton className={cn('h-10 w-full rounded-xl', uiSkeletonBlock)} />
                ) : (
                  <Select value={theme} onValueChange={setTheme}>
                    <SelectTrigger className="bg-midnight border-border rounded-xl text-xs text-slate-300 cursor-pointer">
                      <SelectValue placeholder="Select theme..." />
                    </SelectTrigger>
                    <SelectContent className="bg-card border border-border/80 rounded-xl">
                      <SelectItem value="dark" className="cursor-pointer">Dark (Command Center)</SelectItem>
                      <SelectItem value="light" className="cursor-pointer">Light Mode</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/40 backdrop-blur border border-border/80 shadow-lg">
            <CardHeader>
              <CardTitle className="text-base text-cloud font-semibold flex items-center gap-2">
                <Shield className="h-4.5 w-4.5 text-violet-glow" />
                Backups & Reliability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-xs font-semibold text-slate-200">Daily Cloud Backup</Label>
                  <p className="text-[10px] text-slate-400">Auto backup database snapshots nightly</p>
                </div>
                <Switch defaultChecked />
              </div>
              <Button variant="outline" className="w-full mt-2 rounded-xl text-xs py-2 bg-midnight/35 border-border/40 hover:bg-violet-core/10 text-slate-300">
                Trigger Manual DB Snapshot
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
