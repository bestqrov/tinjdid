"use client"
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from '../../lib/axios'
import Link from 'next/link'
import Table from '../../components/Table'
import { useRouter } from 'next/navigation'
import PageHeader from '../../components/PageHeader'

export default function InvoicesPage() {
  const router = useRouter()
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const { data, isLoading } = useQuery({
    queryKey: ['invoices', companyId],
    queryFn: async () => {
      const res = await axios.get(`/invoices?companyId=${companyId}`)
      return res.data
    }
  })

  const qc = useQueryClient()

  async function remove(id: string) {
    if (!confirm('Supprimer cette facture ?')) return
    try {
      await axios.delete(`/invoices/${id}`)
      qc.invalidateQueries({ queryKey: ['invoices'] })
    } catch (err:any) { alert(err.message || 'Erreur') }
  }

  function handlePreview(id: string) {
    window.open(`/invoices/${id}/print`, '_blank')
  }

  function handlePrint(id: string) {
    window.open(`/invoices/${id}/print`, '_blank')
  }

  function handleExportPDF(id: string) {
    // Open print page which will trigger print dialog for PDF export
    const printWindow = window.open(`/invoices/${id}/print`, '_blank')
    if (printWindow) {
      printWindow.focus()
    }
  }

  if (isLoading) return <div className="p-6">Chargement...</div>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader 
        title="📄 Factures" 
        gradientFrom="purple-600" 
        gradientTo="pink-600"
      >
        <Link href="/invoices/create" className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-all shadow-md">
          ➕ Nouvelle facture
        </Link>
      </PageHeader>

      <div className="bg-white rounded-b-lg shadow-lg overflow-hidden">
        <Table>
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">N° Facture</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Client</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Montant HT</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">TVA</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Total TTC</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Statut</th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data?.map((f: any) => {
              const montantTTC = f.amount * (1 + (f.tva || 20) / 100)
              return (
                <tr key={f.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">FAC-{f.id.slice(0, 8)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.clientName || 'Client'}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{f.amount.toFixed(2)} DH</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{f.tva || 20}%</td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">{montantTTC.toFixed(2)} DH</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{new Date(f.createdAt).toLocaleDateString('fr-FR')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      f.status === 'PAID' ? 'bg-green-100 text-green-800' :
                      f.status === 'SENT' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {f.status === 'PAID' ? 'Payée' : f.status === 'SENT' ? 'Envoyée' : 'Brouillon'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handlePreview(f.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Aperçu"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handlePrint(f.id)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                        title="Imprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleExportPDF(f.id)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="Exporter PDF"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => remove(f.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Supprimer"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        {(!data || data.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Aucune facture pour le moment</p>
            <p className="text-sm mt-2">Créez votre première facture pour commencer</p>
          </div>
        )}
      </div>
    </div>
  )
}
