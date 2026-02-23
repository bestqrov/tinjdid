"use client"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/Card'
import { DollarSign, Wallet, TrendingUp, AlertTriangle, FileText, Car, Wrench, BookOpen, Tag, Shield, MapPin, Compass, Flame, CheckSquare, Globe, XCircle, Calendar } from 'lucide-react'
import { useDashboard } from '../../lib/hooks'

export default function DashboardPage() {
  const { data, isLoading, error } = useDashboard()

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div className="text-red-500">Erreur: {error.message}</div>
  if (!data) return <div>Aucune donnée disponible</div>

  // Alert items for administrative documents
  const alertItems = [
    { label: 'Cartes grises', count: 0, icon: FileText },
    { label: 'Visites techniques', count: 0, icon: Wrench },
    { label: 'Carnets métrologiques', count: 0, icon: BookOpen },
    { label: 'Vignettes', count: 0, icon: Tag },
    { label: 'Assurances', count: 0, icon: Shield },
    { label: 'Taxes', count: 0, icon: DollarSign },
    { label: 'Autorisations de circulation', count: 0, icon: MapPin },
    { label: 'Permis de circulation', count: 0, icon: Compass },
    { label: 'Extincteurs', count: 0, icon: Flame },
    { label: 'Agréments', count: 0, icon: CheckSquare },
    { label: 'Assurances Internationales', count: 0, icon: Globe },
    { label: 'Réforme', count: 0, icon: XCircle },
    { label: 'Fin mise en circulation', count: 0, icon: Calendar },
  ]

  // Alert color categories
  const getAlertColor = (index: number) => {
    const colors = [
      { bg: 'bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20', 
        border: 'border-blue-300 dark:border-blue-600', 
        icon: 'text-blue-600 dark:text-blue-400',
        count: 'text-blue-700 dark:text-blue-300',
        hover: 'hover:shadow-blue-200 dark:hover:shadow-blue-900/50 hover:border-blue-400 dark:hover:border-blue-500'
      },
      { bg: 'bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20', 
        border: 'border-purple-300 dark:border-purple-600', 
        icon: 'text-purple-600 dark:text-purple-400',
        count: 'text-purple-700 dark:text-purple-300',
        hover: 'hover:shadow-purple-200 dark:hover:shadow-purple-900/50 hover:border-purple-400 dark:hover:border-purple-500'
      },
      { bg: 'bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20', 
        border: 'border-green-300 dark:border-green-600', 
        icon: 'text-green-600 dark:text-green-400',
        count: 'text-green-700 dark:text-green-300',
        hover: 'hover:shadow-green-200 dark:hover:shadow-green-900/50 hover:border-green-400 dark:hover:border-green-500'
      },
      { bg: 'bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/30 dark:to-orange-800/20', 
        border: 'border-orange-300 dark:border-orange-600', 
        icon: 'text-orange-600 dark:text-orange-400',
        count: 'text-orange-700 dark:text-orange-300',
        hover: 'hover:shadow-orange-200 dark:hover:shadow-orange-900/50 hover:border-orange-400 dark:hover:border-orange-500'
      },
      { bg: 'bg-gradient-to-br from-red-100 to-red-50 dark:from-red-900/30 dark:to-red-800/20', 
        border: 'border-red-300 dark:border-red-600', 
        icon: 'text-red-600 dark:text-red-400',
        count: 'text-red-700 dark:text-red-300',
        hover: 'hover:shadow-red-200 dark:hover:shadow-red-900/50 hover:border-red-400 dark:hover:border-red-500'
      },
      { bg: 'bg-gradient-to-br from-teal-100 to-teal-50 dark:from-teal-900/30 dark:to-teal-800/20', 
        border: 'border-teal-300 dark:border-teal-600', 
        icon: 'text-teal-600 dark:text-teal-400',
        count: 'text-teal-700 dark:text-teal-300',
        hover: 'hover:shadow-teal-200 dark:hover:shadow-teal-900/50 hover:border-teal-400 dark:hover:border-teal-500'
      },
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="max-w-7xl mx-auto space-y-3 pb-0">
      {/* Top KPI Cards - More compact */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Card title="Total Revenue" amount={data.totalRevenue} icon="💰" />
        <Card title="Total Charges" amount={data.totalCharges} icon="💳" />
        <Card title="Total Profit" amount={data.totalProfit} icon="📈" />
      </div>

      {/* Main Content Grid - Side by side layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Left Column - Alertes Administratifs */}
        <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-md border border-orange-200 dark:border-orange-900/50 p-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1.5 rounded-lg shadow-md">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-base font-black text-gray-800 dark:text-white">Alertes Administratifs</h2>
                <p className="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Documents et échéances</p>
              </div>
            </div>
            <div className="bg-orange-100 dark:bg-orange-900/30 px-2.5 py-1 rounded-full border border-orange-300 dark:border-orange-700">
              <span className="text-lg font-black text-orange-600 dark:text-orange-400">0</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1">
            {alertItems.map((item, index) => {
              const Icon = item.icon
              const colors = getAlertColor(index)
              return (
                <div
                  key={index}
                  className={`${colors.bg} rounded-md p-2 border ${colors.border} ${colors.hover} transition-all duration-200 hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-start gap-1.5">
                    <div className="bg-white/80 dark:bg-gray-800/80 p-1 rounded shadow-sm flex-shrink-0">
                      <Icon className={`w-3.5 h-3.5 ${colors.icon}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300 line-clamp-2 leading-tight">{item.label}</p>
                      <p className={`text-base font-black ${colors.count} mt-0.5`}>{item.count}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right Column - Charts and Driver Activity */}
        <div className="space-y-3">
          {/* Driver Activity Analytics */}
          <div className="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 p-3 rounded-lg shadow-md border border-purple-200 dark:border-purple-900/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-1 rounded-md">
                <Car className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-black text-gray-800 dark:text-white">Driver Activity</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Total Drivers</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{data?.driverActivity?.totalDrivers ?? 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600 dark:text-gray-400">Active Drivers</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">{data?.driverActivity?.activeDrivers ?? 0}</span>
              </div>
              <div className="mt-3">
                <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Top Drivers by Trips</h4>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {data?.driverActivity?.driverStats?.slice(0, 5).map((driver: any, index: number) => (
                    <div key={index} className="flex justify-between items-center text-xs">
                      <span className="truncate mr-2">{driver?.driverName || 'Unknown'}</span>
                      <span className="font-semibold text-purple-600 dark:text-purple-400">{driver?.tripCount ?? 0} trips</span>
                    </div>
                  )) ?? <div className="text-xs text-gray-500">No driver data available</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Revenue per Month Chart - Compact */}
          <div className="bg-gradient-to-br from-white to-teal-50 dark:from-gray-800 dark:to-teal-900/20 p-3 rounded-lg shadow-md border border-teal-200 dark:border-teal-900/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 p-1 rounded-md">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-black text-gray-800 dark:text-white">Revenue per Month</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer>
                <LineChart data={data.monthlyRevenue}>
                  <Line type="monotone" dataKey="total" stroke="#0ea5a4" strokeWidth={2} dot={{ r: 3, fill: '#0ea5a4' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:opacity-20" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666" 
                    style={{ fontSize: '9px', fontWeight: '600' }}
                    className="dark:text-gray-400"
                  />
                  <YAxis 
                    stroke="#666" 
                    style={{ fontSize: '9px', fontWeight: '600' }}
                    className="dark:text-gray-400"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #0ea5a4', 
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Profit per Month Chart - Compact */}
          <div className="bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-900/20 p-3 rounded-lg shadow-md border border-orange-200 dark:border-orange-900/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-1 rounded-md">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-sm font-black text-gray-800 dark:text-white">Profit per Month</h3>
            </div>
            <div className="h-40">
              <ResponsiveContainer>
                <LineChart data={data.monthlyCharges.map((c:any, i:number) => ({ month: c.month, total: (data.monthlyRevenue[i]?.total || 0) - c.total }))}>
                  <Line type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" className="dark:opacity-20" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#666" 
                    style={{ fontSize: '9px', fontWeight: '600' }}
                    className="dark:text-gray-400"
                  />
                  <YAxis 
                    stroke="#666" 
                    className="dark:text-gray-400"
                  />
                  <YAxis 
                    stroke="#666" 
                    style={{ fontSize: '9px', fontWeight: '600' }}
                    className="dark:text-gray-400"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      border: '2px solid #f97316', 
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600'
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
