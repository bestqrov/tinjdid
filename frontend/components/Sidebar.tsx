import Link from 'next/link'
import { useAuth } from '../lib/auth'
import { useState } from 'react'

export default function Sidebar() {
  const { user } = useAuth()

  const role = user?.role || 'STAFF'
  const isSuperAdmin = role === 'SUPERADMIN'

  const show = {
    dashboard: role === 'ADMIN',
    dashboardStaff: role === 'STAFF',
    overview: role === 'ADMIN' || role === 'STAFF',
    trips: role === 'ADMIN' || role === 'STAFF' || role === 'DRIVER',
    quotes: role === 'ADMIN' || role === 'STAFF',
    invoices: role === 'ADMIN' || role === 'STAFF',
    charges: role === 'ADMIN' || role === 'STAFF',
    contracts: role === 'ADMIN' || role === 'STAFF',
    drivers: role === 'ADMIN' || role === 'STAFF',
    vehicles: role === 'ADMIN' || role === 'STAFF',
    settings: role === 'ADMIN' || role === 'DRIVER',
  }

  const menuGroups = [
    {
      title: 'MENU PRINCIPAL',
      items: [
        { href: '/panel', label: 'Tableau de Bord', icon: '🏠', show: show.dashboard || role === 'STAFF' },
        { href: '/overview', label: 'Vue d\'ensemble', icon: '📊', show: show.overview },
        { href: '/dashboard-staff', label: 'Tableau Secrétaire', icon: '💼', show: show.dashboardStaff },
      ],
    },
    {
      title: 'OPÉRATIONS',
      items: [
        { href: '/trips', label: 'Trajets', icon: '📅', show: show.trips },
        { href: '/drivers', label: 'Chauffeurs', icon: '👥', show: show.drivers },
        { href: '/vehicles', label: 'Véhicules', icon: '🚚', show: show.vehicles },
        { href: '/contracts', label: 'Contrats', icon: '📜', show: show.contracts },
      ],
    },
    {
      title: 'COMMERCIAL',
      items: [
        { href: '/quotes', label: 'Devis', icon: '📝', show: show.quotes },
        { href: '/invoices', label: 'Factures', icon: '📄', show: show.invoices },
      ],
    },
    {
      title: 'DONNÉES',
      items: [
        { href: '/consommation/carburant', label: 'Consommation', icon: '⛽', show: show.charges },
        {
          href: role === 'DRIVER' ? '/settings-driver' : '/settings',
          label: 'Paramètres',
          icon: '⚙️',
          show: show.settings
        },
      ],
    },
  ]

  const [openGroup, setOpenGroup] = useState<string | null>(null)

  // Super Admin view is different but we can apply similar style logic if needed.
  // For now let's focus on the standard sidebar.

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity" style={{ display: 'none' }} />

      <aside className="-translate-x-full md:translate-x-0 w-64 bg-[#1e293b] fixed md:static inset-y-0 left-0 transform transition-transform duration-300 z-30 h-screen flex flex-col overflow-hidden m-0">

        {/* Sidebar Header: Brand & Profile */}
        <div className="p-6 space-y-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
            <span className="text-white font-black tracking-tight text-lg uppercase">ArwaEduc</span>
          </div>

          {/* User Profile Info (Reference style) */}
          <div className="bg-[#ffffff10] rounded-2xl p-4 flex flex-col items-center text-center space-y-2 border border-[#ffffff05]">
            <div className="w-16 h-16 rounded-full border-2 border-orange-500 p-0.5 overflow-hidden">
              {(user as any)?.photo ? (
                <img src={(user as any).photo.startsWith('http') ? (user as any).photo : `${window.location.origin}${(user as any).photo}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-xl text-white font-bold">
                  {user?.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div>
              <div className="text-white font-bold text-sm truncate max-w-[180px]">{user?.name || 'Utilisateur'}</div>
              <div className="text-slate-400 text-xs font-medium">@{user?.email?.split('@')[0] || 'profile'}</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-2 space-y-6 overflow-y-auto custom-scrollbar">
          {menuGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              <h3 className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-[2px]">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.filter(i => i.show).map((item, iIdx) => (
                  <Link
                    key={iIdx}
                    href={item.href}
                    className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 text-slate-400 hover:text-white transition-all duration-200 group"
                  >
                    <span className="text-lg opacity-70 group-hover:opacity-100 transition-opacity">{item.icon}</span>
                    <span className="text-sm font-semibold">{item.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}

        </nav>

        {/* Sidebar Footer: Logout (Orange Button) */}
        <div className="p-6 mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem('access_token')
              localStorage.removeItem('user')
              localStorage.removeItem('companyId')
              localStorage.removeItem('token') // For safety with legacy code
              localStorage.removeItem('refreshToken')
              document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
              window.location.href = '/login'
            }}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black transition-all shadow-lg shadow-orange-500/20"
          >
            <span className="text-lg">🚪</span>
            <span>Se Déconnecter</span>
          </button>
        </div>
      </aside>
    </>
  )
}
