import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'
import type { AuthUser } from '../../schemas/auth.schema'

export function ProtectedRoute({ role }: { role?: AuthUser['role'] }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}
