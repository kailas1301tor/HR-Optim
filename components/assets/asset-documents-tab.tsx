// components/assets/asset-documents-tab.tsx
'use client'

import { type AssetDropdowns } from '@/services/asset-service'
import { Loader2, FileText, Upload, Trash2, Download, Plus } from 'lucide-react'
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
import { uiSkeletonBlock } from '@/lib/ui/design-system'
import { useAssetDocumentsTab } from './useAssetDocumentsTab'

interface AssetDocumentsTabProps {
  assetId: number
  dropdowns: AssetDropdowns | null
}

export function AssetDocumentsTab({ assetId, dropdowns }: AssetDocumentsTabProps) {
  const {
    documents,
    isLoading,
    isUploading,
    isDeletingId,
    docTypes,
    form,
    selectedFile,
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in-50 duration-200">
      {/* Upload Form Panel */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 h-fit space-y-4">
        <h3 className="text-sm font-semibold text-cloud flex items-center gap-2">
          <Upload className="w-4 h-4 text-violet-glow" /> Upload Asset Document
        </h3>

        <form onSubmit={handleSubmit(onUploadSubmit)} className="space-y-4 pt-2">
          {/* Document Type select */}
          <div className="space-y-1.5">
            <Label htmlFor="document_type" className="text-xs text-slate-400">Document Category</Label>
            <Select
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
            <div className="flex flex-col items-center justify-center border border-dashed border-border/80 hover:border-violet-glow/65 rounded-xl p-6 bg-midnight/25 cursor-pointer relative group transition-colors">
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
            className="w-full bg-violet-core hover:bg-violet-deep text-white font-semibold rounded-xl flex items-center justify-center gap-2 mt-2"
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

      {/* Uploaded Documents List */}
      <div className="bg-card border border-border/80 rounded-2xl p-6 lg:col-span-2 space-y-4">
        <h3 className="text-sm font-semibold text-cloud flex items-center gap-2">
          <FileText className="w-4 h-4 text-violet-glow" /> Uploaded Document Records
        </h3>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-midnight/35 border border-border/50 p-4 rounded-xl flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0 w-full">
                  <Skeleton className={cn('w-10 h-10 rounded-xl shrink-0', uiSkeletonBlock)} />
                  <div className="space-y-2 w-full">
                    <Skeleton className={cn('h-4 w-28 rounded-xl', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-3.5 w-20 rounded-xl', uiSkeletonBlock)} />
                    <Skeleton className={cn('h-3.5 w-24 rounded-xl', uiSkeletonBlock)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-border/40 flex items-center justify-center text-slate-500 mb-2">
              <FileText className="w-4 h-4" />
            </div>
            <p className="text-sm font-semibold text-cloud">No documents uploaded</p>
            <p className="text-xs text-slate-500 mt-1 max-w-[280px]">Add warranties, invoices, or compliance certificates on the left.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {documents.map((doc) => (
              <div key={doc.id} className="bg-midnight/35 border border-border/50 hover:border-border p-4 rounded-xl flex items-start justify-between gap-3 transition-colors group">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-violet-core/10 text-violet-glow flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-cloud uppercase tracking-wide truncate">
                      {getDocTypeName(doc.document_type)}
                    </h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleDateString()}
                    </p>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-violet-glow hover:text-violet-deep font-semibold flex items-center gap-1 mt-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download File
                    </a>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isDeletingId === doc.id}
                  onClick={() => handleDelete(doc.id)}
                  className="h-8 w-8 text-slate-500 hover:text-destructive hover:bg-destructive/10 rounded-lg opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                >
                  {isDeletingId === doc.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
