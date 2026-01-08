"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../lib/axios'
import Link from 'next/link'
import Table from '../../components/Table'

export default function DriversPage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const { data, isLoading } = useQuery({
    queryKey: ['drivers', companyId],
    queryFn: async () => {
      const res = await axios.get(`/drivers?companyId=${companyId}`)
      return res.data
    }
  })

  if (isLoading) return <div className="flex justify-center items-center h-32"><div className="text-sm">Chargement...</div></div>

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Chauffeurs</h2>
        <Link href="/drivers/create" className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded font-medium flex items-center gap-2 text-sm transition-colors">
          <span>➕</span>
          Nouveau chauffeur
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Nom</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Téléphone</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Langues</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Disponible</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Documents</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.map((driver: any) => (
              <tr key={driver.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">{driver.name}</td>
                <td className="px-4 py-3 text-sm">{driver.phone}</td>
                <td className="px-4 py-3 text-sm">{driver.languages?.join(', ') || 'Aucune'}</td>
                <td className="px-4 py-3 text-sm">{driver.available ? '✅ Disponible' : '❌ Indisponible'}</td>
                <td className="px-4 py-3 text-sm">{(driver.driverPhoto || driver.driverLicense || driver.cin || driver.cv) ? '📎 Complet' : '📭 Manquant'}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <Link href={`/drivers/${driver.id}`} className="text-blue-600 hover:text-blue-800 font-medium">👁️ Voir</Link>
                    <Link href={`/drivers/${driver.id}/edit`} className="text-green-600 hover:text-green-800 font-medium">✏️ Modifier</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  )
}