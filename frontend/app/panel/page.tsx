"use client"
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Card from '../../components/Card'
import { DollarSign, Wallet, TrendingUp, AlertTriangle, FileText, Car, Wrench, BookOpen, Tag, Shield, MapPin, Compass, Flame, CheckSquare, Globe, XCircle, Calendar, Fuel, Droplet, Activity, Clock } from 'lucide-react'
import { useDashboard } from '../../lib/hooks'

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboard()

    if (isLoading) return <div className="p-8 text-center animate-pulse">Chargement des données...</div>
    // Safely handle error rendering
    if (error) return (
        <div className="p-8 text-center text-red-500">
            <p className="font-bold">Une erreur est survenue lors du chargement.</p>
            <p className="text-sm">{(error as any)?.message || 'Erreur inconnue'}</p>
        </div>
    )
    if (!data) return <div className="p-8 text-center">Aucune donnée disponible</div>

    // Data Extraction with Safe Defaults
    const fleet = data?.fleet ?? { total: 0, active: 0, maintenance: 0, available: 0 }
    const fuel = data?.fuel?._sum ?? { amountTTC: 0, quantity: 0, distance: 0 }

    // Alert items 
    const alertItems = [
        // Administratif
        { label: 'Cartes grises (Exp)', count: 0, icon: FileText, type: 'admin' },
        { label: 'Visites techniques', count: 0, icon: Wrench, type: 'admin' },
        { label: 'Assurances', count: 0, icon: Shield, type: 'admin' },
        { label: 'Vignettes', count: 0, icon: Tag, type: 'admin' },
        // Operations
        { label: 'Maintenance Retard', count: 0, icon: AlertTriangle, type: 'ops' },
        { label: 'Trajets en Cours', count: 0, icon: Activity, type: 'ops' },
        // Consommation
        { label: 'Surconsommation', count: 0, icon: Fuel, type: 'fuel' },
        { label: 'Anomalies Cartes', count: 0, icon: CreditCardIcon, type: 'fuel' },
    ]

    // Helper for generic generic icons
    function CreditCardIcon(props: any) { return <Wallet {...props} /> }

    const getAlertColor = (index: number) => {
        // ... existing color logic ...
        const colors = [
            { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300' },
            { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300' },
            { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300' },
        ]
        return colors[index % colors.length]
    }

    // Safe chart data
    const monthlyRevenue = data?.monthlyRevenue ?? []
    const monthlyCharges = data?.monthlyCharges ?? []
    const driverStats = data?.driverActivity?.driverStats ?? []

    const profitData = monthlyCharges.map((c: any, i: number) => {
        const revenue = monthlyRevenue[i]?.total || 0
        return {
            month: c.month,
            total: revenue - (c.total || 0)
        }
    })

    return (
        <div className="max-w-7xl mx-auto space-y-4 pb-0">

            {/* 1. Fleet Statistics Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <StatCard label="Total Flotte" count={fleet.total} icon={Car} color="bg-blue-500" />
                <StatCard label="Véhicules Actifs" count={fleet.active} icon={Activity} color="bg-green-500" />
                <StatCard label="En Maintenance" count={fleet.maintenance} icon={Wrench} color="bg-orange-500" />
                <StatCard label="Disponibles" count={fleet.available} icon={CheckSquare} color="bg-purple-500" />
            </div>

            {/* 2. Financial & Fuel Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card title="Chiffre d'Affaires" amount={data?.totalRevenue ?? 0} icon="💰" />
                <Card title="Dépenses Totales" amount={data?.totalCharges ?? 0} icon="💳" />
                {/* Fuel Specific Card */}
                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                            <Fuel className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                        </div>
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Carburant</h3>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-500">Coût</span>
                            <span className="text-xl font-black text-gray-800 dark:text-white">{(fuel.amountTTC ?? 0).toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between items-end">
                            <span className="text-sm text-gray-500">Volume</span>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{(fuel.quantity ?? 0).toLocaleString()} L</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Main Content: Alerts & Driver Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {/* Left: Combined Alerts (Admin + Ops + Consumption) */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="font-bold text-gray-800 dark:text-white">Centre d'Alertes</h3>
                    </div>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                        {alertItems.map((item, idx) => {
                            const style = getAlertColor(idx)
                            const Icon = item.icon
                            return (
                                <div key={idx} className={`flex items-center justify-between p-2 rounded-lg border ${style.bg} ${style.border}`}>
                                    <div className="flex items-center gap-3">
                                        <div className="bg-white dark:bg-gray-700 p-1.5 rounded-md shadow-sm">
                                            <Icon className={`w-4 h-4 ${style.text}`} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{item.label}</p>
                                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{item.type}</p>
                                        </div>
                                    </div>
                                    <span className={`text-sm font-black ${style.text}`}>{item.count}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Center/Right: Charts & Drivers - Taking 2 cols */}
                <div className="lg:col-span-2 space-y-3">
                    {/* Driver Stats */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                <Car className="w-5 h-5 text-purple-500" />
                                Performance Chauffeurs
                            </h3>
                            <span className="text-xs font-mono bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">Top 5</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* List */}
                            <div className="space-y-2">
                                {driverStats.slice(0, 5).map((d: any, i: number) => (
                                    <div key={i} className="flex items-center justify-between text-sm p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded transition-colors">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-700 dark:text-purple-300">
                                                {i + 1}
                                            </div>
                                            <span className="font-medium">{d.driverName}</span>
                                        </div>
                                        <span className="font-bold text-gray-700 dark:text-gray-300">{d.tripCount} trajets</span>
                                    </div>
                                ))}
                                {driverStats.length === 0 && <p className="text-sm text-gray-400 italic">Aucune donnée chauffeur.</p>}
                            </div>
                            {/* Chart (Simplified) */}
                            <div className="h-40 hidden sm:block">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyRevenue}>
                                        <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={2} dot={false} />
                                        <Tooltip />
                                    </LineChart>
                                </ResponsiveContainer>
                                <p className="text-center text-xs text-gray-400 mt-1">Évolution Revenus</p>
                            </div>
                        </div>
                    </div>

                    {/* Revenue Chart */}
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <h3 className="font-bold text-gray-800 dark:text-white mb-2 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-teal-500" />
                            Évolution Financière
                        </h3>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="total" stroke="#0d9488" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
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
