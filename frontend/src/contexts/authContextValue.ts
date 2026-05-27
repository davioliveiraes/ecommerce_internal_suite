import { createContext } from 'react'

import type { AuthUser, LoginPayload } from '../types/auth'

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
)
