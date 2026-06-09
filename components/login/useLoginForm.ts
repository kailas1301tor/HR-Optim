// components/login/useLoginForm.ts
'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { authService, type LoginResponse } from '@/services/auth-service'
import { loginSchema, type LoginValues } from '@/validations/auth.schema'
import { getApiErrorMessage } from '@/lib/helpers/api-error-message'
import { applyAuthFieldErrors } from '@/lib/helpers/parse-auth-form-errors'
import { ApiError } from '@/lib/api'

interface PendingAuth {
  token: string
  username: string
  email: string
  userId: number
}

interface UseLoginFormReturn {
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  isLoading: boolean
  formError: string | null
  showSetPasswordModal: boolean
  pendingAuthToken: string | null
  methods: UseFormReturn<LoginValues>
  onSubmit: (data: LoginValues) => Promise<void>
  onSetPasswordSuccess: () => void
}

function getSafeRedirectPath(redirect: string | null): string {
  if (!redirect) return '/'
  if (!redirect.startsWith('/') || redirect.startsWith('//')) return '/'
  return redirect
}

export function useLoginForm(): UseLoginFormReturn {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false)
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null)

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const { setError, clearErrors } = methods

  const redirectPath = getSafeRedirectPath(searchParams.get('redirect'))

  const navigateAfterLogin = useCallback(() => {
    router.refresh()
    setTimeout(() => {
      router.push(redirectPath)
    }, 800)
  }, [router, redirectPath])

  const persistAuthSession = useCallback(
    async (token: string, username: string, email: string, userId: number): Promise<void> => {
      await authService.persistSession(token, username, email, userId)
    },
    []
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
      const response: LoginResponse = await authService.login(data.username, data.password)
      const dataObj = response.results?.data
      const token = dataObj?.access

      if (!token) {
        const message = 'Invalid server response. Please try again.'
        setFormError(message)
        toast.error('Login Failed', { description: message })
        return
      }

      const username = dataObj?.username ?? ''
      const email = dataObj?.email ?? ''
      const userId = dataObj?.user_id ?? 0

      if (dataObj && dataObj.has_password_changed === false) {
        setPendingAuth({ token, username, email, userId })
        setShowSetPasswordModal(true)
        return
      }

      await persistAuthSession(token, username, email, userId)
      toast.success('Login successful! Redirecting...', { description: 'Welcome to your HRMS dashboard.' })
      navigateAfterLogin()
    } catch (error: unknown) {
      handleLoginFailure(error)
    } finally {
      setIsLoading(false)
    }
  }

  const onSetPasswordSuccess = async () => {
    if (!pendingAuth) {
      navigateAfterLogin()
      return
    }

    setIsLoading(true)
    setFormError(null)

    try {
      await persistAuthSession(
        pendingAuth.token,
        pendingAuth.username,
        pendingAuth.email,
        pendingAuth.userId
      )
      setPendingAuth(null)
      setShowSetPasswordModal(false)
      toast.success('Login successful! Redirecting...', { description: 'Welcome to your HRMS dashboard.' })
      navigateAfterLogin()
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
    pendingAuthToken: pendingAuth?.token ?? null,
    methods,
    onSubmit,
    onSetPasswordSuccess,
  }
}
