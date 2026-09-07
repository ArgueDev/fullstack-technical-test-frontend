import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/auth/useAuth'
import { useCreateReservation } from '../../hooks/reservations/useCreateReservation'
import { createReservationFormSchema, type ReservationFormValues } from '../../schemas/reservation.schema'
import type { Event } from '../../schemas/event.schema'
import { getReservationError } from '../../utils/getReservationError'

export function ReservationPanel({ event, refreshing }: { event: Event; refreshing: boolean }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const mutation = useCreateReservation()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ReservationFormValues>({
    resolver: zodResolver(createReservationFormSchema(event.availableTickets)), defaultValues: { quantity: 1 },
  })
  const busy = mutation.isPending || isSubmitting
  const soldOut = event.availableTickets === 0
  const buttonClass = 'mt-6 w-full rounded-lg bg-indigo-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50'
  const submit = handleSubmit(async ({ quantity }) => {
    if (!isAuthenticated || soldOut || busy || refreshing) return
    try {
      await mutation.mutateAsync({ eventId: event.id, quantity })
    } catch { /* The mutation exposes the error below. */ }
  })

  if (mutation.isSuccess) {
    return (
      <div role="status" className="mt-5 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
        <p className="font-semibold"><span aria-hidden="true">✓ </span>Reserva realizada correctamente</p>
        <p className="mt-2">Evento: {event.name}</p>
        <p>Tickets reservados: {mutation.data.reservation.quantity}</p>
      </div>
    )
  }

  return (
    <div>
      {mutation.isError && <p role="alert" className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-800">{getReservationError(mutation.error)}</p>}
      {soldOut ? <button type="button" disabled className={buttonClass}>Agotado</button> : !isAuthenticated ? (
        <Link to="/login" state={{ from: location.pathname }} className={`${buttonClass} block`}>Reservar tickets</Link>
      ) : !open ? (
        <button type="button" onClick={() => setOpen(true)} className={buttonClass}>Reservar tickets</button>
      ) : (
        <form noValidate onSubmit={submit} className="mt-5">
          <fieldset disabled={busy || refreshing}>
            <legend className="sr-only">Reservar tickets</legend>
            <label htmlFor="reservation-quantity" className="filter-label">Cantidad de tickets</label>
            <input id="reservation-quantity" type="number" min={1} max={event.availableTickets} step={1} required autoFocus className="filter-input" aria-invalid={Boolean(errors.quantity)} aria-describedby={errors.quantity ? 'quantity-error' : undefined} {...register('quantity', { valueAsNumber: true })} />
            {errors.quantity && <p id="quantity-error" className="mt-2 text-sm text-red-800">{errors.quantity.message}</p>}
            <button type="submit" disabled={busy || refreshing} className={buttonClass}>{busy ? 'Reservando…' : refreshing ? 'Actualizando disponibilidad…' : 'Confirmar reserva'}</button>
          </fieldset>
        </form>
      )}
    </div>
  )
}
