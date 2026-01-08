"use client"
import { useState } from 'react'
import axios from '../../lib/axios'
import { Mail, MessageSquare, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ForgotPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [info, setInfo] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function submit(e: any) {
    e.preventDefault()
    setIsLoading(true)
    setInfo(null)
    try {
      const res = await axios.post('/auth/forgot-password', { email, message })
      setSuccess(true)
      setInfo(res.data.message || 'Votre demande a été envoyée au super administrateur.')
    } catch (e: any) {
      setInfo('Erreur lors de l\'envoi de la demande')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 p-4 sm:p-5 text-white">
            <h1 className="text-xl sm:text-2xl font-bold text-center mb-1">Mot de passe oublié</h1>
            <p className="text-center text-blue-100 dark:text-blue-200 text-xs sm:text-sm">Demande de réinitialisation</p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="p-4 sm:p-5">
            {success ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Demande envoyée !</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{info}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">Vous recevrez un email avec les instructions dans les plus brefs délais.</p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                  Entrez votre adresse email et un message optionnel. Le super administrateur vous répondra par email.
                </p>

                {info && !success && (
                  <div className="mb-3 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="text-red-600 dark:text-red-400 text-xs sm:text-sm">{info}</div>
                  </div>
                )}

                {/* Email Input */}
                <div className="mb-3">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                      placeholder="votre@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Message Input */}
                <div className="mb-4">
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message (optionnel)
                  </label>
                  <div className="relative">
                    <div className="absolute top-2 left-3 pointer-events-none">
                      <MessageSquare className="h-4 w-4 text-gray-400" />
                    </div>
                    <textarea
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all resize-none"
                      placeholder="Décrivez votre problème..."
                      rows={3}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-2.5 px-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Envoi en cours...</span>
                    </>
                  ) : (
                    'Envoyer la demande'
                  )}
                </button>

                <div className="mt-4 text-center">
                  <Link
                    href="/login"
                    className="text-sm text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Retour à la connexion
                  </Link>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
