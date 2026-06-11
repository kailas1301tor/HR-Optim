// components/requests/create-request-page.tsx
'use client'

import { useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, AlertCircle } from 'lucide-react'
import {
  CommonErrorBanner,
  CommonErrorState,
  CommonFilterChips,
  CommonPageHeader,
} from '@/components/common'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { LeaveRequestFormSkeleton } from './forms/leave-request-form-skeleton'
import { typeConfig, type RequestType } from './requests-constants'
import { useCreateRequest, type CreateRequestType } from './useCreateRequest'
import { LeaveRequestForm } from './forms/leave-request-form'
import { SalaryAdvanceRequestForm } from './forms/salary-advance-request-form'
import { LoanRequestForm } from './forms/loan-request-form'
import { DocumentRequestForm } from './forms/document-request-form'
import { usePermissions } from '@/components/auth/permissions-provider'

const REQUEST_TYPE_OPTIONS: CreateRequestType[] = [
  'leave',
  'salary-advance',
  'loan',
  'document',
]

const VALID_TYPES = new Set<string>(REQUEST_TYPE_OPTIONS)

function parseTypeParam(value: string | null): CreateRequestType {
  if (value && VALID_TYPES.has(value)) return value as CreateRequestType
  return 'leave'
}

export function CreateRequestPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isLoading: isPermissionsLoading, canManage } = usePermissions()
  const canManageRequests = canManage('requests')
  const typeParam = parseTypeParam(searchParams.get('type'))

  const {
    selectedType,
    setSelectedType,
    employee,
    isEmployeeLoading,
    employeeError,
    canSubmit,
    leaveTypes,
    holidayEvents,
    existingLeaveDates,
    sessionChoices,
    documentTypeChoices,
    isLoadingMetadata,
    hasMetadataError,
    isCalendarLoading,
    hasCalendarError,
    reloadMetadata,
    isSubmitting,
    handleCalculateLeaveDays,
    handleSubmitLeave,
    handleSubmitSalaryAdvance,
    handleSubmitLoan,
    handleSubmitDocument,
  } = useCreateRequest({ defaultType: typeParam })

  const handleTypeChange = useCallback(
    (type: CreateRequestType): void => {
      setSelectedType(type)
      const nextParams = new URLSearchParams(searchParams.toString())
      nextParams.set('type', type)
      router.replace(`/requests/new?${nextParams.toString()}`)
    },
    [router, searchParams, setSelectedType]
  )

  const handleCancel = useCallback((): void => {
    router.push('/requests')
  }, [router])

  const employeeBanner = useMemo(() => {
    if (isEmployeeLoading) {
      return <Skeleton className={cn('h-4 w-64 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
    }
    if (employee) {
      return (
        <p className="text-sm text-muted-foreground">
          Submitting as{' '}
          <span className="text-slate-300 font-medium">{employee.fullName}</span>
          {employee.employeeCode ? (
            <span className="text-slate-500"> ({employee.employeeCode})</span>
          ) : null}
        </p>
      )
    }
    return (
      <div className="flex items-center gap-2 text-sm text-red-400">
        <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
        <span>{employeeError ?? 'Could not resolve your employee profile'}</span>
      </div>
    )
  }, [employee, employeeError, isEmployeeLoading])

  const isFormLoading = isLoadingMetadata || isEmployeeLoading

  if (!isPermissionsLoading && !canManageRequests) {
    return (
      <CommonErrorState
        title="Access denied"
        message="You do not have permission to create requests."
      />
    )
  }

  return (
    <div className="space-y-6">
      <Link
        href="/requests"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-violet-glow transition-colors w-fit"
        aria-label="Back to requests"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Requests
      </Link>

      <CommonPageHeader title="New Request" subtitle={employeeBanner} />

      <CommonFilterChips
        options={REQUEST_TYPE_OPTIONS.map((type) => ({
          value: type,
          label: typeConfig[type].label,
        }))}
        value={selectedType}
        onChange={(val) => handleTypeChange(val as CreateRequestType)}
        className="flex-wrap"
      />

      <div className="max-w-6xl">
      {hasMetadataError && !isFormLoading ? (
        <CommonErrorState
          title="Failed to load form data"
          message="Request choices or leave types could not be loaded."
          onRetry={reloadMetadata}
        />
      ) : isFormLoading ? (
        selectedType === 'leave' ? (
          <LeaveRequestFormSkeleton />
        ) : (
          <div className="max-w-xl space-y-4">
            <Skeleton className={cn('h-10 w-full rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
            <Skeleton className={cn('h-48 w-full rounded-[32px] [corner-shape:squircle]', uiSkeletonBlock)} />
            <div className="flex justify-end gap-2">
              <Skeleton className={cn('h-10 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
              <Skeleton className={cn('h-10 w-32 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
            </div>
          </div>
        )
      ) : (
        <div key={selectedType}>
          {!canSubmit && (
            <CommonErrorBanner
              message="You cannot submit requests until your employee profile is resolved. Contact HR if this persists."
              className="mb-4"
            />
          )}

          {selectedType === 'leave' && (
            <>
              {hasCalendarError && (
                <CommonErrorBanner
                  message="Leave calendar could not be loaded. You can still submit a request."
                  onRetry={reloadMetadata}
                  className="mb-4"
                />
              )}
              <LeaveRequestForm
                leaveTypes={leaveTypes}
                holidayEvents={holidayEvents}
                existingLeaveDates={existingLeaveDates}
                isCalendarLoading={isCalendarLoading}
                sessionChoices={sessionChoices}
                isSubmitting={isSubmitting || !canSubmit}
                onCalculate={handleCalculateLeaveDays}
                onSubmit={handleSubmitLeave}
                onCancel={handleCancel}
              />
            </>
          )}

          {selectedType !== 'leave' && (
            <div className="max-w-xl rounded-[32px] [corner-shape:squircle] border border-border/60 bg-card/40 p-6">
              {selectedType === 'salary-advance' && (
                <SalaryAdvanceRequestForm
                  isSubmitting={isSubmitting || !canSubmit}
                  onSubmit={handleSubmitSalaryAdvance}
                  onCancel={handleCancel}
                />
              )}
              {selectedType === 'loan' && (
                <LoanRequestForm
                  isSubmitting={isSubmitting || !canSubmit}
                  onSubmit={handleSubmitLoan}
                  onCancel={handleCancel}
                />
              )}
              {selectedType === 'document' && (
                <DocumentRequestForm
                  documentTypeChoices={documentTypeChoices}
                  isSubmitting={isSubmitting || !canSubmit}
                  onSubmit={handleSubmitDocument}
                  onCancel={handleCancel}
                />
              )}
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  )
}
