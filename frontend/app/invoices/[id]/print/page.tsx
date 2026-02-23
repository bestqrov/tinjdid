"use client"
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import axios from '../../../../lib/axios'
import { useEffect, useState } from 'react'

// Convert number to French text - defined outside component
const numberToFrenchText = (num: number): string => {
  const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf']
  const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf']
  const tens = ['', '', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante', 'quatre-vingt', 'quatre-vingt']
  
  if (num === 0) return 'zéro'
  if (num < 10) return units[num]
  if (num < 20) return teens[num - 10]
  if (num < 100) {
    const ten = Math.floor(num / 10)
    const unit = num % 10
    if (ten === 7 || ten === 9) {
      return tens[ten] + '-' + teens[unit]
    }
    return tens[ten] + (unit > 0 ? '-' + units[unit] : '')
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100)
    const rest = num % 100
    return (hundred === 1 ? 'cent' : units[hundred] + '-cent') + (rest > 0 ? '-' + numberToFrenchText(rest) : '')
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000)
    const rest = num % 1000
    return (thousand === 1 ? 'mille' : numberToFrenchText(thousand) + '-mille') + (rest > 0 ? '-' + numberToFrenchText(rest) : '')
  }
  return num.toString()
}

export default function InvoicePrintPage() {
  const params = useParams()
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

  // Removed auto-print - user can print manually using the print button

  if (isLoading) return <div className="p-6">Chargement...</div>
  if (!invoice) return <div className="p-6">Facture introuvable</div>

  const tvaPercent = invoice.tvaPercent || 20
  const montantTVA = invoice.amount * (tvaPercent / 100)
  const montantTTC = invoice.amount + montantTVA
  const montantEnLettres = numberToFrenchText(Math.round(montantTTC)) + ' dirhams'

  return (
    <div>
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          @page { size: A4; margin: 0; }
          .print-page { padding: 15mm; min-height: 297mm; display: flex; flex-direction: column; }
          .invoice-content { flex: 1; }
          .invoice-footer { margin-top: auto; }
        }
        @media screen {
          .print-page { min-height: 100vh; display: flex; flex-direction: column; }
          .invoice-content { flex: 1; }
          .invoice-footer { margin-top: auto; }
        }
        .watermark { 
          position: fixed; 
          left: 50%; 
          top: 50%; 
          transform: translate(-50%, -50%); 
          opacity: 0.08; 
          z-index: 0;
          width: 400px;
          height: auto;
        }
        .header-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .header-right {
          text-align: right;
          background: #1e40af;
          color: white;
          padding: 15px 30px;
          border-radius: 5px;
        }
        .logo-container {
          width: 80px;
          height: 80px;
          background: #1e40af;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid #1e40af;
        }
      `}} />

      <div className="max-w-[210mm] mx-auto bg-white">
        <div className="print-page relative bg-white">
          {/* Watermark */}
          {companyProfile?.logo && (
            <img 
              src={`http://localhost:3001${companyProfile.logo}`} 
              crossOrigin="anonymous" 
              className="watermark pointer-events-none" 
              alt="watermark" 
            />
          )}
          
          {/* Print Button - Hidden when printing */}
          <div className="no-print mb-4 flex justify-end gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              🖨️ Imprimer
            </button>
            <button
              onClick={() => window.close()}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              ✖️ Fermer
            </button>
          </div>

          {/* Invoice Content */}
          <div className="invoice-content bg-white relative z-10">
          {/* Custom Header */}
          <div className="header-section mb-6">
            <div className="header-left">
              <div className="logo-container">
                {companyProfile?.logo ? (
                  <img
                    src={`http://localhost:3001${companyProfile.logo}`}
                    alt="Logo"
                    className="h-full w-full object-contain p-2"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <span className="text-white text-3xl font-bold">{companyProfile?.name?.[0] || 'C'}</span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-gray-800">{companyProfile?.name || 'COMPANY NAME'}</h1>
              </div>
            </div>
            <div className="header-right">
              <p className="text-sm font-semibold mb-1">{companyProfile?.activite || 'Activité de la société'}</p>
              <p className="text-xs">{companyProfile?.slogan || 'Slogan de la société'}</p>
            </div>
          </div>

          {/* Client Info */}
          <div className="mb-6 text-center">
            <p className="text-sm font-bold mb-1">CLIENT : {invoice.clientName || 'STE CLIENT NAME'}</p>
            <p className="text-xs">ICE : {invoice.clientIce || '000000000000000'}</p>
          </div>

          {/* Date */}
          <div className="mb-6">
            <div className="mb-4">
              <p className="text-sm font-medium">DATE : {new Date(invoice.createdAt).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')}</p>
            </div>
          </div>

          {/* Invoice Title */}
          <div className="mb-4 text-center">
            <h2 className="text-base font-bold">Facture N : {invoice.numero || `FAC-${invoice.id.slice(0,8).toUpperCase()}`}</h2>
          </div>

          {/* Items Table */}
          <table className="w-full border-collapse border-2 border-gray-800 mb-6">
            <thead>
              <tr className="bg-white">
                <th className="border-2 border-gray-800 p-2 text-left font-bold text-xs">DÉSIGNATION</th>
                <th className="border-2 border-gray-800 p-2 text-center font-bold text-xs w-16">UN</th>
                <th className="border-2 border-gray-800 p-2 text-center font-bold text-xs w-24">QTE</th>
                <th className="border-2 border-gray-800 p-2 text-right font-bold text-xs w-28">PU</th>
                <th className="border-2 border-gray-800 p-2 text-right font-bold text-xs w-32">MONTANT</th>
              </tr>
            </thead>
            <tbody>
              {invoice.lines && Array.isArray(invoice.lines) && invoice.lines.length > 0 ? (
                invoice.lines.map((line: any, idx: number) => (
                  <tr key={idx}>
                    <td className="border-2 border-gray-800 p-2 text-xs">{line.designation || ''}</td>
                    <td className="border-2 border-gray-800 p-2 text-center text-xs">U</td>
                    <td className="border-2 border-gray-800 p-2 text-center text-xs">{parseFloat(line.quantite || 0).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                    <td className="border-2 border-gray-800 p-2 text-right text-xs">{parseFloat(line.puHT || 0).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                    <td className="border-2 border-gray-800 p-2 text-right text-xs">{parseFloat(line.montantHT || 0).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="border-2 border-gray-800 p-2 text-xs">{invoice.description || 'Travaux'}</td>
                  <td className="border-2 border-gray-800 p-2 text-center text-xs">U</td>
                  <td className="border-2 border-gray-800 p-2 text-center text-xs">{(1).toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td className="border-2 border-gray-800 p-2 text-right text-xs">{invoice.amount.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                  <td className="border-2 border-gray-800 p-2 text-right text-xs">{invoice.amount.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
                </tr>
              )}
              <tr>
                <td colSpan={3} className="border-l-2 border-r-2 border-b-2 border-gray-800"></td>
                <td className="border-l-2 border-r-2 border-b-2 border-gray-800 p-2 text-center font-bold text-xs">TOTAL HT</td>
                <td className="border-l-2 border-r-2 border-b-2 border-gray-800 p-2 text-right font-bold text-xs">{invoice.amount.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-l-2 border-r-2 border-b-2 border-gray-800"></td>
                <td className="border-l-2 border-r-2 border-b-2 border-gray-800 p-2 text-center font-bold text-xs">TVA {tvaPercent} %</td>
                <td className="border-l-2 border-r-2 border-b-2 border-gray-800 p-2 text-right font-bold text-xs">{montantTVA.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
              <tr>
                <td colSpan={3} className="border-l-2 border-r-2 border-b-2 border-gray-800"></td>
                <td className="border-l-2 border-r-2 border-b-2 border-gray-800 p-2 text-center font-bold text-xs">TOTAL TTC</td>
                <td className="border-l-2 border-r-2 border-b-2 border-gray-800 p-2 text-right font-bold text-xs">{montantTTC.toLocaleString('fr-FR', {minimumFractionDigits:2, maximumFractionDigits:2})}</td>
              </tr>
            </tbody>
          </table>

          {/* Closing Statement */}
          <div className="mb-8">
            <p className="font-bold text-sm">LA FACTURE fermer au montant de {montantEnLettres}.</p>
          </div>

          {/* Signature and Stamp Area */}
          <div className="flex justify-end mb-16 mt-12">
            <div className="text-center" style={{ width: '250px' }}>
              <p className="font-bold text-sm mb-2">Signature et Cachet</p>
              <div className="border-2 border-gray-300 h-32" style={{ minHeight: '120px' }}>
                {/* Empty space for signature and stamp */}
              </div>
            </div>
          </div>
          </div>

          {/* Footer - Blue Angled Bar with Legal Information */}
          <div className="invoice-footer text-white text-center" style={{
            background: 'linear-gradient(to right, #1e40af 0%, #1e40af 45%, #1e40af 55%, #1e40af 100%)',
            clipPath: 'polygon(0 30%, 100% 0, 100% 100%, 0% 100%)',
            padding: '35px 25px 25px 25px',
            marginTop: '30px'
          }}>
            <p className="font-bold text-lg mb-3">{companyProfile?.name || 'COMPANY NAME'} SARL AU</p>
            
            {/* Legal Information */}
            <div className="mb-3 text-xs leading-relaxed">
              <p className="mb-1">
                <span className="font-semibold">ICE:</span> {companyProfile?.ice || '000000000000000'} &nbsp;|&nbsp;
                <span className="font-semibold">IF:</span> {companyProfile?.if || '0000000'} &nbsp;|&nbsp;
                <span className="font-semibold">RC:</span> {companyProfile?.rc || '00000'} &nbsp;|&nbsp;
                <span className="font-semibold">PATENTE:</span> {companyProfile?.patente || '00000000'}
              </p>
              <p className="mb-1">
                <span className="font-semibold">CNSS:</span> {companyProfile?.cnss || '0000000'} &nbsp;|&nbsp;
                <span className="font-semibold">Compte Bancaire:</span> {companyProfile?.compteBancaire || '000000000000'}
              </p>
              <p>
                <span className="font-semibold">Adresse:</span> {companyProfile?.address || 'Adresse de la société'}
              </p>
            </div>
            
            {/* Contact Information */}
            <div className="text-xs opacity-90">
              {companyProfile?.phone && (
                <span>Tél: {companyProfile.phone} &nbsp;|&nbsp;</span>
              )}
              {companyProfile?.email && (
                <span>Email: {companyProfile.email}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
