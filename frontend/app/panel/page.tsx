"use client"
import React from 'react'
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { DollarSign, TrendingUp, Car, CheckSquare, Fuel, Activity } from 'lucide-react'
import { useDashboard } from '../../lib/hooks'

export const dynamic = 'force-dynamic'

export default function DashboardPage() {
    const { data, isLoading, error } = useDashboard()

    if (isLoading) return <div className="p-8 text-center animate-pulse py-20 text-slate-400 font-bold">Chargement de votre espace...</div>
    if (error) return (
        <div className="p-8 text-center text-red-500 bg-red-50 rounded-[2.5rem] m-4 border border-red-100">
            <p className="font-black text-lg mb-2">Une erreur est survenue</p>
            <p className="text-sm mt-2 font-medium">{(error as any)?.message || 'Erreur inconnue'}</p>
        </div>
    )
    if (!data) return <div className="p-8 text-center py-20 text-slate-400">Aucune donnée disponible</div>

    const fleet = data?.fleet ?? { total: 0, active: 0, maintenance: 0, available: 0 }
    const fuel = data?.fuel?._sum ?? { amountTTC: 0, quantity: 0, distance: 0 }
    const recentTrips = data?.recentTrips ?? []
    const driverStats = data?.driverActivity?.driverStats ?? []
    const monthlyRevenue = data?.monthlyRevenue ?? []

    return (
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 p-2 md:p-6 animation-fade-in">

            {/* LEFT AREA: Stats & Main Activity (9 Columns) */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-8">

                {/* Top Row: KPIs in small Bento cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                    <BentoKPI label="Revenu" amount={data.totalRevenue} sub="Chiffre d'affaires" color="bg-[#6366f1]" />
                    <BentoKPI label="Dépenses" amount={data.totalCharges} sub="Total charges" color="bg-[#f97316]" />
                    <BentoKPI label="Carburant" amount={fuel.amountTTC || 0} sub={`${(fuel.quantity || 0).toLocaleString()} L consommés`} color="bg-[#10b981]" />
                </div>

                {/* Middle Row: Operational charts & Lists */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Evolution Chart Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 border border-slate-100/50 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-[#1e293b]">Évolution Financière</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Revenus mensuels</p>
                            </div>
                            <div className="p-3 bg-indigo-50 rounded-2xl">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyRevenue}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }} dy={10} />
                                    <YAxis hide />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 50px rgba(0,0,0,0.1)', padding: '15px' }}
                                        itemStyle={{ fontWeight: 800, color: '#1e293b' }}
                                    />
                                    <Line type="monotone" dataKey="total" stroke="#6366f1" strokeWidth={6} dot={{ r: 0 }} activeDot={{ r: 8, strokeWidth: 4, stroke: '#fff' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Operational Feed Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-8 border border-slate-100/50 flex flex-col h-[400px]">
                        <div className="flex justify-between items-center mb-10">
                            <div>
                                <h3 className="text-xl font-black text-[#1e293b]">Missions Récentes</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Dernières activités</p>
                            </div>
                            <button className="text-[10px] font-black text-orange-600 bg-orange-50 px-4 py-2 rounded-full hover:bg-orange-100 transition-all uppercase tracking-widest">Voir tout</button>
                        </div>
                        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-2">
                            {recentTrips.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center opacity-30">
                                    <Activity className="w-12 h-12 mb-2" />
                                    <p className="text-xs font-bold uppercase tracking-widest">Aucune mission</p>
                                </div>
                            ) : recentTrips.slice(0, 5).map((trip: any) => (
                                <div key={trip.id} className="flex items-center gap-5 group">
                                    <div className="w-1.5 h-12 rounded-full bg-slate-100 group-hover:bg-indigo-500 transition-all"></div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-black text-sm text-slate-800 truncate">{trip.clientName || 'Client'}</div>
                                        <div className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight">{trip.startLocation} → {trip.endLocation}</div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-black text-slate-900">{(trip.amount || 0).toLocaleString()} MAD</div>
                                        <div className={`text-[9px] uppercase font-black px-2 py-0.5 rounded-full ${trip.status === 'DONE' ? 'text-emerald-600 bg-emerald-50' :
                                                trip.status === 'PENDING' ? 'text-amber-600 bg-amber-50' :
                                                    'text-blue-600 bg-blue-50'
                                            }`}>
                                            {trip.status}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Full Width List */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.02)] p-10 border border-slate-100/50">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-[#1e293b]">Gestion de Flotte</h3>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-[3px] mt-1">Historique des trajets</p>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-2xl flex gap-1">
                            <div className="px-4 py-2 bg-white rounded-xl shadow-sm text-xs font-black text-indigo-600 cursor-pointer">Tous</div>
                            <div className="px-4 py-2 hover:bg-white rounded-xl text-xs font-bold text-slate-400 cursor-pointer transition-all">Terminés</div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[10px] font-black text-slate-400 uppercase tracking-[3px]">
                                <tr>
                                    <th className="pb-6 px-4">Client / Destination</th>
                                    <th className="pb-6 px-4">Chauffeur</th>
                                    <th className="pb-6 px-4">Véhicule</th>
                                    <th className="pb-6 px-4 text-right">Montant</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {recentTrips.slice(0, 8).map((trip: any) => (
                                    <tr key={trip.id} className="hover:bg-slate-50/80 transition-all cursor-pointer group">
                                        <td className="py-6 px-4">
                                            <div className="font-black text-slate-800 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{trip.clientName || 'Client'}</div>
                                            <div className="text-[10px] font-bold text-slate-400 mt-0.5">{trip.startLocation}</div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-[10px] font-black text-indigo-600">
                                                    {trip.driver?.name?.charAt(0) || 'D'}
                                                </div>
                                                <span className="text-xs font-bold text-slate-600">{trip.driver?.name || '—'}</span>
                                            </div>
                                        </td>
                                        <td className="py-6 px-4">
                                            <div className="text-[10px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                                                {trip.vehicle?.immatriculation || '—'}
                                            </div>
                                        </td>
                                        <td className="py-6 px-4 text-right">
                                            <div className="text-base font-black text-slate-900">{(trip.amount || 0).toLocaleString()} <span className="text-[10px] opacity-40 font-normal">MAD</span></div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* RIGHT SIDEBAR Area (3 Columns) mirroring the reference image's card */}
            <div className="lg:col-span-4 xl:col-span-3 space-y-8">

                {/* Profile/Summary Card (Mirror of reference right card) */}
                <div className="bg-white rounded-[2.5rem] shadow-[0_15px_50px_rgba(0,0,0,0.03)] p-10 border border-slate-100 flex flex-col items-center text-center sticky top-24">
                    <div className="relative mb-8">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-slate-50 p-1 border-2 border-orange-500/20 overflow-hidden shadow-inner">
                            <img
                                src={data.companyProfile?.logo || "https://api.dicebear.com/7.x/shapes/svg?seed=Arwa"}
                                alt="Logo"
                                className="w-full h-full object-contain p-2"
                            />
                        </div>
                        <div className="absolute bottom-[-10px] right-[-10px] bg-emerald-500 w-8 h-8 rounded-2xl border-4 border-white flex items-center justify-center text-white text-xs font-black shadow-lg">✓</div>
                    </div>

                    <h2 className="text-2xl font-black text-[#1e293b] mb-1">{data.companyProfile?.name || "ArwaPark"}</h2>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-[4px] mb-10">Premium Management</p>

                    <div className="w-full space-y-8">
                        <ProfileStat label="Fondé le" value="28 Jan 2024" icon="📅" color="bg-orange-50" />
                        <ProfileStat label="Flotte" value={`${fleet.total} Véhicules`} icon="🚚" color="bg-indigo-50" />
                        <ProfileStat label="Type" value="SaaS Corporate" icon="🏢" color="bg-emerald-50" />
                    </div>

                    <div className="w-full mt-10 pt-10 border-t border-slate-50">
                        <h4 className="text-left text-[10px] font-black text-slate-400 mb-6 uppercase tracking-widest">Statut du Compte</h4>
                        <div className="bg-slate-50 rounded-[2rem] p-6 text-left">
                            <p className="text-xs text-slate-600 leading-relaxed font-bold italic">
                                "Profil administrateur actif. Tous les services de gestion de parc sont opérationnels pour la société."
                            </p>
                        </div>
                    </div>

                    {/* Dark Card at bottom like reference */}
                    <div className="w-full mt-8 p-8 bg-[#1e293b] rounded-[2.5rem] text-left text-white shadow-2xl shadow-slate-900/20 overflow-hidden relative group cursor-pointer hover:scale-[1.02] transition-all">
                        <div className="relative z-10 space-y-1">
                            <h5 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Performance</h5>
                            <div className="text-3xl font-black">{fleet.total > 0 ? Math.round((fleet.active / fleet.total) * 100) : 0}%</div>
                            <p className="text-[10px] font-bold text-slate-400 mt-2">Disponibilité temps réel</p>
                        </div>
                        <Activity className="absolute bottom-[-15px] right-[-15px] w-24 h-24 text-white opacity-[0.03] group-hover:rotate-12 transition-transform duration-700" />
                    </div>
                </div>

            </div>

        </div>
    )
}

function BentoKPI({ label, amount, sub, color }: any) {
    return (
        <div className="bg-white rounded-[2.5rem] shadow-[0_4px_25px_rgba(0,0,0,0.02)] p-10 border border-slate-100 flex flex-col justify-between hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 group relative overflow-hidden">
            <div className={`w-14 h-14 ${color} rounded-2xl mb-10 flex items-center justify-center text-white shadow-2xl shadow-current/20 group-hover:scale-110 transition-transform duration-500`}>
                <DollarSign className="w-7 h-7" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[3px] mb-2">{label}</p>
                <h4 className="text-3xl font-black text-slate-900 mb-3 tracking-tighter">{(amount || 0).toLocaleString()} <span className="text-xs font-normal text-slate-400 ml-1">MAD</span></h4>
                <div className="text-[9px] font-black text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full w-fit group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 uppercase tracking-wider shadow-sm">
                    {sub}
                </div>
            </div>
            <div className={`absolute top-0 right-0 w-32 h-32 ${color} opacity-[0.02] translate-x-10 -translate-y-10 rounded-full group-hover:scale-150 transition-transform duration-1000`}></div>
        </div>
    )
}

function ProfileStat({ label, value, icon, color }: any) {
    return (
        <div className="flex items-center gap-5 text-left group">
            <div className={`w-12 h-12 rounded-[1.2rem] ${color} flex items-center justify-center text-xl shadow-sm group-hover:scale-110 transition-transform`}>{icon}</div>
            <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</div>
                <div className="text-sm font-black text-slate-700 leading-tight mt-0.5">{value}</div>
            </div>
        </div>
    )
}
