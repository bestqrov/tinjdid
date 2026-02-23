"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { chargeSchema, ChargeInput } from '../../../../lib/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../../lib/axios'
import FormInput from '../../../../components/FormInput'
import { useEffect } from 'react'

export default function EditChargePage() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['charge', id],
    queryFn: async () => {
      const res = await axios.get(`/charges/${id}`)
      return res.data
    },
    enabled: !!id
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ChargeInput>({ resolver: zodResolver(chargeSchema) })

  useEffect(() => { if (data) reset({ type: data.type, amount: data.amount, tripId: data.tripId, date: data.date?.slice(0,10) }) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.put(`/charges/${id}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['charges'] });
      qc.invalidateQueries({ queryKey: ['charge', id] });
      router.push(`/charges/${id}`)
    }
  })

  function onSubmit(vals: any) { mutation.mutate({ ...vals }) }

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Modifier la charge</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Type" {...register('type' as any)} error={errors.type?.message as any} />
        <FormInput label="Montant" type="number" step="0.01" {...register('amount' as any)} error={errors.amount?.message as any} />
        <FormInput label="Date de la dépense" type="date" {...register('date' as any)} error={errors.date?.message as any} />
        <FormInput label="Trip ID (optionnel)" {...register('tripId' as any)} error={errors.tripId?.message as any} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Enregistrer</button>
      </form>
    </div>
  )
}
