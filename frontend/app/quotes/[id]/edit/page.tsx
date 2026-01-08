"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { quoteSchema, QuoteInput } from '../../../../lib/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../../lib/axios'
import FormInput from '../../../../components/FormInput'
import { useEffect } from 'react'

export default function EditQuotePage() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      const res = await axios.get(`/quotes/${id}`)
      return res.data
    },
    enabled: !!id
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuoteInput>({ resolver: zodResolver(quoteSchema) })

  useEffect(() => { if (data) reset({ amount: data.amount, currency: data.currency, status: data.status }) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.put(`/quotes/${id}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['quotes'] });
      qc.invalidateQueries({ queryKey: ['quote', id] });
      router.push(`/quotes/${id}`)
    }
  })

  function onSubmit(vals: any) { mutation.mutate({ ...vals }) }

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Modifier le devis</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Montant" type="number" step="0.01" {...register('amount' as any)} error={errors.amount?.message as any} />
        <label className="block mb-3">
          <div className="text-sm text-gray-600 mb-1">Devise</div>
          <select className="w-full border p-2 rounded" {...register('currency' as any)}>
            <option value="MAD">MAD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label className="block mb-3">
          <div className="text-sm text-gray-600 mb-1">Statut</div>
          <input className="w-full border p-2 rounded" {...register('status' as any)} />
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Enregistrer</button>
      </form>
    </div>
  )
}
