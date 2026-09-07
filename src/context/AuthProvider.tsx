import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react'
import { AuthContext } from './AuthContext'
import { authStorage } from '../utils/authStorage'
import { decodeAuthToken } from '../utils/decodeAuthToken'

export function AuthProvider({ children }: { children: ReactNode }) {
  const token = useSyncExternalStore(authStorage.subscribe, authStorage.getToken, () => null)
  const name = useSyncExternalStore(authStorage.subscribe, authStorage.getName, () => null)
  const payload = useMemo(() => token ? decodeAuthToken(token) : null, [token])

  useEffect(() => {
    if (!payload) return
    const timer = window.setTimeout(() => {
      if (authStorage.getToken() === token || authStorage.getToken() === null) authStorage.clear()
    }, Math.min(Math.max(payload.exp * 1000 - Date.now(), 0), 2_147_483_647))
    return () => window.clearTimeout(timer)
  }, [payload, token])

  const value = useMemo(() => ({
    user: payload ? { userId: payload.userId, role: payload.role, name } : null,
    isAuthenticated: payload !== null,
    establishSession: authStorage.setToken,
    logout: authStorage.clear,
  }), [payload, name])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
