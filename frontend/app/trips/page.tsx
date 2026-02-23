"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../lib/axios'
import Link from 'next/link'
import Table from '../../components/Table'

export default function TripsPage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const { data, isLoading } = useQuery({
    queryKey: ['trips', companyId],
    queryFn: async () => {
      const res = await axios.get(`/trips?companyId=${companyId}`)
      return res.data
    }
  })

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Trajets</h2>
        <Link href="/trips/create" className="bg-blue-600 text-white px-3 py-2 rounded">Nouveau trajet</Link>
      </div>

      <Table>
        <thead>
          <tr>
            <th className="p-2 text-left">Date</th>
            <th className="p-2 text-left">Pickup</th>
            <th className="p-2 text-left">Dropoff</th>
            <th className="p-2 text-left">Price</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((t: any) => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{new Date(t.date).toLocaleString()}</td>
              <td className="p-2">{t.pickup}</td>
              <td className="p-2">{t.dropoff}</td>
              <td className="p-2">{t.price} {t.currency}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
