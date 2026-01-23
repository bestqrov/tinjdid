'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import { AuthProvider } from '../lib/auth'
import { usePathname } from 'next/navigation'

const queryClient = new QueryClient()

export default function ClientLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [hideShell, setHideShell] = useState(true)

    useEffect(() => {
        // Determine if we should hide the sidebar/topbar shell
        const shouldHide =
            pathname === '/' ||
            pathname === '/login' ||
            pathname === '/forgot-password' ||
            pathname === '/reset-password' ||
            pathname?.includes('/print') ||
            pathname?.startsWith('/super-admin')

        setHideShell(shouldHide)
    }, [pathname])

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                {hideShell ? (
                    <main className="p-0 min-h-screen">{children}</main>
                ) : (
                    <div className="flex h-screen bg-[#f8fafc] dark:bg-gray-900 overflow-hidden">
                        <Sidebar />
                        <div className="flex-1 w-full md:w-auto flex flex-col overflow-hidden">
                            <Topbar />
                            <main className="flex-1 p-3 md:p-4 overflow-y-auto">{children}</main>
                        </div>
                    </div>
                )}
            </AuthProvider>
        </QueryClientProvider>
    )
}
