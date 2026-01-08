"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../lib/axios'
import Link from 'next/link'
import Table from '../../components/Table'

export default function QuotesPage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const { data, isLoading } = useQuery({
    queryKey: ['quotes', companyId],
    queryFn: async () => {
      const res = await axios.get(`/quotes?companyId=${companyId}`)
      return res.data
    }
  })

  if (isLoading) return <div>Chargement...</div>

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Devis</h2>
        <Link href="/quotes/create" className="bg-blue-600 text-white px-3 py-2 rounded">Nouveau devis</Link>
      </div>

      <Table>
        <thead>
          <tr>
            <th className="p-2 text-left">Montant</th>
            <th className="p-2 text-left">Statut</th>
            <th className="p-2 text-left">Date</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((q: any) => (
            <tr key={q.id} className="border-t">
              <td className="p-2">{q.amount} {q.currency}</td>
              <td className="p-2">{q.status}</td>
              <td className="p-2">{new Date(q.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
