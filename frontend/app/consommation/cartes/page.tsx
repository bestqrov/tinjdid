"use client"
import React, { useState } from 'react'
import FormSection from '../../../components/FormSection'

export default function CartesPage() {
  const [number, setNumber] = useState('')
  const [name, setName] = useState('')
  const [startDate, setStartDate] = useState('2025-12-31')
  const [endDate, setEndDate] = useState('')
  const [initialBalance, setInitialBalance] = useState<number>(0)
  const [plafondCarburant, setPlafondCarburant] = useState<number>(0)
  const [plafondService, setPlafondService] = useState<number>(0)
  const [tagJawaz, setTagJawaz] = useState('')
  const [quota, setQuota] = useState('')
  const [pin, setPin] = useState('')
  const [comment, setComment] = useState('')

  const [fournisseur, setFournisseur] = useState('')
  const [activite, setActivite] = useState('')
  const [typeCarte, setTypeCarte] = useState('')
  const [typeAffectation, setTypeAffectation] = useState('')
  const [statutActive, setStatutActive] = useState(true)

  const [status, setStatus] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const fd = new FormData()
      fd.append('number', number)
      fd.append('name', name)
      fd.append('startDate', startDate)
      fd.append('endDate', endDate)
      fd.append('initialBalance', String(initialBalance))
      fd.append('plafondCarburant', String(plafondCarburant))
      fd.append('plafondService', String(plafondService))
      fd.append('tagJawaz', tagJawaz)
      fd.append('quota', quota)
      fd.append('pin', pin)
      fd.append('comment', comment)
      fd.append('fournisseur', fournisseur)
      fd.append('activite', activite)
      fd.append('typeCarte', typeCarte)
      fd.append('typeAffectation', typeAffectation)
      fd.append('statutActive', String(statutActive))

      const res = await fetch('/api/consommation/cartes', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Server error')
      setStatus('ok')
      setNumber('')
      setName('')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">💳</span>
          Gestion des Cartes
        </h1>
        <p className="text-indigo-100 text-sm mt-2">Gérez vos cartes carburant et services</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <FormSection title="Informations de la carte" icon="📇" color="blue">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de carte</label>
                    <input value={number} onChange={e => setNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="CARTE-001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la carte</label>
                    <input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" placeholder="Nom de la carte" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date début</label>
                    <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date fin</label>
                    <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all" />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Plafonds & Solde" icon="💰" color="green">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Solde initial</label>
                    <div className="flex">
                      <input type="number" step="0.01" value={initialBalance} onChange={e => setInitialBalance(Number(e.target.value))} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="0.00" />
                      <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-700 font-medium">DH</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plafond carburant</label>
                    <div className="flex">
                      <input type="number" step="0.01" value={plafondCarburant} onChange={e => setPlafondCarburant(Number(e.target.value))} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="0.00" />
                      <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-700 font-medium">DH</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plafond service</label>
                    <div className="flex">
                      <input type="number" step="0.01" value={plafondService} onChange={e => setPlafondService(Number(e.target.value))} className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="0.00" />
                      <span className="inline-flex items-center px-4 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 text-gray-700 font-medium">DH</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tag Jawaz</label>
                    <input value={tagJawaz} onChange={e => setTagJawaz(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="Tag Jawaz" />
                  </div>
                </div>
              </FormSection>

              <FormSection title="Configuration" icon="⚙️" color="purple">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quota</label>
                    <input value={quota} onChange={e => setQuota(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="Quota" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Code PIN</label>
                    <input value={pin} onChange={e => setPin(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" placeholder="****" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                  <textarea value={comment} onChange={e => setComment(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none" rows={3} placeholder="Notes ou commentaires..." />
                </div>
              </FormSection>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <FormSection title="Caractéristiques" icon="🏷️" color="orange">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Flotte</label>
                    <div className="flex gap-2">
                      <select className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                        <option>Choisir</option>
                      </select>
                      <button type="button" className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Fournisseur</label>
                    <div className="flex gap-2">
                      <select value={fournisseur} onChange={e => setFournisseur(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                        <option>Choisir</option>
                      </select>
                      <button type="button" className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Activité</label>
                    <div className="flex gap-2">
                      <select value={activite} onChange={e => setActivite(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                        <option>Choisir</option>
                      </select>
                      <button type="button" className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type carte</label>
                    <select value={typeCarte} onChange={e => setTypeCarte(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                      <option>Choisir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type affectation</label>
                    <select value={typeAffectation} onChange={e => setTypeAffectation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                      <option>Choisir</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                    <select value={statutActive ? 'active' : 'inactive'} onChange={e => setStatutActive(e.target.value === 'active')} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </FormSection>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-6 border-t border-gray-200">
            <button type="submit" disabled={status === 'sending'} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed">
              {status === 'sending' ? 'Enregistrement...' : 'Enregistrer la carte'}
            </button>
            <button type="button" className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all">
              Annuler
            </button>
            {status === 'ok' && (
              <div className="flex items-center gap-2 text-green-600 font-medium">
                <span className="text-xl">✓</span>
                <span>Carte enregistrée avec succès</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-2 text-red-600 font-medium">
                <span className="text-xl">✗</span>
                <span>Erreur lors de l'enregistrement</span>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
