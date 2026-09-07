import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../hooks/auth/useAuth'

export function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="border-b border-slate-200 bg-white">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:block focus:p-3">Saltar al contenido</a>
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-5">
        <Link to="/" className="text-lg font-extrabold tracking-tight text-indigo-700">Ticket Reservation</Link>
        <nav aria-label="Navegación principal" className="flex flex-wrap items-center gap-4 text-sm font-semibold">
          <NavLink to="/" className={({ isActive }) => isActive ? 'text-indigo-700 underline underline-offset-8' : 'text-slate-600'}>Eventos</NavLink>
          {user ? (
            <>
              <Link to="/profile" className="text-indigo-700 hover:underline">Perfil</Link>
              {user.role === 'admin' && <Link to="/admin" className="text-indigo-700 hover:underline">Administración</Link>}
              <button type="button" onClick={logout} className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50">Cerrar sesión</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg border border-slate-300 px-4 py-2 hover:bg-slate-50">Iniciar sesión</Link>
              <Link to="/register" className="text-indigo-700 hover:underline">Registrarse</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
