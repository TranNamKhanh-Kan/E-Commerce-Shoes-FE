import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api'

const AuthContext = createContext(null)

const ROLES = { ADMIN: 1, STAFF: 2, CUSTOMER: 3 }

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchCurrentUser = useCallback(async () => {
    try {
      const data = await authApi.me()
      const userData = data?.user || (data?.userId ? data : data)
      setUser(userData || null)
      return userData
    } catch {
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    const initAuth = async () => {
      try {
        const data = await authApi.me()
        if (isMounted) {
          const userData = data?.user || (data?.userId ? data : data)
          setUser(userData || null)
        }
      } catch {
        if (isMounted) {
          setUser(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initAuth()

    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(
    async (email, password) => {
      // 1. Gọi login (Backend set HttpOnly cookie access_token)
      await authApi.login(email, password)
      // 2. Gọi api /api/User/me để lấy user profile từ cookie
      const meData = await fetchCurrentUser()
      return meData
    },
    [fetchCurrentUser],
  )

  const register = useCallback(async (payload) => {
    return authApi.register(payload)
  }, [])

  const logout = useCallback(() => {
    // Xóa tất cả cookie khả dụng ở phía client (document.cookie)
    return authApi.logout().then(() => {
      setUser(null)
    })
  }, [])

  const updateProfile = useCallback(
    async (payload) => {
      const updated = await authApi.updateUser(payload)
      const userData = updated?.user || (updated?.userId ? updated : updated)
      setUser(userData)
      return userData
    },
    [],
  )

  const value = useMemo(() => {
    const roleId = user?.roleId ?? null
    return {
      user,
      loading,
      isAuthenticated: Boolean(user),
      roleId,
      isAdmin: roleId === ROLES.ADMIN,
      isStaff: roleId === ROLES.STAFF || roleId === ROLES.ADMIN,
      isCustomer: roleId === ROLES.CUSTOMER,
      login,
      register,
      logout,
      updateProfile,
      refreshUser: fetchCurrentUser,
      ROLES,
    }
  }, [user, loading, login, register, logout, updateProfile, fetchCurrentUser])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
