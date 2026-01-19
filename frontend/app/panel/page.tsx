"use client"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/Card'
import { DollarSign, Wallet, TrendingUp, AlertTriangle, FileText, Car, Wrench, BookOpen, Tag, Shield, MapPin, Compass, Flame, CheckSquare, Globe, XCircle, Calendar, Fuel, Droplet, Activity, Clock } from 'lucide-react'
import { useDashboard } from '../../lib/hooks'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboard()

    if (isLoading) return <div className="p-8 text-center animate-pulse">Chargement des données...</div>
    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-4 border border-red-200">
            <p className="font-bold text-lg mb-2">Une erreur est survenue</p>
            <p className="text-sm mt-2">{(error as any)?.message || 'Erreur inconnue'}</p>
        </div>
    )
    if (!data) return <div className="p-8 text-center">Aucune donnée disponible</div>

    // Data Extraction
    const fleet = data?.fleet ?? { total: 0, active: 0, maintenance: 0, available: 0 }
    const fuel = data?.fuel?._sum ?? { amountTTC: 0, quantity: 0, distance: 0 }
    const recentTrips = data?.recentTrips ?? []
    const driverStats = data?.driverActivity?.driverStats ?? []
    const monthlyRevenue = data?.monthlyRevenue ?? []

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-8">

            {/* 1. High Impact KPI Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard label="Revenu Total" amount={data.totalRevenue} icon={<DollarSign />} color="indigo" />
                <KPICard label="Bénéfice Net" amount={data.totalProfit} icon={<TrendingUp />} color="emerald" />
                <KPICard label="Dépenses Carburant" amount={fuel.amountTTC || 0} icon={<Fuel />} color="amber" />
                <KPICard label="Missions Effectuées" count={data.tripsByStatus?.find((s: any) => s.status === 'DONE')?._count?.status || 0} icon={<CheckSquare />} color="blue" />
            </div>

            {/* 2. Middle Row: Fleet Status & Finances */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Fleet Overview (4 cols) */}
                <div className="lg:col-span-4 space-y-4">
                    <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                            <Car className="w-5 h-5 text-blue-500" />
                            État de la Flotte
                        </h3>
                        <div className="space-y-3">
                            <StatusRow label="En service" count={fleet.active} total={fleet.total} color="bg-green-500" />
                            <StatusRow label="En maintenance" count={fleet.maintenance} total={fleet.total} color="bg-orange-500" />
                            <StatusRow label="Disponibles" count={fleet.available} total={fleet.total} color="bg-blue-400" />
                            <div className="pt-2 border-t dark:border-gray-700 flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-500">Total Véhicules</span>
                                <span className="text-xl font-black text-gray-800 dark:text-white">{fleet.total}</span>
                            </div>
                        </div>
                    </div>

                    {/* Quick Stats Mini-Card */}
                    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-5 rounded-2xl shadow-lg text-white">
                        <h4 className="text-indigo-100 text-xs font-bold uppercase tracking-widest mb-1">Rendement Flotte</h4>
                        <div className="text-3xl font-black mb-2">{fleet.total > 0 ? Math.round((fleet.active / fleet.total) * 100) : 0}%</div>
                        <div className="w-full bg-white/20 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-white h-full" style={{ width: `${fleet.total > 0 ? (fleet.active / fleet.total) * 100 : 0}%` }}></div>
                        </div>
                        <p className="mt-3 text-[10px] text-indigo-100 opacity-80 italic">Calculé sur les véhicules actifs vs total</p>
                    </div>
                </div>

                {/* Operations Feed - REPLACING ALERTS (8 cols) */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 h-full flex flex-col">
                        <div className="p-5 border-b dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Activity className="w-5 h-5 text-emerald-500" />
                                Commandes Récentes
                            </h3>
                            <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">Voir tout</button>
                        </div>
                        <div className="flex-1 overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-gray-900/50 text-[10px] uppercase tracking-wider text-gray-500 font-bold">
                                        <th className="px-6 py-3">Client / Trajet</th>
                                        <th className="px-4 py-3">Chauffeur</th>
                                        <th className="px-4 py-3">Véhicule</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Montant</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y dark:divide-gray-700">
                                    {recentTrips.length === 0 ? (
                                        <tr><td colSpan={5} className="py-10 text-center text-gray-400 italic text-sm">Aucun trajet récent trouvé.</td></tr>
                                    ) : recentTrips.map((trip: any) => (
                                        <tr key={trip.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-sm text-gray-800 dark:text-gray-200">{trip.clientName || 'Client Inconnu'}</div>
                                                <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{trip.startLocation} → {trip.endLocation}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                                                        {trip.driver?.name?.charAt(0) || 'D'}
                                                    </div>
                                                    <span className="text-xs font-medium dark:text-gray-300">{trip.driver?.name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 text-xs dark:text-gray-400 font-mono">
                                                {trip.vehicle?.immatriculation || '—'}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${trip.status === 'DONE' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                                        trip.status === 'PENDING' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 text-right font-black text-sm text-gray-800 dark:text-white">
                                                {(trip.amount || trip.price || 0).toLocaleString()} <span className="text-[10px] font-normal opacity-60">MAD</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Bottom Row: Activity Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Financial Performance Chart */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Évolution Financière
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyRevenue}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b' }} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    cursor={{ stroke: '#6366f1', strokeWidth: 2 }}
                                />
                                <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={4} dot={{ r: 4, fill: '#6366f1' }} activeDot={{ r: 8, stroke: '#fff', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Driver Performance Table (Top 5) */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-bold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
                        <Car className="w-5 h-5 text-purple-500" />
                        Performance des Chauffeurs
                    </h3>
                    <div className="space-y-4">
                        {driverStats.slice(0, 5).map((d: any, i: number) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="text-sm font-black text-gray-300 w-4">#{i + 1}</div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{d.driverName}</span>
                                        <span className="text-xs font-medium text-gray-500">{d.tripCount} missions</span>
                                    </div>
                                    <div className="w-full bg-gray-100 dark:bg-gray-700 h-2 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-purple-500"
                                            style={{ width: `${Math.min(100, (d.tripCount / (driverStats[0]?.tripCount || 1)) * 100)}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {driverStats.length === 0 && <p className="text-center py-10 text-gray-400 italic text-sm">Aucune donnée chauffeur.</p>}
                    </div>
                </div>

            </div>

        </div>
    )
}

// Custom KPI Card
function KPICard({ label, amount, count, icon, color }: any) {
    const colors: any = {
        indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-200 dark:shadow-none',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-200 dark:shadow-none',
        amber: 'from-amber-500 to-amber-600 shadow-amber-200 dark:shadow-none',
        blue: 'from-blue-500 to-blue-600 shadow-blue-200 dark:shadow-none',
    }
    return (
        <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-xl bg-gradient-to-br ${colors[color]} text-white shadow-lg`}>
                    {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
                </div>
            </div>
            <div>
                <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                <div className="text-2xl font-black text-gray-800 dark:text-white">
                    {amount !== undefined ? `${amount.toLocaleString()} MAD` : count}
                </div>
            </div>
        </div>
    )
}

// Status Row for Fleet
function StatusRow({ label, count, total, color }: any) {
    const percentage = total > 0 ? (count / total) * 100 : 0
    return (
        <div>
            <div className="flex justify-between items-center text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400 font-medium">{label}</span>
                <span className="font-bold text-gray-800 dark:text-white">{count} ({Math.round(percentage)}%)</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${color}`} style={{ width: `${percentage}%` }}></div>
            </div>
        </div>
    )
}

// Simple Stat Card Component
function StatCard({ label, count, icon: Icon, color }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-3 transition-transform hover:-translate-y-1 duration-300">
            <div className={`p-2.5 rounded-lg ${color} bg-opacity-10`}>
                <Icon className={`w-5 h-5 ${color.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-xs text-gray-500 font-medium">{label}</p>
                <p className="text-lg font-black text-gray-800 dark:text-white">{count}</p>
            </div>
        </div>
    )
}
