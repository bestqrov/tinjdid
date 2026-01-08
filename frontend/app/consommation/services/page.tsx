"use client"
import React, { useState } from 'react'
import FormSection from '../../../components/FormSection'

export default function ServicesPage() {
  const [vehicle, setVehicle] = useState('')
  const [date, setDate] = useState('2025-12-31')
  const [serviceType, setServiceType] = useState('')
  const [provider, setProvider] = useState('')
  const [amount, setAmount] = useState<number>(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const fd = new FormData()
    fd.append('vehicle', vehicle)
    fd.append('date', date)
    fd.append('serviceType', serviceType)
    fd.append('provider', provider)
    fd.append('amount', String(amount))
    fd.append('comment', comment)
    
    try {
      await fetch('/api/consommation/services', { method: 'POST', body: fd })
      setMessage('Enregistrement réussi avec succès')
    } catch (err) {
      setMessage("Échec de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🔧</span>
          Services
        </h1>
        <p className="text-indigo-100 text-sm mt-2">Gérez les services et maintenances des véhicules</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 space-y-6">
          <FormSection title="Véhicule & Date" icon="🚗" color="blue">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Véhicule</label>
                <input value={vehicle} onChange={e => setVehicle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Sélectionner ou saisir" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date du service</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Détails du service" icon="📋" color="green">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de service</label>
                <input value={serviceType} onChange={e => setServiceType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Vidange, révision, réparation..." />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                <input value={provider} onChange={e => setProvider(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Nom du garage ou prestataire" />
              </div>
            </div>
          </FormSection>

          <FormSection title="Montant & Commentaires" icon="💰" color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                  <input type="number" step="0.01" value={amount} onChange={e => setAmount(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0.00" />
                  <span className="inline-flex items-center px-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium">DH</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                <input value={comment} onChange={e => setComment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Notes additionnelles..." />
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
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
              <span>💾</span>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
