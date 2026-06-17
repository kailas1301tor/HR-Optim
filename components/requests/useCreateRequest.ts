// components/requests/useCreateRequest.ts
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { employeeRequestService } from '@/services/employee-request-service'
import { employeeService } from '@/services/employee-service'
import type { LeaveType } from '@/services/leave-type-service'
import type { RequestChoiceItem } from '@/services/employee-request-service'
import { useCurrentEmployee } from '@/hooks/use-current-employee'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { EMPTY_LEAVE_CALENDAR, type LeaveBalanceRecord, type LeaveCalendarViewModel } from '@/types/request'
import type {
  LeaveRequestInput,
  SalaryAdvanceRequestInput,
  LoanRequestInput,
  DocumentRequestInput,
} from '@/validations/request.schema'
import { findBalanceForLeaveType } from '@/lib/helpers/leave-balance'
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
  const [leaveCalendar, setLeaveCalendar] = useState<LeaveCalendarViewModel>(EMPTY_LEAVE_CALENDAR)
  const [leaveBalances, setLeaveBalances] = useState<LeaveBalanceRecord[]>([])
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true)
  const [hasMetadataError, setHasMetadataError] = useState(false)
  const [isCalendarLoading, setIsCalendarLoading] = useState(false)
  const [hasCalendarError, setHasCalendarError] = useState(false)
  const [isBalancesLoading, setIsBalancesLoading] = useState(false)
  const [hasBalancesError, setHasBalancesError] = useState(false)
  const [metadataReloadToken, setMetadataReloadToken] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setSelectedType(defaultType)
  }, [defaultType])

  const reloadMetadata = useCallback(() => {
    setMetadataReloadToken((prev) => prev + 1)
  }, [])

  const metadataFetchIdRef = useRef(0)
  const calendarFetchIdRef = useRef(0)
  const balancesFetchIdRef = useRef(0)

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++metadataFetchIdRef.current

    const loadMetadata = async (): Promise<void> => {
      setIsLoadingMetadata(true)
      setHasMetadataError(false)
      try {
        const [choices, typeItems] = await Promise.all([
          employeeRequestService.getRequestChoices(controller.signal),
          employeeService.getLeaveTypesFromDropdowns(controller.signal),
        ])
        if (controller.signal.aborted || fetchId !== metadataFetchIdRef.current) return
        setSessionChoices(choices.session_choices)
        setDocumentTypeChoices(choices.document_request_type_choices)
        setLeaveTypes(typeItems.map(({ id, name }) => ({ id, name })))
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== metadataFetchIdRef.current) return
        setHasMetadataError(true)
        setSessionChoices([])
        setDocumentTypeChoices([])
        setLeaveTypes([])
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

  useEffect(() => {
    const employeeId = employee?.id
    if (!employeeId) {
      setLeaveCalendar(EMPTY_LEAVE_CALENDAR)
      setIsCalendarLoading(false)
      setHasCalendarError(false)
      return
    }

    const controller = new AbortController()
    const fetchId = ++calendarFetchIdRef.current

    const loadCalendar = async (): Promise<void> => {
      setIsCalendarLoading(true)
      setHasCalendarError(false)
      try {
        const calendar = await employeeRequestService.getLeaveCalendar(employeeId, controller.signal)
        if (controller.signal.aborted || fetchId !== calendarFetchIdRef.current) return
        setLeaveCalendar(calendar)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== calendarFetchIdRef.current) return
        setHasCalendarError(true)
        setLeaveCalendar(EMPTY_LEAVE_CALENDAR)
      } finally {
        if (fetchId === calendarFetchIdRef.current) {
          setIsCalendarLoading(false)
        }
      }
    }

    void loadCalendar()
    return () => controller.abort()
  }, [employee?.id, metadataReloadToken])

  useEffect(() => {
    const employeeId = employee?.id
    if (!employeeId) {
      setLeaveBalances([])
      setIsBalancesLoading(false)
      setHasBalancesError(false)
      return
    }

    const controller = new AbortController()
    const fetchId = ++balancesFetchIdRef.current

    const loadBalances = async (): Promise<void> => {
      setIsBalancesLoading(true)
      setHasBalancesError(false)
      try {
        const balances = await employeeRequestService.getLeaveBalances(employeeId, controller.signal)
        if (controller.signal.aborted || fetchId !== balancesFetchIdRef.current) return
        setLeaveBalances(balances)
      } catch (error: unknown) {
        if (error instanceof Error && error.name === 'AbortError') return
        if (fetchId !== balancesFetchIdRef.current) return
        setHasBalancesError(true)
        setLeaveBalances([])
      } finally {
        if (fetchId === balancesFetchIdRef.current) {
          setIsBalancesLoading(false)
        }
      }
    }

    void loadBalances()
    return () => controller.abort()
  }, [employee?.id, metadataReloadToken])

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

      if (hasBalancesError || isBalancesLoading) {
        toast.error('Leave balances are not available. Please try again.')
        return
      }

      const selectedLeaveType = leaveTypes.find((type) => type.id === data.leave_type)
      if (!selectedLeaveType) {
        toast.error('Please select a valid leave type')
        return
      }

      const balance = findBalanceForLeaveType(selectedLeaveType.name, leaveBalances)
      if (balance === null) {
        toast.error('No leave balance found for the selected leave type')
        return
      }
      if (balance <= 0) {
        toast.error('No leave balance available for this leave type')
        return
      }
      if (data.number_of_days > balance) {
        toast.error('Requested days exceed your available leave balance')
        return
      }

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
    [requireEmployeeId, handleSuccess, hasBalancesError, isBalancesLoading, leaveTypes, leaveBalances]
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
    holidayEvents: leaveCalendar.holidayEvents,
    existingLeaveDates: leaveCalendar.existingLeaveDates,
    leaveBalances,
    isBalancesLoading,
    hasBalancesError,
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
  }
}
