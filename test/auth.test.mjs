import assert from 'node:assert/strict'
import { test } from 'node:test'
import { loginSchema, registerSchema, loginResponseSchema, registerResponseSchema } from '../src/schemas/auth.schema.ts'
import { decodeAuthToken } from '../src/utils/decodeAuthToken.ts'

const jwt = (payload) => [
  Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url'),
  Buffer.from(JSON.stringify(payload)).toString('base64url'),
  'test-signature',
].join('.')
const payload = { userId: 'user-1', role: 'user', exp: Math.floor(Date.now() / 1000) + 3600 }

test('forms match password rules and require matching confirmation', () => {
  const input = { name: ' Ana ', email: 'ana@example.com', password: 'password123', confirmPassword: 'password123' }
  assert.equal(registerSchema.parse(input).name, 'Ana')
  for (const overrides of [{ name: ' ' }, { email: 'invalid' }, { password: 'short' }, { confirmPassword: 'different' }]) {
    assert.equal(registerSchema.safeParse({ ...input, ...overrides }).success, false)
  }
  assert.equal(loginSchema.safeParse({ email: input.email, password: 'a' }).success, true)
  assert.equal(loginSchema.safeParse({ email: input.email, password: '' }).success, false)
  assert.equal('role' in registerSchema.parse({ ...input, role: 'admin' }), false)
})

test('responses match backend contracts and discard unused sensitive fields', () => {
  const response = { message: 'OK', user: { id: 'user-1', name: 'Ana', email: 'ana@example.com', role: 'user', password: 'discard' } }
  assert.equal(registerResponseSchema.safeParse(response).success, true)
  assert.equal(loginResponseSchema.safeParse(response).success, false)
  assert.equal(loginResponseSchema.safeParse({ ...response, token: jwt(payload) }).success, true)
  assert.equal('password' in registerResponseSchema.parse(response).user, false)
})

test('JWT decoding accepts known roles and rejects corrupt, expired or incomplete payloads', () => {
  assert.deepEqual(decodeAuthToken(jwt(payload)), payload)
  assert.equal(decodeAuthToken(jwt({ ...payload, role: 'admin' })).role, 'admin')
  for (const token of ['broken', 'a.%%.b', jwt({ ...payload, role: 'owner' }), jwt({ ...payload, exp: 1 }), jwt({ userId: '1', role: 'user' }), jwt({ ...payload, userId: '' })]) {
    assert.equal(decodeAuthToken(token), null)
  }
})

test('storage restores sessions and clears the persisted name on logout and expiry', async () => {
  const entries = new Map([['ticket-reservation.auth.token', jwt(payload)]])
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: {
    getItem: (key) => entries.get(key) ?? null,
    setItem: (key, value) => entries.set(key, value),
    removeItem: (key) => entries.delete(key),
  } })
  const now = Date.now
  try {
    const { authStorage } = await import('../src/utils/authStorage.ts')
    assert.equal(authStorage.getToken(), jwt(payload))
    authStorage.clear()
    assert.equal(authStorage.getToken(), null)
    assert.equal(entries.size, 0)
    assert.throws(() => authStorage.setToken('broken'))
    authStorage.setToken(jwt(payload))
    assert.deepEqual([...entries.values()], [jwt(payload)])
    authStorage.setToken(jwt(payload), 'Ana Real')
    assert.equal(authStorage.getName(), 'Ana Real')
    assert.deepEqual(JSON.parse(entries.get('ticket-reservation.auth.token')), { token: jwt(payload), name: 'Ana Real' })
    const restored = await import('../src/utils/authStorage.ts?name-restoration')
    assert.equal(restored.authStorage.getName(), 'Ana Real')
    authStorage.clear()
    assert.equal(authStorage.getName(), null)
    assert.equal(entries.size, 0)
    authStorage.setToken(jwt(payload), 'Ana Real')
    Date.now = () => (payload.exp + 1) * 1000
    assert.equal(authStorage.getToken(), null)
    assert.equal(authStorage.getName(), null)
    assert.equal(entries.size, 0)
  } finally {
    Date.now = now
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
    else delete globalThis.localStorage
  }
})
