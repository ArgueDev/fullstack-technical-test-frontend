import { createContext } from 'react'
import type { AuthUser } from '../schemas/auth.schema'

export const AuthContext = createContext<{
  user: (AuthUser & { name: string | null }) | null
  isAuthenticated: boolean
  establishSession: (token: string, name: string) => void
  logout: () => void
} | null>(null)
