import assert from 'node:assert/strict'
import { test } from 'node:test'
import { AxiosError } from 'axios'
import { createReservationFormSchema, reservationInputSchema, reservationResponseSchema } from '../src/schemas/reservation.schema.ts'
import { getReservationError } from '../src/utils/getReservationError.ts'

test('quantity must be a number, integer and within current availability', () => {
  const schema = createReservationFormSchema(5)
  for (const quantity of [undefined, NaN, '2', 0, -1, 1.5, 6]) assert.equal(schema.safeParse({ quantity }).success, false)
  for (const quantity of [1, 5]) assert.equal(schema.safeParse({ quantity }).success, true)
  assert.equal(createReservationFormSchema(0).safeParse({ quantity: 1 }).success, false)
  assert.equal(createReservationFormSchema(2).safeParse({ quantity: 3 }).success, false)
})

test('input strips user identity and response validates the actual backend envelope', () => {
  const eventId = '507f1f77bcf86cd799439011'
  assert.deepEqual(reservationInputSchema.parse({ eventId, quantity: 2, userId: 'injected' }), { eventId, quantity: 2 })
  const response = { message: 'Reserva creada correctamente', reservation: { id: 'reservation-1', eventId, userId: 'user-1', quantity: 2 } }
  assert.equal(reservationResponseSchema.safeParse(response).success, true)
  assert.equal(reservationResponseSchema.safeParse(response.reservation).success, false)
  assert.equal(reservationResponseSchema.safeParse({ ...response, reservation: { ...response.reservation, quantity: -1 } }).success, false)
})

test('expected API errors have actionable messages without internal details', () => {
  for (const status of [400, 401, 404, 409, 500]) {
    const message = getReservationError(new AxiosError('internal-secret', undefined, undefined, undefined, { status }))
    assert.ok(!message.includes('internal-secret'))
    if (status === 409) assert.ok(message.includes('disponibilidad'))
    if (status === 401) assert.ok(message.includes('sesión'))
  }
  assert.ok(getReservationError(new AxiosError('Network Error')).includes('antes de volver a intentarlo'))
})
