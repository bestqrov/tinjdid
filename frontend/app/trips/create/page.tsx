"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { tripSchema, TripInput } from '../../../lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../../../lib/axios'
import FormInput from '../../../components/FormInput'
import FormSection from '../../../components/FormSection'
import { z } from 'zod'

export default function CreateTripPage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const qc = useQueryClient()

  const { register, handleSubmit, formState: { errors } } = useForm<TripInput>({ resolver: zodResolver(tripSchema) })

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.post(`/trips?companyId=${companyId}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['trips', companyId] });
      window.location.href = '/trips'
    }
  })

  function onSubmit(data: any) { mutation.mutate({ ...data, price: Number(data.price) }) }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          Nouveau trajet
        </h1>
        <p className="text-blue-100 text-sm mt-1">Remplissez les informations</p>
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
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm" type="submit">
            <span>✅</span>
            Créer
          </button>
        </div>
      </form>
    </div>
  )
}
