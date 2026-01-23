import './globals.css'
import { ReactNode } from 'react'
import ClientLayout from '../components/ClientLayout'

export const metadata = {
  title: 'ArwaPark',
  description: 'ArwaPark - Gestion de parc automobile',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="antialiased">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
