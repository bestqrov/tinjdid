"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { chargeSchema, ChargeInput } from '../../../lib/schemas'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../../../lib/axios'
import FormInput from '../../../components/FormInput'
import FormSection from '../../../components/FormSection'

export default function CreateChargePage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const qc = useQueryClient()
  const { register, handleSubmit, formState: { errors } } = useForm<ChargeInput>({ resolver: zodResolver(chargeSchema) })

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.post(`/charges?companyId=${companyId}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['charges', companyId] });
      window.location.href = '/charges'
    }
  })

  function onSubmit(data: any) { mutation.mutate({ ...data }) }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <span className="text-2xl">💳</span>
          Nouvelle charge
        </h1>
        <p className="text-blue-100 text-sm mt-1">Enregistrez vos dépenses</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-4 rounded-b-lg shadow-lg">
        <FormSection title="Détails de la charge" icon="📋" color="purple">
          <FormInput
            label="Type de charge"
            icon="🏷️"
            placeholder="fuel, driver, toll, other..."
            {...register('type' as any)}
            error={errors.type?.message as any}
          />
          <FormInput
            label="Date de la dépense"
            type="date"
            icon="📅"
            {...register('date' as any)}
            error={errors.date?.message as any}
          />
        </FormSection>

        <FormSection title="Informations financières" icon="💰" color="green">
          <FormInput
            label="Montant"
            type="number"
            step="0.01"
            icon="💵"
            {...register('amount' as any)}
            error={errors.amount?.message as any}
          />
        </FormSection>

        <FormSection title="Association" icon="🔗" color="orange">
          <FormInput
            label="ID du trajet (optionnel)"
            icon="🚗"
            placeholder="Laissez vide si non associé à un trajet"
            {...register('tripId' as any)}
            error={errors.tripId?.message as any}
          />
        </FormSection>

        <div className="flex justify-end pt-3 border-t mt-4">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors text-sm" type="submit">
            <span>✅</span>
            Ajouter
          </button>
        </div>
      </form>
    </div>
  )
}
