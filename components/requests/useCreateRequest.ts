// components/requests/useCreateRequest.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { employeeRequestService } from '@/services/employee-request-service'
import { leaveTypeService, type LeaveType } from '@/services/leave-type-service'
import { holidayService } from '@/services/holiday-service'
import { holidaysToDates } from '@/lib/mappers/leave-calendar-mapper'
import type { RequestChoiceItem } from '@/services/employee-request-service'
import { useCurrentEmployee } from '@/hooks/use-current-employee'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import type {
  LeaveRequestInput,
  SalaryAdvanceRequestInput,
  LoanRequestInput,
  DocumentRequestInput,
} from '@/validations/request.schema'
import type { RequestType } from './requests-constants'

export type CreateRequestType = RequestType

interface UseCreateRequestOptions {
  defaultType: CreateRequestType
}

export function useCreateRequest({ defaultType }: UseCreateRequestOptions) {
  const router = useRouter()
  const { employee, isLoading: isEmployeeLoading, error: employeeError } = useCurrentEmployee()

  const [selectedType, setSelectedType] = useState<CreateRequestType>(defaultType)
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([])
  const [sessionChoices, setSessionChoices] = useState<RequestChoiceItem[]>([])
  const [documentTypeChoices, setDocumentTypeChoices] = useState<RequestChoiceItem[]>([])
  const [holidayDates, setHolidayDates] = useState<Date[]>([])
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true)
  const [hasMetadataError, setHasMetadataError] = useState(false)
  const [metadataReloadToken, setMetadataReloadToken] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setSelectedType(defaultType)
  }, [defaultType])

  const reloadMetadata = useCallback(() => {
    setMetadataReloadToken((prev) => prev + 1)
  }, [])

  const metadataFetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++metadataFetchIdRef.current

    const loadMetadata = async (): Promise<void> => {
      setIsLoadingMetadata(true)
      setHasMetadataError(false)
      try {
        const [choices, types, holidays] = await Promise.all([
          employeeRequestService.getRequestChoices(controller.signal),
          leaveTypeService.getLeaveTypes(controller.signal),
          holidayService.getHolidays(controller.signal),
        ])
        if (controller.signal.aborted || fetchId !== metadataFetchIdRef.current) return
        setSessionChoices(choices.session_choices)
        setDocumentTypeChoices(choices.document_request_type_choices)
        setLeaveTypes(types)
        setHolidayDates(holidaysToDates(holidays))
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== metadataFetchIdRef.current) return
        setHasMetadataError(true)
        setSessionChoices([])
        setDocumentTypeChoices([])
        setLeaveTypes([])
        setHolidayDates([])
        toast.error('Failed to load form data')
      } finally {
        if (fetchId === metadataFetchIdRef.current) {
          setIsLoadingMetadata(false)
        }
      }
    }

    void loadMetadata()
    return () => controller.abort()
  }, [metadataReloadToken])

  const handleSuccess = useCallback((): void => {
    router.push('/requests?status=pending')
  }, [router])

  const requireEmployeeId = useCallback((): number | null => {
    if (!employee?.id) {
      toast.error(employeeError ?? 'Could not resolve your employee profile')
      return null
    }
    return employee.id
  }, [employee, employeeError])

  const handleCalculateLeaveDays = useCallback(
    async (
      values: Pick<LeaveRequestInput, 'from_date' | 'to_date' | 'start_session' | 'end_session'>
    ): Promise<number> => {
      return employeeRequestService.calculateLeaveDays(values)
    },
    []
  )

  const handleSubmitLeave = useCallback(
    async (data: LeaveRequestInput): Promise<void> => {
      const employeeId = requireEmployeeId()
      if (!employeeId) return

      setIsSubmitting(true)
      try {
        await employeeRequestService.createLeaveRequest({
          employee: employeeId,
          leave_type: data.leave_type,
          start_session: data.start_session,
          end_session: data.end_session,
          number_of_days: data.number_of_days,
          from_date: data.from_date,
          to_date: data.to_date,
          reason: data.reason,
        })
        toast.success('Leave request submitted successfully')
        handleSuccess()
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, 'Failed to submit leave request'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [requireEmployeeId, handleSuccess]
  )

  const handleSubmitSalaryAdvance = useCallback(
    async (data: SalaryAdvanceRequestInput): Promise<void> => {
      const employeeId = requireEmployeeId()
      if (!employeeId) return

      setIsSubmitting(true)
      try {
        await employeeRequestService.createSalaryAdvanceRequest({
          employee: employeeId,
          request_amount: data.request_amount.toFixed(2),
          tenure: data.tenure,
          reason: data.reason,
        })
        toast.success('Salary advance request submitted successfully')
        handleSuccess()
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, 'Failed to submit salary advance request'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [requireEmployeeId, handleSuccess]
  )

  const handleSubmitLoan = useCallback(
    async (data: LoanRequestInput): Promise<void> => {
      const employeeId = requireEmployeeId()
      if (!employeeId) return

      setIsSubmitting(true)
      try {
        await employeeRequestService.createLoanRequest({
          employee: employeeId,
          request_amount: data.request_amount.toFixed(2),
          tenure: data.tenure,
          reason: data.reason,
        })
        toast.success('Loan request submitted successfully')
        handleSuccess()
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, 'Failed to submit loan request'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [requireEmployeeId, handleSuccess]
  )

  const handleSubmitDocument = useCallback(
    async (data: DocumentRequestInput): Promise<void> => {
      const employeeId = requireEmployeeId()
      if (!employeeId) return

      setIsSubmitting(true)
      try {
        await employeeRequestService.createDocumentRequest({
          employee: employeeId,
          document_type: data.document_type,
          purpose: data.purpose,
        })
        toast.success('Document request submitted successfully')
        handleSuccess()
      } catch (error: unknown) {
        toast.error(getApiErrorMessage(error, 'Failed to submit document request'))
      } finally {
        setIsSubmitting(false)
      }
    },
    [requireEmployeeId, handleSuccess]
  )

  const canSubmit = Boolean(employee?.id) && !isEmployeeLoading && !employeeError

  return {
    selectedType,
    setSelectedType,
    employee,
    isEmployeeLoading,
    employeeError,
    canSubmit,
    leaveTypes,
    holidayDates,
    sessionChoices,
    documentTypeChoices,
    isLoadingMetadata,
    hasMetadataError,
    reloadMetadata,
    isSubmitting,
    handleCalculateLeaveDays,
    handleSubmitLeave,
    handleSubmitSalaryAdvance,
    handleSubmitLoan,
    handleSubmitDocument,
  }
}
