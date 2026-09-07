import { useEffect, useId, useRef } from 'react'
import type { MyReservation } from '../../schemas/reservation.schema'
import { formatDate } from '../../utils/formatDate'

type Props = {
  event: NonNullable<MyReservation['eventId']>
  quantity: number
  onClose: () => void
}

export function TicketModal({ event, quantity, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()

  useEffect(() => {
    const dialog = dialogRef.current
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    dialog?.showModal()
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [])

  return (
    <dialog ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} onCancel={(e) => { e.preventDefault(); onClose() }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }} className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-sm overflow-y-auto rounded-2xl bg-white p-0 text-slate-900 shadow-xl backdrop:bg-slate-900/60">
      <div className="relative p-7 text-center">
        <button type="button" autoFocus onClick={onClose} aria-label="Cerrar ticket" className="absolute right-3 top-3 rounded-lg px-3 py-1 text-2xl text-slate-600 hover:bg-slate-100">×</button>
        <p id={titleId} className="mt-5 text-xs font-bold uppercase tracking-widest text-indigo-700">Ticket de reserva</p>
        <h2 className="mt-4 wrap-break-word text-2xl font-extrabold">{event.name}</h2>
        <time dateTime={event.date} className="mt-3 block text-sm font-medium text-indigo-700">{formatDate(event.date)}</time>
        <p className="mt-2 wrap-break-word text-sm text-slate-600">{event.location}</p>
        <div className="my-6 border-y border-dashed border-slate-300 py-6">
          <img src="/ticket-qr.svg" alt="" aria-hidden="true" width="180" height="180" className="mx-auto" />
          <p className="mt-2 text-xs text-slate-500">QR decorativo · Sin validez de acceso</p>
        </div>
        <p className="text-xl font-bold">{quantity} {quantity === 1 ? 'ticket reservado' : 'tickets reservados'}</p>
        <p className="mt-4 rounded-full bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800">Reserva confirmada</p>
      </div>
    </dialog>
  )
}
