// components/documents/useUploadDocumentModal.ts
'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import {
  companyUploadToFormData,
  employeeUploadToFormData,
} from '@/lib/mappers/document-form-mapper'
import {
  companyDocumentService,
  employeeDocumentService,
} from '@/services/document-service'
import { employeeService } from '@/services/employee-service'
import { branchService } from '@/services/branch-service'
import type { Employee } from '@/types/employee'
import type { DocumentTab } from '@/types/document'
import type {
  CompanyDocumentUploadInput,
  EmployeeDocumentUploadInput,
} from '@/validations/document.schema'
import {
  invalidateDocumentCategories,
  useDocumentCategories,
} from './useDocumentCategories'

const EMPLOYEE_SEARCH_DEBOUNCE_MS = 300

let cachedBranches: { id: number; name: string }[] | null = null
let branchesInflight: Promise<{ id: number; name: string }[]> | null = null

export function invalidateUploadBranchesCache(): void {
  cachedBranches = null
}

async function fetchBranchesCached(signal?: AbortSignal): Promise<{ id: number; name: string }[]> {
  if (cachedBranches) return cachedBranches

  if (!branchesInflight) {
    branchesInflight = branchService
      .getBranches(signal)
      .then((data) => {
        cachedBranches = data.map((b) => ({ id: b.id, name: b.name }))
        return cachedBranches
      })
      .finally(() => {
        branchesInflight = null
      })
  }

  return branchesInflight
}

export interface UseUploadDocumentModalReturn {
  isSubmitting: boolean
  loadingMetadata: boolean
  metadataError: boolean
  employees: Employee[]
  employeeSearch: string
  setEmployeeSearch: (query: string) => void
  employeesLoading: boolean
  branches: { id: number; name: string }[]
  employeeDocTypes: { id: number; name: string }[]
  companyDocTypes: { id: number; name: string }[]
  onEmployeeSubmit: (data: EmployeeDocumentUploadInput) => Promise<void>
  onCompanySubmit: (data: CompanyDocumentUploadInput) => Promise<void>
  reloadMetadata: () => void
}

export function useUploadDocumentModal(
  open: boolean,
  tab: DocumentTab,
  onOpenChange: (open: boolean) => void,
  onSuccess: () => void
): UseUploadDocumentModalReturn {
  const { categories, isLoading: categoriesLoading, hasError: categoriesError, reload: reloadCategories } =
    useDocumentCategories(tab)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [metadataError, setMetadataError] = useState(false)
  const [branches, setBranches] = useState<{ id: number; name: string }[]>(cachedBranches ?? [])
  const [branchesLoading, setBranchesLoading] = useState(false)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeeSearch, setEmployeeSearch] = useState('')
  const [employeesLoading, setEmployeesLoading] = useState(false)
  const [reloadToken, setReloadToken] = useState(0)

  const loadingMetadata =
    tab === 'employee'
      ? categoriesLoading || employeesLoading
      : categoriesLoading || branchesLoading

  const reloadMetadata = useCallback(() => {
    setMetadataError(false)
    invalidateDocumentCategories(tab)
    if (tab === 'company') {
      invalidateUploadBranchesCache()
    }
    setReloadToken((prev) => prev + 1)
    void reloadCategories()
  }, [reloadCategories, tab])

  useEffect(() => {
    if (open) {
      setMetadataError(false)
      return
    }

    setEmployeeSearch('')
    setEmployees([])
  }, [open])

  useEffect(() => {
    if (!open) return

    const controller = new AbortController()

    async function loadCompanyMetadata(): Promise<void> {
      if (tab !== 'company') return
      setBranchesLoading(true)
      setMetadataError(false)
      try {
        const data = await fetchBranchesCached(controller.signal)
        if (!controller.signal.aborted) setBranches(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setMetadataError(true)
        toast.error('Failed to load form lookup data')
      } finally {
        if (!controller.signal.aborted) setBranchesLoading(false)
      }
    }

    loadCompanyMetadata()
    return () => controller.abort()
  }, [open, tab, reloadToken])

  useEffect(() => {
    if (!open || tab !== 'employee') return

    const controller = new AbortController()

    async function searchEmployees(): Promise<void> {
      setEmployeesLoading(true)
      try {
        const response = await employeeService.getEmployees(
          { search: employeeSearch || undefined, page_size: 50 },
          controller.signal
        )
        if (!controller.signal.aborted) setEmployees(response.data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        setMetadataError(true)
      } finally {
        if (!controller.signal.aborted) setEmployeesLoading(false)
      }
    }

    const handler = setTimeout(() => {
      searchEmployees()
    }, employeeSearch ? EMPLOYEE_SEARCH_DEBOUNCE_MS : 0)

    return () => {
      clearTimeout(handler)
      controller.abort()
    }
  }, [open, tab, employeeSearch, reloadToken])

  useEffect(() => {
    if (categoriesError) setMetadataError(true)
  }, [categoriesError])

  const handleClose = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  const onEmployeeSubmit = async (data: EmployeeDocumentUploadInput): Promise<void> => {
    setIsSubmitting(true)
    try {
      await employeeDocumentService.upload(employeeUploadToFormData(data))
      toast.success('Employee document uploaded successfully!')
      invalidateDocumentCategories('employee')
      onSuccess()
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const onCompanySubmit = async (data: CompanyDocumentUploadInput): Promise<void> => {
    setIsSubmitting(true)
    try {
      await companyDocumentService.upload(companyUploadToFormData(data))
      toast.success('Company document uploaded successfully!')
      invalidateDocumentCategories('company')
      onSuccess()
      handleClose()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const employeeDocTypes = tab === 'employee' ? categories : []
  const companyDocTypes = tab === 'company' ? categories : []

  return {
    isSubmitting,
    loadingMetadata,
    metadataError,
    employees,
    employeeSearch,
    setEmployeeSearch,
    employeesLoading,
    branches,
    employeeDocTypes,
    companyDocTypes,
    onEmployeeSubmit,
    onCompanySubmit,
    reloadMetadata,
  }
}
