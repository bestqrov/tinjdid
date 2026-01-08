"use client"
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../lib/axios'
import Card from '../../../components/Card'

export default function TripDetail() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['trip', id],
    queryFn: async () => {
      const res = await axios.get(`/trips/${id}`)
      return res.data
    },
    enabled: !!id
  })

  async function remove() {
    if (!confirm('Supprimer ce trajet ?')) return
    try {
      await axios.delete(`/trips/${id}`)
      router.push('/trips')
    } catch (err:any) { alert(err.message || 'Erreur') }
  }

  if (isLoading) return <div>Chargement...</div>
  if (!data) return <div>Introuvable</div>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Détails du trajet</h2>
        <div className="space-x-2">
          <a className="text-sm text-blue-600" href={`/trips/${id}/edit`}>Modifier</a>
          <button onClick={remove} className="text-sm text-red-600">Supprimer</button>
        </div>
      </div>

      <Card title="Infos">
        <div>Date: {new Date(data.date).toLocaleString()}</div>
        <div>Pickup: {data.pickup}</div>
        <div>Dropoff: {data.dropoff}</div>
        <div>Price: {data.price} {data.currency}</div>
      </Card>

      <Card title="Charges">
        {data.charges?.length ? data.charges.map((c:any) => (
          <div key={c.id} className="border-b py-2">{c.type} — {c.amount} {c.currency}</div>
        )) : <div>Aucune charge</div>}
      </Card>
    </div>
  )
}
