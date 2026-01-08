import type { Metadata } from 'next'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'ArwaPark - Touristic Transport Fleet Management',
  description: 'Professional fleet management software for touristic transport companies in Morocco',
}

export default function Home() {
  redirect('/login')
}
