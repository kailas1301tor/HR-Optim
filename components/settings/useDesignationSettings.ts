// components/settings/useDesignationSettings.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { invalidateAssetDropdowns } from '@/components/assets/useAssetDropdowns'
import { invalidateEmployeeDropdowns } from '@/components/employees/useEmployeeDropdowns'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { departmentService } from '@/services/department-service'
import { designationService } from '@/services/designation-service'
import type { Department, Designation } from '@/types/settings'

export interface UseDesignationSettingsReturn {
  selectedDeptId: string
  departments: Department[]
  isDeptLoading: boolean
  deptHasError: boolean
  reloadDepartments: () => Promise<void>
  designations: Designation[]
  isLoading: boolean
  designationsHasError: boolean
  reloadDesignations: () => Promise<void>
  isOpen: boolean
  editId: number | null
  formName: string
  formDescription: string
  formDepartmentId: string
  isSubmitting: boolean
  deleteId: number | null
  isDeleting: boolean
  setIsOpen: (open: boolean) => void
  setFormName: (name: string) => void
  setFormDescription: (desc: string) => void
  setFormDepartmentId: (id: string) => void
  setDeleteId: (id: number | null) => void
  handleDeptChange: (value: string) => void
  handleOpenAdd: () => void
  handleOpenEdit: (desig: Designation) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDelete: () => Promise<void>
}

export function useDesignationSettings(): UseDesignationSettingsReturn {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedDeptId = searchParams.get('dept_id') || ''

  const setSelectedDeptId = useCallback((id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) {
      params.set('dept_id', id)
    } else {
      params.delete('dept_id')
    }
    router.replace(`${pathname}?${params.toString()}`)
  }, [router, pathname, searchParams])

  // Department data
  const [departments, setDepartments] = useState<Department[]>([])
  const [isDeptLoading, setIsDeptLoading] = useState(true)
  const [deptHasError, setDeptHasError] = useState(false)

  const [designations, setDesignations] = useState<Designation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [designationsHasError, setDesignationsHasError] = useState(false)

  // Add/Edit Dialog
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formDepartmentId, setFormDepartmentId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Delete Dialog
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const deptRequestIdRef = useRef(0)
  const designationsRequestIdRef = useRef(0)

  const reloadDepartments = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setIsDeptLoading,
      setHasError: setDeptHasError,
      fetcher: () => departmentService.getDepartments(),
      onSuccess: setDepartments,
      errorMessage: 'Failed to load departments',
      requestIdRef: deptRequestIdRef,
    })
  }, [])

  useEffect(() => {
    reloadDepartments()
  }, [reloadDepartments])

  useEffect(() => {
    if (isDeptLoading || departments.length === 0) return
    if (selectedDeptId && !departments.some((dept) => String(dept.id) === selectedDeptId)) {
      setSelectedDeptId('')
      return
    }
    if (!selectedDeptId) {
      setSelectedDeptId(String(departments[0].id))
    }
  }, [isDeptLoading, selectedDeptId, departments, setSelectedDeptId])

  const reloadDesignations = useCallback(async (): Promise<void> => {
    if (!selectedDeptId) {
      setDesignations([])
      setIsLoading(false)
      return
    }
    const deptId = Number(selectedDeptId)
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError: setDesignationsHasError,
      fetcher: () => designationService.getDesignations(deptId),
      onSuccess: setDesignations,
      errorMessage: 'Failed to load designations',
      requestIdRef: designationsRequestIdRef,
    })
  }, [selectedDeptId])

  useEffect(() => {
    if (!selectedDeptId) {
      setDesignations([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    reloadDesignations()
  }, [selectedDeptId, reloadDesignations])

  const handleDeptChange = (value: string): void => {
    setSelectedDeptId(value)
    setDesignations([])
    setIsLoading(true)
  }

  const handleOpenAdd = (): void => {
    setFormName('')
    setFormDescription('')
    setFormDepartmentId(selectedDeptId)
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (desig: Designation): void => {
    setFormName(desig.name)
    setFormDescription(desig.description)
    setFormDepartmentId(String(desig.department))
    setEditId(desig.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!formName.trim() || !formDepartmentId) return

    const deptId = Number(formDepartmentId)
    setIsSubmitting(true)
    try {
      if (editId !== null) {
        await designationService.updateDesignation(editId, deptId, formName.trim(), formDescription.trim())
        toast.success('Designation updated successfully')
      } else {
        await designationService.createDesignation(deptId, formName.trim(), formDescription.trim())
        toast.success('Designation created successfully')
      }
      setIsOpen(false)
      invalidateEmployeeDropdowns()
      invalidateAssetDropdowns()
      await reloadDesignations()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save designation'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null || !selectedDeptId) return
    setIsDeleting(true)
    try {
      await designationService.deleteDesignation(deleteId)
      toast.success('Designation deleted successfully')
      setDeleteId(null)
      invalidateEmployeeDropdowns()
      invalidateAssetDropdowns()
      await reloadDesignations()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete designation'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open && !isSubmitting) {
      setEditId(null)
      setFormName('')
      setFormDescription('')
      setFormDepartmentId('')
    }
    if (!isSubmitting) setIsOpen(open)
  }

  return {
    selectedDeptId,
    departments,
    isDeptLoading,
    deptHasError,
    reloadDepartments,
    designations,
    isLoading,
    designationsHasError,
    reloadDesignations,
    isOpen,
    editId,
    formName,
    formDescription,
    formDepartmentId,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen: handleDialogOpenChange,
    setFormName,
    setFormDescription,
    setFormDepartmentId,
    setDeleteId,
    handleDeptChange,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  }
}
