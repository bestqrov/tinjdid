"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import SuperAdminSidebar from './SuperAdminSidebar'
import SuperAdminTopbar from './SuperAdminTopbar'

export default function SuperAdminLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check authentication and role
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token')
      const userStr = localStorage.getItem('user')
      let role = null
      
      if (userStr) {
        try {
          const user = JSON.parse(userStr)
          role = user.role
        } catch (e) {
          console.error('Failed to parse user data:', e)
        }
      }
      
      if (!token) {
        router.push('/login')
        return
      }
      
      if (role !== 'SUPERADMIN') {
        router.push('/dashboard')
        return
      }

      setIsAuthorized(true)
      setIsLoading(false)
      
      // Set page title
      document.title = '👑 Super Admin Dashboard - ArwaPark SaaS'
      
      // Initialize dark mode
      const theme = localStorage.getItem('theme')
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <SuperAdminSidebar />
      
      {/* Main Content */}
      <div className="flex flex-col lg:ml-64">
        {/* Topbar */}
        <SuperAdminTopbar />
        
        {/* Page Content */}
        <main className="flex-1 mt-16">
          {children}
        </main>
      </div>
    </div>
  )
}
