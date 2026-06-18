// components/reports/reports-dashboard.tsx
'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { CommonErrorBanner, CommonPageHeader } from '@/components/common'
import { uiOutlineBtn, uiTabChipActive, uiTabChipBase, uiTabChipInactive } from '@/lib/ui/design-system'
import type { ReportsData } from '@/types/reports'
import { ReportsOverviewTab } from './reports-overview-tab'
import { ReportsEmployeesTab } from './reports-employees-tab'
import { ReportsAttendanceTab } from './reports-attendance-tab'
import { ReportsPayrollTab } from './reports-payroll-tab'
import { ReportsAssetsTab } from './reports-assets-tab'
import { ReportsRequestsTab } from './reports-requests-tab'

type ReportTab = 'overview' | 'employees' | 'attendance' | 'payroll' | 'assets' | 'requests'

const TAB_OPTIONS: { value: ReportTab; label: string }[] = [
  { value: 'overview', label: 'Overview' },
  { value: 'employees', label: 'Employees' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'payroll', label: 'Payroll' },
  { value: 'assets', label: 'Assets' },
  { value: 'requests', label: 'Requests' },
]

interface ReportsDashboardProps {
  data: ReportsData
  isLoading: boolean
  hasError: boolean
  errorMessage: string | null
  onReload: () => void
}

export function ReportsDashboard({
  data,
  isLoading,
  hasError,
  errorMessage,
  onReload,
}: ReportsDashboardProps) {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview')

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <CommonPageHeader
        title="Reports & Analytics"
        subtitle="Live insights across employees, attendance, payroll, assets, and requests"
        action={
          <Button
            variant="outline"
            size="icon"
            className={cn(uiOutlineBtn, 'h-10 w-10')}
            onClick={onReload}
            disabled={isLoading}
            aria-label="Refresh reports"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        }
      />

      {hasError ? (
        <CommonErrorBanner
          message={errorMessage ?? 'Failed to load reports'}
          onRetry={onReload}
        />
      ) : null}

      <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
        {TAB_OPTIONS.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              uiTabChipBase,
              activeTab === tab.value ? uiTabChipActive : uiTabChipInactive,
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' ? (
        <ReportsOverviewTab data={data} isLoading={isLoading} />
      ) : null}

      {activeTab === 'employees' ? (
        <ReportsEmployeesTab data={data.employees} isLoading={isLoading} />
      ) : null}

      {activeTab === 'attendance' ? (
        <ReportsAttendanceTab data={data.attendance} isLoading={isLoading} />
      ) : null}

      {activeTab === 'payroll' ? (
        <ReportsPayrollTab data={data.payroll} isLoading={isLoading} />
      ) : null}

      {activeTab === 'assets' ? (
        <ReportsAssetsTab data={data.assets} isLoading={isLoading} />
      ) : null}

      {activeTab === 'requests' ? (
        <ReportsRequestsTab data={data.requests} isLoading={isLoading} />
      ) : null}
    </div>
  )
}
