// app/error.tsx
'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

interface ErrorPageProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error('🔴 Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6 text-destructive" aria-hidden="true" />
        </div>
        <h1 className="text-xl font-semibold text-cloud">Something went wrong</h1>
        <p className="text-sm text-muted-foreground">
          An unexpected error occurred. Please try again or contact support if the problem persists.
        </p>
        <Button
          type="button"
          onClick={reset}
          className="w-full"
          aria-label="Try again"
        >
          Try Again
        </Button>
      </div>
    </div>
  )
}
