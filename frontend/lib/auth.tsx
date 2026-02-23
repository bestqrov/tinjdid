"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { decodeToken } from './jwt'
import { useRouter } from 'next/navigation'

type User = { id?: string; email?: string; name?: string; role?: string; companyId?: string } | null

type AuthContextType = {
  user: User
  setToken: (token: string | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({ user: null, setToken: () => {}, logout: () => {} })

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
    if (token) {
      const payload = decodeToken(token)
      if (payload) setUser({ id: payload.sub, email: payload.email, name: payload.name, role: payload.role, companyId: payload.companyId })
    }
  }, [])

  function setToken(token: string | null) {
    if (token) {
      localStorage.setItem('access_token', token)
      const payload = decodeToken(token)
      if (payload) {
        const u: User = { id: payload.sub, email: payload.email, name: payload.name, role: payload.role, companyId: payload.companyId }
        localStorage.setItem('user', JSON.stringify(u))
        if (u.companyId) localStorage.setItem('companyId', u.companyId)
        // set cookie to enable middleware (note: httpOnly cookies are recommended in production)
        try { document.cookie = `access_token=${token}; path=/` } catch (e) {}
        setUser(u)
      }
    } else {
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
      localStorage.removeItem('companyId')
      try { document.cookie = 'access_token=; Max-Age=0; path=/' } catch (e) {}
      setUser(null)
    }
  }

  function logout() {
    setToken(null)
    const router = (typeof window !== 'undefined') ? (window as any).location = '/login' : undefined
  }

  return <AuthContext.Provider value={{ user, setToken, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}

export function useRequireRole(allowed: string[] = []) {
  const { user } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!user) return
    if (allowed.length === 0) return
    if (!allowed.includes(user.role || '')) router.push('/dashboard')
  }, [user, allowed, router])
}
