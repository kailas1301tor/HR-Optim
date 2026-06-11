// components/assets/useAssetDocumentsTab.ts
'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { assetService } from '@/services/asset-service'
import { uploadDocumentSchema, type UploadDocumentInput } from '@/validations/asset-actions.schema'
import type { AssetDocument, AssetDropdowns } from '@/types/asset'
import { toast } from 'sonner'

export interface UseAssetDocumentsTabReturn {
  documents: AssetDocument[]
  isLoading: boolean
  hasError: boolean
  isUploading: boolean
  isDeletingId: number | null
  docTypes: { id: number; name: string }[]
  hasDocTypesError: boolean
  form: UseFormReturn<UploadDocumentInput>
  selectedFile: File | undefined
  fetchDocuments: () => void
  handleRetry: () => void
  onUploadSubmit: (data: UploadDocumentInput) => Promise<void>
  handleDelete: (docId: number) => Promise<void>
  getDocTypeName: (typeVal: string | number) => string
}

export function useAssetDocumentsTab(
  assetId: number,
  dropdowns: AssetDropdowns | null
): UseAssetDocumentsTabReturn {
  const [documents, setDocuments] = useState<AssetDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isDeletingId, setIsDeletingId] = useState<number | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const fetchIdRef = useRef(0)

  const docTypes = dropdowns?.asset_document_types ?? []
  const hasDocTypesError = !dropdowns || docTypes.length === 0

  const form = useForm<UploadDocumentInput>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      document_type: undefined,
      file: undefined,
    },
  })

  const { watch, reset } = form
  const selectedFile = watch('file') as File | undefined

  const fetchDocuments = useCallback(() => {
    setReloadToken((prev) => prev + 1)
  }, [])

  const handleRetry = fetchDocuments

  useEffect(() => {
    reset({
      document_type: undefined,
      file: undefined,
    })
  }, [assetId, reset])

  useEffect(() => {
    const controller = new AbortController()
    const fetchId = ++fetchIdRef.current

    async function loadDocuments(): Promise<void> {
      setIsLoading(true)
      setHasError(false)
      try {
        const data = await assetService.getAssetDocuments(assetId, controller.signal)
        if (controller.signal.aborted || fetchId !== fetchIdRef.current) return
        setDocuments(data)
      } catch (err: unknown) {
        if (err instanceof Error && err.name === 'AbortError') return
        if (fetchId !== fetchIdRef.current) return
        setHasError(true)
        setDocuments([])
        toast.error('Failed to load asset documents')
      } finally {
        if (fetchId === fetchIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void loadDocuments()
    return () => controller.abort()
  }, [assetId, reloadToken])

  const onUploadSubmit = async (data: UploadDocumentInput) => {
    if (hasDocTypesError) {
      toast.error('Document types are unavailable. Please try again later.')
      return
    }
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('asset_id', assetId.toString())
      formData.append('document_type', data.document_type.toString())
      formData.append('file', data.file)

      await assetService.uploadAssetDocument(formData)
      toast.success('Document uploaded successfully')
      reset()
      fetchDocuments()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to upload document'
      toast.error(message)
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (docId: number) => {
    setIsDeletingId(docId)
    try {
      await assetService.deleteAssetDocument(docId)
      toast.success('Document deleted successfully')
      fetchDocuments()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete document'
      toast.error(message)
    } finally {
      setIsDeletingId(null)
    }
  }

  const getDocTypeName = (typeVal: string | number) => {
    const typeId = Number(typeVal)
    const match = docTypes.find((t) => t.id === typeId)
    return match ? match.name : `Document Type #${typeVal}`
  }

  return {
    documents,
    isLoading,
    hasError,
    isUploading,
    isDeletingId,
    docTypes,
    hasDocTypesError,
    form,
    selectedFile,
    fetchDocuments,
    handleRetry,
    onUploadSubmit,
    handleDelete,
    getDocTypeName,
  }
}
