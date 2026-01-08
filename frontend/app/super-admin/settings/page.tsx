"use client"
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from '../../../lib/axios'

export default function SettingsPage() {
  const qc = useQueryClient()

  const { data: settings, isLoading } = useQuery({
    queryKey: ['super-admin-settings'],
    queryFn: async () => {
      const res = await axios.get('/super-admin/settings')
      return res.data
    },
  })

  const [formData, setFormData] = useState({
    platformName: '',
    supportEmail: '',
    defaultLanguage: 'FR',
    enabledLanguages: ['FR', 'AR', 'EN'],
    maintenanceMode: false,
    maintenanceMessage: '',
  })

  // Update form data when settings load
  useState(() => {
    if (settings) {
      setFormData({
        platformName: settings.platformName || '',
        supportEmail: settings.supportEmail || '',
        defaultLanguage: settings.defaultLanguage || 'FR',
        enabledLanguages: settings.enabledLanguages || ['FR', 'AR', 'EN'],
        maintenanceMode: settings.maintenanceMode || false,
        maintenanceMessage: settings.maintenanceMessage || '',
      })
    }
  })

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      return axios.put('/super-admin/settings', data)
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['super-admin-settings'] })
      alert('✓ Paramètres mis à jour avec succès')
    },
    onError: (error: any) => {
      alert('✗ Erreur: ' + (error.response?.data?.message || error.message))
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateMutation.mutate(formData)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-700 text-white p-6 shadow">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span>⚙️</span>
          Paramètres de la Plateforme
        </h1>
        <p className="mt-2 text-gray-300">Configurez les paramètres globaux d'ArwaPark</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Paramètres Généraux</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nom de la Plateforme</label>
              <input
                type="text"
                value={formData.platformName}
                onChange={(e) => setFormData({ ...formData, platformName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="ArwaPark"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email de Support</label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="support@arwapark.com"
              />
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Paramètres de Langue</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langue par Défaut</label>
              <select
                value={formData.defaultLanguage}
                onChange={(e) => setFormData({ ...formData, defaultLanguage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="FR">Français</option>
                <option value="AR">Arabe</option>
                <option value="EN">Anglais</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Langues Activées</label>
              <div className="flex gap-4 mt-3">
                {['FR', 'AR', 'EN'].map((lang) => (
                  <label key={lang} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.enabledLanguages.includes(lang)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            enabledLanguages: [...formData.enabledLanguages, lang],
                          })
                        } else {
                          setFormData({
                            ...formData,
                            enabledLanguages: formData.enabledLanguages.filter((l) => l !== lang),
                          })
                        }
                      }}
                      className="h-4 w-4 text-blue-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{lang}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Mode */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Mode Maintenance</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="maintenanceMode"
                checked={formData.maintenanceMode}
                onChange={(e) => setFormData({ ...formData, maintenanceMode: e.target.checked })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                Activer le mode maintenance
              </label>
            </div>
            {formData.maintenanceMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message de Maintenance</label>
                <textarea
                  value={formData.maintenanceMessage}
                  onChange={(e) => setFormData({ ...formData, maintenanceMessage: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="La plateforme est en maintenance. Nous serons de retour bientôt."
                />
              </div>
            )}
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Branding</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo de la Plateforme</label>
              <input
                type="file"
                accept="image/*"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">Format recommandé: PNG, 200x60px</p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {updateMutation.isPending ? 'Enregistrement...' : '💾 Enregistrer les modifications'}
          </button>
        </div>
      </form>
    </div>
  )
}
