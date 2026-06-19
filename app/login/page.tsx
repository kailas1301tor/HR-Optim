// app/login/page.tsx
import { Suspense } from 'react'
import { LoginPageContent } from '@/components/login/login-page-content'
import { BrandLogo } from '@/components/common'
import { uiSquircleLg } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'

function LoginPageFallback() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-core/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div
        className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 items-center gap-8 lg:gap-12"
        aria-label="Loading login page"
        role="status"
      >
        <div className="flex flex-col items-center lg:items-start justify-center">
          <BrandLogo
            variant="full"
            size="hero"
            priority
            className="w-fit max-w-sm mx-auto lg:mx-0 lg:max-w-md items-center lg:items-start [&_img]:object-center lg:[&_img]:object-left"
          />
        </div>
        <div className="w-full max-w-md lg:max-w-lg mx-auto lg:mx-0 lg:justify-self-end">
          <div className={cn('w-full h-80 bg-card/45 border border-border/80 animate-pulse', uiSquircleLg)} />
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <LoginPageContent />
    </Suspense>
  )
}
