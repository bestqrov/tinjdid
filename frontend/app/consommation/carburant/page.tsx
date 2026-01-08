"use client"
import React, { useEffect, useState } from 'react'
import FormSection from '../../../components/FormSection'
import PageHeader from '../../../components/PageHeader'

export default function CarburantPage() {
  const [vehicle, setVehicle] = useState('')
  const [collaborator, setCollaborator] = useState('')

  const [number, setNumber] = useState('')
  const [date, setDate] = useState('2025-12-31')
  const [time, setTime] = useState('22:35')
  const [fuelType, setFuelType] = useState('')
  const [station, setStation] = useState('')

  const [paymentMode, setPaymentMode] = useState('')
  const [quantity, setQuantity] = useState<number>(0)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [amountHT, setAmountHT] = useState<number>(0)
  const [tva, setTva] = useState<number>(20)
  const [amountTTC, setAmountTTC] = useState<number>(0)
  const [plein, setPlein] = useState(false)

  const [kilometrage, setKilometrage] = useState<number>(0)
  const [distance, setDistance] = useState<number>(0)
  const [percentConso, setPercentConso] = useState<number>(0)
  const [indexHoraire, setIndexHoraire] = useState<number>(0)

  const [attachment, setAttachment] = useState<File | null>(null)
  const [comment, setComment] = useState('')
  const [status, setStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const ht = Number((quantity || 0) * (unitPrice || 0))
    setAmountHT(Number(ht.toFixed(2)))
    const ttc = ht * (1 + (tva || 0) / 100)
    setAmountTTC(Number(ttc.toFixed(2)))
  }, [quantity, unitPrice, tva])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    setLoading(true)
    setMessage('')
    
    try {
      const fd = new FormData()
      fd.append('vehicle', vehicle)
      fd.append('collaborator', collaborator)
      fd.append('number', number)
      fd.append('date', date)
      fd.append('time', time)
      fd.append('fuelType', fuelType)
      fd.append('station', station)
      fd.append('paymentMode', paymentMode)
      fd.append('quantity', String(quantity))
      fd.append('unitPrice', String(unitPrice))
      fd.append('amountHT', String(amountHT))
      fd.append('tva', String(tva))
      fd.append('amountTTC', String(amountTTC))
      fd.append('plein', String(plein))
      fd.append('kilometrage', String(kilometrage))
      fd.append('distance', String(distance))
      fd.append('percentConso', String(percentConso))
      fd.append('indexHoraire', String(indexHoraire))
      fd.append('comment', comment)
      if (attachment) fd.append('attachment', attachment)

      const res = await fetch('/api/consommation/carburant', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Server error')
      setStatus('ok')
      setMessage('Enregistrement réussi avec succès')
      setQuantity(0)
      setUnitPrice(0)
      setAttachment(null)
    } catch (err) {
      setStatus('error')
      setMessage("Échec de l'enregistrement")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader 
        title="⛽ Carburant" 
        gradientFrom="orange-600" 
        gradientTo="orange-700"
      />

      <form onSubmit={handleSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 space-y-6">
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
                <select value={collaborator} onChange={e => setCollaborator(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                  <option value="">Sélectionner un collaborateur</option>
                </select>
              </div>
            </div>
          </FormSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <FormSection title="Informations du ravitaillement" icon="📋" color="green">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Numéro de ticket</label>
                    <input value={number} onChange={e => setNumber(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" placeholder="CARB-2026-001" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date & Heure</label>
                    <div className="flex gap-2">
                      <input type="date" value={date} onChange={e => setDate(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                      <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Type de carburant</label>
                    <select value={fuelType} onChange={e => setFuelType(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                      <option value="">Sélectionner le type</option>
                      <option value="essence">Essence</option>
                      <option value="diesel">Diesel</option>
                      <option value="gpl">GPL</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Station-service</label>
                    <div className="flex gap-2">
                      <select value={station} onChange={e => setStation(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all">
                        <option value="">Sélectionner une station</option>
                      </select>
                      <button type="button" className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md">
                        <span className="text-lg">+</span>
                      </button>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Consommation & Performance" icon="📊" color="purple">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Kilométrage actuel</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                      <input type="number" step="0.01" value={kilometrage} onChange={e => setKilometrage(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium">KM</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Distance parcourue</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                      <input type="number" step="0.01" value={distance} onChange={e => setDistance(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium">KM</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">% Consommation</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                      <input type="number" step="0.01" value={percentConso} onChange={e => setPercentConso(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium">%</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Index horaire</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-purple-500 transition-all">
                      <input type="number" step="0.01" value={indexHoraire} onChange={e => setIndexHoraire(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 font-medium">H</span>
                    </div>
                  </div>
                </div>
              </FormSection>

              <FormSection title="Documents & Notes" icon="📎" color="pink">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ticket / Justificatif</label>
                    <input type="file" onChange={e => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
                    <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all" placeholder="Notes additionnelles..." />
                  </div>
                </div>
              </FormSection>
            </div>

            <div className="lg:col-span-1">
              <FormSection title="Coûts & Paiement" icon="💰" color="orange">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mode de paiement</label>
                    <select value={paymentMode} onChange={e => setPaymentMode(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all">
                      <option value="">Sélectionner</option>
                      <option value="cash">Espèces</option>
                      <option value="card">Carte</option>
                      <option value="fuel-card">Carte carburant</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                      <input type="number" step="0.01" value={quantity} onChange={e => setQuantity(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0.00" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium">L</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prix unitaire</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                      <input type="number" step="0.01" value={unitPrice} onChange={e => setUnitPrice(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" placeholder="0.00" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium">DH/L</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">TVA</label>
                    <div className="flex rounded-lg overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-orange-500 transition-all">
                      <input type="number" value={tva} onChange={e => setTva(Number(e.target.value))} className="flex-1 px-3 py-2 border-0 focus:ring-0 outline-none" />
                      <span className="inline-flex items-center px-4 bg-gradient-to-r from-orange-50 to-orange-100 text-orange-700 font-medium">%</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <input type="checkbox" checked={plein} onChange={e => setPlein(e.target.checked)} className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500" />
                    <label className="text-sm font-medium text-gray-700">Plein complet</label>
                  </div>

                  <div className="pt-4 border-t border-orange-200 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600">Montant HT:</span>
                      <span className="font-semibold text-gray-700">{amountHT.toFixed(2)} DH</span>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-600">Total TTC:</span>
                        <span className="text-2xl font-bold text-orange-700">{amountTTC.toFixed(2)} DH</span>
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
            <button type="submit" disabled={loading} className="px-6 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50">
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
    </div>
  )
}
