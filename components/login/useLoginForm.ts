// components/login/useLoginForm.ts
'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, type UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { authService, type LoginResponse } from '@/services/auth-service'
import { loginSchema, type LoginValues } from '@/validations/auth.schema'
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
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false)
  const [pendingAuth, setPendingAuth] = useState<PendingAuth | null>(null)

  const methods = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const { setError } = methods

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

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    try {
      const response: LoginResponse = await authService.login(data.username, data.password)
      const dataObj = response.results?.data
      const token = dataObj?.access

      if (!token) {
        setIsLoading(false)
        toast.error('Login Failed', {
          description: 'Invalid server response. Please try again.',
        })
        return
      }

      const username = dataObj?.username ?? ''
      const email = dataObj?.email ?? ''
      const userId = dataObj?.user_id ?? 0

      if (dataObj && dataObj.has_password_changed === false) {
        setPendingAuth({ token, username, email, userId })
        setShowSetPasswordModal(true)
        setIsLoading(false)
      } else {
        await persistAuthSession(token, username, email, userId)
        toast.success('Login successful! Redirecting...', { description: 'Welcome to your HRMS dashboard.' })
        setIsLoading(false)
        navigateAfterLogin()
      }
    } catch (error: unknown) {
      setIsLoading(false)
      let errorMessage = 'Invalid username or password.'

      if (error instanceof ApiError) {
        errorMessage = error.message || errorMessage
        const errorData = error.data
        if (errorData && typeof errorData === 'object' && 'errors' in errorData) {
          const backendErrors = (errorData as { errors: Record<string, unknown> }).errors
          if (backendErrors && typeof backendErrors === 'object') {
            const errorMessages: string[] = []
            Object.entries(backendErrors).forEach(([field, messages]) => {
              const messagesArr = Array.isArray(messages) ? messages : [String(messages)]
              if (messagesArr.length > 0) {
                const cleanMsg = String(messagesArr[0])
                errorMessages.push(cleanMsg)
                if (field === 'username' || field === 'password') {
                  setError(field, {
                    type: 'server',
                    message: cleanMsg,
                  })
                }
              }
            })
            if (errorMessages.length > 0) {
              errorMessage = errorMessages.join(' ')
            }
          }
        }
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      toast.error('Login Failed', { description: errorMessage })
    }
  }

  const onSetPasswordSuccess = async () => {
    if (pendingAuth) {
      await persistAuthSession(
        pendingAuth.token,
        pendingAuth.username,
        pendingAuth.email,
        pendingAuth.userId
      )
      setPendingAuth(null)
    }
    setShowSetPasswordModal(false)
    toast.success('Login successful! Redirecting...', { description: 'Welcome to your HRMS dashboard.' })
    navigateAfterLogin()
  }

  return {
    showPassword,
    setShowPassword,
    isLoading,
    showSetPasswordModal,
    pendingAuthToken: pendingAuth?.token ?? null,
    methods,
    onSubmit,
    onSetPasswordSuccess,
  }
}
