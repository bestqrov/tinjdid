"use client"
import React, { useState, useEffect } from 'react'
import FormSection from '../../../components/FormSection'
import { useAuth } from '../../../lib/auth'

export default function AutoroutesPage() {
  const { user } = useAuth()
  const [vehicle, setVehicle] = useState('')
  const [collaborator, setCollaborator] = useState('')
  const [number, setNumber] = useState('')
  const [date, setDate] = useState('2025-12-31')
  const [time, setTime] = useState('22:51')
  const [peageDepart, setPeageDepart] = useState('')
  const [peageArrivee, setPeageArrivee] = useState('')
  const [paymentType, setPaymentType] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)

  const [montantHT, setMontantHT] = useState<number | ''>('')
  const [tva, setTva] = useState<number>(20)
  const [montantTTC, setMontantTTC] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Toll stations management
  const [tollStations, setTollStations] = useState<string[]>([
    'Casablanca - Rabat',
    'Rabat - Meknès',
    'Meknès - Fès',
    'Fès - Oujda',
    'Marrakech - Agadir',
    'Agadir - Tiznit'
  ])
  const [showAddTollModal, setShowAddTollModal] = useState(false)
  const [newTollStation, setNewTollStation] = useState('')
  const [addingForDepart, setAddingForDepart] = useState(false)

  useEffect(() => {
    const ht = Number(montantHT || 0)
    const ttc = ht * (1 + (tva || 0) / 100)
    setMontantTTC(Number(ttc.toFixed(2)))
  }, [montantHT, tva])

  useEffect(() => {
    if (user?.name) {
      setCollaborator(user.name)
    }
  }, [user])

  const handleAddTollStation = (isDepart: boolean) => {
    setAddingForDepart(isDepart)
    setShowAddTollModal(true)
  }

  const handleSaveNewTollStation = () => {
    if (newTollStation.trim()) {
      setTollStations(prev => [...prev, newTollStation.trim()])
      if (addingForDepart) {
        setPeageDepart(newTollStation.trim())
      } else {
        setPeageArrivee(newTollStation.trim())
      }
      setNewTollStation('')
      setShowAddTollModal(false)
    }
  }

  const handleCancelAddTollStation = () => {
    setNewTollStation('')
    setShowAddTollModal(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    const fd = new FormData()
    fd.append('vehicle', vehicle)
    fd.append('collaborator', collaborator)
    fd.append('number', number)
    fd.append('date', date)
    fd.append('time', time)
    fd.append('peageDepart', peageDepart)
    fd.append('peageArrivee', peageArrivee)
    fd.append('paymentType', paymentType)
    fd.append('montantHT', String(montantHT || 0))
    fd.append('tva', String(tva))
    fd.append('montantTTC', String(montantTTC))
    if (attachment) fd.append('attachment', attachment)

    try {
      const res = await fetch('/api/consommation/autoroutes', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Erreur')
      setMessage('Enregistrement réussi avec succès')
    } catch (err) {
      setMessage("Échec de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">🛣️</span>
          Péage Autoroute
        </h1>
        <p className="text-blue-100 text-sm mt-2">Gérez les passages de péage d'autoroute</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <FormSection title="Véhicule & Conducteur" icon="🚗" color="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Véhicule</label>
                    <select value={vehicle} onChange={e => setVehicle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                      <option value="">Sélectionner un véhicule</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Collaborateur</label>
                    <input
                      type="text"
                      value={collaborator}
                      readOnly
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                      placeholder="Nom du collaborateur"
                    />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Informations du passage" icon="📋" color="green">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de ticket</label>
                    <input value={number} onChange={e => setNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="AUTO-2026-001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date & Heure</label>
                    <div className="flex gap-2">
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                      <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Trajet du péage" icon="🚦" color="purple">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Péage de départ</label>
                    <div className="flex gap-2">
                      <select value={peageDepart} onChange={e => setPeageDepart(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                        <option value="">Sélectionner le péage départ</option>
                        {tollStations.map((station, index) => (
                          <option key={index} value={station}>{station}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleAddTollStation(true)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Péage d'arrivée</label>
                    <div className="flex gap-2">
                      <select value={peageArrivee} onChange={e => setPeageArrivee(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all">
                        <option value="">Sélectionner le péage arrivée</option>
                        {tollStations.map((station, index) => (
                          <option key={index} value={station}>{station}</option>
                        ))}
                      </select>
                      <button type="button" onClick={() => handleAddTollStation(false)} className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Paiement & Documents" icon="💳" color="orange">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                    <select value={paymentType} onChange={e => setPaymentType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                      <option value="">Sélectionner le mode de paiement</option>
                      <option value="cash">Espèces</option>
                      <option value="card">Carte bancaire</option>
                      <option value="badge">Badge télépéage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ticket / Justificatif</label>
                    <input type="file" onChange={e => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 transition-all" />
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="lg:col-span-1">
              <FormSection title="Montant à payer" icon="💰" color="pink">
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant HT</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-pink-500 transition-all">
                      <input type="number" step="0.01" value={montantHT as any} onChange={e => setMontantHT(e.target.value === '' ? '' : Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0.00" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 font-medium">DH</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">TVA</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-pink-500 transition-all">
                      <input type="number" step="0.01" value={tva} onChange={e => setTva(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-pink-50 to-pink-100 text-pink-700 font-medium">%</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-pink-200">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Montant TTC</label>
                    <div className="p-3 bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Total à payer:</span>
                        <span className="text-xl font-bold text-pink-700">{montantTTC.toFixed(2)} DH</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg ${message.includes('succès') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{message.includes('succès') ? '✅' : '❌'}</span>
                {message}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all">
              ❌ Annuler
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
              <span>💾</span>
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
              <span>➕</span>
              {loading ? 'Enregistrement...' : 'Enregistrer & Ajouter'}
            </button>
          </div>
        </div>
      </form>

      {/* Add Toll Station Modal */}
      {showAddTollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Ajouter un nouveau péage
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du péage
              </label>
              <input
                type="text"
                value={newTollStation}
                onChange={(e) => setNewTollStation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="Ex: Casablanca - Settat"
                onKeyPress={(e) => e.key === 'Enter' && handleSaveNewTollStation()}
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancelAddTollStation}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSaveNewTollStation}
                disabled={!newTollStation.trim()}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
