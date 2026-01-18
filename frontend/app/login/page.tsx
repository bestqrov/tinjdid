"use client"
import { useState } from 'react'
import axios from '../../lib/axios'
import { safeFetchJson } from '../../lib/safeFetch'
import { Lock, Mail, ArrowRight } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function formatError(err: any) {
    if (!err) return 'Erreur'
    if (typeof err === 'string') {
      const s = err.trim()
      if (s.startsWith('<')) return 'Réponse inattendue du serveur'
      return s
    }
    if (err instanceof Error) {
      const m = String(err.message || '')
      if (m.trim().startsWith('<')) return 'Réponse inattendue du serveur'
      return m || 'Erreur'
    }
    // Try common shapes
    if (err?.response?.data?.message) return String(err.response.data.message)
    if (err?.message) {
      const m = String(err.message)
      if (m.trim().startsWith('<')) return 'Réponse inattendue du serveur'
      return m
    }
    if (err?.error) return String(err.error)
    return 'Erreur'
  }

  async function submit(e: any) {
    e.preventDefault()
    setIsLoading(true)
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/$/, '')
      const apiUrl = baseUrl ? `${baseUrl}/api` : '/api'

      console.log('Login Request URL:', `${apiUrl}/auth/login`) // Debug log

      const data = await safeFetchJson(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })
      const token = data.access
      localStorage.setItem('access_token', token)
      // decode token and set user/company
      let userRole = null
      try {
        const { decodeToken } = await import('../../lib/jwt')
        const payload = decodeToken(token)
        if (payload) {
          userRole = payload.role
          localStorage.setItem('user', JSON.stringify({ id: payload.sub, email: payload.email, role: payload.role, companyId: payload.companyId }))
          if (payload.companyId) localStorage.setItem('companyId', payload.companyId)
        }
      } catch (e) { }
      try { document.cookie = `access_token=${token}; path=/` } catch (e) { }

      // Redirect based on role
      if (userRole === 'SUPERADMIN') {
        window.location.href = '/super-admin'
      } else {
        window.location.href = '/dashboard'
      }
    } catch (err: any) {
      setError(formatError(err))
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-32 left-0 w-96 h-96 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md px-4">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/50 transform transition-all hover:scale-[1.01] duration-500">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-blue-600/90 to-purple-600/90 dark:from-blue-700/90 dark:to-purple-700/90 p-6 sm:p-8 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg ring-4 ring-white/20 mb-3 transform hover:rotate-3 transition-transform duration-300">
                <h1 className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 tracking-tight">ArwaPark</h1>
              </div>
            </div>
            <p className="text-center text-blue-100 dark:text-blue-200 text-xs sm:text-sm mt-2">Gestion de Transport</p>
          </div>

          {/* Form Section */}
          <form onSubmit={submit} className="p-4 sm:p-5">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-1">Bienvenue</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-3">Connectez-vous à votre compte</p>

            {error && (
              <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{error}</div>
              </div>
            )}

            {/* Email Input */}
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-3">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center">
                <input type="checkbox" className="w-3 h-3 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                <span className="ml-1.5 text-xs text-gray-600 dark:text-gray-400">Se souvenir</span>
              </label>
              <a href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Mot de passe oublié?
              </a>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs sm:text-sm">Connexion...</span>
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-4 pb-3 sm:pb-4">
            <p className="text-center text-xs text-gray-500 dark:text-gray-400">
              © 2026 ArwaPark
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
