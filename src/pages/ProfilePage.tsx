import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/auth/useAuth'
import { useMyReservations } from '../hooks/reservations/useMyReservations'
import { ReservationCard } from '../components/reservations/ReservationCard'
import { getMyReservationsError } from '../utils/getMyReservationsError'

export function ProfilePage() {
  const { user } = useAuth()
  const { data: reservations, isPending, isError, error, isFetching, refetch } = useMyReservations()

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <h1 className="text-center text-4xl font-extrabold tracking-tight wrap-break-word">{user?.name?.trim() || 'Mi perfil'}</h1>
      <section aria-labelledby="reservations-title" aria-busy={isFetching} className="mt-10">
        <h2 id="reservations-title" className="mb-5 text-center text-2xl font-bold">Mis reservas</h2>
        {isPending && <p role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">Cargando reservas…</p>}
        {isError ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6">
            <p className="text-red-800">{getMyReservationsError(error)}</p>
            <button type="button" disabled={isFetching} onClick={() => void refetch()} className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50">{isFetching ? 'Reintentando…' : 'Reintentar'}</button>
          </div>
        ) : reservations && (reservations.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <h3 className="text-xl font-bold">Aún no tienes reservas</h3>
            <p className="mt-3 text-slate-600">Descubre un evento y reserva tus tickets.</p>
            <Link to="/" className="mt-5 inline-block font-semibold text-indigo-700 underline">Explorar eventos</Link>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{reservations.map((reservation) => <ReservationCard key={reservation.id} reservation={reservation} />)}</div>
        ))}
      </section>
    </main>
  )
}
