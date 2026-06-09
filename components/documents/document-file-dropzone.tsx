// components/documents/document-file-dropzone.tsx
'use client'

import { Upload } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { CommonFormFieldError } from '@/components/common'
import { cn } from '@/lib/utils'

interface DocumentFileDropzoneProps {
  file: File | undefined
  errorMessage?: string
  onFileChange: (file: File) => void
}

export function DocumentFileDropzone({ file, errorMessage, onFileChange }: DocumentFileDropzoneProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs text-slate-400">Select Document File</Label>
      <div
        className={cn(
          'flex flex-col items-center justify-center border border-dashed border-border/80',
          'hover:border-violet-glow/65 rounded-xl p-6 bg-midnight/25 cursor-pointer relative group transition-colors'
        )}
      >
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          aria-label="Upload document file"
          onChange={(e) => {
            const fileObj = e.target.files?.[0]
            if (fileObj) onFileChange(fileObj)
          }}
        />
        <Upload className="w-8 h-8 text-slate-500 group-hover:text-violet-glow mb-2 transition-colors" aria-hidden />
        <p className="text-xs font-semibold text-cloud text-center truncate w-full max-w-[280px]">
          {file ? file.name : 'Click to select / drop document'}
        </p>
        <p className="text-[10px] text-slate-500 text-center mt-1">
          {file ? `${(file.size / 1024).toFixed(1)} KB` : 'PDF, JPG, PNG, DOCX up to 10MB'}
        </p>
      </div>
      <CommonFormFieldError message={errorMessage} />
    </div>
  )
}
