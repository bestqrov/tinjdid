"use client"
import { useParams, useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from '../../../lib/axios'
import { useEffect, useState } from 'react'

export default function InvoiceDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string
  const [companyProfile, setCompanyProfile] = useState<any>(null)

  const { data: invoice, isLoading } = useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      const res = await axios.get(`/invoices/${id}`)
      return res.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/settings/company-profile')
        setCompanyProfile(res.data?.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    fetchProfile()
  }, [])

  if (isLoading) return <div className="p-6">Chargement...</div>
  if (!invoice) return <div className="p-6">Facture introuvable</div>

  const montantTVA = invoice.amount * ((invoice.tva || 20) / 100)
  const montantTTC = invoice.amount + montantTVA

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow hover:bg-gray-50 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour
          </button>
          <div className="flex gap-3">
            <button
              onClick={() => window.open(`/invoices/${id}/print`, '_blank')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Imprimer
            </button>
          </div>
        </div>

        {/* Invoice Preview */}
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                {companyProfile?.logo ? (
                  <div className="w-20 h-20 bg-white rounded-lg p-2 shadow-lg">
                    <img src={`http://localhost:3001${companyProfile.logo}`} alt="Logo" className="w-full h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white rounded-lg flex items-center justify-center text-purple-600 font-bold text-2xl shadow-lg">
                    {companyProfile?.name?.[0] || 'A'}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold mb-1">{companyProfile?.name || 'Ma Société'}</h2>
                  <p className="text-purple-100">{companyProfile?.tagline}</p>
                </div>
              </div>
              <div className="text-right">
                <h1 className="text-4xl font-bold mb-2">FACTURE</h1>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <p className="text-sm">N° FAC-{invoice.id.slice(0, 8).toUpperCase()}</p>
                  <p className="text-sm">Date: {new Date(invoice.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8">
            {/* Client Info */}
            <div className="mb-8">
            <h3 className="text-sm font-semibold text-purple-600 mb-3 uppercase tracking-wide">Facturé à</h3>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-l-4 border-purple-600 p-5 rounded-r-lg">
              <p className="font-bold text-gray-900 text-lg mb-1">{invoice.clientName || 'Client'}</p>
              {invoice.clientAddress && <p className="text-gray-600">{invoice.clientAddress}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                  <th className="text-left p-4 font-semibold">Désignation</th>
                  <th className="text-center p-4 font-semibold">Quantité</th>
                  <th className="text-right p-4 font-semibold">Prix unitaire</th>
                  <th className="text-right p-4 font-semibold">Montant HT</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-800">{invoice.description || 'Service'}</td>
                  <td className="text-center p-4 text-gray-600">1</td>
                  <td className="text-right p-4 text-gray-600">{invoice.amount.toFixed(2)} DH</td>
                  <td className="text-right p-4 font-semibold text-gray-900">{invoice.amount.toFixed(2)} DH</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-80">
              <div className="bg-gray-50 rounded-lg p-6 space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Sous-total HT:</span>
                  <span className="font-semibold">{invoice.amount.toFixed(2)} DH</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>TVA ({invoice.tva || 20}%):</span>
                  <span className="font-semibold">{montantTVA.toFixed(2)} DH</span>
                </div>
                <div className="border-t-2 border-gray-300 pt-3"></div>
                <div className="flex justify-between items-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-lg">
                  <span className="font-bold text-lg">TOTAL TTC</span>
                  <span className="font-bold text-2xl">{montantTTC.toFixed(2)} DH</span>
                </div>
              </div>
            </div>
          </div>

          {/* Footer - Fiscal Information */}
          <div className="border-t-2 border-gray-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left - Contact Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📧</span>
                  Coordonnées
                </h4>
                <div className="space-y-2 text-sm">
                  {companyProfile?.address && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-blue-900">Adresse:</span> {companyProfile.address}
                    </p>
                  )}
                  {companyProfile?.email && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-blue-900">Email:</span> {companyProfile.email}
                    </p>
                  )}
                  {companyProfile?.phone && (
                    <p className="text-gray-700">
                      <span className="font-semibold text-blue-900">Tél:</span> {companyProfile.phone}
                    </p>
                  )}
                </div>
              </div>
              
              {/* Right - Fiscal Info */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-100">
                <h4 className="font-bold text-purple-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">📋</span>
                  Informations Légales
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-900">IF:</span> {companyProfile?.if || '1111'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-900">ICE:</span> {companyProfile?.ice || '121212'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-900">CNSS:</span> {companyProfile?.cnss || '22222'}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold text-purple-900">RIB:</span> {companyProfile?.compteBancaire || '09987765433322'}
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}
