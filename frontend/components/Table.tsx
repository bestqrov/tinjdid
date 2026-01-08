import { ReactNode } from 'react'

export default function Table({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white rounded shadow overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">{children}</table>
    </div>
  )
}
