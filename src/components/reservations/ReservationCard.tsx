import { useState } from 'react'
import { TicketModal } from './TicketModal'
import type { MyReservation } from '../../schemas/reservation.schema'
import { formatDate } from '../../utils/formatDate'
import { formatDateTime } from '../../utils/formatDateTime'

export function ReservationCard({ reservation }: { reservation: MyReservation }) {
  const [ticketOpen, setTicketOpen] = useState(false)
  const event = reservation.eventId
  return (
    <article className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="wrap-break-word text-xl font-bold">{event?.name ?? 'Evento no disponible'}</h3>
      {event && (
        <>
          <time dateTime={event.date} className="mt-3 text-sm font-medium text-indigo-700">{formatDate(event.date)}</time>
          <p className="mt-2 wrap-break-word text-sm text-slate-600">{event.location}</p>
        </>
      )}
      <p className="mt-5 font-semibold">{reservation.quantity} {reservation.quantity === 1 ? 'ticket reservado' : 'tickets reservados'}</p>
      <p className="mt-2 mb-6 text-sm text-slate-600">Reserva realizada: <time dateTime={reservation.createdAt}>{formatDateTime(reservation.createdAt)}</time></p>
      {event && <button type="button" onClick={() => setTicketOpen(true)} aria-label={`Ver ticket: ${event.name}`} className="mt-auto rounded-lg bg-indigo-700 px-4 py-3 text-center text-sm font-semibold text-white hover:bg-indigo-800">Ver ticket</button>}
      {event && ticketOpen && <TicketModal event={event} quantity={reservation.quantity} onClose={() => setTicketOpen(false)} />}

    </article>
  )
}
