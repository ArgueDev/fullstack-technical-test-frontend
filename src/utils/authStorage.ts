import { decodeAuthToken } from './decodeAuthToken.ts'

const storageKey = 'ticket-reservation.auth.token'
const listeners = new Set<() => void>()

function readStoredToken() {
  try { return localStorage.getItem(storageKey) } catch { return null }
}

let currentToken = readStoredToken()

function removeStoredToken() {
  try { localStorage.removeItem(storageKey) } catch { /* In-memory logout still works if storage is unavailable. */ }
}

function notify() {
  listeners.forEach((listener) => listener())
}

export const authStorage = {
  getToken(): string | null {
    if (currentToken && !decodeAuthToken(currentToken)) {
      currentToken = null
      removeStoredToken()
    }
    return currentToken
  },
  setToken(token: string) {
    if (!decodeAuthToken(token)) throw new Error('Invalid session')
    localStorage.setItem(storageKey, token)
    currentToken = token
    notify()
  },
  clear() {
    currentToken = null
    removeStoredToken()
    notify()
  },
  subscribe(listener: () => void) {
    listeners.add(listener)
    const onStorage = (event: StorageEvent) => {
      if (event.key === storageKey || event.key === null) {
        currentToken = readStoredToken()
        listener()
      }
    }
    const onFocus = () => {
      currentToken = readStoredToken()
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
