import React, { useEffect, useState } from 'react'
import { useAuth } from '../lib/auth'
import { User, LogOut, Sun, Moon, Menu } from 'lucide-react'
import axios from '../lib/axios'
import Image from 'next/image'

interface CompanyProfile {
  name: string
  gerantNom?: string
  logo?: string
  tagline?: string
}

export default function Topbar() {
  const { user, logout } = useAuth()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    // Load theme from localStorage on mount
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.classList.toggle('dark', savedTheme === 'dark')
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    }

    // Load company profile only if user is loaded
    if (user) {
      loadCompanyProfile()
    }

    // Listen for profile updates
    const handleProfileUpdate = () => {
      loadCompanyProfile()
    }
    window.addEventListener('companyProfileUpdated', handleProfileUpdate)

    return () => {
      window.removeEventListener('companyProfileUpdated', handleProfileUpdate)
    }
  }, [user])

  const loadCompanyProfile = async () => {
    try {
      // Only attempt to load if user is authenticated and not super admin
      if (!user || user.role === 'SUPER_ADMIN') return
      
      const response = await axios.get('/settings/company-profile')
      if (response.data?.data) {
        setCompanyProfile(response.data.data)
      }
    } catch (error: any) {
      // Silently fail for 404 errors (no profile yet)
      if (error?.response?.status !== 404) {
        console.error('Error loading company profile:', error)
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
  }

  return (
    <header className="flex items-center justify-between border-b bg-white dark:bg-gray-800 dark:border-gray-700 p-3 md:p-4 transition-colors">
      {/* Mobile menu button */}
      <button 
        className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        onClick={() => {
          const sidebar = document.querySelector('aside');
          if (sidebar) {
            sidebar.classList.toggle('-translate-x-full');
          }
        }}
      >
        <Menu size={20} className="text-gray-600 dark:text-gray-300" />
      </button>

      <div className="flex items-center gap-2 sm:gap-3">
        {companyProfile?.logo && (
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <Image
              src={`http://localhost:3001${companyProfile.logo}`}
              alt={companyProfile.name || 'Company Logo'}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
        )}
        <div className="hidden sm:block">
          <div className="text-xs sm:text-sm font-semibold dark:text-white">
            {companyProfile?.name || 'Ma Société'}
          </div>
          {companyProfile?.tagline && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {companyProfile.tagline}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-gray-600 dark:text-gray-300" />
          ) : (
            <Sun size={18} className="text-gray-300" />
          )}
        </button>
          <div className="hidden md:flex items-center gap-3">
          {/* User Photo and Name */}
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
            {(user as any)?.photo ? (
              <div className="relative w-6 h-6 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600">
                <Image
                  src={`http://localhost:3001${(user as any).photo}`}
                  alt={(user as any).name || 'User Photo'}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <User size={14} className="sm:w-4 sm:h-4" />
            )}
            <span className="hidden lg:inline font-medium">{(user as any)?.name || companyProfile?.gerantNom || (user as any)?.email || 'Invité'}</span>
          </div>

          {/* Logout Button */}
          <button onClick={() => logout()} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <LogOut size={14} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Se déconnecter</span>
          </button>
        </div>
      </div>
    </header>
  )
}
