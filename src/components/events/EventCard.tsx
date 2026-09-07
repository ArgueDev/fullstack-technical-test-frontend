import { Link } from 'react-router-dom'
import type { Event } from '../../schemas/event.schema'
import { formatDate } from '../../utils/formatDate'

export function EventCard({ event }: { event: Event }) {
  const available = event.availableTickets > 0
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <span className={`self-start rounded-full px-3 py-1 text-xs font-semibold ${available ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'}`}>
        {available ? 'Disponible' : 'Agotado'}
      </span>
      <h2 className="mt-5 wrap-break-word text-xl font-bold tracking-tight">{event.name}</h2>
      <time dateTime={event.date} className="mt-3 text-sm font-medium text-indigo-700">{formatDate(event.date)}</time>
      <p className="mt-2 wrap-break-word text-sm text-slate-600">{event.location}</p>
      <p className="mb-6 mt-5 text-sm font-semibold">{event.availableTickets} {event.availableTickets === 1 ? 'ticket disponible' : 'tickets disponibles'}</p>
      <Link to={`/events/${encodeURIComponent(event.id)}`} aria-label={`Ver detalle de ${event.name}`} className="mt-auto rounded-lg bg-indigo-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-800">Ver detalle</Link>
    </article>
  )
}
