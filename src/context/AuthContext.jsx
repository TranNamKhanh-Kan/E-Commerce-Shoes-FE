import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

const ROLES = { ADMIN: 1, STAFF: 2, CUSTOMER: 3 }

function loadStoredUser() {
  try {
    const raw = localStorage.getItem('user')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(loadStoredUser)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  const persist = useCallback((nextUser, nextToken) => {
    setUser(nextUser)
    setToken(nextToken)
    if (nextUser && nextToken) {
      localStorage.setItem('user', JSON.stringify(nextUser))
      localStorage.setItem('token', nextToken)
    } else {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
    }
  }, [])

  const login = useCallback(
    async (email, password) => {
      const data = await authApi.login(email, password)
      persist(data.user, data.token)
      return data.user
    },
    [persist],
  )

  const register = useCallback(async (payload) => {
    return authApi.register(payload)
  }, [])

  const logout = useCallback(() => {
    persist(null, null)
  }, [persist])

  const updateProfile = useCallback(
    async (payload) => {
      const updated = await authApi.updateUser(payload)
      persist(updated, token)
      return updated
    },
    [persist, token],
  )

  const value = useMemo(() => {
    const roleId = user?.roleId ?? null
    return {
      user,
      token,
      isAuthenticated: Boolean(user && token),
      roleId,
      isAdmin: roleId === ROLES.ADMIN,
      isStaff: roleId === ROLES.STAFF || roleId === ROLES.ADMIN,
      isCustomer: roleId === ROLES.CUSTOMER,
      login,
      register,
      logout,
      updateProfile,
      ROLES,
    }
  }, [user, token, login, register, logout, updateProfile])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
