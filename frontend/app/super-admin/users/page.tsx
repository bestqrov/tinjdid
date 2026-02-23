"use client"
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../../../lib/axios'

export default function UsersPage() {
  const [filters, setFilters] = useState({ companyId: '', role: '', page: 1 })
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-users', filters],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (filters.companyId) params.set('companyId', filters.companyId)
      if (filters.role) params.set('role', filters.role)
      params.set('page', filters.page.toString())
      params.set('limit', '50')
      const res = await axios.get(`/super-admin/users?${params}`)
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const blockMutation = useMutation({
    mutationFn: async (userId: string) => {
      return axios.put(`/super-admin/users/${userId}/block`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-users'] })
      alert('✓ Utilisateur bloqué')
    },
  })

  const unblockMutation = useMutation({
    mutationFn: async (userId: string) => {
      return axios.put(`/super-admin/users/${userId}/unblock`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-users'] })
      alert('✓ Utilisateur débloqué')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async (userId: string) => {
      if (!confirm('Envoyer un email de réinitialisation ?')) throw new Error('Annulé')
      return axios.post(`/super-admin/users/${userId}/reset-password`)
    },
    onSuccess: () => {
      alert('✓ Email envoyé')
    },
    onError: (error: any) => {
      if (error.message !== 'Annulé') {
        alert('✗ Erreur: ' + error.message)
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const users = data?.data || []
  const pagination = data?.pagination || {}

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 shadow-lg">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>👥</span>
          Gestion des Utilisateurs
        </h1>
        <p className="mt-2 text-purple-100">Gérez tous les utilisateurs de la plateforme</p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Rôle:</label>
          <select
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
            className="px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="">Tous</option>
            <option value="SUPERADMIN">Super Admin</option>
            <option value="COMPANY_ADMIN">Admin Entreprise</option>
            <option value="ADMIN">Admin</option>
            <option value="STAFF">Staff</option>
            <option value="DRIVER">Chauffeur</option>
          </select>
        </div>
        <div className="ml-auto">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{pagination.total || 0}</span> utilisateurs
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Utilisateur</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Téléphone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{user.name || 'N/A'}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.company?.name || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.phone || 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => resetPasswordMutation.mutate(user.id)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Reset MDP
                    </button>
                    {user.role !== 'SUPERADMIN' && (
                      <>
                        <button
                          onClick={() => blockMutation.mutate(user.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Bloquer
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t">
            <div>
              <p className="text-sm text-gray-700">
                Page {filters.page} sur {pagination.totalPages}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                disabled={filters.page === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                ←
              </button>
              <button
                onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                disabled={filters.page === pagination.totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-50"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const roleConfig: any = {
    SUPERADMIN: { label: 'Super Admin', className: 'bg-red-100 text-red-800' },
    COMPANY_ADMIN: { label: 'Admin Entreprise', className: 'bg-purple-100 text-purple-800' },
    ADMIN: { label: 'Admin', className: 'bg-blue-100 text-blue-800' },
    STAFF: { label: 'Staff', className: 'bg-green-100 text-green-800' },
    DRIVER: { label: 'Chauffeur', className: 'bg-gray-100 text-gray-800' },
  }

  const config = roleConfig[role] || { label: role, className: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  )
}
