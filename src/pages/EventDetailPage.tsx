import { ReservationPanel } from '../components/reservations/ReservationPanel'
import { Link, useParams } from 'react-router-dom'
import { useEvent } from '../hooks/events/useEvent'
import { formatDate } from '../utils/formatDate'
import { getEventDetailError } from '../utils/getEventDetailError'

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: event, isValidId, isPending, isError, error, isFetching, refetch } = useEvent(id)
  const failure = !isValidId
    ? { title: 'Identificador de evento inválido', message: 'Vuelve a la lista para seleccionar un evento válido.', canRetry: false }
    : isError ? getEventDetailError(error) : null

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <Link to="/" className="inline-block text-sm font-semibold text-indigo-700 underline underline-offset-4">Volver a eventos</Link>
      <div className="mt-8" aria-busy={isFetching}>
        {failure ? (
          <section role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-6 sm:p-10">
            <h1 className="text-2xl font-bold text-red-900">{failure.title}</h1>
            <p className="mt-3 text-red-800">{failure.message}</p>
            {failure.canRetry && (
              <button type="button" disabled={isFetching} onClick={() => void refetch()} className="mt-5 rounded-lg bg-red-800 px-4 py-3 text-sm font-semibold text-white hover:bg-red-900 disabled:cursor-not-allowed disabled:opacity-50">
                {isFetching ? 'Reintentando…' : 'Reintentar'}
              </button>
            )}
          </section>
        ) : isPending ? (
          <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h1 className="text-2xl font-bold">Detalle del evento</h1>
            <p role="status" className="mt-3 text-slate-600">Cargando evento…</p>
          </section>
        ) : event ? (
          <article className="grid overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:grid-cols-[2fr_1fr]">
            <div className="min-w-0 p-6 sm:p-10">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Detalle del evento</p>
              <h1 className="mt-4 wrap-break-word text-3xl font-extrabold tracking-tight sm:text-4xl">{event.name}</h1>
              <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold text-slate-600">Fecha</dt>
                  <dd className="mt-2 font-medium text-indigo-700"><time dateTime={event.date}>{formatDate(event.date)}</time></dd>
                </div>
                <div className="min-w-0">
                  <dt className="text-sm font-semibold text-slate-600">Ubicación</dt>
                  <dd className="mt-2 wrap-break-word font-medium">{event.location}</dd>
                </div>
              </dl>
            </div>
            <section aria-label="Disponibilidad de tickets" className="border-t border-slate-200 bg-slate-50 p-6 sm:p-10 lg:border-t-0 lg:border-l">
              <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${event.availableTickets > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-200 text-slate-700'}`}>
                {event.availableTickets > 0 ? 'Disponible' : 'Agotado'}
              </span>
              <h2 className="mt-5 text-xl font-bold">{event.availableTickets} {event.availableTickets === 1 ? 'ticket disponible' : 'tickets disponibles'}</h2>
              <ReservationPanel key={event.id} event={event} refreshing={isFetching} />
            </section>
          </article>
        ) : null}
      </div>
    </main>
  )
}
