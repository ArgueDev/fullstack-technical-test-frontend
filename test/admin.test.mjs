import assert from 'node:assert/strict'
import { test } from 'node:test'
import { eventFormSchema } from '../src/schemas/event.schema.ts'
import { getAdminEventError } from '../src/utils/getAdminEventError.ts'
import { AxiosError } from 'axios'

const input = { name: ' Concierto ', date: '2026-09-20', location: ' Guayaquil ', availableTickets: 10 }
test('formulario acepta creación y valores de edición, eliminando campos ajenos', () => {
  const parsed = eventFormSchema.parse(input)
  assert.equal(parsed.name, 'Concierto')
  assert.equal(parsed.location, 'Guayaquil')
  assert.deepEqual(eventFormSchema.parse({ ...input, id: 'event-1', createdAt: 'unused' }), parsed)
  assert.equal(eventFormSchema.safeParse({ ...input, availableTickets: 0 }).success, true)
})
test('formulario rechaza cantidades negativas, decimales, vacías y fechas inválidas', () => {
  for (const value of [-1, 1.5, NaN, '2']) assert.equal(eventFormSchema.safeParse({ ...input, availableTickets: value }).success, false)
  for (const overrides of [{ name: ' ' }, { location: '' }, { date: '' }, { date: '2026-02-30' }]) assert.equal(eventFormSchema.safeParse({ ...input, ...overrides }).success, false)
})
test('errores administrativos distinguen estados esperados sin exponer detalles técnicos', () => {
  const messages = [400, 401, 403, 404].map((status) => getAdminEventError(new AxiosError('secret', undefined, undefined, undefined, { status })))
  assert.equal(new Set(messages).size, 4)
  assert.ok(messages.every((message) => !message.includes('secret')))
  assert.ok(getAdminEventError(new AxiosError('Network Error')).includes('conexión'))
})
