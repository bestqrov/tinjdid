"use client"
import { useQuery } from '@tanstack/react-query'
import axios from '../../lib/axios'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, AreaChart, Area, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { useState } from 'react'

const COLORS = ['#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899']

export default function SuperAdminDashboard() {
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  
  const { data: dashboard, isLoading, refetch } = useQuery({
    queryKey: ['super-admin-dashboard'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/dashboard')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const { data: charts } = useQuery({
    queryKey: ['super-admin-charts'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/dashboard/charts?period=90')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const { data: passwordResetRequests, refetch: refetchRequests } = useQuery({
    queryKey: ['password-reset-requests'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/password-reset-requests?status=PENDING')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading Super Admin Dashboard...</p>
        </div>
      </div>
    )
  }

  const kpis = dashboard?.kpis || {}

  return (
    <div className="space-y-6">
      {/* Premium Header with Animation */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white p-8 shadow-2xl border-2 border-purple-400 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>
        
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-5 mb-4">
              <div className="bg-gradient-to-br from-yellow-400 to-amber-500 p-4 rounded-2xl shadow-lg transform hover:scale-110 transition-transform duration-300">
                <span className="text-5xl">👑</span>
              </div>
              <div>
                <h1 className="text-5xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">
                  TABLEAU DE BORD ADMIN
                </h1>
                <p className="text-purple-100 text-base font-semibold mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  ArwaPark SaaS Platform
                </p>
              </div>
            </div>
            <p className="text-purple-200 text-sm ml-24 font-medium">Plateforme de Gestion Multi-Entreprises</p>
          </div>
          
          <div className="hidden lg:flex gap-4">
            <div className="bg-gradient-to-br from-white/20 to-white/10 px-8 py-5 rounded-2xl backdrop-blur-md border-2 border-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="text-4xl font-black mb-2">{kpis.totalCompanies || 0}</div>
                <div className="text-xs text-purple-100 font-bold uppercase tracking-wider">Total Clients</div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-400/30 to-emerald-500/20 px-8 py-5 rounded-2xl backdrop-blur-md border-2 border-green-300/40 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-center">
                <div className="text-4xl font-black mb-2">{kpis.activeCompanies || 0}</div>
                <div className="text-xs text-green-100 font-bold uppercase tracking-wider">Actifs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main KPIs - Companies & Users */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-purple-600 to-purple-400 rounded-full"></div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Vue d'Ensemble</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="Total Entreprises"
            value={kpis.totalCompanies || 0}
            icon="🏢"
            color="purple"
            trend="+12%"
            link="/super-admin/companies"
          />
          <KPICard
            title="Entreprises Actives"
            value={kpis.activeCompanies || 0}
            icon="✅"
            color="green"
            subtitle={`${kpis.trialCompanies || 0} en essai`}
          />
          <KPICard
            title="Total Utilisateurs"
            value={kpis.totalUsers || 0}
            icon="👥"
            color="blue"
            link="/super-admin/users"
          />
          <KPICard
            title="Total Trajets"
            value={kpis.totalTrips || 0}
            icon="🚗"
            color="orange"
          />
        </div>
      </div>

      {/* Revenue KPIs */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-1 w-12 bg-gradient-to-r from-green-600 to-emerald-400 rounded-full"></div>
          <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Revenus & Finance</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <KPICard
            title="MRR"
            value={`${kpis.mrr?.toFixed(0) || 0} MAD`}
            icon="💰"
            color="green"
            subtitle="Revenu Mensuel"
            link="/super-admin/revenue"
          />
          <KPICard
            title="ARR"
            value={`${kpis.arr?.toFixed(0) || 0} MAD`}
            icon="📈"
            color="blue"
            subtitle="Revenu Annuel"
          />
          <KPICard
            title="Taux Départ"
            value={`${kpis.churnRate || 0}%`}
            icon="📉"
            color="red"
            subtitle="30 derniers jours"
          />
          <KPICard
            title="Profit Total"
            value={`${kpis.platformProfit?.toFixed(0) || 0} MAD`}
            icon="💎"
            color="purple"
            subtitle="Revenu Net"
          />
        </div>
      </div>

      {/* Password Reset Requests Section */}
      {passwordResetRequests?.requests && passwordResetRequests.requests.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="h-1 w-12 bg-gradient-to-r from-red-600 to-pink-400 rounded-full"></div>
            <h2 className="text-lg font-black text-gray-800 uppercase tracking-wide">Demandes de Réinitialisation</h2>
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">{passwordResetRequests.requests.length}</span>
          </div>
          <div className="bg-white rounded-xl shadow-lg border-2 border-red-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-red-50 to-pink-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {passwordResetRequests.requests.map((request: any) => (
                    <tr key={request.id} className="hover:bg-red-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">📧</span>
                          <span className="font-semibold text-gray-900">{request.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-600 line-clamp-2">{request.message || 'Aucun message'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{new Date(request.createdAt).toLocaleDateString('fr-FR')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => {
                            setSelectedRequest(request)
                            setShowResponseModal(true)
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold text-sm transition-all shadow-md hover:shadow-lg"
                        >
                          Répondre
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Second Row Charts - Trips Volume & Companies Growth */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trips Volume */}
        <div className="bg-gradient-to-br from-white to-orange-50 p-6 rounded-2xl shadow-xl border-2 border-orange-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-2 rounded-lg">
                <span className="text-2xl">🚗</span>
              </div>
              <h3 className="text-xl font-black text-gray-800">Volume des Trajets</h3>
            </div>
            <span className="text-xs text-orange-700 bg-orange-100 px-4 py-1.5 rounded-full font-bold border border-orange-300">30 derniers jours</span>
          </div>
          {charts?.tripsVolume && charts.tripsVolume.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={charts.tripsVolume.slice(-30)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" style={{ fontSize: '11px', fontWeight: '600' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px', fontWeight: '600' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #F59E0B', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    fontWeight: '600'
                  }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[10, 10, 0, 0]} name="Trajets" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-5xl mb-3">🚗</div>
              <p className="text-sm font-semibold">Aucune donnée de trajets</p>
            </div>
          )}
        </div>

        {/* New Companies vs Churn */}
        <div className="bg-gradient-to-br from-white to-green-50 p-6 rounded-2xl shadow-xl border-2 border-green-200 hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-2 rounded-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-black text-gray-800">Croissance Entreprises</h3>
            </div>
            <span className="text-xs text-green-700 bg-green-100 px-4 py-1.5 rounded-full font-bold border border-green-300">Mensuel</span>
          </div>
          {charts?.tripsVolume && charts.tripsVolume.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={charts.tripsVolume}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" style={{ fontSize: '12px', fontWeight: '600' }} />
                <YAxis stroke="#666" style={{ fontSize: '12px', fontWeight: '600' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '2px solid #10B981', 
                    borderRadius: '12px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                    fontWeight: '600'
                  }}
                />
                <Legend wrapperStyle={{ fontWeight: '600' }} />
                <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={3} name="Nouvelles" dot={{ r: 5, fill: '#10B981' }} />
                <Line type="monotone" dataKey="churn" stroke="#EF4444" strokeWidth={3} name="Perdues" dot={{ r: 5, fill: '#EF4444' }} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[280px] flex flex-col items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
              <div className="text-5xl mb-3">📈</div>
              <p className="text-sm font-semibold">Aucune donnée de croissance</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Companies */}
      <div className="bg-gradient-to-br from-white to-indigo-50 p-7 rounded-2xl shadow-xl border-2 border-indigo-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-2 rounded-lg">
                <span className="text-2xl">🏢</span>
              </div>
              <h2 className="text-2xl font-black text-gray-900">Entreprises Récentes</h2>
            </div>
            <p className="text-sm text-gray-600 ml-12 font-medium">Derniers clients ajoutés à la plateforme</p>
          </div>
          <Link href="/super-admin/companies" className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-sm font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
            Voir Tout →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-xl border-2 border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Utilisateurs</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Trajets</th>
                <th className="px-6 py-4 text-left text-xs font-black text-gray-700 uppercase tracking-wider">Inscription</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dashboard?.recentCompanies?.map((company: any) => (
                <tr key={company.id} className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-indigo-50 transition-all duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
                        {company.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900">{company.name}</div>
                        <div className="text-xs text-gray-500 font-medium">{company.contact || 'Aucun contact'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-indigo-700 bg-indigo-100 px-3 py-1 rounded-lg inline-block border border-indigo-200">
                      {company.plan?.name || 'Aucun Plan'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={company.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-black text-gray-900 bg-blue-100 px-3 py-1 rounded-lg inline-block border border-blue-200">
                      {company._count?.users || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-black text-gray-900 bg-orange-100 px-3 py-1 rounded-lg inline-block border border-orange-200">
                      {company._count?.trips || 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700 font-semibold">{new Date(company.createdAt).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function KPICard({ title, value, icon, color, subtitle, link, trend }: any) {
  const colorClasses = {
    blue: {
      bg: 'bg-gradient-to-br from-blue-100 via-blue-50 to-white',
      border: 'border-blue-300',
      text: 'text-blue-700',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: 'text-blue-700 bg-blue-50',
      shadow: 'hover:shadow-blue-200',
      glow: 'hover:ring-4 hover:ring-blue-200'
    },
    green: {
      bg: 'bg-gradient-to-br from-green-100 via-green-50 to-white',
      border: 'border-green-300',
      text: 'text-green-700',
      icon: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: 'text-green-700 bg-green-50',
      shadow: 'hover:shadow-green-200',
      glow: 'hover:ring-4 hover:ring-green-200'
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-100 via-purple-50 to-white',
      border: 'border-purple-300',
      text: 'text-purple-700',
      icon: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: 'text-purple-700 bg-purple-50',
      shadow: 'hover:shadow-purple-200',
      glow: 'hover:ring-4 hover:ring-purple-200'
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-100 via-orange-50 to-white',
      border: 'border-orange-300',
      text: 'text-orange-700',
      icon: 'bg-gradient-to-br from-orange-500 to-orange-600',
      trend: 'text-orange-700 bg-orange-50',
      shadow: 'hover:shadow-orange-200',
      glow: 'hover:ring-4 hover:ring-orange-200'
    },
    red: {
      bg: 'bg-gradient-to-br from-red-100 via-red-50 to-white',
      border: 'border-red-300',
      text: 'text-red-700',
      icon: 'bg-gradient-to-br from-red-500 to-red-600',
      trend: 'text-red-700 bg-red-50',
      shadow: 'hover:shadow-red-200',
      glow: 'hover:ring-4 hover:ring-red-200'
    },
  }

  const colors = colorClasses[color as keyof typeof colorClasses]

  const content = (
    <div className={`${colors.bg} border-2 ${colors.border} rounded-2xl p-6 hover:shadow-2xl ${colors.shadow} transition-all duration-300 hover:-translate-y-1 ${colors.glow} ${link ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.icon} p-3 rounded-xl shadow-lg transform hover:scale-110 transition-transform duration-300`}>
          <span className="text-3xl">{icon}</span>
        </div>
        {trend && (
          <span className={`${colors.trend} text-xs font-black px-3 py-1.5 rounded-full border-2 ${colors.border}`}>
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-xs font-black text-gray-600 uppercase tracking-wider mb-2">{title}</p>
        <p className={`text-4xl font-black ${colors.text} mb-2`}>{value || 0}</p>
        {subtitle && (
          <p className="text-xs text-gray-600 font-bold">{subtitle}</p>
        )}
      </div>
    </div>
  )

  if (link) {
    return <Link href={link}>{content}</Link>
  }

  return content
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    ACTIVE: { 
      label: 'Actif', 
      className: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-2 border-green-300 shadow-md',
      icon: '✓'
    },
    TRIAL: { 
      label: 'Essai', 
      className: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border-2 border-blue-300 shadow-md',
      icon: '⏰'
    },
    SUSPENDED: { 
      label: 'Suspendu', 
      className: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-2 border-red-300 shadow-md',
      icon: '⚠'
    },
    EXPIRED: { 
      label: 'Expiré', 
      className: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-300 shadow-md',
      icon: '⌛'
    },
    CANCELED: { 
      label: 'Annulé', 
      className: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-300 shadow-md',
      icon: '✗'
    },
  }

  const config = statusConfig[status] || { 
    label: status, 
    className: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-2 border-gray-300 shadow-md',
    icon: '•'
  }

  return (
    <span className={`px-4 py-2 inline-flex items-center gap-2 text-xs font-black rounded-xl ${config.className}`}>
      <span className="text-sm">{config.icon}</span>
      {config.label}
    </span>
  )
}
