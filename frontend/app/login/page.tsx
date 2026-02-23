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
      document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`

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
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden flex items-center justify-center p-4 selection:bg-indigo-100 selection:text-indigo-900">

      {/* Dynamic Background Elements (Blobs) */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-indigo-200/40 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-purple-200/40 rounded-full blur-[100px] animate-pulse [animation-delay:2s]"></div>

      {/* Main Login Card */}
      <div className="w-full max-w-[480px] bg-white rounded-[3rem] shadow-[0_25px_80px_rgba(0,0,0,0.12)] overflow-hidden border border-white/20 backdrop-blur-3xl relative z-10 flex flex-col group transition-all duration-700 hover:shadow-[0_40px_100px_rgba(79,70,229,0.15)]">

        {/* Premium Header: Mesh Gradient style */}
        <div className="h-[280px] bg-gradient-to-br from-[#4f46e5] via-[#7c3aed] to-[#9333ea] flex flex-col items-center justify-center relative px-8 pt-4 overflow-hidden">

          {/* Animated Mesh Pattern inside header */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.2),transparent_50%)] animate-pulse"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000"></div>

          {/* Logo Container: High-end Glassmorphism Card */}
          <div className="bg-white/95 saturate-150 rounded-[2.2rem] px-12 py-7 shadow-[0_25px_50px_rgba(0,0,0,0.15)] mb-8 transform transition-all duration-500 hover:scale-105 hover:-rotate-1 border border-white/50 relative z-20">
            <h1 className="text-4xl font-black tracking-tight flex items-center gap-0.5">
              <span className="text-[#3b82f6] drop-shadow-sm">Arwa</span>
              <span className="text-[#a855f7] drop-shadow-sm">Park</span>
            </h1>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-indigo-500 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white scale-75 rotate-12">
              <span className="text-white text-[10px] font-black">TM</span>
            </div>
          </div>

          {/* Subtitle with Ultra-Transparent blur */}
          <div className="bg-white/15 backdrop-blur-xl px-7 py-2.5 rounded-full border border-white/20 shadow-sm transition-all hover:bg-white/20">
            <p className="text-white font-black text-[10px] tracking-[6px] uppercase opacity-95">
              Gestion de transport
            </p>
          </div>
        </div>

        {/* Form Content Section */}
        <div className="px-10 py-12 md:px-14">
          <div className="mb-12 text-left space-y-2">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              Bienvenue
            </h2>
            <p className="text-slate-400 text-lg font-bold tracking-tight">
              Pro-Level Management Dashboard
            </p>
          </div>

          {error && (
            <div className="mb-10 p-5 bg-rose-50 border border-rose-100 rounded-[1.5rem] flex items-center gap-4 text-rose-600 font-bold animate-shake shadow-sm">
              <div className="w-1.5 h-10 bg-rose-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-widest opacity-60 mb-0.5 font-black">Erreur</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="space-y-7">
            {/* Input Groups: Refined and Polished */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Email Professionnel
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                  <Mail className="h-5 w-5 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.8rem] focus:ring-[6px] focus:ring-indigo-500/5 focus:border-indigo-500 focus:bg-white outline-none transition-all text-slate-800 font-bold text-lg placeholder:text-slate-200 shadow-inner"
                  placeholder="votre@agence.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">
                  Mot de passe
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-transform group-focus-within:scale-110">
                  <Lock className="h-5 w-5 text-slate-300 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <input
                  type="password"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50/50 border border-slate-100 rounded-[1.8rem] focus:ring-[6px] focus:ring-purple-500/5 focus:border-purple-500 focus:bg-white outline-none transition-all text-slate-800 font-bold text-lg placeholder:text-slate-200 shadow-inner"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
              </div>
            </div>

            {/* Actions: Clean and Bold */}
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 group cursor-pointer">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded-lg border-2 border-slate-200 text-indigo-600 focus:ring-0 cursor-pointer transition-all peer opacity-0 absolute inset-0"
                  />
                  <div className="w-5 h-5 rounded-lg border-2 border-slate-200 peer-checked:bg-indigo-600 peer-checked:border-indigo-600 transition-all flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-slate-400 font-bold text-sm tracking-tight group-hover:text-slate-600 transition-colors">
                  Connexion persistante
                </span>
              </label>
              <a href="/forgot-password" virtual-href="/forgot-password" className="text-sm font-black text-indigo-500 hover:text-indigo-600 hover:underline underline-offset-8 transition-all decoration-2">
                Mot de passe oublié?
              </a>
            </div>

            {/* Submit Button: The Wow Factor */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-black py-6 rounded-[2rem] shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_50px_rgba(79,70,229,0.25)] hover:bg-[#1e1b4b] active:scale-[0.97] transition-all flex items-center justify-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed group text-[1.3rem] mt-6 relative overflow-hidden"
            >
              {/* Internal Shimmer effect */}
              <div className="absolute inset-0 w-1/2 h-full bg-white/5 skew-x-[-20deg] -translate-x-full group-hover:animate-shimmer"></div>

              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span className="tracking-tighter uppercase text-sm font-black">Authentification...</span>
                </>
              ) : (
                <>
                  <span className="uppercase tracking-[2px] text-sm font-black">Accéder au Parc</span>
                  <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-indigo-500 transition-colors duration-500">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </>
              )}
            </button>
          </form>

          {/* Luxury Footer */}
          <div className="mt-16 text-center space-y-4">
            <div className="w-12 h-1 bg-slate-100 mx-auto rounded-full"></div>
            <p className="text-slate-300 font-bold text-xs uppercase tracking-[5px] flex items-center justify-center gap-2">
              © 2026 ArwaPark Professional
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
