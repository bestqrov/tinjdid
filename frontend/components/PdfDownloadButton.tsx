"use client"
import React from 'react'
import { useDownloadInvoicePdf, useDownloadQuotePdf } from '../lib/hooks'

export default function PdfDownloadButton({ id, type = 'invoice' }: { id: string; type?: 'invoice'|'quote' }) {
  const downloadInvoice = useDownloadInvoicePdf()
  const downloadQuote = useDownloadQuotePdf()

  async function handle() {
    try {
      const blob = type === 'invoice' ? await downloadInvoice.mutateAsync(id) : await downloadQuote.mutateAsync(id)
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      window.open(url, '_blank')
    } catch (e:any) {
      alert(e?.message || 'Erreur téléchargement PDF')
    }
  }

  return (
    <button onClick={handle} className="text-sm text-blue-600">Télécharger PDF</button>
  )
}
