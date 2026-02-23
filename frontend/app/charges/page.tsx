"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../lib/axios'
import Link from 'next/link'
import Table from '../../components/Table'

export default function ChargesPage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const { data, isLoading } = useQuery({
    queryKey: ['charges', companyId],
    queryFn: async () => {
      const res = await axios.get(`/charges?companyId=${companyId}`)
      return res.data
    }
  })

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Charges</h2>
        <Link href="/charges/create" className="bg-blue-600 text-white px-3 py-2 rounded">Nouvelle charge</Link>
      </div>

      <Table>
        <thead>
          <tr>
            <th className="p-2 text-left">Type</th>
            <th className="p-2 text-left">Montant</th>
            <th className="p-2 text-left">Trip</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((c: any) => (
            <tr key={c.id} className="border-t">
              <td className="p-2">{c.type}</td>
              <td className="p-2">{c.amount} {c.currency}</td>
              <td className="p-2">{c.tripId || '-'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
