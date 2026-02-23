"use client"
import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import axios from '../../../lib/axios'

export default function CreateInvoicePage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const qc = useQueryClient()
  
  const [numero, setNumero] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')
  const [clientIce, setClientIce] = useState('')
  const [montantHT, setMontantHT] = useState('0.00')
  const [tvaPercent, setTvaPercent] = useState('20')
  const [numeroAttestation, setNumeroAttestation] = useState('')
  const [dateDelivrance, setDateDelivrance] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [periodeFacturation, setPeriodeFacturation] = useState('')
  const [lines, setLines] = useState([{ designation: '', quantite: '1', puHT: '0.00', montantHT: '0.00' }])

  const { data: clients } = useQuery({
    queryKey: ['clients', companyId],
    queryFn: async () => {
      const res = await axios.get(`/companies`)
      return res.data
    },
  })

  const montantHTValue = parseFloat(montantHT) || 0
  const tvaPercentValue = parseFloat(tvaPercent) || 0
  const montantTVA = (montantHTValue * tvaPercentValue / 100)
  const montantTTC = (montantHTValue + montantTVA).toFixed(2)

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const response = await axios.post(`/invoices?companyId=${companyId}`, payload)
      return response.data
    },
    onSuccess: () => {
      alert('✓ Facture créée avec succès!')
      qc.invalidateQueries({ queryKey: ['invoices', companyId] })
      setTimeout(() => { window.location.href = '/invoices' }, 500)
    },
    onError: (error: any) => {
      const errorMsg = error.response?.data?.message || error.message || 'Erreur inconnue'
      alert('✗ Erreur: ' + errorMsg)
    },
  })

  const addLine = () => setLines([...lines, { designation: '', quantite: '1', puHT: '0.00', montantHT: '0.00' }])
  const removeLine = (idx: number) => setLines(lines.filter((_, i) => i !== idx))
  const updateLine = (idx: number, field: string, value: string) => {
    const updated = [...lines]
    updated[idx] = { ...updated[idx], [field]: value }
    if (field === 'quantite' || field === 'puHT') {
      const q = parseFloat(updated[idx].quantite) || 0
      const p = parseFloat(updated[idx].puHT) || 0
      updated[idx].montantHT = (q * p).toFixed(2)
    }
    setLines(updated)
  }

  const onSubmit = (e: any) => {
    e.preventDefault()
    const amountValue = parseFloat(montantHT)
    if (!amountValue || amountValue <= 0) {
      alert('⚠️ Le montant HT est obligatoire')
      return
    }
    const payload: any = { amount: amountValue, currency: 'MAD', tva: parseFloat(tvaPercent) > 0 }
    if (numero) payload.numero = numero
    if (date) payload.date = date
    if (clientId) payload.clientId = clientId
    if (clientName) payload.clientName = clientName
    if (clientIce) payload.clientIce = clientIce
    if (parseFloat(tvaPercent) > 0) payload.tvaPercent = parseFloat(tvaPercent)
    if (numeroAttestation) payload.numeroAttestation = numeroAttestation
    if (dateDelivrance) payload.dateDelivrance = dateDelivrance
    if (periodeFacturation) payload.periodeFacturation = periodeFacturation
    if (lines && lines.length > 0 && lines[0].designation) payload.lines = lines
    mutation.mutate(payload)
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">📄</span>
          Nouvelle Facture
        </h1>
      </div>

      <form onSubmit={onSubmit} className="bg-white rounded-b-lg shadow-lg">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro</label>
              <input value={numero} onChange={(e) => setNumero(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="FAC-2026-001" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Client</label>
              <select value={clientId} onChange={(e) => {
                const selectedClient = clients?.find((c: any) => c.id === e.target.value)
                setClientId(e.target.value)
                if (selectedClient) {
                  setClientName(selectedClient.name || '')
                  setClientIce(selectedClient.ice || '')
                }
              }} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                <option value="">Choisir:</option>
                {clients?.map((client: any) => (<option key={client.id} value={client.id}>{client.name}</option>))}
              </select>
            </div>
          </div>
        </div>

        <div className="p-6 border-b bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Montants</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Montant HT DH</label>
              <input type="number" step="0.01" value={montantHT} onChange={(e) => setMontantHT(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">TVA %</label>
              <input type="number" step="0.01" value={tvaPercent} onChange={(e) => setTvaPercent(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Montant TVA DH</label>
              <input type="text" value={montantTVA.toFixed(2)} readOnly className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Montant TTC DH</label>
              <input type="text" value={montantTTC} readOnly className="w-full px-3 py-2 bg-green-50 border border-green-300 rounded-lg font-bold text-green-700" />
            </div>
          </div>
        </div>

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Champs additionnels</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Numéro attestation</label>
              <input value={numeroAttestation} onChange={(e) => setNumeroAttestation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date délivrance</label>
              <input type="date" value={dateDelivrance} onChange={(e) => setDateDelivrance(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachement</label>
              <input type="file" onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" accept=".pdf,.jpg,.jpeg,.png" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période facturation</label>
              <input value={periodeFacturation} onChange={(e) => setPeriodeFacturation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>
        </div>

        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Détails:</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left border">Désignation *</th>
                <th className="p-3 text-center border w-32">Quantité</th>
                <th className="p-3 text-right border w-40">PU HT</th>
                <th className="p-3 text-right border w-40">Montant HT</th>
                <th className="p-3 text-center border w-20"></th>
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx}>
                  <td className="p-2 border"><input type="text" value={line.designation} onChange={(e) => updateLine(idx, 'designation', e.target.value)} className="w-full px-2 py-1 border rounded" /></td>
                  <td className="p-2 border"><input type="number" step="1" min="1" value={line.quantite} onChange={(e) => updateLine(idx, 'quantite', e.target.value)} className="w-full px-2 py-1 border rounded text-center" /></td>
                  <td className="p-2 border"><input type="number" step="0.01" min="0" value={line.puHT} onChange={(e) => updateLine(idx, 'puHT', e.target.value)} className="w-full px-2 py-1 border rounded text-right" /></td>
                  <td className="p-2 border"><input type="text" value={line.montantHT} readOnly className="w-full px-2 py-1 bg-gray-50 border rounded text-right" /></td>
                  <td className="p-2 border text-center">{lines.length > 1 && <button type="button" onClick={() => removeLine(idx)} className="text-red-600 hover:text-red-800 font-bold text-xl">×</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addLine} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg">+ Ajouter une ligne</button>
        </div>

        <div className="p-6 bg-gray-50 border-t flex justify-end gap-3">
          <button type="button" onClick={() => window.location.href = '/invoices'} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg">Annuler</button>
          <button type="submit" disabled={mutation.isPending} className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">{mutation.isPending ? 'Création...' : '💾 Créer la facture'}</button>
        </div>
      </form>
    </div>
  )
}
