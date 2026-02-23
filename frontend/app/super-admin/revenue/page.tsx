"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../../lib/axios'
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']

export default function RevenuePage() {
  const { data: revenue, isLoading } = useQuery({
    queryKey: ['super-admin-revenue'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/revenue?period=30')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const { data: revenueByPlan } = useQuery({
    queryKey: ['super-admin-revenue-by-plan'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/revenue/by-plan?period=30')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>💰</span>
          Revenus & Finance
        </h1>
        <p className="mt-2 text-green-100">Suivez les revenus de la plateforme</p>
      </div>

      {/* Revenue KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevenueCard
          title="MRR"
          value={`${revenue?.mrr?.toFixed(2) || 0} MAD`}
          subtitle="Revenu Mensuel Récurrent"
          icon="💵"
          color="green"
        />
        <RevenueCard
          title="ARR"
          value={`${revenue?.arr?.toFixed(2) || 0} MAD`}
          subtitle="Revenu Annuel Récurrent"
          icon="📈"
          color="blue"
        />
        <RevenueCard
          title="Revenu Moyen"
          value={`${revenue?.averageRevenuePerCompany?.toFixed(2) || 0} MAD`}
          subtitle="Par entreprise"
          icon="💎"
          color="purple"
        />
        <RevenueCard
          title="Total Paiements"
          value={revenue?.payments?.paid || 0}
          subtitle={`${revenue?.payments?.pending || 0} en attente`}
          icon="✅"
          color="orange"
        />
      </div>

      {/* Payment Status */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Statut des Paiements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Payés</p>
                <p className="text-2xl font-bold text-green-700">{revenue?.payments?.paid || 0}</p>
              </div>
              <span className="text-3xl">✅</span>
            </div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">En attente</p>
                <p className="text-2xl font-bold text-yellow-700">{revenue?.payments?.pending || 0}</p>
              </div>
              <span className="text-3xl">⏳</span>
            </div>
          </div>
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 font-medium">Échoués</p>
                <p className="text-2xl font-bold text-red-700">{revenue?.payments?.failed || 0}</p>
              </div>
              <span className="text-3xl">❌</span>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue by Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Revenu par Plan</h2>
          {revenueByPlan && revenueByPlan.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={revenueByPlan}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.planName}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="monthlyRevenue"
                >
                  {revenueByPlan.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-400">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Détails par Plan</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-3 text-sm font-medium text-gray-700">Plan</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">Entreprises</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">MRR</th>
                  <th className="text-right py-2 px-3 text-sm font-medium text-gray-700">ARR</th>
                </tr>
              </thead>
              <tbody>
                {revenueByPlan?.map((plan: any, index: number) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm font-medium text-gray-900">{plan.planName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right text-sm text-gray-600">{plan.companies}</td>
                    <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">
                      {plan.monthlyRevenue?.toFixed(2)} MAD
                    </td>
                    <td className="py-3 px-3 text-right text-sm font-semibold text-gray-900">
                      {plan.yearlyRevenue?.toFixed(2)} MAD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Exporter les Données</h2>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              const res = await axios.get('/super-admin/revenue/export?format=csv')
              const blob = new Blob([res.data.data], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `revenue-${new Date().toISOString()}.csv`
              a.click()
            }}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            📊 Exporter CSV
          </button>
          <button
            onClick={async () => {
              const res = await axios.get('/super-admin/revenue/export?format=json')
              const blob = new Blob([JSON.stringify(res.data.data, null, 2)], { type: 'application/json' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.href = url
              a.download = `revenue-${new Date().toISOString()}.json`
              a.click()
            }}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            📄 Exporter JSON
          </button>
        </div>
      </div>
    </div>
  )
}

function RevenueCard({ title, value, subtitle, icon, color }: any) {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  }

  return (
    <div className={`${colorClasses[color as keyof typeof colorClasses]} border-2 rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium opacity-75">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-xs mt-1 opacity-60">{subtitle}</p>}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  )
}
