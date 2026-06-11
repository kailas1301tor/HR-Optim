// components/login/useLoginForm.ts
'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { authService } from '@/services/auth-service'
import { loginSchema, type LoginValues } from '@/validations/auth.schema'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { applyAuthFieldErrors } from '@/lib/helpers/parse-auth-form-errors'
import { ApiError } from '@/lib/api'
import { getSafeRedirectPath } from '@/lib/helpers/get-safe-redirect-path'
import { PRODUCT_NAME } from '@/lib/brand'
import {
  setPendingAuth,
  getPendingAuth,
  clearPendingAuth,
} from '@/lib/helpers/pending-auth-storage'
import type { PendingAuthSession } from '@/types/auth'

interface UseLoginFormReturn {
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  isLoading: boolean
  formError: string | null
  showSetPasswordModal: boolean
  pendingAuthToken: string | null
  methods: UseFormReturn<LoginValues>
  onSubmit: (data: LoginValues) => Promise<void>
  onSetPasswordSuccess: () => Promise<void>
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false)
  const [pendingAuth, setPendingAuthState] = useState<PendingAuthSession | null>(null)

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const { setError, clearErrors } = methods
  const redirectPath = getSafeRedirectPath(searchParams.get('redirect'))

  useEffect(() => {
    const stored = getPendingAuth()
    if (stored) {
      setPendingAuthState(stored)
      setShowSetPasswordModal(true)
    }
  }, [])

  const navigateAfterLogin = useCallback(() => {
    router.refresh()
    router.push(redirectPath)
  }, [router, redirectPath])

  const completeLogin = useCallback(
    async (session: Pick<PendingAuthSession, 'token' | 'username' | 'email' | 'userId' | 'refresh'>) => {
      authService.storeTokensFromLogin(session.token, session.refresh)
      await authService.persistSession(session.token, session.username, session.email, session.userId)
      clearPendingAuth()
      setPendingAuthState(null)
      setShowSetPasswordModal(false)
      toast.success('Login successful! Redirecting...', { description: `Welcome to your ${PRODUCT_NAME} dashboard.` })
      navigateAfterLogin()
    },
    [navigateAfterLogin]
  )

  const handleLoginFailure = useCallback(
    (error: unknown) => {
      const errorData = error instanceof ApiError ? error.data : undefined
      applyAuthFieldErrors<LoginValues>(errorData, setError, {
        username: 'username',
        password: 'password',
      })
      const errorMessage = getApiErrorMessage(error, 'Invalid username or password.')
      setFormError(errorMessage)
      toast.error('Login Failed', { description: errorMessage })
    },
    [setError]
  )

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    setFormError(null)
    clearErrors()

    try {
      const response = await authService.login(data.username, data.password)
      const dataObj = response.results?.data
      const token = dataObj?.access

      if (!token) {
        const message = 'Invalid server response. Please try again.'
        setFormError(message)
        toast.error('Login Failed', { description: message })
        return
      }

      const session = {
        token,
        refresh: dataObj?.refresh,
        username: dataObj?.username ?? '',
        email: dataObj?.email ?? '',
        userId: dataObj?.user_id ?? 0,
      }

      if (dataObj && dataObj.has_password_changed === false) {
        setPendingAuth(session)
        setPendingAuthState({ ...session, expiresAt: Date.now() + 10 * 60 * 1000 })
        setShowSetPasswordModal(true)
        return
      }

      try {
        await completeLogin(session)
      } catch (persistError: unknown) {
        const errorMessage = getApiErrorMessage(
          persistError,
          'Failed to save your session. Please try again.'
        )
        setFormError(errorMessage)
        toast.error('Login Failed', { description: errorMessage })
      }
    } catch (error: unknown) {
      handleLoginFailure(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSetPasswordSuccess = async () => {
    const session = getPendingAuth()
    if (!session) {
      setShowSetPasswordModal(false)
      clearPendingAuth()
      setPendingAuthState(null)
      const message = 'Your login session expired. Please sign in again to continue.'
      setFormError(message)
      toast.error('Session expired', { description: message })
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      await completeLogin(session)
    } catch (error: unknown) {
      const errorMessage = getApiErrorMessage(error, 'Failed to save your session. Please sign in again.')
      setFormError(errorMessage)
      toast.error('Login Failed', { description: errorMessage })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    showPassword,
    setShowPassword,
    isLoading,
    formError,
    showSetPasswordModal,
    pendingAuthToken: pendingAuth?.token ?? getPendingAuth()?.token ?? null,
    methods,
    onSubmit,
    onSetPasswordSuccess,
  }
}
