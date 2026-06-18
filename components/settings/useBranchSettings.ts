// components/settings/useBranchSettings.ts
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { toast } from 'sonner'
import { invalidateUploadBranchesCache } from '@/components/documents/useUploadDocumentModal'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { branchService } from '@/services/branch-service'
import { branchSchema } from '@/validations/settings-master.schema'
import type { Branch } from '@/types/settings'

export interface UseBranchSettingsReturn {
  branches: Branch[]
  isLoading: boolean
  hasError: boolean
  reload: () => Promise<void>
  isOpen: boolean
  editId: number | null
  formName: string
  formAddress: string
  nameError: string | null
  addressError: string | null
  isFormValid: boolean
  isSubmitting: boolean
  deleteId: number | null
  isDeleting: boolean
  setIsOpen: (open: boolean) => void
  setFormName: (name: string) => void
  setFormAddress: (address: string) => void
  setDeleteId: (id: number | null) => void
  handleOpenAdd: () => void
  handleOpenEdit: (branch: Branch) => void
  handleSubmit: (e: React.FormEvent) => Promise<void>
  handleDelete: () => Promise<void>
}

export function useBranchSettings(): UseBranchSettingsReturn {
  const [branches, setBranches] = useState<Branch[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [editId, setEditId] = useState<number | null>(null)
  const [formName, setFormNameState] = useState('')
  const [formAddress, setFormAddressState] = useState('')
  const [nameError, setNameError] = useState<string | null>(null)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const requestIdRef = useRef(0)

  const reload = useCallback(async (): Promise<void> => {
    await loadMasterList({
      setLoading: setIsLoading,
      setHasError,
      fetcher: () => branchService.getBranches(),
      onSuccess: setBranches,
      errorMessage: 'Failed to load branches',
      requestIdRef,
    })
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const isFormValid = useMemo(
    () => branchSchema.safeParse({ name: formName, address: formAddress }).success,
    [formName, formAddress],
  )

  const setFormName = (name: string): void => {
    setFormNameState(name)
    if (nameError) setNameError(null)
  }

  const setFormAddress = (address: string): void => {
    setFormAddressState(address)
    if (addressError) setAddressError(null)
  }

  const handleOpenAdd = (): void => {
    setFormNameState('')
    setFormAddressState('')
    setNameError(null)
    setAddressError(null)
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (branch: Branch): void => {
    setFormNameState(branch.name)
    setFormAddressState(branch.address)
    setNameError(null)
    setAddressError(null)
    setEditId(branch.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const parsed = branchSchema.safeParse({ name: formName, address: formAddress })
    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors
      setNameError(fieldErrors.name?.[0] ?? null)
      setAddressError(fieldErrors.address?.[0] ?? null)
      return
    }

    setNameError(null)
    setAddressError(null)
    setIsSubmitting(true)
    try {
      const trimmedName = parsed.data.name.toUpperCase()
      const trimmedAddress = parsed.data.address ?? ''
      if (editId !== null) {
        await branchService.updateBranch(editId, trimmedName, trimmedAddress)
        toast.success('Branch updated successfully')
      } else {
        await branchService.createBranch(trimmedName, trimmedAddress)
        toast.success('Branch created successfully')
      }
      setIsOpen(false)
      invalidateUploadBranchesCache()
      await reload()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save branch'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null) return
    setIsDeleting(true)
    try {
      await branchService.deleteBranch(deleteId)
      toast.success('Branch deleted successfully')
      setDeleteId(null)
      invalidateUploadBranchesCache()
      await reload()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete branch'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDialogOpenChange = (open: boolean): void => {
    if (!open && !isSubmitting) {
      setEditId(null)
      setFormNameState('')
      setFormAddressState('')
      setNameError(null)
      setAddressError(null)
    }
    if (!isSubmitting) setIsOpen(open)
  }

  return {
    branches,
    isLoading,
    hasError,
    reload,
    isOpen,
    editId,
    formName,
    formAddress,
    nameError,
    addressError,
    isFormValid,
    isSubmitting,
    deleteId,
    isDeleting,
    setIsOpen: handleDialogOpenChange,
    setFormName,
    setFormAddress,
    setDeleteId,
    handleOpenAdd,
    handleOpenEdit,
    handleSubmit,
    handleDelete,
  }
}
