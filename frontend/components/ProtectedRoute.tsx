"use client"
import React, { ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../lib/auth'

export default function ProtectedRoute({ children, roles = [] }: { children: ReactNode; roles?: string[] }) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user === null) {
      router.push('/login')
      return
    }
    if (roles.length > 0 && user && !roles.includes(user.role || '')) {
      router.push('/dashboard')
      return
    }
  }, [user, roles, router])

  if (user === null) return <div>Redirecting...</div>
  if (roles.length > 0 && user && !roles.includes(user.role || '')) return <div>Not authorized</div>
  return <>{children}</>
}
