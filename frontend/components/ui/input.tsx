import React from 'react'

export default function Input({ className = '', as, children, ...props }: any) {
  const Component = as || 'input'
  return (
    <Component
      className={`w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm placeholder:text-slate-400 shadow-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-blue-500 focus:shadow-md ${className}`}
      {...props}
    >
      {children}
    </Component>
  )
}
