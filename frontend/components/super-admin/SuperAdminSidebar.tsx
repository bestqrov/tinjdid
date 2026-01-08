"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Crown, 
  DollarSign, 
  Users, 
  FileText, 
  Server, 
  Settings,
  ChevronLeft,
  Menu,
  MessageSquare
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../lib/utils'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', href: '/super-admin', icon: LayoutDashboard },
  { name: 'Companies', href: '/super-admin/companies', icon: Building2 },
  { name: 'Demo Requests', href: '/super-admin/demo-requests', icon: MessageSquare },
  { name: 'Plans', href: '/super-admin/plans', icon: Crown },
  { name: 'Revenue', href: '/super-admin/revenue', icon: DollarSign },
  { name: 'Users', href: '/super-admin/users', icon: Users },
  { name: 'Logs', href: '/super-admin/logs', icon: FileText },
  { name: 'System', href: '/super-admin/system', icon: Server },
  { name: 'Settings', href: '/super-admin/settings', icon: Settings },
]

export default function SuperAdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out",
          "bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800",
          "lg:translate-x-0",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-gray-900 dark:text-white">Administrateur</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">ArwaPark SaaS</p>
              </div>
            </div>
          )}
          
          {/* Collapse Button - Desktop Only */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ChevronLeft 
              className={cn(
                "w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform",
                collapsed && "rotate-180"
              )}
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/super-admin' && pathname?.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  "hover:bg-gray-100 dark:hover:bg-gray-800",
                  "group relative",
                  isActive && "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
                  !isActive && "text-gray-700 dark:text-gray-300"
                )}
              >
                <Icon 
                  className={cn(
                    "w-5 h-5 flex-shrink-0",
                    isActive && "text-purple-600 dark:text-purple-400",
                    !isActive && "text-gray-500 dark:text-gray-400"
                  )}
                />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.name}</span>
                )}
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-600 dark:bg-purple-400 rounded-r-full" />
                )}

                {/* Tooltip for collapsed state */}
                {collapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-800">
          {!collapsed ? (
            <div className="px-3 py-2 rounded-lg bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-xs font-semibold text-gray-900 dark:text-white">System Status</p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">All systems operational</p>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          )}
        </div>
      </aside>

      {/* Spacer for fixed sidebar */}
      <div className={cn(
        "hidden lg:block flex-shrink-0 transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )} />
    </>
  )
}
