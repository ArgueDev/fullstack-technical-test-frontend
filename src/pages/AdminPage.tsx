import { useState } from 'react'
import { useEvents } from '../hooks/events/useEvents'
import { useAdminEvents } from '../hooks/events/useAdminEvents'
import { EventForm } from '../components/events/EventForm'
import type { Event, EventInput } from '../schemas/event.schema'
import { formatDate } from '../utils/formatDate'
import { getAdminEventError } from '../utils/getAdminEventError'

type Action = { mode: 'create' } | { mode: 'edit' | 'delete'; event: Event }

export function AdminPage() {
  const query = useEvents()
  const { create, update, remove } = useAdminEvents()
  const [action, setAction] = useState<Action | null>(null)
  const [feedback, setFeedback] = useState<{ error: boolean; message: string } | null>(null)
  const busy = create.isPending || update.isPending || remove.isPending
  const begin = (next: Action) => { setFeedback(null); setAction(next) }
  const save = async (input: EventInput) => {
    if (!action || busy) return
    try {
      if (action.mode === 'edit') await update.mutateAsync({ id: action.event.id, input })
      else await create.mutateAsync(input)
      setFeedback({ error: false, message: action.mode === 'edit' ? 'Evento actualizado correctamente.' : 'Evento creado correctamente.' })
      setAction(null)
    } catch (error) { setFeedback({ error: true, message: getAdminEventError(error) }) }
  }
  const confirmDelete = async () => {
    if (action?.mode !== 'delete' || busy) return
    try {
      await remove.mutateAsync(action.event.id)
      setAction(null)
      setFeedback({ error: false, message: 'Evento eliminado correctamente.' })
    } catch (error) { setFeedback({ error: true, message: getAdminEventError(error) }) }
  }
  return (
    <main id="main-content" className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold tracking-tight">Administración de eventos</h1>
        <button type="button" disabled={busy} onClick={() => begin({ mode: 'create' })} className="rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white disabled:opacity-50">Crear evento</button>
      </div>
      {feedback && <p role={feedback.error ? 'alert' : 'status'} className={`mt-6 rounded-lg p-4 ${feedback.error ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'}`}>{feedback.message}</p>}
      {action && action.mode !== 'delete' && <EventForm key={action.mode === 'edit' ? action.event.id : 'create'} initialValues={action.mode === 'edit' ? action.event : undefined} onSubmit={save} onCancel={() => setAction(null)} />}
      {action?.mode === 'delete' && (
        <section aria-labelledby="delete-title" className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
          <h2 id="delete-title" className="text-xl font-bold">¿Eliminar este evento?</h2>
          <p className="mt-3 wrap-break-word">{action.event.name}. Esta acción no se puede deshacer.</p>
          <div className="mt-5 flex gap-4">
            <button type="button" disabled={busy} onClick={() => setAction(null)} className="rounded-lg border border-slate-300 px-4 py-3 disabled:opacity-50">Cancelar</button>
            <button type="button" disabled={busy} onClick={() => void confirmDelete()} className="rounded-lg bg-red-800 px-4 py-3 font-semibold text-white disabled:opacity-50">{remove.isPending ? 'Eliminando…' : 'Eliminar'}</button>
          </div>
        </section>
      )}
      <section aria-label="Eventos existentes" aria-busy={query.isFetching} className="mt-8">
        {query.isPending && <p role="status">Cargando eventos…</p>}
        {query.isError && <div role="alert" className="mb-5 rounded-lg bg-red-50 p-5 text-red-800"><p>{getAdminEventError(query.error)}</p><button type="button" disabled={query.isFetching} onClick={() => void query.refetch()} className="mt-3 rounded-lg border px-4 py-2 disabled:opacity-50">Reintentar</button></div>}
        {query.data?.length === 0 && <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">Aún no hay eventos. Crea el primero.</p>}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {query.data?.map((event) => <article key={event.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="wrap-break-word text-xl font-bold">{event.name}</h2>
            <time dateTime={event.date} className="mt-3 block text-sm text-indigo-700">{formatDate(event.date)}</time>
            <p className="mt-2 wrap-break-word text-slate-600">{event.location}</p>
            <p className="mt-4 font-semibold">{event.availableTickets} tickets disponibles</p>
            <div className="mt-5 flex gap-4">
              <button type="button" disabled={busy} onClick={() => begin({ mode: 'edit', event })} aria-label={`Editar ${event.name}`} className="rounded-lg border border-indigo-700 px-4 py-2 text-indigo-700 disabled:opacity-50">Editar</button>
              <button type="button" disabled={busy} onClick={() => begin({ mode: 'delete', event })} aria-label={`Eliminar ${event.name}`} className="rounded-lg border border-red-800 px-4 py-2 text-red-800 disabled:opacity-50">Eliminar</button>
            </div>
          </article>)}
        </div>
      </section>
    </main>
  )
}
