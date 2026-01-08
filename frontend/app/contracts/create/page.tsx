"use client"
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import axios from '../../../lib/axios'
import FormInput from '../../../components/FormInput'
import FormSection from '../../../components/FormSection'

export default function CreateContractPage() {
  const { register, handleSubmit } = useForm()
  const [loading, setLoading] = useState(false)
  const [collaborators, setCollaborators] = useState<any[]>([])
  const [contractTypes, setContractTypes] = useState<any[]>([])
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''

  useEffect(() => {
    if (!companyId) return
    axios.get(`/contracts/metadata?companyId=${companyId}`).then(res => {
      setCollaborators(res.data.collaborators || [])
      setContractTypes(res.data.contractTypes || [])
    }).catch(() => {})
  }, [companyId])

  async function onSubmit(vals: any) {
    try {
      setLoading(true)
      const form = new FormData()
      // append all fields
      Object.keys(vals).forEach(key => {
        const v = (vals as any)[key]
        if (v instanceof FileList) {
          if (v.length > 0) form.append(key, v[0])
        } else if (Array.isArray(v)) {
          v.forEach((it: any) => form.append(key, it))
        } else if (v !== undefined && v !== null) {
          form.append(key, String(v))
        }
      })

      await axios.post('/contracts', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      window.location.href = '/contracts'
    } catch (err) {
      alert('Erreur lors de la création du contrat')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-t-lg shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">📜</span>
          Nouveau contrat
        </h1>
        <p className="text-purple-100 text-sm mt-2">Créez un nouveau contrat collaborateur</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-b-lg shadow-lg">
        <FormSection title="Collaborateur" icon="👤" color="blue">
          <select {...register('collaboratorId')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500">
            <option value="">Choisir un collaborateur</option>
            {collaborators.map(c => (
              <option key={c.id} value={c.id}>{c.name || c.email}</option>
            ))}
          </select>
        </FormSection>

        <FormSection title="Informations générales" icon="📋" color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput label="Numéro" {...register('number')} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type contrat</label>
              <div className="flex gap-2">
                <select {...register('contractTypeId')} className="flex-1 rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-green-500">
                  <option value="">Choisir</option>
                  {contractTypes.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
                <button type="button" className="px-3 rounded border bg-white text-sm hover:bg-gray-50">+</button>
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Dates & Durées" icon="📅" color="purple">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date entrée</label>
              <input type="date" {...register('startDate')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date embauche</label>
              <input type="date" {...register('hireDate')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date fin prévue</label>
              <input type="date" {...register('endDatePlanned')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée prévue (mois)</label>
              <input type="number" step="1" {...register('durationPlanned')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date fin réelle</label>
              <input type="date" {...register('endDateReal')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Durée réelle (mois)</label>
              <input type="number" step="1" {...register('durationReal')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Période essai (mois)</label>
              <input type="number" step="1" {...register('probationPeriod')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nombre heures de travail</label>
              <input type="number" step="0.01" {...register('hours')} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500" />
            </div>
          </div>
        </FormSection>

        <FormSection title="Documents & Commentaires" icon="📎" color="orange">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Attachment</label>
              <input type="file" {...register('attachment')} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Commentaire</label>
              <textarea {...register('comment')} rows={4} className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end pt-4 border-t mt-6">
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium text-sm" type="submit" disabled={loading}>
            {loading ? 'Création…' : 'Créer le contrat'}
          </button>
        </div>
      </form>
    </div>
  )
}
