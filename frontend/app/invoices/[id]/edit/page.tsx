"use client"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { invoiceSchema, InvoiceInput } from '../../../../lib/schemas'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../../lib/axios'
import FormInput from '../../../../components/FormInput'
import { useEffect } from 'react'

export default function EditInvoicePage() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await axios.get(`/invoices/${id}`)
      return res.data
    },
    enabled: !!id
  })

  const { register, handleSubmit, reset, formState: { errors } } = useForm<InvoiceInput>({ resolver: zodResolver(invoiceSchema) })

  useEffect(() => { if (data) reset({ amount: data.amount, currency: data.currency, tva: data.tva }) }, [data, reset])

  const mutation = useMutation({
    mutationFn: (payload: any) => axios.put(`/invoices/${id}`, payload),
    onSuccess() {
      qc.invalidateQueries({ queryKey: ['invoices'] });
      qc.invalidateQueries({ queryKey: ['invoice', id] });
      router.push(`/invoices/${id}`)
    }
  })

  function onSubmit(vals: any) { mutation.mutate({ ...vals }) }

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">Modifier la facture</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FormInput label="Montant" type="number" step="0.01" {...register('amount' as any)} error={errors.amount?.message as any} />
        <label className="block mb-3">
          <div className="text-sm text-gray-600 mb-1">TVA</div>
          <select className="w-full border p-2 rounded" {...register('tva' as any)}>
            <option value={false as any}>Non</option>
            <option value={true as any}>Oui</option>
          </select>
        </label>
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">Enregistrer</button>
      </form>
    </div>
  )
}
