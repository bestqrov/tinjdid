import { ReactNode } from 'react'

interface CardProps {
  title?: string
  amount?: number
  children?: ReactNode
  icon?: string
  className?: string
}

export default function Card({ title, amount, children, icon, className = '' }: CardProps) {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-sm border ${className}`}>
      <div className="flex items-center gap-3 mb-2">
        {icon ? <div className="text-lg">{icon}</div> : null}
        {title ? <div className="font-medium text-slate-700">{title}</div> : null}
      </div>
      {amount !== undefined ? <div className="text-2xl font-semibold text-slate-900 mb-2">{amount} MAD</div> : null}
      <div className="text-sm text-slate-700">{children}</div>
    </div>
  )
}
