import { createContext } from 'react'
import type { AuthUser } from '../schemas/auth.schema'

export const AuthContext = createContext<{
  user: AuthUser | null
  isAuthenticated: boolean
  establishSession: (token: string) => void
  logout: () => void
} | null>(null)
