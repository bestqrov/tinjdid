import React from 'react'

interface FormSectionProps {
  title: string
  icon: string
  color: string
  children: React.ReactNode
}

export default function FormSection({ title, icon, color, children }: FormSectionProps) {
  const borderColorClass = {
    blue: 'border-blue-300',
    green: 'border-green-300',
    purple: 'border-purple-300',
    orange: 'border-orange-300',
    pink: 'border-pink-300'
  }[color] || 'border-blue-300'

  const bgColorClass = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50',
    pink: 'bg-pink-50'
  }[color] || 'bg-blue-50'

  return (
    <div className={`overflow-hidden rounded-lg border ${borderColorClass} mb-4`}>
      <div className="flex items-center gap-3 px-4 py-3 bg-blue-600 text-white">
        <span className="text-lg">{icon}</span>
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className={`${bgColorClass} p-4 space-y-3`}>
        {children}
      </div>
    </div>
  )
}