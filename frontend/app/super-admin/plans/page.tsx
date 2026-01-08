"use client"
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../../../lib/axios'

export default function PlansPage() {
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<any>(null)
  const qc = useQueryClient()

  const { data: plans, isLoading } = useQuery({
    queryKey: ['super-admin-plans'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/plans')
      return res.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (planData: any) => {
      return axios.post('/super-admin/plans', planData)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-plans'] })
      setShowModal(false)
      setEditingPlan(null)
      alert('✓ Plan créé avec succès')
    },
    onError: (error: any) => {
      alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return axios.put(`/super-admin/plans/${id}`, data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-plans'] })
      setShowModal(false)
      setEditingPlan(null)
      alert('✓ Plan mis à jour')
    },
    onError: (error: any) => {
      alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce plan ?')) {
        throw new Error('Annulé')
      }
      return axios.delete(`/super-admin/plans/${id}`)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-plans'] })
      alert('✓ Plan supprimé')
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

  return (
    <div>
      {/* Header */}
      <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-900 text-white p-6 shadow-lg overflow-hidden">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <span>💎</span>
              Gestion des Plans & Abonnements
            </h1>
            <p className="mt-2 text-purple-100">Créez et gérez les plans d'abonnement</p>
          </div>
          <button
            onClick={() => {
              setEditingPlan(null)
              setShowModal(true)
            }}
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors shadow-lg"
          >
            + Nouveau Plan
          </button>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan: any) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            onEdit={() => {
              setEditingPlan(plan)
              setShowModal(true)
            }}
            onDelete={() => deleteMutation.mutate(plan.id)}
          />
        ))}
      </div>

      {/* Plan Form Modal */}
      {showModal && (
        <PlanModal
          plan={editingPlan}
          onClose={() => {
            setShowModal(false)
            setEditingPlan(null)
          }}
          onSave={(data: any) => {
            if (editingPlan) {
              updateMutation.mutate({ id: editingPlan.id, data })
            } else {
              createMutation.mutate(data)
            }
          }}
        />
      )}
    </div>
  )
}

function PlanCard({ plan, onEdit, onDelete }: any) {
  const typeColors: any = {
    BASIC: 'bg-blue-50 border-blue-200 text-blue-700',
    PRO: 'bg-purple-50 border-purple-200 text-purple-700',
    ENTERPRISE: 'bg-green-50 border-green-200 text-green-700',
    CUSTOM: 'bg-orange-50 border-orange-200 text-orange-700',
  }

  const typeIcons: any = {
    BASIC: '🌱',
    PRO: '🚀',
    ENTERPRISE: '💼',
    CUSTOM: '⚙️',
  }

  return (
    <div className={`${typeColors[plan.type]} border-2 rounded-lg p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{typeIcons[plan.type]}</span>
          <div>
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="text-xs opacity-60">{plan.type}</p>
          </div>
        </div>
        {!plan.isActive && (
          <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">Inactif</span>
        )}
      </div>

      {plan.description && (
        <p className="text-sm opacity-75 mb-4">{plan.description}</p>
      )}

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="opacity-75">Prix mensuel:</span>
          <span className="font-semibold">{plan.priceMonthly} MAD</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="opacity-75">Prix annuel:</span>
          <span className="font-semibold">{plan.priceYearly} MAD</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4 space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span>👥</span>
          <span>{plan.maxUsers} utilisateurs max</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>🚗</span>
          <span>{plan.maxVehicles} véhicules max</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span>🗺️</span>
          <span>{plan.maxTrips} trajets/mois max</span>
        </div>
      </div>

      <div className="border-t pt-4 mb-4">
        <div className="text-sm">
          <span className="font-semibold">{plan._count?.companies || 0}</span> entreprises
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 bg-white bg-opacity-50 hover:bg-opacity-100 px-4 py-2 rounded text-sm font-medium transition-all"
        >
          Modifier
        </button>
        <button
          onClick={onDelete}
          className="px-4 py-2 bg-red-500 text-white rounded text-sm font-medium hover:bg-red-600 transition-colors"
        >
          Supprimer
        </button>
      </div>
    </div>
  )
}

function PlanModal({ plan, onClose, onSave }: any) {
  const [formData, setFormData] = useState({
    name: plan?.name || '',
    type: plan?.type || 'BASIC',
    description: plan?.description || '',
    maxUsers: plan?.maxUsers || 5,
    maxVehicles: plan?.maxVehicles || 10,
    maxTrips: plan?.maxTrips || 100,
    priceMonthly: plan?.priceMonthly || 0,
    priceYearly: plan?.priceYearly || 0,
    isActive: plan?.isActive ?? true,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-purple-600 text-white p-6 rounded-t-lg">
          <h2 className="text-xl font-bold">
            {plan ? 'Modifier le Plan' : 'Nouveau Plan'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom du plan *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="BASIC">Basic</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Utilisateurs</label>
              <input
                type="number"
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Véhicules</label>
              <input
                type="number"
                value={formData.maxVehicles}
                onChange={(e) => setFormData({ ...formData, maxVehicles: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Trajets/mois</label>
              <input
                type="number"
                value={formData.maxTrips}
                onChange={(e) => setFormData({ ...formData, maxTrips: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="1"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix Mensuel (MAD) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.priceMonthly}
                onChange={(e) => setFormData({ ...formData, priceMonthly: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Prix Annuel (MAD) *</label>
              <input
                type="number"
                step="0.01"
                value={formData.priceYearly}
                onChange={(e) => setFormData({ ...formData, priceYearly: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                min="0"
                required
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Plan actif
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              {plan ? 'Mettre à jour' : 'Créer le plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
