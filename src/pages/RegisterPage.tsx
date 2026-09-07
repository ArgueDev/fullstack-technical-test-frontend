import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { registerSchema, type RegisterInput } from '../schemas/auth.schema'
import { register as registerAccount } from '../services/auth.service'
import { useAuth } from '../hooks/auth/useAuth'
import { getAuthError } from '../utils/getAuthError'
import { AuthField } from '../components/auth/AuthField'

export function RegisterPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<RegisterInput>({ resolver: zodResolver(registerSchema) })
  if (isAuthenticated) return <Navigate to="/" replace />

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerAccount(values)
      navigate('/login', { replace: true, state: { registered: true } })
    } catch (error) {
      setError('root', { message: getAuthError(error) })
    }
  })

  return (
    <main id="main-content" className="mx-auto max-w-md px-5 py-10 sm:py-14">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Crear cuenta</h1>
        <p className="mt-3 text-sm text-slate-600">Regístrate en Ticket Reservation.</p>
        <form noValidate onSubmit={onSubmit} className="mt-6">
          <fieldset disabled={isSubmitting} className="space-y-5">
            <legend className="sr-only">Datos de registro</legend>
            <AuthField id="register-name" label="Nombre" type="text" autoComplete="name" required maxLength={100} {...register('name')} error={errors.name?.message} />
            <AuthField id="register-email" label="Email" type="email" autoComplete="email" required {...register('email')} error={errors.email?.message} />
            <AuthField id="register-password" label="Contraseña (mínimo 8 caracteres)" type="password" autoComplete="new-password" required {...register('password')} error={errors.password?.message} />
            <AuthField id="register-confirm" label="Confirmar contraseña" type="password" autoComplete="new-password" required {...register('confirmPassword')} error={errors.confirmPassword?.message} />
            {errors.root && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{errors.root.message}</p>}
            <button type="submit" className="w-full rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}</button>
          </fieldset>
        </form>
        <p className="mt-6 text-sm text-slate-600">¿Ya tienes cuenta? <Link to="/login" className="font-semibold text-indigo-700 underline">Inicia sesión</Link></p>
      </section>
    </main>
  )
}
