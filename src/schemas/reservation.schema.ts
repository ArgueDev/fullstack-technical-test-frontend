import { z } from 'zod'
import { eventSchema } from './event.schema.ts'

export const reservationInputSchema = z.object({
  eventId: z.string().regex(/^[a-fA-F0-9]{24}$/, 'El evento no es válido.'),
  quantity: z.number({ error: 'Ingresa una cantidad válida.' }).int('La cantidad debe ser entera.').min(1, 'Reserva al menos 1 ticket.'),
})
export const createReservationFormSchema = (availableTickets: number) => reservationInputSchema.pick({ quantity: true }).extend({
  quantity: reservationInputSchema.shape.quantity.max(availableTickets, `Solo hay ${availableTickets} tickets disponibles.`),
})
export const reservationResponseSchema = z.object({
  message: z.string(),
  reservation: z.object({
    id: z.string().min(1), eventId: z.string().min(1), userId: z.string().min(1),
    quantity: z.number().int().min(1),
  }),
})
export type ReservationInput = z.infer<typeof reservationInputSchema>
export type ReservationFormValues = z.infer<ReturnType<typeof createReservationFormSchema>>
export type ReservationResponse = z.infer<typeof reservationResponseSchema>

export const myReservationSchema = reservationResponseSchema.shape.reservation.pick({ id: true, quantity: true }).extend({
  createdAt: z.iso.datetime({ offset: true }),
  eventId: eventSchema.pick({ id: true, name: true, date: true, location: true }).nullable(),
})
export const myReservationsSchema = z.array(myReservationSchema)
export type MyReservation = z.infer<typeof myReservationSchema>
