// components/employees/employee-profile-drawer.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { uiSkeletonBlock, uiTabChipActive, uiTabChipBase, uiTabChipInactive } from '@/lib/ui/design-system'
import { CommonErrorState, CommonStatusBadge } from '@/components/common'
import { getEmployeeStatusBadgeVariant } from '@/lib/ui/design-system'
import {
  X,
  Building2,
  Pencil,
} from 'lucide-react'
import type { Employee } from './employee-table-types'
import { PersonalTab } from './profile/personal-tab'
import { OnboardingChecklistTab } from './profile/onboarding-checklist-tab'
import { OffboardingChecklistTab } from './profile/offboarding-checklist-tab'
import { ClipboardCheck, FileX } from 'lucide-react'
import { employeeService } from '@/services/employee-service'

interface EmployeeProfileDrawerProps {
  employee: Employee | null
  open: boolean
  detailVersion?: number
  onClose: () => void
  onEdit: (employee: Employee) => void
}

const tabs = [
  { id: 'personal', label: 'Personal', icon: Building2 },
  { id: 'onboarding', label: 'Onboarding', icon: ClipboardCheck },
  { id: 'offboarding', label: 'Offboarding', icon: FileX },
] as const

export function EmployeeProfileDrawer({ employee, open, detailVersion = 0, onClose, onEdit }: EmployeeProfileDrawerProps) {
  const [activeTab, setActiveTab] = useState('personal')
  const [detailedEmployee, setDetailedEmployee] = useState<Employee | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fetchIdRef = useRef(0)

  const fetchDetail = async (id: number, signal?: AbortSignal) => {
    const fetchId = ++fetchIdRef.current
    setIsLoadingDetail(true)
    setError(null)
    try {
      const data = await employeeService.getEmployee(id, signal)
      if (signal?.aborted || fetchId !== fetchIdRef.current) return
      setDetailedEmployee(data)
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      if (fetchId !== fetchIdRef.current) return
      console.error('Failed to load employee details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load employee details')
    } finally {
      if (fetchId === fetchIdRef.current) {
        setIsLoadingDetail(false)
      }
    }
  }

  useEffect(() => {
    setActiveTab('personal')
  }, [employee?.id])

  useEffect(() => {
    if (!open || !employee?.id) {
      setDetailedEmployee(null)
      setError(null)
      return
    }
    const controller = new AbortController()
    fetchDetail(employee.id, controller.signal)
    return () => {
      controller.abort()
    }
  }, [open, employee?.id, detailVersion])

  if (!employee) return null

  const displayEmployee = detailedEmployee || employee

  const initials = displayEmployee.full_name
    ? displayEmployee.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM'

  const currentStatus = displayEmployee.status || 'Active'
  const statusVariant = getEmployeeStatusBadgeVariant(currentStatus)

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/70 z-50"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-[600px] bg-carbon border-l border-border z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4 min-w-0">
                  <Avatar className="w-14 h-14 sm:w-16 sm:h-16 shrink-0">
                    <AvatarFallback className="bg-gradient-to-br from-violet-core to-violet-glow text-white text-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-xl font-semibold text-cloud truncate">{displayEmployee.full_name}</h2>
                    <p className="text-sm text-muted-foreground truncate">{displayEmployee.designation}</p>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5">
                      <span className="text-[11px] font-mono font-semibold text-violet-glow bg-violet-core/10 border border-violet-core/20 px-2 py-0.5 rounded-md">
                        {displayEmployee.employee_id}
                      </span>
                      <CommonStatusBadge variant={statusVariant} label={currentStatus} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => onEdit(displayEmployee)}>
                    <Pencil className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close profile">
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      uiTabChipBase,
                      'flex items-center gap-2 whitespace-nowrap',
                      activeTab === tab.id ? uiTabChipActive : uiTabChipInactive
                    )}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {activeTab === 'personal' && (
                isLoadingDetail ? (
                  <PersonalTabSkeleton />
                ) : error ? (
                  <CommonErrorState
                    title="Failed to load details"
                    message={error}
                    onRetry={() => fetchDetail(employee.id)}
                  />
                ) : (
                  <PersonalTab employee={displayEmployee} />
                )
              )}
              {activeTab === 'onboarding' && (
                <OnboardingChecklistTab employeeId={displayEmployee.id} />
              )}
              {activeTab === 'offboarding' && (
                <OffboardingChecklistTab employeeId={displayEmployee.id} />
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function PersonalTabSkeleton() {
  return (
    <div className="space-y-6" aria-label="Loading employee details" role="status">
      <div>
        <Skeleton className={cn('h-3 w-32 rounded-[20px] [corner-shape:squircle] mb-3', uiSkeletonBlock)} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-midnight/60 border border-border/40 rounded-[20px] [corner-shape:squircle] p-3 flex flex-col gap-2">
              <Skeleton className={cn('w-8 h-8 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              <div className="space-y-1.5">
                <Skeleton className={cn('h-2 w-12 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                <Skeleton className={cn('h-3 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              </div>
            </div>
          ))}
        </div>
        <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle] mt-3', uiSkeletonBlock)} />
      </div>

      <div>
        <Skeleton className={cn('h-3 w-28 rounded-[20px] [corner-shape:squircle] mb-3', uiSkeletonBlock)} />
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-midnight/40 border border-border/40 rounded-[20px] [corner-shape:squircle] p-4 flex items-start gap-3">
              <Skeleton className={cn('w-9 h-9 rounded-[20px] [corner-shape:squircle] shrink-0', uiSkeletonBlock)} />
              <div className="space-y-1.5 flex-1">
                <Skeleton className={cn('h-2 w-12 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                <Skeleton className={cn('h-3.5 w-24 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Skeleton className={cn('h-3 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
        <Skeleton className={cn('h-20 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
      </div>
    </div>
  )
}

