// validations/auth.schema.ts
import * as z from 'zod'

/**
 * Login validates existing credentials only (min 6 chars).
 * New passwords use setPasswordSchema with stronger rules.
 */
export const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username or Email is required' }).trim(),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
})

export type LoginValues = z.infer<typeof loginSchema>

export const setPasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z.string().min(1, { message: 'Confirm password is required' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type SetPasswordValues = z.infer<typeof setPasswordSchema>
