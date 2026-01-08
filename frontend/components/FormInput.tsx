import React from 'react'
import Input from './ui/input'

export default function FormInput({ label, error, icon, ...props }: any) {
  return (
    <label className="block mb-3">
      <div className="text-sm text-slate-700 mb-2 flex items-center gap-2">
        {icon && <span className="text-base">{icon}</span>}
        <span className="font-medium">{label}</span>
      </div>
      <Input {...props} />
      {error ? <div className="text-sm text-red-600 mt-2">{error}</div> : null}
    </label>
  )
}
