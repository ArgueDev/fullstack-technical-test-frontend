import { apiClient } from '../api/apiClient'
import { reservationInputSchema, reservationResponseSchema, type ReservationInput } from '../schemas/reservation.schema'

export async function createReservation(input: ReservationInput) {
  const { eventId, quantity } = reservationInputSchema.parse(input)
  const response = await apiClient.post<unknown>('/reservations', { eventId, quantity })
  return reservationResponseSchema.parse(response.data)
}
