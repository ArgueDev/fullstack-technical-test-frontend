import { z } from 'zod'

const emailSchema = z.string().trim().min(1, 'El correo es obligatorio.').email('Ingresa un correo válido.')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'La contraseña es obligatoria.'),
})

export const registerSchema = loginSchema.extend({
  name: z.string().trim().min(1, 'El nombre es obligatorio.').max(100, 'Usa como máximo 100 caracteres.'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  confirmPassword: z.string().min(1, 'Confirma tu contraseña.'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'], message: 'Las contraseñas no coinciden.',
})

export const authUserSchema = z.object({ userId: z.string().min(1), role: z.enum(['user', 'admin']) })

export const jwtPayloadSchema = authUserSchema.extend({ exp: z.number().int().positive() })

const responseUserSchema = z.object({
  id: z.string().min(1), name: z.string(), email: z.string().email(), role: authUserSchema.shape.role,
})

export const registerResponseSchema = z.object({ message: z.string(), user: responseUserSchema })
export const loginResponseSchema = registerResponseSchema.extend({ token: z.string().min(1) })
export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type AuthUser = z.infer<typeof authUserSchema>
