// components/settings/useBranchSettings.ts
import { useState, useEffect, useCallback, useRef } from 'react'
import { toast } from 'sonner'
import { invalidateUploadBranchesCache } from '@/components/documents/useUploadDocumentModal'
import { loadMasterList } from '@/lib/helpers/load-master-list'
import { branchService } from '@/services/branch-service'
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
  const [formName, setFormName] = useState('')
  const [formAddress, setFormAddress] = useState('')
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

  const handleOpenAdd = (): void => {
    setFormName('')
    setFormAddress('')
    setEditId(null)
    setIsOpen(true)
  }

  const handleOpenEdit = (branch: Branch): void => {
    setFormName(branch.name)
    setFormAddress(branch.address)
    setEditId(branch.id)
    setIsOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    const trimmedName = formName.trim()
    if (!trimmedName) return

    setIsSubmitting(true)
    try {
      if (editId !== null) {
        await branchService.updateBranch(editId, trimmedName, formAddress.trim())
        toast.success('Branch updated successfully')
      } else {
        await branchService.createBranch(trimmedName, formAddress.trim())
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
      setFormName('')
      setFormAddress('')
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
