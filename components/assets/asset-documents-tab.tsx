// components/assets/asset-documents-tab.tsx
'use client'

import { type AssetDropdowns } from '@/types/asset'
import { CommonEmptyState, CommonErrorState } from '@/components/common'
import { Loader2, FileText, Upload, Trash2, Download, Plus, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { uiCardInteractive, uiSkeletonBlock } from '@/lib/ui/design-system'
import { formatAssetDocumentDate, openAssetDocument } from '@/lib/helpers/asset-document'
import { downloadFileFromUrl } from '@/lib/helpers/download-file-url'
import { toast } from 'sonner'
import { useAssetDocumentsTab } from './useAssetDocumentsTab'
import { usePermissions } from '@/components/auth/permissions-provider'

interface AssetDocumentsTabProps {
  assetId: number
  dropdowns: AssetDropdowns | null
}

export function AssetDocumentsTab({ assetId, dropdowns }: AssetDocumentsTabProps) {
  const { canManage } = usePermissions()
  const canManageAssets = canManage('assets')
  const {
    documents,
    isLoading,
    hasError,
    isUploading,
    isDeletingId,
    docTypes,
    hasDocTypesError,
    form,
    selectedFile,
    handleRetry,
    onUploadSubmit,
    handleDelete,
    getDocTypeName,
  } = useAssetDocumentsTab(assetId, dropdowns)

  const {
    setValue,
    handleSubmit,
    formState: { errors },
  } = form

  return (
    <div className={cn('grid grid-cols-1 gap-6 animate-in fade-in-50 duration-200', canManageAssets ? 'lg:grid-cols-3' : '')}>
      {canManageAssets ? (
      <div className="bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 h-fit space-y-4">
        <h3 className="text-sm font-semibold text-cloud flex items-center gap-2">
          <Upload className="w-4 h-4 text-violet-glow" /> Upload Asset Document
        </h3>

        {hasDocTypesError && (
          <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-[20px] [corner-shape:squircle] p-3">
            Document types could not be loaded. Upload is unavailable until metadata loads.
          </p>
        )}

        <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-4 pt-2">
          {/* Document Type select */}
          <div className="space-y-1.5">
            <Label htmlFor="document_type" className="text-xs text-slate-400">Document Category</Label>
            <Select
              disabled={hasDocTypesError}
              onValueChange={(val) => setValue('document_type', Number(val), { shouldValidate: true })}
            >
              <SelectTrigger className="w-full bg-midnight border-border">
                <SelectValue placeholder="Select type..." />
              </SelectTrigger>
              <SelectContent className="bg-popover border border-border">
                {docTypes.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.document_type && (
              <p className="text-[11px] text-destructive font-medium">{errors.document_type.message}</p>
            )}
          </div>

          {/* File input */}
          <div className="space-y-2">
            <Label htmlFor="file" className="text-xs text-slate-400">Select File</Label>
            <div className="flex flex-col items-center justify-center border border-dashed border-border/80 hover:border-violet-glow/65 rounded-[20px] [corner-shape:squircle] p-6 bg-midnight/25 cursor-pointer relative group transition-colors">
              <input
                type="file"
                id="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={(e) => {
                  const fileObj = e.target.files?.[0]
                  if (fileObj) {
                    setValue('file', fileObj, { shouldValidate: true })
                  }
                }}
              />
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-violet-glow mb-2 transition-colors" />
              <p className="text-xs font-semibold text-cloud text-center">
                {selectedFile ? selectedFile.name : 'Click to select / drop document'}
              </p>
              <p className="text-[10px] text-slate-500 text-center mt-1">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'PDF, JPG, PNG, DOCX up to 10MB'}
              </p>
            </div>
            {errors.file && (
              <p className="text-[11px] text-destructive font-medium">{errors.file.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-[20px] [corner-shape:squircle] flex items-center justify-center gap-2 mt-2"
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" /> Add Document
              </>
            )}
          </Button>
        </form>
      </div>
      ) : null}

      <div className={cn('bg-card border border-border/80 rounded-[32px] [corner-shape:squircle] p-6 space-y-4', canManageAssets ? 'lg:col-span-2' : '')}>
        <h3 className="text-sm font-semibold text-cloud flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-glow" /> Uploaded Document Records
        </h3>

        {hasError ? (
          <CommonErrorState
            title="Failed to load documents"
            message="Uploaded document records could not be retrieved."
            onRetry={handleRetry}
            className="shadow-none border-0 bg-transparent py-8"
          />
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-midnight/35 border border-border/50 p-4 rounded-[20px] [corner-shape:squircle] flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 w-full">
                  <Skeleton className={cn('w-10 h-10 rounded-[20px] [corner-shape:squircle] shrink-0', uiSkeletonBlock)} />
                  <div className="space-y-2 w-full">
                    <Skeleton className={cn('h-4 w-28 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-3.5 w-20 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-3.5 w-24 rounded-[20px] [corner-shape:squircle]', uiSkeletonBlock)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <CommonEmptyState
            icon={FileText}
            title="No documents uploaded"
            description={canManageAssets ? 'Add warranties, invoices, or compliance certificates using the form on the left.' : 'No documents have been uploaded for this asset yet.'}
            className="py-12 shadow-none border-0 bg-transparent"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => {
              const handleViewDocument = () => {
                if (!doc.file_url) {
                  toast.error('No file URL available')
                  return
                }
                openAssetDocument(doc.file_url)
              }

              const handleDownloadDocument = async (e: React.MouseEvent) => {
                e.stopPropagation()
                if (!doc.file_url) {
                  toast.error('No file URL available')
                  return
                }
                try {
                  await downloadFileFromUrl(doc.file_url)
                } catch {
                  openAssetDocument(doc.file_url)
                }
              }

              return (
              <div
                key={doc.id}
                role="button"
                tabIndex={0}
                onClick={handleViewDocument}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    handleViewDocument()
                  }
                }}
                className={cn(
                  uiCardInteractive,
                  'bg-midnight/35 border-border/50 p-4 flex items-start justify-between gap-3 group cursor-pointer'
                )}
                aria-label={`View ${getDocTypeName(doc.document_type)} document`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-[16px] [corner-shape:squircle] bg-violet-core/10 text-violet-glow flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-cloud uppercase tracking-wide truncate">
                      {getDocTypeName(doc.document_type)}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Uploaded: {formatAssetDocumentDate(doc.uploaded_at)}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleViewDocument()
                        }}
                        className="text-[11px] text-violet-glow hover:text-violet-deep font-semibold flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadDocument}
                        className="text-[11px] text-violet-glow hover:text-violet-deep font-semibold flex items-center gap-1"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>
                    </div>
                  </div>
                </div>

                {canManageAssets ? (
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeletingId === doc.id}
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDelete(doc.id)
                  }}
                  className="h-8 w-8 text-slate-500 hover:text-destructive hover:bg-destructive/10 rounded-[16px] [corner-shape:squircle] opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                  aria-label="Delete document"
                >
                  {isDeletingId === doc.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
                ) : null}
              </div>
            )})}
          </div>
        )}
      </div>
    </div>
  )
}
