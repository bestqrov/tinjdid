"use client"
import { useState, Suspense } from 'react'
import axios from '../../lib/axios'
import { useSearchParams, useRouter } from 'next/navigation'

function ResetForm() {
  const [password, setPassword] = useState('')
  const [info, setInfo] = useState<string | null>(null)
  const search = useSearchParams()
  const router = useRouter()
  const token = search.get('token')

  async function submit(e:any) {
    e.preventDefault()
    try {
      await axios.post('/auth/reset-password', { token, password })
      setInfo('Mot de passe réinitialisé')
      setTimeout(() => router.push('/login'), 1200)
    } catch (e:any) { setInfo('Erreur') }
  }

  return (
    <form onSubmit={submit} className="bg-white p-6 rounded shadow w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Réinitialiser le mot de passe</h2>
      {info ? <div className="mb-2">{info}</div> : null}
      <label className="block mb-4">
        <div className="text-sm">Nouveau mot de passe</div>
        <input type="password" className="w-full border p-2 rounded" value={password} onChange={e => setPassword(e.target.value)} />
      </label>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Réinitialiser</button>
    </form>
  )
}

export default function ResetPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Suspense fallback={<div>Loading...</div>}>
        <ResetForm />
      </Suspense>
    </div>
  )
}
