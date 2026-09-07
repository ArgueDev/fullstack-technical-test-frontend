import { z } from 'zod'
import { decodeAuthToken } from './decodeAuthToken.ts'

const storageKey = 'ticket-reservation.auth.token'
const listeners = new Set<() => void>()

const storedSessionSchema = z.object({ token: z.string(), name: z.string().optional() })

function readStoredSession() {
  try {
    const value = localStorage.getItem(storageKey)
    if (!value) return null
    // Existing sessions stored the raw JWT under this same key.
    if (!value.startsWith('{')) return { token: value }
    return storedSessionSchema.parse(JSON.parse(value))
  } catch {
    removeStoredToken()
    return null
  }
}

let currentSession = readStoredSession()

function removeStoredToken() {
  try { localStorage.removeItem(storageKey) } catch { /* In-memory logout still works if storage is unavailable. */ }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export const authStorage = {
  getToken(): string | null {
    if (currentSession && !decodeAuthToken(currentSession.token)) {
      currentSession = null
      removeStoredToken()
    }
    return currentSession?.token ?? null
  },
  getName(): string | null {
    return authStorage.getToken() ? currentSession?.name ?? null : null
  },
  setToken(token: string, name?: string) {
    if (!decodeAuthToken(token)) throw new Error('Invalid session')
    const session = name === undefined ? { token } : { token, name }
    localStorage.setItem(storageKey, name === undefined ? token : JSON.stringify(session))
    currentSession = session
    notify()
  },
  clear() {
    currentSession = null
    removeStoredToken()
    notify()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) {
        currentSession = readStoredSession()
        listener()
      }
    }
    const onFocus = () => {
      currentSession = readStoredSession()
      listener()
    }
    window.addEventListener('storage', onStorage)
    window.addEventListener('focus', onFocus)
    return () => {
      listeners.delete(listener)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('focus', onFocus)
    }
  },
}
