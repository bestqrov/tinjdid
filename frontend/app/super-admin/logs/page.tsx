"use client"
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from '../../../lib/axios'

export default function LogsPage() {
  const [filters, setFilters] = useState({ companyId: '', action: '', page: 1 })

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-logs', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.companyId) params.set('companyId', filters.companyId)
      if (filters.action) params.set('action', filters.action)
      params.set('page', filters.page.toString())
      params.set('limit', '100')
      const res = await axios.get(`/super-admin/logs?${params}`)
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    )
  }

  const logs = data?.data || []
  const pagination = data?.pagination || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>📋</span>
          Journaux d'Activité
        </h1>
        <p className="mt-2 text-orange-100">Suivez toutes les actions de la plateforme</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Action:</label>
          <select
            value={filters.action}
            onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Toutes</option>
            <option value="COMPANY_CREATED">Entreprise créée</option>
            <option value="COMPANY_SUSPENDED">Entreprise suspendue</option>
            <option value="COMPANY_ACTIVATED">Entreprise activée</option>
            <option value="PLAN_CHANGED">Plan modifié</option>
            <option value="USER_BLOCKED">Utilisateur bloqué</option>
            <option value="PAYMENT_RECEIVED">Paiement reçu</option>
          </select>
        </div>
        <div className="ml-auto text-sm text-gray-600">
          Total: <span className="font-semibold">{pagination.total || 0}</span> entrées
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-lg shadow">
        <div className="divide-y divide-gray-200">
          {logs.map((log: any) => (
            <div key={log.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <ActionIcon action={log.action} />
                    <span className="text-sm font-semibold text-gray-900">{formatAction(log.action)}</span>
                    {log.company && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {log.company.name}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 ml-9">{log.description}</p>
                  {log.metadata && (
                    <div className="mt-2 ml-9 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                      {JSON.stringify(log.metadata)}
                    </div>
                  )}
                </div>
                <div className="text-right text-xs text-gray-500 ml-4">
                  <div>{new Date(log.createdAt).toLocaleDateString('fr-FR')}</div>
                  <div>{new Date(log.createdAt).toLocaleTimeString('fr-FR')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <p className="text-sm text-gray-700">
              Page {filters.page} sur {pagination.totalPages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                ←
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ActionIcon({ action }: { action: string }) {
  const icons: any = {
    COMPANY_CREATED: '🏢',
    COMPANY_SUSPENDED: '🚫',
    COMPANY_ACTIVATED: '✅',
    COMPANY_DELETED: '🗑️',
    PLAN_CHANGED: '💎',
    USER_BLOCKED: '⛔',
    USER_UNBLOCKED: '✅',
    PAYMENT_RECEIVED: '💰',
    PAYMENT_FAILED: '❌',
    SETTINGS_UPDATED: '⚙️',
  }

  return <span className="text-2xl">{icons[action] || '📌'}</span>
}

function formatAction(action: string): string {
  const labels: any = {
    COMPANY_CREATED: 'Entreprise créée',
    COMPANY_SUSPENDED: 'Entreprise suspendue',
    COMPANY_ACTIVATED: 'Entreprise activée',
    COMPANY_DELETED: 'Entreprise supprimée',
    PLAN_CHANGED: 'Plan modifié',
    USER_BLOCKED: 'Utilisateur bloqué',
    USER_UNBLOCKED: 'Utilisateur débloqué',
    PAYMENT_RECEIVED: 'Paiement reçu',
    PAYMENT_FAILED: 'Paiement échoué',
    SETTINGS_UPDATED: 'Paramètres mis à jour',
  }

  return labels[action] || action
}
