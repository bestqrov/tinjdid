"use client"
import React, { useState } from 'react'
import FormSection from '../../../components/FormSection'

export default function DepensesPage() {
  const [date, setDate] = useState('2025-12-31')
  const [category, setCategory] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [tva, setTva] = useState<number>(0)
  const [attachment, setAttachment] = useState<File | null>(null)
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
    fd.append('tva', String(tva))
    if (attachment) fd.append('attachment', attachment)
    fd.append('comment', comment)
    
    try {
      await fetch('/api/consommation/depenses', { method: 'POST', body: fd })
      setMessage('Enregistrement réussi avec succès')
    } catch (err) {
      setMessage("Échec de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">💸</span>
          Dépenses
        </h1>
        <p className="text-teal-100 text-sm mt-2">Enregistrez vos dépenses diverses</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 space-y-6">
          <FormSection title="Informations générales" icon="📋" color="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <input value={category} onChange={e => setCategory(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Catégorie de dépense" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Montant" icon="💰" color="green">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                  <input type="number" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0.00" />
                  <span className="inline-flex items-center px-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-medium">DH</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">TVA</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-green-500 transition-all">
                  <input type="number" value={tva} onChange={e => setTva(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="20" />
                  <span className="inline-flex items-center px-4 bg-gradient-to-r from-green-50 to-green-100 text-green-700 font-medium">%</span>
                </div>
              </div>
            </div>
          </FormSection>

          <FormSection title="Documents & Commentaires" icon="📎" color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Justificatif</label>
                <input type="file" onChange={e => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Notes..." />
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
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
              <span>💾</span>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
