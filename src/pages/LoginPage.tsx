import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { loginSchema, type LoginInput } from '../schemas/auth.schema'
import { login } from '../services/auth.service'
import { useAuth } from '../hooks/auth/useAuth'
import { getAuthError } from '../utils/getAuthError'
import { AuthField } from '../components/auth/AuthField'

export function LoginPage() {
  const { isAuthenticated, establishSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState: unknown = location.state
  const from = typeof navigationState === 'object' && navigationState !== null && 'from' in navigationState && typeof navigationState.from === 'string' && /^\/events\/[^/?#]+$/.test(navigationState.from) ? navigationState.from : '/'
  const registered = typeof navigationState === 'object' && navigationState !== null && 'registered' in navigationState && navigationState.registered === true
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })
  if (isAuthenticated) return <Navigate to={from} replace />

  const onSubmit = handleSubmit(async (values) => {
    try {
      const response = await login(values)
      establishSession(response.token)
      navigate(from, { replace: true })
    } catch (error) {
      setError('root', { message: getAuthError(error) })
    }
  })

  return (
    <main id="main-content" className="mx-auto max-w-md px-5 py-10 sm:py-14">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Iniciar sesión</h1>
        <p className="mt-3 text-sm text-slate-600">Accede a tu cuenta de Ticket Reservation.</p>
        {registered && <p role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">Tu cuenta se creó correctamente. Ya puedes iniciar sesión.</p>}
        <form noValidate onSubmit={onSubmit} className="mt-6">
          <fieldset disabled={isSubmitting} className="space-y-5">
            <legend className="sr-only">Datos de acceso</legend>
            <AuthField id="login-email" label="Email" type="email" autoComplete="email" required {...register('email')} error={errors.email?.message} />
            <AuthField id="login-password" label="Contraseña" type="password" autoComplete="current-password" required {...register('password')} error={errors.password?.message} />
            {errors.root && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">{errors.root.message}</p>}
            <button type="submit" className="w-full rounded-lg bg-indigo-700 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Iniciando sesión…' : 'Iniciar sesión'}</button>
          </fieldset>
        </form>
        <p className="mt-6 text-sm text-slate-600">¿No tienes cuenta? <Link to="/register" className="font-semibold text-indigo-700 underline">Regístrate</Link></p>
      </section>
    </main>
  )
}
