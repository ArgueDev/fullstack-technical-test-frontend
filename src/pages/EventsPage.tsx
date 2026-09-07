import { useState } from 'react'
import { isAxiosError } from 'axios'
import { ZodError } from 'zod'
import { EventCard } from '../components/events/EventCard'
import { EventFilters, type EventFilterValues } from '../components/events/EventFilters'
import { useEvents } from '../hooks/events/useEvents'

const initialFilters: EventFilterValues = { date: '', location: '', availability: 'all' }

function errorMessage(error: Error) {
  if (error instanceof ZodError) return 'Los datos de eventos recibidos no tienen el formato esperado. Intenta nuevamente más tarde.'
  if (isAxiosError(error) && !error.response) return 'No pudimos conectar con el servidor de eventos. Comprueba tu conexión e inténtalo nuevamente.'
  return 'No pudimos cargar los eventos en este momento. Intenta nuevamente en unos minutos.'
}

export function EventsPage() {
  const { data: events, isPending, isError, error, isFetching, refetch } = useEvents()
  const [filters, setFilters] = useState(initialFilters)
  const location = filters.location.trim().toLocaleLowerCase('es')
  const filteredEvents = events?.filter((event) =>
    (!filters.date || event.date === filters.date) &&
    event.location.toLocaleLowerCase('es').includes(location) &&
    (filters.availability === 'all' || (filters.availability === 'available' ? event.availableTickets > 0 : event.availableTickets === 0)),
  ) ?? []

  return (
    <main id="main-content" className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <section className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-700">Encuentra tu próximo plan</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">Descubre eventos</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-600">Explora los eventos disponibles y encuentra el lugar y la fecha para tu próxima experiencia.</p>
      </section>
      <EventFilters filters={filters} onChange={setFilters} onReset={() => setFilters(initialFilters)} disabled={isPending || !events?.length} />
      <section aria-label="Resultados de eventos" aria-busy={isFetching} className="mt-8">
        {isPending && <p role="status" className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-600">Cargando eventos…</p>}
        {isError && (
          <div role="alert" className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-6">
            <h2 className="font-bold text-red-900">No se pudieron actualizar los eventos</h2>
            <p className="mt-2 text-sm text-red-800">{errorMessage(error)}</p>
            <button type="button" disabled={isFetching} onClick={() => void refetch()} className="mt-4 rounded-lg bg-red-800 px-4 py-2 text-sm font-semibold text-white hover:bg-red-900 disabled:opacity-50">{isFetching ? 'Reintentando…' : 'Reintentar'}</button>
          </div>
        )}
        {events && (
          <>
            <p role="status" className="mb-4 text-sm text-slate-600">{filteredEvents.length} {filteredEvents.length === 1 ? 'evento encontrado' : 'eventos encontrados'}{isFetching ? ' · Actualizando…' : ''}</p>
            {filteredEvents.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{filteredEvents.map((event) => <EventCard key={event.id} event={event} />)}</div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <h2 className="text-xl font-bold">{events.length === 0 ? 'Aún no hay eventos disponibles' : 'No encontramos eventos con estos filtros'}</h2>
                <p className="mt-3 text-slate-600">{events.length === 0 ? 'Vuelve pronto para descubrir nuevos eventos.' : 'Prueba otra fecha o ubicación, o limpia los filtros para ver todos los eventos.'}</p>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  )
}
