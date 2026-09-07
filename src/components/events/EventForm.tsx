import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { eventFormSchema, type EventInput } from '../../schemas/event.schema'

export function EventForm({ initialValues, onSubmit, onCancel }: {
  initialValues?: EventInput
  onSubmit: (values: EventInput) => Promise<void>
  onCancel: () => void
}) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EventInput>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues ?? { name: '', date: '', location: '', availableTickets: 0 },
  })
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold">{initialValues ? 'Editar evento' : 'Crear evento'}</h2>
      <fieldset disabled={isSubmitting} className="grid gap-5 sm:grid-cols-2">
        <legend className="sr-only">Datos del evento</legend>
        {(['name', 'date', 'location', 'availableTickets'] as const).map((field) => (
          <div key={field}>
            <label htmlFor={`admin-${field}`} className="filter-label">{{ name: 'Nombre', date: 'Fecha', location: 'Ubicación', availableTickets: 'Tickets disponibles' }[field]}</label>
            <input id={`admin-${field}`} type={field === 'date' ? 'date' : field === 'availableTickets' ? 'number' : 'text'} min={field === 'availableTickets' ? 0 : undefined} step={field === 'availableTickets' ? 1 : undefined} required className="filter-input" aria-invalid={Boolean(errors[field])} aria-describedby={errors[field] ? `admin-${field}-error` : undefined} {...register(field, { valueAsNumber: field === 'availableTickets' })} />
            {errors[field] && <p id={`admin-${field}-error`} className="mt-2 text-sm text-red-800">{errors[field]?.message}</p>}
          </div>
        ))}
        <div className="flex gap-4 sm:col-span-2">
          <button type="submit" disabled={isSubmitting} className="rounded-lg bg-indigo-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{isSubmitting ? 'Guardando…' : 'Guardar evento'}</button>
          <button type="button" onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-slate-300 px-4 py-3 disabled:opacity-50">Cancelar</button>
        </div>
      </fieldset>
    </form>
  )
}
