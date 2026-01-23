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
      // Set Cookie for Middleware
      document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`

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
        window.location.href = '/panel'
      }
    } catch (err: any) {
      setError(formatError(err))
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex items-center justify-center p-4">
      {/* Login Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-200">

        {/* Gradient Header */}
        <div className="h-[240px] bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#9333ea] flex flex-col items-center justify-center relative p-8">
          {/* Logo Box */}
          <div className="bg-white rounded-[1.8rem] px-8 py-5 shadow-2xl shadow-indigo-500/20 mb-6 transform transition-transform hover:scale-105">
            <h1 className="text-4xl font-black tracking-tight text-[#4f46e5]">
              ArwaPark
            </h1>
          </div>

          {/* Header Subtitle */}
          <p className="text-white/60 font-medium text-sm tracking-widest uppercase">
            GESTION DE TRANSPORT TOURISTIQUE
          </p>
        </div>

        {/* Form Section */}
        <div className="px-10 py-12">
          <div className="mb-10">
            <h2 className="text-[2rem] font-bold text-slate-800 leading-tight mb-2">
              Bienvenue
            </h2>
            <p className="text-slate-500 text-lg">
              Connectez-vous à votre compte
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-medium animate-shake">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              {error}
            </div>
          )}

          <form onSubmit={submit} className="space-y-8">
            {/* Email Field */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-slate-700 ml-1">
                Email
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Mail className="h-6 w-6 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-indigo-500 outline-none transition-all text-slate-900 text-lg placeholder:text-slate-300"
                  placeholder="exemple@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-3">
              <label className="text-lg font-bold text-slate-700 ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-6 w-6 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                </div>
                <input
                  type="password"
                  className="w-full pl-14 pr-5 py-4 bg-white border-2 border-slate-100 rounded-2xl focus:ring-0 focus:border-purple-500 outline-none transition-all text-slate-900 text-lg placeholder:text-slate-300"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Actions Row */}
            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 group cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded-md border-2 border-slate-300 text-indigo-600 focus:ring-0 cursor-pointer transition-all"
                />
                <span className="text-slate-500 font-medium text-lg group-hover:text-slate-700 transition-colors">
                  Se souvenir
                </span>
              </label>
              <a href="/forgot-password" virtual-href="/forgot-password" className="text-lg font-bold text-[#4f46e5] hover:text-[#4338ca] transition-colors">
                Mot de passe oublié?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-[#3b82f6] to-[#a855f7] text-white font-bold py-5 rounded-[1.2rem] shadow-xl shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group text-xl"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Vérification...</span>
                </>
              ) : (
                <>
                  <span>Se connecter</span>
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-slate-400 font-medium text-lg tracking-wide">
              © 2026 ArwaPark
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  )
}
