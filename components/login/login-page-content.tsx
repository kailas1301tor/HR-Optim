// components/login/login-page-content.tsx
'use client'

import { motion } from 'framer-motion'
import { FormProvider } from 'react-hook-form'
import { Mail, Lock, Eye, EyeOff, Building2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PrimaryButton } from '@/components/ui/primary-button'
import { CommonFormFieldError } from '@/components/common'
import { uiInput } from '@/lib/ui/design-system'
import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { SetPasswordDialog } from '@/components/login/set-password-dialog'
import { useLoginForm } from '@/components/login/useLoginForm'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
}

export function LoginPageContent() {
  const {
    showPassword,
    setShowPassword,
    isLoading,
    showSetPasswordModal,
    pendingAuthToken,
    methods,
    onSubmit,
    onSetPasswordSuccess,
  } = useLoginForm()

  const { register, handleSubmit, formState: { errors } } = methods

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background px-4 overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-core/10 rounded-full filter blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-teal-400/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md z-10 space-y-6">
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-core to-violet-glow flex items-center justify-center shadow-lg shadow-violet-core/20 mb-3">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-cloud font-sans">HRMS Portal</h1>
          <p className="text-sm text-muted-foreground mt-1 font-sans">Enterprise Command Center</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card/45 border-border/80 backdrop-blur-md shadow-2xl shadow-black/40 rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl font-semibold text-cloud font-sans">Welcome Back</CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5 font-sans">Please sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="username-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Username or Email Address</Label>
                    <div className="relative flex items-center">
                      <Mail className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
                      <Input
                        {...register('username')}
                        id="username-input"
                        type="text"
                        autoComplete="username"
                        placeholder="name@acmecorp.com"
                        disabled={isLoading}
                        className={cn(uiInput, 'pl-10 text-cloud focus-visible:ring-primary/30', errors.username && 'border-destructive focus-visible:border-destructive')}
                      />
                    </div>
                    {errors.username?.message && <CommonFormFieldError message={errors.username.message} />}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-input" className="text-xs font-semibold uppercase tracking-wider text-slate-400">Password</Label>
                    <div className="relative flex items-center">
                      <Lock className="absolute left-3 w-4 h-4 text-slate-500 z-10" />
                      <Input
                        {...register('password')}
                        id="password-input"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        placeholder="••••••••"
                        disabled={isLoading}
                        className={cn(uiInput, 'pl-10 pr-10 text-cloud focus-visible:ring-primary/30', errors.password && 'border-destructive focus-visible:border-destructive')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute right-3 text-slate-500 hover:text-cloud transition-colors cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password?.message && <CommonFormFieldError message={errors.password.message} />}
                  </div>

                  <PrimaryButton
                    type="submit"
                    disabled={isLoading}
                    isLoading={isLoading}
                    className="w-full font-semibold"
                  >
                    {isLoading ? 'Verifying...' : 'Sign In'}
                  </PrimaryButton>
                </form>
              </FormProvider>

              <p className="text-center mt-6 text-xs text-slate-500 font-sans">
                Need system access? Contact your IT administrator.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <SetPasswordDialog open={showSetPasswordModal} authToken={pendingAuthToken} onSuccess={onSetPasswordSuccess} />
    </div>
  )
}
