import React from 'react'

export default function Button({ children, className = '', intent = 'primary', ...props }: any) {
  const intentClass = intent === 'primary'
    ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white'
    : 'bg-slate-100 text-slate-800 hover:bg-slate-200'

  return (
    <button
      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium shadow-sm ${intentClass} disabled:opacity-60 disabled:cursor-not-allowed transition-colors ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
