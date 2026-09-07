import assert from 'node:assert/strict'
import { test } from 'node:test'
import { myReservationsSchema } from '../src/schemas/reservation.schema.ts'

const reservation = {
  id: '507f1f77bcf86cd799439014', quantity: 2, createdAt: '2026-09-07T12:00:00.000Z',
  eventId: { id: '507f1f77bcf86cd799439011', name: 'Concierto', date: '2026-09-20', location: 'Guayaquil' },
}

test('historial válido conserva el contrato y el orden del backend', () => {
  const rows = [reservation, { ...reservation, id: 'second', quantity: 1 }]
  assert.deepEqual(myReservationsSchema.parse(rows), rows)
})
test('historial admite eventos eliminados y respuesta vacía', () => {
  assert.deepEqual(myReservationsSchema.parse([]), [])
  assert.equal(myReservationsSchema.parse([{ ...reservation, eventId: null }])[0].eventId, null)
})
test('historial rechaza fechas y cantidades inválidas y eventos sin datos requeridos', () => {
  for (const overrides of [{ quantity: 0 }, { quantity: 1.5 }, { createdAt: 'invalid' }, { eventId: {} }]) {
    assert.equal(myReservationsSchema.safeParse([{ ...reservation, ...overrides }]).success, false)
  }
})
