// components/settings/useVendorsMaster.ts
import { useState, useCallback } from 'react'
import { toast } from 'sonner'
import { invalidateAssetDropdowns } from '@/components/assets/useAssetDropdowns'
import { vendorService } from '@/services/vendor-service'
import type { FrontendVendor } from '@/types/settings'
import type { AssetType } from '@/services/asset-type-service'

export interface UseVendorsMasterProps {
  assetTypes: AssetType[]
  onRefresh: () => Promise<void>
}

export interface UseVendorsMasterReturn {
  isVendorModalOpen: boolean
  setIsVendorModalOpen: (open: boolean) => void
  editingVendor: FrontendVendor | null
  isSubmitting: boolean
  vendorName: string
  setVendorName: (name: string) => void
  selectedAssetTypeId: string
  setSelectedAssetTypeId: (id: string) => void
  vendorDescription: string
  setVendorDescription: (desc: string) => void
  deleteTarget: FrontendVendor | null
  setDeleteTarget: (vendor: FrontendVendor | null) => void
  isDeleting: boolean
  handleOpenAdd: () => void
  handleOpenEdit: (vendor: FrontendVendor) => void
  handleSaveVendor: (e: React.FormEvent) => Promise<void>
  handleDeleteVendor: () => Promise<void>
  getAssetTypeName: (typeId: number) => string
}

export function useVendorsMaster({
  assetTypes,
  onRefresh,
}: UseVendorsMasterProps): UseVendorsMasterReturn {
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<FrontendVendor | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form fields
  const [vendorName, setVendorName] = useState('')
  const [selectedAssetTypeId, setSelectedAssetTypeId] = useState('')
  const [vendorDescription, setVendorDescription] = useState('')

  // Delete state
  const [deleteTarget, setDeleteTarget] = useState<FrontendVendor | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const resetForm = (): void => {
    setVendorName('')
    setSelectedAssetTypeId('')
    setVendorDescription('')
    setEditingVendor(null)
  }

  const handleOpenAdd = (): void => {
    resetForm()
    setIsVendorModalOpen(true)
  }

  const handleOpenEdit = (vendor: FrontendVendor): void => {
    setVendorName(vendor.name)
    setSelectedAssetTypeId(String(vendor.assetTypeId))
    setVendorDescription(vendor.description)
    setEditingVendor(vendor)
    setIsVendorModalOpen(true)
  }

  const handleSaveVendor = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    if (!vendorName.trim() || !selectedAssetTypeId) {
      toast.error('Name and Asset Type are required')
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: vendorName.trim().toUpperCase(),
        assetTypeId: Number(selectedAssetTypeId),
        description: vendorDescription.trim(),
      }

      if (editingVendor) {
        await vendorService.updateVendor({ id: editingVendor.id, ...payload })
        toast.success('Vendor updated successfully')
      } else {
        await vendorService.createVendor(payload)
        toast.success('Vendor created successfully')
      }
      setIsVendorModalOpen(false)
      resetForm()
      invalidateAssetDropdowns()
      await onRefresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to save vendor'
      toast.error(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteVendor = async (): Promise<void> => {
    if (!deleteTarget) return

    setIsDeleting(true)
    try {
      await vendorService.deleteVendor(deleteTarget.id)
      toast.success('Vendor deleted successfully')
      setDeleteTarget(null)
      invalidateAssetDropdowns()
      await onRefresh()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete vendor'
      toast.error(message)
    } finally {
      setIsDeleting(false)
    }
  }

  const getAssetTypeName = (typeId: number): string => {
    const found = assetTypes.find((t) => t.id === typeId)
    return found ? found.name : 'Unknown'
  }

  const handleDialogOpenChange = useCallback((open: boolean): void => {
    if (!open && !isSubmitting) {
      resetForm()
    }
    if (!isSubmitting) setIsVendorModalOpen(open)
  }, [isSubmitting])

  return {
    isVendorModalOpen,
    setIsVendorModalOpen: handleDialogOpenChange,
    editingVendor,
    isSubmitting,
    vendorName,
    setVendorName,
    selectedAssetTypeId,
    setSelectedAssetTypeId,
    vendorDescription,
    setVendorDescription,
    deleteTarget,
    setDeleteTarget,
    isDeleting,
    handleOpenAdd,
    handleOpenEdit,
    handleSaveVendor,
    handleDeleteVendor,
    getAssetTypeName,
  }
}
