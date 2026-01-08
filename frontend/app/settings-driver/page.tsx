"use client"

import { useState, useEffect } from 'react'
import FormSection from '../../components/FormSection'
import axios from '../../lib/axios'
import PageHeader from '../../components/PageHeader'
import { useAuth } from '../../lib/auth'

export default function DriverSettingsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [driverData, setDriverData] = useState({
    name: '',
    email: '',
    phone: '',
    licenseNumber: '',
    licenseExpiry: '',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    photo: null as File | null,
    currentPhoto: ''
  })

  useEffect(() => {
    loadDriverData()
  }, [])

  const loadDriverData = async () => {
    try {
      const response = await axios.get('/drivers/me')
      const driver = response.data
      setDriverData({
        name: driver.name || '',
        email: driver.email || '',
        phone: driver.phone || '',
        licenseNumber: driver.licenseNumber || '',
        licenseExpiry: driver.licenseExpiry ? driver.licenseExpiry.split('T')[0] : '',
        address: driver.address || '',
        emergencyContact: driver.emergencyContact || '',
        emergencyPhone: driver.emergencyPhone || '',
        photo: null,
        currentPhoto: driver.photo || ''
      })
    } catch (error) {
      console.error('Error loading driver data:', error)
      setMessage('Erreur lors du chargement des données')
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setDriverData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setDriverData(prev => ({
        ...prev,
        photo: file
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const formData = new FormData()
      formData.append('name', driverData.name)
      formData.append('email', driverData.email)
      formData.append('phone', driverData.phone)
      formData.append('licenseNumber', driverData.licenseNumber)
      formData.append('licenseExpiry', driverData.licenseExpiry)
      formData.append('address', driverData.address)
      formData.append('emergencyContact', driverData.emergencyContact)
      formData.append('emergencyPhone', driverData.emergencyPhone)

      if (driverData.photo) {
        formData.append('photo', driverData.photo)
      }

      const response = await axios.put('/drivers/me', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setMessage('Informations mises à jour avec succès !')
      // Reload data to reflect changes
      await loadDriverData()
    } catch (error: any) {
      console.error('Error updating driver data:', error)
      setMessage(error.response?.data?.message || 'Erreur lors de la mise à jour')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader
        title="Paramètres du Conducteur"
      />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo Section */}
          <FormSection title="Photo de Profil" icon="📸" color="blue">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {driverData.currentPhoto ? (
                    <img
                      src={driverData.currentPhoto}
                      alt="Photo de profil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl text-gray-400">👤</span>
                  )}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Changer la photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formats acceptés: JPG, PNG, GIF. Taille maximale: 5MB
                </p>
              </div>
            </div>
          </FormSection>

          {/* Personal Information */}
          <FormSection title="Informations Personnelles" icon="👤" color="green">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                <input
                  type="text"
                  value={driverData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Votre nom complet"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={driverData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="votre.email@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  type="tel"
                  value={driverData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={driverData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  placeholder="Votre adresse"
                />
              </div>
            </div>
          </FormSection>

          {/* License Information */}
          <FormSection title="Informations du Permis" icon="🚗" color="orange">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Numéro du permis</label>
                <input
                  type="text"
                  value={driverData.licenseNumber}
                  onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                  placeholder="Numéro du permis de conduire"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date d'expiration</label>
                <input
                  type="date"
                  value={driverData.licenseExpiry}
                  onChange={(e) => handleInputChange('licenseExpiry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </FormSection>

          {/* Emergency Contact */}
          <FormSection title="Contact d'Urgence" icon="🚨" color="red">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du contact</label>
                <input
                  type="text"
                  value={driverData.emergencyContact}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="Nom de la personne à contacter"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone d'urgence</label>
                <input
                  type="tel"
                  value={driverData.emergencyPhone}
                  onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  placeholder="+212 6XX XXX XXX"
                />
              </div>
            </div>
          </FormSection>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg ${
              message.includes('succès')
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{message.includes('succès') ? '✅' : '❌'}</span>
                {message}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <span>💾</span>
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}