"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../../lib/axios'

export default function SystemPage() {
  const { data: health, isLoading } = useQuery({
    queryKey: ['super-admin-system-health'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/system/health')
      return res.data
    },
    refetchInterval: 30000, // Refresh every 30 seconds
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const { data: errors } = useQuery({
    queryKey: ['super-admin-system-errors'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/system/errors?limit=20')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    )
  }

  const isHealthy = health?.status === 'HEALTHY'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`bg-gradient-to-r ${isHealthy ? 'from-green-600 to-green-700' : 'from-red-600 to-red-700'} text-white p-6 shadow-lg`}>
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>{isHealthy ? '✅' : '⚠️'}</span>
          Santé du Système
        </h1>
        <p className={`mt-2 ${isHealthy ? 'text-green-100' : 'text-red-100'}`}>
          Statut: {isHealthy ? 'Tous les systèmes opérationnels' : 'Problèmes détectés'}
        </p>
      </div>

      {/* System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusCard
          title="API"
          status={health?.api || 'UNKNOWN'}
          icon="🌐"
        />
        <StatusCard
          title="Base de Données"
          status={health?.database || 'UNKNOWN'}
          icon="🗄️"
        />
        <StatusCard
          title="Uptime"
          status="RUNNING"
          value={formatUptime(health?.uptime || 0)}
          icon="⏱️"
        />
        <StatusCard
          title="Erreurs"
          status={health?.details?.errorCount > 0 ? 'WARNING' : 'OK'}
          value={health?.details?.errorCount || 0}
          icon="⚠️"
        />
      </div>

      {/* System Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Details */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Détails du Système</h2>
          <div className="space-y-3">
            <DetailRow label="Statut Global" value={health?.status} />
            <DetailRow label="Statut API" value={health?.api} />
            <DetailRow label="Statut BD" value={health?.database} />
            <DetailRow label="Uptime" value={formatUptime(health?.uptime || 0)} />
            <DetailRow
              label="Dernière vérification"
              value={new Date(health?.timestamp || Date.now()).toLocaleString('fr-FR')}
            />
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Métriques de Performance</h2>
          <div className="space-y-4">
            <MetricBar
              label="CPU Usage"
              value={health?.details?.cpuUsage || 0}
              max={100}
              color="blue"
            />
            <MetricBar
              label="Memory Usage"
              value={health?.details?.memoryUsage || 0}
              max={100}
              color="purple"
            />
            <MetricBar
              label="Disk Usage"
              value={health?.details?.diskUsage || 0}
              max={100}
              color="orange"
            />
          </div>
        </div>
      </div>

      {/* Recent Errors */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Erreurs Récentes</h2>
        {errors && errors.length > 0 ? (
          <div className="space-y-3">
            {errors.map((error: any, index: number) => (
              <div key={index} className="border-l-4 border-red-500 bg-red-50 p-4 rounded">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-800">
                      {error.lastErrorMsg || 'Erreur inconnue'}
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      Nombre d'erreurs: {error.errorCount}
                    </p>
                  </div>
                  <div className="text-xs text-red-600">
                    {error.lastErrorAt ? new Date(error.lastErrorAt).toLocaleString('fr-FR') : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">✅</p>
            <p>Aucune erreur récente</p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatusCard({ title, status, value, icon }: any) {
  const isHealthy = status === 'HEALTHY' || status === 'CONNECTED' || status === 'RUNNING' || status === 'OK'
  const colorClass = isHealthy ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'

  return (
    <div className={`${colorClass} border-2 rounded-lg p-6`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className={`px-2 py-1 rounded text-xs font-semibold ${isHealthy ? 'bg-green-200' : 'bg-red-200'}`}>
          {status}
        </span>
      </div>
      <p className="text-sm font-medium opacity-75">{title}</p>
      {value !== undefined && <p className="text-2xl font-bold mt-1">{value}</p>}
    </div>
  )
}

function DetailRow({ label, value }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-semibold text-gray-900">{value}</span>
    </div>
  )
}

function MetricBar({ label, value, max, color }: any) {
  const percentage = Math.min((value / max) * 100, 100)
  const colorClasses: any = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    orange: 'bg-orange-600',
  }

  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-semibold text-gray-900">{value.toFixed(1)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`${colorClasses[color]} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  )
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400)
  const hours = Math.floor((seconds % 86400) / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  if (days > 0) {
    return `${days}j ${hours}h ${minutes}m`
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else {
    return `${minutes}m`
  }
}
