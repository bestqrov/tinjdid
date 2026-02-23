"use client"

import { useRouter } from 'next/navigation'
import { Moon, Sun, LogOut, User, Shield } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SuperAdminTopbar() {
  const router = useRouter()
  const [isDark, setIsDark] = useState(false)
  const [userName, setUserName] = useState('Administrateur')

  useEffect(() => {
    // Check dark mode
    const isDarkMode = document.documentElement.classList.contains('dark')
    setIsDark(isDarkMode)

    // Get user name
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        setUserName(user.email?.split('@')[0] || 'Administrateur')
      } catch (e) {
        console.error('Failed to parse user data:', e)
      }
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setIsDark(false)
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setIsDark(true)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="h-full px-4 lg:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">
              Super Admin Panel
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">ArwaPark SaaS Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* User Info */}
          <div className="flex items-center gap-2 px-3 py-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">Administrateur</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{userName}</p>
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={isDark ? 'Mode clair' : 'Mode sombre'}
          >
            {isDark ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            title="Déconnexion"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </div>
    </header>
  )
}
