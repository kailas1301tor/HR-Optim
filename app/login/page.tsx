// app/login/page.tsx
import { Suspense } from 'react'
import { Building2 } from 'lucide-react'
import { LoginPageContent } from '@/components/login/login-page-content'

function LoginPageFallback() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-core/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="w-full max-w-md z-10 flex flex-col items-center gap-6" aria-label="Loading login page" role="status">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shadow-lg shadow-violet-core/20">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div className="w-full h-80 rounded-2xl bg-card/45 border border-border/80 animate-pulse" />
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
