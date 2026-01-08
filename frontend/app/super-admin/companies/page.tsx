"use client"
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../../../lib/axios'
import Link from 'next/link'

export default function CompaniesPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<{ companyId: string; currentPlanId: string | null } | null>(null)
  const qc = useQueryClient()

  // Fetch available plans for the dropdown
  const { data: plansData } = useQuery({
    queryKey: ['super-admin-plans'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/plans')
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const { data, isLoading } = useQuery({
    queryKey: ['super-admin-companies', statusFilter, page],
    queryFn: async () => {
      const params = new URLSearchParams()
      if (statusFilter) params.set('status', statusFilter)
      params.set('page', page.toString())
      params.set('limit', '20')
      const res = await axios.get(`/super-admin/companies?${params}`)
      return res.data
    },
    refetchOnMount: 'always',
    staleTime: 0,
  })

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return axios.put(`/super-admin/companies/${id}/status`, { status })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-companies'] })
      alert('✓ Statut mis à jour avec succès')
    },
    onError: (error: any) => {
      alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
    },
  })

  const updatePlanMutation = useMutation({
    mutationFn: async ({ id, planId }: { id: string; planId: string | null }) => {
      return axios.put(`/super-admin/companies/${id}/plan`, { planId })
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-companies'] })
      setEditingPlan(null)
      alert('✓ Plan mis à jour avec succès')
    },
    onError: (error: any) => {
      alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
    },
  })

  const deleteCompanyMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette entreprise ?')) {
        throw new Error('Annulé')
      }
      return axios.delete(`/super-admin/companies/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-companies'] })
      alert('✓ Entreprise supprimée')
    },
    onError: (error: any) => {
      if (error.message !== 'Annulé') {
        alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
      }
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const companies = data?.data || []
  const pagination = data?.pagination || {}
  const plans = plansData || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span>🏢</span>
              Gestion des Entreprises
            </h1>
            <p className="mt-2 text-blue-100">Gérez toutes les entreprises de la plateforme</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg flex items-center gap-2"
          >
            <span className="text-xl">+</span>
            Ajouter une entreprise
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow flex items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Filtrer par statut:</label>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(1)
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous</option>
            <option value="ACTIVE">Actif</option>
            <option value="TRIAL">Essai</option>
            <option value="SUSPENDED">Suspendu</option>
            <option value="EXPIRED">Expiré</option>
            <option value="CANCELED">Annulé</option>
          </select>
        </div>
        <div className="ml-auto">
          <div className="text-sm text-gray-600">
            Total: <span className="font-semibold">{pagination.total || 0}</span> entreprises
          </div>
        </div>
      </div>

      {/* Companies Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Essai</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilisateurs</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trajets</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Véhicules</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {companies.map((company: any) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{company.name}</div>
                        <div className="text-xs text-gray-500">{company.contact}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <div className="text-sm text-gray-900">{company.plan?.name || 'Aucun plan'}</div>
                        {company.plan && (
                          <div className="text-xs text-gray-500">{company.plan.priceMonthly} MAD/mois</div>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingPlan({ companyId: company.id, currentPlanId: company.plan?.id || null })}
                        className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                      >
                        Modifier
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={company.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {company.status === 'TRIAL' && company.trialEndsAt ? (
                      <TrialInfo trialEndsAt={company.trialEndsAt} />
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company._count?.users || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company._count?.trips || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company._count?.vehicles || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(company.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <Link
                      href={`/super-admin/companies/${company.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Voir
                    </Link>
                    <button
                      onClick={() => {
                        const newStatus = company.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
                        updateStatusMutation.mutate({ id: company.id, status: newStatus })
                      }}
                      className="text-yellow-600 hover:text-yellow-900"
                    >
                      {company.status === 'ACTIVE' ? 'Suspendre' : 'Activer'}
                    </button>
                    <button
                      onClick={() => deleteCompanyMutation.mutate(company.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Précédent
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Page <span className="font-medium">{page}</span> sur{' '}
                  <span className="font-medium">{pagination.totalPages}</span>
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const pageNum = i + 1
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          page === pageNum
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page === pagination.totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Plan Modal */}
      {editingPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Modifier le plan</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sélectionner un plan
                </label>
                <select
                  defaultValue={editingPlan.currentPlanId || ''}
                  onChange={(e) => {
                    const planId = e.target.value || null
                    updatePlanMutation.mutate({ id: editingPlan.companyId, planId })
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Aucun plan</option>
                  {plans.map((plan: any) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} - {plan.priceMonthly} MAD/mois
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setEditingPlan(null)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Company Modal */}
      {showAddModal && (
        <AddCompanyModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false)
            qc.invalidateQueries({ queryKey: ['super-admin-companies'] })
          }}
          plans={plans}
        />
      )}
    </div>
  )
}

function TrialInfo({ trialEndsAt }: { trialEndsAt: string }) {
  const endDate = new Date(trialEndsAt)
  const now = new Date()
  const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  
  const isExpired = daysRemaining < 0
  const isExpiringSoon = daysRemaining <= 3 && daysRemaining >= 0
  
  return (
    <div className="text-sm">
      {isExpired ? (
        <span className="text-red-600 font-semibold">Expiré</span>
      ) : (
        <>
          <div className={`font-semibold ${isExpiringSoon ? 'text-orange-600' : 'text-blue-600'}`}>
            {daysRemaining} {daysRemaining === 1 ? 'jour' : 'jours'}
          </div>
          <div className="text-xs text-gray-500">
            Jusqu'au {endDate.toLocaleDateString('fr-FR')}
          </div>
        </>
      )}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: any = {
    ACTIVE: { label: 'Actif', className: 'bg-green-100 text-green-800' },
    TRIAL: { label: 'Essai', className: 'bg-blue-100 text-blue-800' },
    SUSPENDED: { label: 'Suspendu', className: 'bg-red-100 text-red-800' },
    EXPIRED: { label: 'Expiré', className: 'bg-gray-100 text-gray-800' },
    CANCELED: { label: 'Annulé', className: 'bg-gray-100 text-gray-800' },
  }

  const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-800' }

  return (
    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${config.className}`}>
      {config.label}
    </span>
  )
}

function AddCompanyModal({ onClose, onSuccess, plans }: { onClose: () => void; onSuccess: () => void; plans: any[] }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    contact: '',
    address: '',
    planId: '',
    adminEmail: '',
    adminPassword: '',
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      // Create company with admin user
      return axios.post('/companies', data)
    },
    onSuccess: () => {
      alert('✓ Entreprise créée avec succès')
      onSuccess()
    },
    onError: (error: any) => {
      alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">Ajouter une nouvelle entreprise</h2>
          
          {/* Trial Notice */}
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <span className="text-blue-600 text-xl">ℹ️</span>
              <div className="text-sm text-blue-800">
                <strong>Période d'essai gratuite :</strong> Les nouvelles entreprises bénéficient automatiquement de <strong>15 jours d'essai gratuit</strong>. Après cette période, vous devrez leur attribuer un plan payant.
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Company Information */}
            <div className="border-b pb-4">
              <h3 className="font-semibold text-lg mb-3">Informations de l'entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'entreprise *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email de l'entreprise *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan
                  </label>
                  <select
                    value={formData.planId}
                    onChange={(e) => setFormData({ ...formData, planId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Aucun plan</option>
                    {plans.map((plan: any) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} - {plan.priceMonthly} MAD/mois
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresse
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Admin User Information */}
            <div>
              <h3 className="font-semibold text-lg mb-3">Administrateur de l'entreprise</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email admin *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.adminEmail}
                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mot de passe *
                  </label>
                  <input
                    type="password"
                    required
                    value={formData.adminPassword}
                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Création...' : 'Créer l\'entreprise'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
