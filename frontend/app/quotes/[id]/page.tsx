"use client"
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../lib/axios'
import Card from '../../../components/Card'

export default function QuoteDetail() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['quote', id],
    queryFn: async () => {
      const res = await axios.get(`/quotes/${id}`)
      return res.data
    },
    enabled: !!id
  })

  async function remove() {
    if (!confirm('Supprimer ce devis ?')) return
    try {
      await axios.delete(`/quotes/${id}`)
      router.push('/quotes')
    } catch (err:any) { alert(err.message || 'Erreur') }
  }

  if (isLoading) return <div>Chargement...</div>
  if (!data) return <div>Introuvable</div>

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Détails du devis</h2>
        <div className="space-x-2">
          <a className="text-sm text-blue-600" href={`/quotes/${id}/edit`}>Modifier</a>
          <button onClick={remove} className="text-sm text-red-600">Supprimer</button>
        </div>
      </div>

      <Card title="Infos">
        <div>Montant: {data.amount} {data.currency}</div>
        <div>Statut: {data.status}</div>
      </Card>
    </div>
  )
}
