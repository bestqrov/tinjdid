"use client"
import React, { useState } from 'react'
import FormSection from '../../../components/FormSection'

export default function FraisGenerauxPage() {
  const [date, setDate] = useState('2025-12-31')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const fd = new FormData()
    fd.append('date', date)
    fd.append('category', category)
    fd.append('amount', String(amount))
    fd.append('comment', comment)
    
    try {
      await fetch('/api/consommation/frais-generaux', { method: 'POST', body: fd })
      setMessage('Enregistrement réussi avec succès')
    } catch (err) {
      setMessage("Échec de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">📊</span>
          Frais généraux
        </h1>
        <p className="text-rose-100 text-sm mt-2">Enregistrez les frais généraux de l'entreprise</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 space-y-6">
          <FormSection title="Informations" icon="📋" color="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Catégorie des frais" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Montant & Commentaires" icon="💰" color="green">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                  <input type="number" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0.00" />
                  <span className="inline-flex items-center px-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-medium">DH</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Notes..." />
              </div>
            </div>
          </FormSection>

          {message && (
            <div className={`p-4 rounded-lg ${message.includes('succès') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{message.includes('succès') ? '✅' : '❌'}</span>
                {message}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t">
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
              <span>💾</span>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
