"use client"
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../lib/axios'
import Card from '../../../components/Card'

export default function ChargeDetail() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['charge', id],
    queryFn: async () => {
      const res = await axios.get(`/charges/${id}`)
      return res.data
    },
    enabled: !!id
  })

  async function remove() {
    if (!confirm('Supprimer cette charge ?')) return
    try {
      await axios.delete(`/charges/${id}`)
      router.push('/charges')
    } catch (err:any) { alert(err.message || 'Erreur') }
  }

  if (isLoading) return <div>Chargement...</div>
  if (!data) return <div>Introuvable</div>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Détails de la charge</h2>
        <div className="space-x-2">
          <a className="text-sm text-blue-600" href={`/charges/${id}/edit`}>Modifier</a>
          <button onClick={remove} className="text-sm text-red-600">Supprimer</button>
        </div>
      </div>

      <Card title="Infos">
        <div>Type: {data.type}</div>
        <div>Montant: {data.amount} {data.currency}</div>
        <div>Trip: {data.tripId || '-'}</div>
      </Card>
    </div>
  )
}
