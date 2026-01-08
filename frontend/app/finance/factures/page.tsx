"use client"
import Link from 'next/link'

export default function FacturesIndex() {
  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Factures</h1>
          <p className="text-sm text-slate-500">Liste des factures</p>
        </div>
        <div>
          <Link href="/finance/factures/create" className="bg-blue-600 text-white px-4 py-2 rounded">Nouvelle facture</Link>
        </div>
      </div>

      <div className="border rounded bg-white p-4">
        <p className="text-sm text-slate-500">Aucune facture pour l'instant (placeholder)</p>
      </div>
    </div>
  )
}
