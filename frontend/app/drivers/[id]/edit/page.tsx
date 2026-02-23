"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { driverSchema, DriverInput } from '../../../../lib/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../../lib/axios'
import FormInput from '../../../../components/FormInput'
import FormSection from '../../../../components/FormSection'
import { useEffect } from 'react'

export default function EditDriverPage() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['driver', id],
    queryFn: async () => {
      const res = await axios.get(`/drivers/${id}`)
      return res.data
    },
    enabled: !!id
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<DriverInput>({ resolver: zodResolver(driverSchema) })

  useEffect(() => {
    if (data) reset({
      name: data.name,
      phone: data.phone,
      whatsapp: data.whatsapp,
      email: data.email,
      address: data.address,
      cinNumber: data.cinNumber,
      languages: data.languages || [],
      available: data.available
    })
  }, [data, reset])

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.put(`/drivers/${id}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['drivers'] });
      qc.invalidateQueries({ queryKey: ['driver', id] });
      router.push(`/drivers/${id}`)
    }
  })

  function onSubmit(vals: any) { mutation.mutate({ ...vals }) }

  if (isLoading) return <div className="flex justify-center items-center h-32"><div className="text-sm">Chargement...</div></div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">✏️</span>
          Modifier chauffeur
        </h1>
        <p className="text-blue-100 text-sm mt-1">Mettez à jour les informations</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-b-lg shadow-lg">
        {/* Informations personnelles et contact */}
        <FormSection title="Informations personnelles & Contact" icon="👤" color="blue">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Nom complet"
              icon="📝"
              {...register('name' as any)}
              error={errors.name?.message as any}
            />
            <FormInput
              label="Email"
              type="email"
              icon="📧"
              {...register('email' as any)}
              error={errors.email?.message as any}
            />
            <FormInput
              label="Téléphone"
              type="tel"
              icon="📱"
              {...register('phone' as any)}
              error={errors.phone?.message as any}
            />
            <FormInput
              label="WhatsApp"
              type="tel"
              icon="💬"
              {...register('whatsapp' as any)}
              error={errors.whatsapp?.message as any}
            />
            <div className="md:col-span-2">
              <FormInput
                label="Adresse"
                icon="🏠"
                {...register('address' as any)}
                error={errors.address?.message as any}
              />
            </div>
          </div>
        </FormSection>

        {/* Documents d'identité et statut */}
        <FormSection title="Documents & Statut" icon="🆔" color="green">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormInput
              label="Numéro CIN"
              icon="🆔"
              {...register('cinNumber' as any)}
              error={errors.cinNumber?.message as any}
            />
            <div>
              <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
                <span className="text-sm">📊</span>
                Disponibilité
              </label>
              <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" {...register('available' as any)}>
                <option value={true as any}>✅ Disponible</option>
                <option value={false as any}>❌ Indisponible</option>
              </select>
            </div>
          </div>
        </FormSection>

        {/* Langues parlées */}
        <FormSection title="Langues parlées" icon="🌍" color="purple">
          <div className="space-y-2">
            <label className="text-xs text-slate-600 mb-2 flex items-center gap-2">
              <span className="text-sm">🗣️</span>
              Sélectionnez les langues
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['Français', 'Anglais', 'Arabe', 'Tachelhit', 'Espagnol', 'Allemand', 'Italien'].map(lang => (
                <label key={lang} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    value={lang}
                    {...register('languages' as any)}
                    className="rounded border-slate-200"
                  />
                  {lang}
                </label>
              ))}
            </div>
          </div>
        </FormSection>

        {/* Documents & Photos */}
        <FormSection title="Documents & Photos" icon="📎" color="pink">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
                <span className="text-sm">📸</span>
                Photo du chauffeur
              </label>
              <input
                type="file"
                accept="image/*"
                {...register('driverPhoto' as any)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
                <span className="text-sm">🚗</span>
                Permis de conduire
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                {...register('driverLicense' as any)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
                <span className="text-sm">🆔</span>
                Carte d'identité (CIN)
              </label>
              <input
                type="file"
                accept="image/*,.pdf"
                {...register('cin' as any)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600 mb-1 flex items-center gap-2">
                <span className="text-sm">📄</span>
                CV / Autres documents
              </label>
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                {...register('cv' as any)}
                className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
              />
            </div>
          </div>
        </FormSection>

        <div className="flex justify-end pt-4 border-t mt-6">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm" type="submit">
            <span>💾</span>
            Enregistrer les modifications
          </button>
        </div>
      </form>
    </div>
  )
}