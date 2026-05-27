import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'

import { fetchMe, login as loginRequest, logout as logoutRequest } from '../api/auth'
import {
  clearAuthToken,
  getAuthToken,
  setAuthToken,
} from '../api/tokenStorage'
import { AuthContext, type AuthContextValue } from './authContextValue'
import type { AuthUser, LoginPayload } from '../types/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const token = getAuthToken()
    if (!token) {
      setUser(null)
      return
    }

    try {
      const currentUser = await fetchMe()
      setUser(currentUser)
    } catch {
      clearAuthToken()
      setUser(null)
    }
  }, [])

  useEffect(() => {
    let isActive = true

    async function initializeAuth() {
      await refreshUser()
      if (isActive) {
        setIsLoading(false)
      }
    }

    void initializeAuth()

    return () => {
      isActive = false
    }
  }, [refreshUser])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginRequest(payload)
    setAuthToken(response.token)
    setUser(response.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      if (getAuthToken()) {
        await logoutRequest()
      }
    } finally {
      clearAuthToken()
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      refreshUser,
    }),
    [isLoading, login, logout, refreshUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
