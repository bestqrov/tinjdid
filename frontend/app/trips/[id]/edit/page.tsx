"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tripSchema, TripInput } from '../../../../lib/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../../lib/axios'
import FormInput from '../../../../components/FormInput'
import FormSection from '../../../../components/FormSection'
import { useEffect } from 'react'

export default function EditTripPage() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const res = await axios.get(`/trips/${id}`)
      return res.data
    },
    enabled: !!id
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<TripInput>({ resolver: zodResolver(tripSchema) })

  useEffect(() => { if (data) reset({ date: new Date(data.date).toISOString().slice(0,16), pickup: data.pickup, dropoff: data.dropoff, tripType: data.tripType, price: data.price }) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.put(`/trips/${id}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['trip', id] });
      router.push(`/trips/${id}`)
    }
  })

  function onSubmit(vals: any) { mutation.mutate({ ...vals, price: Number(vals.price) }) }

  if (isLoading) return <div className="flex justify-center items-center h-32"><div className="text-sm">Chargement...</div></div>

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">✏️</span>
          Modifier trajet
        </h1>
        <p className="text-blue-100 text-sm mt-1">Mettez à jour les informations</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-lg shadow-lg">
        <FormSection title="Informations temporelles" icon="🕒" color="blue">
          <FormInput
            label="Date & heure"
            type="datetime-local"
            icon="📅"
            {...register('date' as any)}
            error={errors.date?.message as any}
          />
        </FormSection>

        <FormSection title="Détails du trajet" icon="📍" color="green">
          <FormInput
            label="Point de départ"
            icon="🏠"
            {...register('pickup' as any)}
            error={errors.pickup?.message as any}
          />
          <FormInput
            label="Destination"
            icon="🎯"
            {...register('dropoff' as any)}
            error={errors.dropoff?.message as any}
          />
        </FormSection>

        <FormSection title="Configuration" icon="⚙️" color="purple">
          <label className="block mb-3">
            <div className="text-sm text-slate-600 mb-1 flex items-center gap-2">
              <span className="text-lg">🏷️</span>
              Type de trajet
            </div>
            <select className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400" {...register('tripType' as any)}>
              <option value="AIRPORT">✈️ Aéroport</option>
              <option value="EXCURSION">🏞️ Excursion</option>
              <option value="CITY_TOUR">🏙️ City tour</option>
            </select>
          </label>
        </FormSection>

        <FormSection title="Tarification" icon="💰" color="orange">
          <FormInput
            label="Prix"
            type="number"
            step="0.01"
            icon="💵"
            {...register('price' as any)}
            error={errors.price?.message as any}
          />
        </FormSection>

        <div className="flex justify-end pt-3 border-t mt-4">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm" type="submit">
            <span>💾</span>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  )
}
