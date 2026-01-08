"use client"
import React, { useState } from 'react'
import FormSection from '../../../../components/FormSection'
import FormInput from '../../../../components/FormInput'

export default function CreateFacturePage() {
  const [numero, setNumero] = useState('')
  const [date, setDate] = useState('')
  const [client, setClient] = useState('')
  const [montantHT, setMontantHT] = useState<number | ''>('')
  const [tva, setTva] = useState<number>(20)
  const [montantTTC, setMontantTTC] = useState<number | ''>('')
  const [numAttestation, setNumAttestation] = useState('')
  const [dateDelivrance, setDateDelivrance] = useState('')
  const [attachment, setAttachment] = useState<File | null>(null)
  const [periode, setPeriode] = useState('')
  const [lines, setLines] = useState<Array<{ desc: string; qty: number | ''; pu: number | ''; montant: number | '' }>>([
    { desc: '', qty: '', pu: '', montant: '' }
  ])
  const [status, setStatus] = useState<string | null>(null)

  function updateLine(i: number, key: string, value: any) {
    const copy = lines.slice()
    // @ts-ignore
    copy[i][key] = value
    const qty = Number(copy[i].qty) || 0
    const pu = Number(copy[i].pu) || 0
    // @ts-ignore
    copy[i].montant = Number((qty * pu).toFixed(2))
    setLines(copy)
  }

  function addLine() { setLines([...lines, { desc: '', qty: '', pu: '', montant: '' }]) }
  function removeLine(i: number) { setLines(lines.filter((_, idx) => idx !== i)) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const fd = new FormData()
      fd.append('numero', numero)
      fd.append('date', date)
      fd.append('client', client)
      fd.append('montantHT', String(montantHT))
      fd.append('tva', String(tva))
      fd.append('montantTTC', String(montantTTC))
      fd.append('numAttestation', numAttestation)
      fd.append('dateDelivrance', dateDelivrance)
      fd.append('periode', periode)
      fd.append('lines', JSON.stringify(lines))
      if (attachment) fd.append('attachment', attachment)

      const res = await fetch('/api/finance/factures', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Server error')
      setStatus('ok')
    } catch (err) {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="rounded-t-lg overflow-hidden shadow">
        <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">📄 Nouvelle facture</h1>
              <p className="text-purple-100 mt-1">Créez et enregistrez une facture rapidement</p>
            </div>
            <div className="text-sm text-purple-100">Finance • Factures</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-b-lg">
          <FormSection title="Informations générales" icon="🧾" color="purple">
            <div className="grid grid-cols-3 gap-4">
              <FormInput label="Numéro" value={numero} onChange={(e: any) => setNumero(e.target.value)} />
              <FormInput label="Date" type="date" value={date} onChange={(e: any) => setDate(e.target.value)} />
              <FormInput label="Client" as="select" value={client} onChange={(e: any) => setClient(e.target.value)}>
                <option value="">Choisir</option>
              </FormInput>
            </div>
          </FormSection>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <FormSection title="Détails" icon="📋" color="green">
                <div className="space-y-3">
                  {lines.map((ln, i) => (
                    <div key={i} className="grid grid-cols-6 gap-2 items-end">
                      <div className="col-span-3">
                        <FormInput label="Désignation *" value={ln.desc} onChange={(e: any) => updateLine(i, 'desc', e.target.value)} />
                      </div>
                      <div>
                        <FormInput label="Quantité" type="number" value={ln.qty as any} onChange={(e: any) => updateLine(i, 'qty', e.target.value === '' ? '' : Number(e.target.value))} />
                      </div>
                      <div>
                        <FormInput label="PU HT" type="number" value={ln.pu as any} onChange={(e: any) => updateLine(i, 'pu', e.target.value === '' ? '' : Number(e.target.value))} />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 mb-1 block">Montant HT</label>
                        <div className="mt-1 p-2 border rounded bg-white">{(ln.montant || 0).toString()} DH</div>
                      </div>
                      <div className="col-span-6 flex justify-end">
                        <button type="button" onClick={() => removeLine(i)} className="text-sm text-red-600">Supprimer</button>
                      </div>
                    </div>
                  ))}

                  <div>
                    <button type="button" onClick={addLine} className="px-3 py-1 bg-green-600 text-white rounded text-sm">Ajouter une ligne</button>
                  </div>
                </div>
              </FormSection>
            </div>

            <div>
              <FormSection title="Montants" icon="💰" color="orange">
                <FormInput label="Montant HT" type="number" value={montantHT as any} onChange={(e: any) => setMontantHT(e.target.value === '' ? '' : Number(e.target.value))} />
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <FormInput label="TVA" type="number" value={tva} onChange={(e: any) => setTva(Number(e.target.value))} />
                  <div>
                    <label className="text-xs text-slate-600 mb-1 block">Montant TTC</label>
                    <div className="mt-1 p-2 border rounded bg-slate-50">{(Number(montantHT || 0) * (1 + tva / 100)).toFixed(2)} DH</div>
                  </div>
                </div>

                <div className="mt-3">
                  <FormInput label="Numéro attestation" value={numAttestation} onChange={(e: any) => setNumAttestation(e.target.value)} />
                </div>
                <div className="mt-2">
                  <FormInput label="Date délivrance" type="date" value={dateDelivrance} onChange={(e: any) => setDateDelivrance(e.target.value)} />
                </div>
                <div className="mt-2">
                  <label className="block mb-1 text-xs text-slate-600">Attachement</label>
                  <input type="file" onChange={e => setAttachment(e.target.files ? e.target.files[0] : null)} className="w-full" />
                </div>
              </FormSection>
            </div>
          </div>

          <div>
            <label className="text-sm text-slate-600">Période facturation</label>
            <input value={periode} onChange={e => setPeriode(e.target.value)} placeholder="ex: 01/2025 - 01/2026" className="mt-1 w-full p-2 border rounded" />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button type="button" className="px-4 py-2 border rounded">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded">Enregistrer</button>
          </div>

          {status === 'sending' && <div className="text-sm text-slate-500 mt-2">Envoi...</div>}
          {status === 'ok' && <div className="text-sm text-green-600 mt-2">Facture enregistrée.</div>}
          {status === 'error' && <div className="text-sm text-red-600 mt-2">Erreur lors de l'envoi.</div>}
        </form>
      </div>
    </div>
  )
}
