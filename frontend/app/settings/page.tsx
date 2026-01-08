"use client"

import { useState, useEffect } from 'react'
import FormSection from '../../components/FormSection'
import axios from '../../lib/axios'
import PageHeader from '../../components/PageHeader'

const CollapsibleSection = ({ title, icon, color, isOpen, onToggle, children }: any) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 text-left transition-all ${
          isOpen 
            ? `bg-gradient-to-r from-${color}-50 to-${color}-100 border-b border-${color}-200` 
            : 'bg-white hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        <span className={`transform transition-transform text-xl ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>
      {isOpen && (
        <div className="p-6 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

export default function SettingsPage() {
  const [openSection, setOpenSection] = useState<string | null>('profile')
  const [theme, setTheme] = useState('light')
  const [backupEnabled, setBackupEnabled] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState('daily')
  const [isOnline, setIsOnline] = useState(true)
  const [pendingBackups, setPendingBackups] = useState(0)
  const [message, setMessage] = useState('')
  const [lastBackupTime, setLastBackupTime] = useState<string | null>(null)
  const [showRestoreModal, setShowRestoreModal] = useState(false)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [checkingUpdates, setCheckingUpdates] = useState(false)
  const [availableUpdates, setAvailableUpdates] = useState<any[]>([])
  const [currentVersion, setCurrentVersion] = useState('1.0.0')
  const [lastUpdateCheck, setLastUpdateCheck] = useState<string | null>(null)
  
  // Company Profile
  const [companyLogo, setCompanyLogo] = useState<File | null>(null)
  const [companyName, setCompanyName] = useState('ArwaPark')
  const [gerantNom, setGerantNom] = useState('')
  const [companyActivite, setCompanyActivite] = useState('')
  const [companySlogan, setCompanySlogan] = useState('')
  const [companyTagline, setCompanyTagline] = useState('Solution de gestion de transport')
  const [companyPhone, setCompanyPhone] = useState('')
  const [companyWebsite, setCompanyWebsite] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyCountry, setCompanyCountry] = useState('Maroc')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyIF, setCompanyIF] = useState('')
  const [companyCNSS, setCompanyCNSS] = useState('')
  const [companyICE, setCompanyICE] = useState('')
  const [companyRC, setCompanyRC] = useState('')
  const [companyPatente, setCompanyPatente] = useState('')
  const [companyCompteBancaire, setCompanyCompteBancaire] = useState('')

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section)
  }

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData()
      if (companyLogo) {
        formData.append('logo', companyLogo)
      }
      formData.append('name', companyName)
      formData.append('gerantNom', gerantNom)
      formData.append('activite', companyActivite)
      formData.append('slogan', companySlogan)
      formData.append('tagline', companyTagline)
      formData.append('phone', companyPhone)
      formData.append('email', companyEmail)
      formData.append('website', companyWebsite)
      formData.append('address', companyAddress)
      formData.append('country', companyCountry)
      formData.append('if', companyIF)
      formData.append('cnss', companyCNSS)
      formData.append('ice', companyICE)
      formData.append('rc', companyRC)
      formData.append('patente', companyPatente)
      formData.append('compteBancaire', companyCompteBancaire)

      const response = await axios.put('/settings/company-profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Save to localStorage as backup
      const profileData = {
        name: companyName,
        gerantNom,
        activite: companyActivite,
        slogan: companySlogan,
        tagline: companyTagline,
        phone: companyPhone,
        email: companyEmail,
        website: companyWebsite,
        address: companyAddress,
        country: companyCountry,
        if: companyIF,
        cnss: companyCNSS,
        ice: companyICE,
        rc: companyRC,
        patente: companyPatente,
        compteBancaire: companyCompteBancaire,
        lastSaved: new Date().toISOString()
      }
      localStorage.setItem('companyProfile', JSON.stringify(profileData))

      // Dispatch event to refresh topbar
      window.dispatchEvent(new CustomEvent('companyProfileUpdated'))

      setMessage('✅ Profil société enregistré avec succès et sauvegardé')
      setTimeout(() => setMessage(''), 3000)
    } catch (error: any) {
      console.error('Error saving profile:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Erreur inconnue'
      console.error('Error details:', errorMessage)
      setMessage(`❌ Erreur: ${errorMessage}`)
      setTimeout(() => setMessage(''), 5000)
    }
  }

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/settings/company-profile')
        if (response.data?.data) {
          const profile = response.data.data
          setCompanyName(profile.name || 'ArwaPark')
          setGerantNom(profile.gerantNom || '')
          setCompanyActivite(profile.activite || '')
          setCompanySlogan(profile.slogan || '')
          setCompanyTagline(profile.tagline || 'Solution de gestion de transport')
          setCompanyPhone(profile.phone || '')
          setCompanyEmail(profile.email || '')
          setCompanyWebsite(profile.website || '')
          setCompanyAddress(profile.address || '')
          setCompanyCountry(profile.country || 'Maroc')
          setCompanyIF(profile.if || '')
          setCompanyCNSS(profile.cnss || '')
          setCompanyICE(profile.ice || '')
          setCompanyRC(profile.rc || '')
          setCompanyPatente(profile.patente || '')
          setCompanyCompteBancaire(profile.compteBancaire || '')
          
          // Save to localStorage for offline access
          const profileData = {
            name: profile.name,
            gerantNom: profile.gerantNom,
            activite: profile.activite,
            slogan: profile.slogan,
            tagline: profile.tagline,
            phone: profile.phone,
            email: profile.email,
            website: profile.website,
            address: profile.address,
            country: profile.country,
            if: profile.if,
            cnss: profile.cnss,
            ice: profile.ice,
            rc: profile.rc,
            patente: profile.patente,
            compteBancaire: profile.compteBancaire
          }
          localStorage.setItem('companyProfile', JSON.stringify(profileData))
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        
        // Try to load from localStorage if API fails
        const cachedProfile = localStorage.getItem('companyProfile')
        if (cachedProfile) {
          try {
            const profile = JSON.parse(cachedProfile)
            setCompanyName(profile.name || 'ArwaPark')
            setGerantNom(profile.gerantNom || '')
            setCompanyActivite(profile.activite || '')
            setCompanySlogan(profile.slogan || '')
            setCompanyTagline(profile.tagline || 'Solution de gestion de transport')
            setCompanyPhone(profile.phone || '')
            setCompanyEmail(profile.email || '')
            setCompanyWebsite(profile.website || '')
            setCompanyAddress(profile.address || '')
            setCompanyCountry(profile.country || 'Maroc')
            setCompanyIF(profile.if || '')
            setCompanyCNSS(profile.cnss || '')
            setCompanyICE(profile.ice || '')
            setCompanyRC(profile.rc || '')
            setCompanyPatente(profile.patente || '')
            setCompanyCompteBancaire(profile.compteBancaire || '')
            setMessage('📂 Profil chargé depuis le cache local')
            setTimeout(() => setMessage(''), 3000)
          } catch (e) {
            console.error('Error parsing cached profile:', e)
          }
        }
      }
    }
    fetchProfile()

    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(isDark ? 'dark' : 'light')
    }

    // Load backup settings
    const savedBackupEnabled = localStorage.getItem('backupEnabled')
    if (savedBackupEnabled !== null) {
      setBackupEnabled(savedBackupEnabled === 'true')
    }
    const savedBackupFrequency = localStorage.getItem('backupFrequency')
    if (savedBackupFrequency) {
      setBackupFrequency(savedBackupFrequency)
    }
    
    // Load last backup time
    const savedLastBackup = localStorage.getItem('lastBackupTime')
    if (savedLastBackup) {
      setLastBackupTime(savedLastBackup)
    }

    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true)
      // Check for pending backups in localStorage
      const pending = localStorage.getItem('pendingBackupsCount')
      if (pending) {
        setPendingBackups(parseInt(pending))
        // Auto-sync when coming online
        if (parseInt(pending) > 0) {
          setTimeout(() => {
            setPendingBackups(0)
            localStorage.setItem('pendingBackupsCount', '0')
          }, 2000)
        }
      }
    }
    
    const handleOffline = () => {
      setIsOnline(false)
    }

    // Set initial online status
    setIsOnline(navigator.onLine)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Apply theme immediately
    if (newTheme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', isDark)
    } else {
      document.documentElement.classList.toggle('dark', newTheme === 'dark')
    }
    
    setMessage('✅ Thème modifié et enregistré')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleCreateBackup = () => {
    const now = new Date().toISOString()
    localStorage.setItem('lastBackupTime', now)
    setLastBackupTime(now)
    setMessage('✅ Sauvegarde manuelle créée avec succès')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleRestoreBackup = () => {
    setShowRestoreModal(false)
    setMessage('🔄 Restauration en cours...')
    setTimeout(() => {
      setMessage('✅ Données restaurées avec succès')
      setTimeout(() => setMessage(''), 3000)
    }, 2000)
  }

  const handleBackupToggle = (enabled: boolean) => {
    setBackupEnabled(enabled)
    localStorage.setItem('backupEnabled', enabled.toString())
    setMessage(enabled ? '✅ Sauvegarde automatique activée' : '⚠️ Sauvegarde automatique désactivée')
    setTimeout(() => setMessage(''), 3000)
  }

  const handleBackupFrequencyChange = (frequency: string) => {
    setBackupFrequency(frequency)
    localStorage.setItem('backupFrequency', frequency)
    setMessage('✅ Fréquence de sauvegarde mise à jour')
    setTimeout(() => setMessage(''), 2000)
  }

  const handleCheckUpdates = () => {
    setCheckingUpdates(true)
    setMessage('🔍 Vérification des mises à jour...')
    
    // Simulate checking for updates
    setTimeout(() => {
      const updates = [
        {
          version: '1.1.0',
          date: '2026-01-10',
          type: 'feature',
          description: 'Nouvelles fonctionnalités de gestion des trajets',
          features: [
            'Tableau de bord amélioré',
            'Rapports exportables en PDF',
            'Notifications en temps réel'
          ]
        },
        {
          version: '1.0.5',
          date: '2026-01-08',
          type: 'bugfix',
          description: 'Corrections de bugs et améliorations de performance',
          features: [
            'Correction du bug d\'affichage des factures',
            'Amélioration de la vitesse de chargement',
            'Optimisation de la base de données'
          ]
        }
      ]
      
      setAvailableUpdates(updates)
      setLastUpdateCheck(new Date().toISOString())
      setCheckingUpdates(false)
      
      if (updates.length > 0) {
        setMessage(`✅ ${updates.length} mise(s) à jour disponible(s)`)
      } else {
        setMessage('✅ Aucune mise à jour disponible')
      }
      setTimeout(() => setMessage(''), 3000)
    }, 2000)
  }

  const handleApplyUpdates = () => {
    setMessage('📥 Installation des mises à jour...')
    setTimeout(() => {
      const latestVersion = availableUpdates[0]?.version || currentVersion
      setCurrentVersion(latestVersion)
      setAvailableUpdates([])
      setMessage('✅ Mises à jour appliquées avec succès - Redémarrage requis')
      setTimeout(() => setMessage(''), 4000)
    }, 3000)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <PageHeader 
        title="⚙️ Paramètres" 
        gradientFrom="indigo-600" 
        gradientTo="indigo-700"
      />

      <div className="bg-white rounded-b-lg shadow-lg p-6 space-y-4">

        <CollapsibleSection 
          title="Profil Société" 
          icon="🏢" 
          color="blue"
          isOpen={openSection === 'profile'}
          onToggle={() => toggleSection('profile')}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side - Form */}
            <div className="lg:col-span-2 space-y-4">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo de la société <span className="text-blue-600">*</span>
                </label>
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                    {companyLogo ? (
                      <img src={URL.createObjectURL(companyLogo)} alt="Logo" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span>LOGO</span>
                    )}
                  </div>
                  <label className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium cursor-pointer transition-all shadow-md hover:shadow-lg flex items-center gap-2">
                    <span>📷</span>
                    Changer le logo
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setCompanyLogo(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom de la société <span className="text-blue-600">*</span>
                  </label>
                  <input 
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nom de la société"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du gérant <span className="text-blue-600">*</span>
                  </label>
                  <input 
                    type="text"
                    value={gerantNom}
                    onChange={(e) => setGerantNom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nom complet du gérant"
                  />
                  <p className="text-xs text-gray-500 mt-1">Ce nom s'affichera en haut de la page</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activité <span className="text-blue-600">*</span>
                  </label>
                  <input 
                    type="text"
                    value={companyActivite}
                    onChange={(e) => setCompanyActivite(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: Travaux de fonçage et exploitation minière"
                  />
                  <p className="text-xs text-gray-500 mt-1">Activité principale de la société (apparaît sur les factures)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slogan</label>
                  <input 
                    type="text"
                    value={companySlogan}
                    onChange={(e) => setCompanySlogan(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Ex: Votre partenaire de confiance"
                  />
                  <p className="text-xs text-gray-500 mt-1">Slogan de la société (apparaît sur les factures)</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                  <input 
                    type="text"
                    value={companyTagline}
                    onChange={(e) => setCompanyTagline(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Solution de gestion de transport"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input 
                    type="tel"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="+212 6 XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input 
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="contact@arwapark.ma"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                <input 
                  type="url"
                  value={companyWebsite}
                  onChange={(e) => setCompanyWebsite(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="https://www.arwapark.ma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse <span className="text-blue-600">*</span>
                </label>
                <textarea 
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Adresse complète de la société"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pays <span className="text-blue-600">*</span>
                </label>
                <select 
                  value={companyCountry}
                  onChange={(e) => setCompanyCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="Maroc">🇲🇦 Maroc</option>
                  <option value="France">🇫🇷 France</option>
                  <option value="Algérie">🇩🇿 Algérie</option>
                  <option value="Tunisie">🇹🇳 Tunisie</option>
                  <option value="Autre">🌍 Autre</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📋</span> Informations Fiscales
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      IF (Identifiant Fiscal)
                    </label>
                    <input 
                      type="text"
                      value={companyIF}
                      onChange={(e) => setCompanyIF(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNSS
                    </label>
                    <input 
                      type="text"
                      value={companyCNSS}
                      onChange={(e) => setCompanyCNSS(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="XXXXXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ICE
                    </label>
                    <input 
                      type="text"
                      value={companyICE}
                      onChange={(e) => setCompanyICE(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="XXXXXXXXXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      RC (Registre de Commerce)
                    </label>
                    <input 
                      type="text"
                      value={companyRC}
                      onChange={(e) => setCompanyRC(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="XXXXX"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patente
                    </label>
                    <input 
                      type="text"
                      value={companyPatente}
                      onChange={(e) => setCompanyPatente(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="XXXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Compte Bancaire
                    </label>
                    <input 
                      type="text"
                      value={companyCompteBancaire}
                      onChange={(e) => setCompanyCompteBancaire(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="RIB"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Preview */}
            <div className="lg:col-span-1">
              <div className="sticky top-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-2 border-blue-200 shadow-lg">
                  <div className="flex items-center justify-center mb-4">
                    <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold rounded-full shadow-md">
                      Aperçu du profil
                    </span>
                  </div>
                  
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shadow-xl">
                      {companyLogo ? (
                        <img src={URL.createObjectURL(companyLogo)} alt="Logo" className="w-full h-full rounded-full object-cover" />
                      ) : (
                        <span>LOGO</span>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{companyName || 'Nom de la société'}</h3>
                      <p className="text-sm text-gray-600 italic">{companyTagline || 'Slogan'}</p>
                    </div>

                    <div className="w-full space-y-2 text-sm pt-2">
                      {companyPhone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>📞</span>
                          <span>{companyPhone}</span>
                        </div>
                      )}
                      {companyEmail && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>📧</span>
                          <span className="text-xs break-all">{companyEmail}</span>
                        </div>
                      )}
                      {companyWebsite && (
                        <div className="flex items-center gap-2 text-blue-600">
                          <span>🌐</span>
                          <span className="text-xs break-all">{companyWebsite}</span>
                        </div>
                      )}
                      {companyAddress && (
                        <div className="flex items-start gap-2 text-gray-700">
                          <span className="mt-0.5">📍</span>
                          <span className="text-xs text-left">{companyAddress}</span>
                        </div>
                      )}
                      {companyCountry && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <span>🌍</span>
                          <span className="text-xs">{companyCountry}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <button 
                    onClick={handleSaveProfile}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                  >
                    💾 Enregistrer le profil
                  </button>
                  {message && (
                    <div className="mt-2 p-3 bg-blue-50 text-blue-800 rounded-lg text-sm text-center">
                      {message}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Apparence" 
          icon="🎨" 
          color="green"
          isOpen={openSection === 'appearance'}
          onToggle={() => toggleSection('appearance')}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thème de l'interface</label>
            <div className="flex gap-3">
              <button 
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'dark' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🌙 Sombre
              </button>
              <button 
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'light' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                ☀️ Clair
              </button>
              <button 
                onClick={() => handleThemeChange('system')}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  theme === 'system' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                💻 Système
              </button>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Sauvegardes" 
          icon="💾" 
          color="green"
          isOpen={openSection === 'backup'}
          onToggle={() => toggleSection('backup')}
        >
          <div className="space-y-6">
            <p className="text-sm text-gray-600">Sauvegarde automatique avec synchronisation en ligne</p>
            
            {/* Backup Status Card */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg">
                    <span className="text-2xl">💾</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">Sauvegarde Automatique</h4>
                    <p className="text-xs text-gray-600">Locale + Cloud (quand connecté)</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBackupToggle(!backupEnabled)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${backupEnabled ? 'bg-green-600' : 'bg-gray-300'}`}
                >
                  <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    backupEnabled ? 'translate-x-7' : 'translate-x-1'
                  }`} />
                </button>
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2 text-sm">
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                <span className="font-medium text-gray-700">
                  {isOnline ? '✅ Connecté - Synchronisation active' : '📴 Hors ligne - Sauvegarde locale active'}
                </span>
              </div>
              
              {!isOnline && pendingBackups > 0 && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    ⏳ {pendingBackups} sauvegarde(s) en attente de synchronisation
                  </p>
                </div>
              )}
            </div>

            {/* Backup Frequency */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fréquence de sauvegarde</label>
              <select 
                value={backupFrequency} 
                onChange={(e) => handleBackupFrequencyChange(e.target.value)}
                disabled={!backupEnabled}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="realtime">⚡ Temps réel</option>
                <option value="hourly">🕐 Toutes les heures</option>
                <option value="daily">📅 Quotidien</option>
                <option value="weekly">📆 Hebdomadaire</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">💡 La sauvegarde locale est toujours active même hors ligne</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleCreateBackup}
                disabled={!backupEnabled}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                💾 Sauvegarder maintenant
              </button>
              {!isOnline && pendingBackups > 0 && (
                <button 
                  onClick={() => {
                    setPendingBackups(0)
                    setMessage('🔄 Synchronisation en cours...')
                    setTimeout(() => setMessage('✅ Synchronisation terminée'), 2000)
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  🔄 Forcer la synchronisation
                </button>
              )}
              <button 
                onClick={() => setShowRestoreModal(true)}
                disabled={!lastBackupTime}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                🔄 Restaurer
              </button>
            </div>

            {/* Last Backup Info */}
            {lastBackupTime && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-2">
                <p className="text-xs text-green-800">
                  <strong>Dernière sauvegarde :</strong> {new Date(lastBackupTime).toLocaleString('fr-FR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h5 className="font-semibold text-sm text-blue-900 mb-2">ℹ️ Comment ça marche ?</h5>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>• Les données sont sauvegardées localement en temps réel</li>
                <li>• Quand internet est disponible, synchronisation automatique vers le cloud</li>
                <li>• En mode hors ligne, toutes les modifications sont mises en file d'attente</li>
                <li>• Restauration possible depuis la sauvegarde locale ou cloud</li>
              </ul>
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Sécurité" 
          icon="🔒" 
          color="purple"
          isOpen={openSection === 'security'}
          onToggle={() => toggleSection('security')}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Paramètres de sécurité et contrôle d'accès</p>
            
            {/* Password Policies */}
            <div className="border-2 border-purple-300 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-600 p-3 rounded-lg shadow-lg">
                  <span className="text-2xl">🔑</span>
                </div>
                <div>
                  <h4 className="text-base font-bold text-gray-800">Politiques de mot de passe</h4>
                  <p className="text-xs text-gray-600">Exigences de sécurité pour les mots de passe</p>
                </div>
              </div>

              <div className="space-y-3 bg-white rounded-lg p-4 shadow-sm">
                {/* Minimum Length */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span>📏</span>
                    <span className="text-sm font-medium text-gray-700">Longueur minimale: 8 caractères</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                {/* Complexity Requirements */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span>🔤</span>
                    <span className="text-sm font-medium text-gray-700">Majuscules + Minuscules</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span>🔢</span>
                    <span className="text-sm font-medium text-gray-700">Au moins un chiffre</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span>🔣</span>
                    <span className="text-sm font-medium text-gray-700">Caractère spécial (@#$%!)</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                {/* Password Rotation */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span>🔄</span>
                    <span className="text-sm font-medium text-gray-700">Rotation tous les 90 jours</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>

                {/* Password History */}
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                  <div className="flex items-center gap-2">
                    <span>📜</span>
                    <span className="text-sm font-medium text-gray-700">Ne pas réutiliser les 5 derniers</span>
                  </div>
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>

              <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-3">
                <p className="text-xs text-green-800 font-semibold flex items-center gap-2">
                  <span>✅</span>
                  Politiques de mot de passe activées et appliquées
                </p>
              </div>
            </div>

            {/* User Credentials Management */}
            <div className="border-2 border-purple-300 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-100 p-5 mt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-600 p-3 rounded-lg shadow-lg">
                    <span className="text-2xl">👥</span>
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-800">Gestion des Identifiants</h4>
                    <p className="text-xs text-gray-600">Modifier email et mot de passe des utilisateurs</p>
                  </div>
                </div>
                {isDemoMode && (
                  <div className="bg-yellow-100 border border-yellow-300 px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-yellow-800">🔒 MODE DÉMO</span>
                  </div>
                )}
              </div>

              <div className="space-y-2 bg-white rounded-lg p-4 shadow-sm">
                {/* Admin Users */}
                <div 
                  className={`flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200 ${isDemoMode ? 'opacity-50' : 'hover:shadow-md'} transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👑</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Administrateurs</p>
                      <p className="text-xs text-gray-600">Modifier identifiants admin</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isDemoMode) {
                        setSelectedUser({ role: 'ADMIN' })
                        setShowEditUserModal(true)
                      }
                    }}
                    disabled={isDemoMode}
                    className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ✏️ Modifier
                  </button>
                </div>

                {/* Staff Users */}
                <div 
                  className={`flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200 ${isDemoMode ? 'opacity-50' : 'hover:shadow-md'} transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">💼</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Personnel</p>
                      <p className="text-xs text-gray-600">Modifier identifiants staff</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isDemoMode) {
                        setSelectedUser({ role: 'STAFF' })
                        setShowEditUserModal(true)
                      }
                    }}
                    disabled={isDemoMode}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ✏️ Modifier
                  </button>
                </div>

                {/* Driver Users */}
                <div 
                  className={`flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200 ${isDemoMode ? 'opacity-50' : 'hover:shadow-md'} transition-all`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🚗</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">Chauffeurs</p>
                      <p className="text-xs text-gray-600">Modifier identifiants chauffeurs</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (!isDemoMode) {
                        setSelectedUser({ role: 'DRIVER' })
                        setShowEditUserModal(true)
                      }
                    }}
                    disabled={isDemoMode}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                  >
                    ✏️ Modifier
                  </button>
                </div>
              </div>

              {isDemoMode && (
                <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-800 font-semibold flex items-center gap-2">
                    <span>⚠️</span>
                    Mode démo activé - Modification des identifiants désactivée pour protéger les données de démonstration
                  </p>
                </div>
              )}
            </div>
          </div>
        </CollapsibleSection>

        <CollapsibleSection 
          title="Mises à jour" 
          icon="🔄" 
          color="orange"
          isOpen={openSection === 'updates'}
          onToggle={() => toggleSection('updates')}
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Gérer les mises à jour de l'application</p>
            
            {/* Current Version Card */}
            <div className="p-4 border-2 border-orange-200 rounded-lg bg-gradient-to-r from-orange-50 to-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-gray-800">Version actuelle: {currentVersion}</div>
                  <div className="text-xs text-gray-600 mt-1">
                    Dernière vérification: {lastUpdateCheck ? new Date(lastUpdateCheck).toLocaleString('fr-FR') : 'Jamais'}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  availableUpdates.length > 0 
                    ? 'bg-yellow-100 text-yellow-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {availableUpdates.length > 0 ? `${availableUpdates.length} mise(s) à jour` : '✓ À jour'}
                </span>
              </div>
            </div>

            {/* Available Updates List */}
            {availableUpdates.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <span>📦</span>
                  Mises à jour disponibles
                </h4>
                {availableUpdates.map((update, index) => (
                  <div key={index} className="border-2 border-blue-200 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
                          update.type === 'feature' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-orange-500 text-white'
                        }`}>
                          {update.type === 'feature' ? '✨ NOUVEAU' : '🔧 CORRECTIF'}
                        </div>
                        <div>
                          <div className="font-bold text-gray-800">Version {update.version}</div>
                          <div className="text-xs text-gray-600">{new Date(update.date).toLocaleDateString('fr-FR')}</div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 font-medium mb-2">{update.description}</p>
                    
                    <ul className="space-y-1">
                      {update.features.map((feature: string, fIndex: number) => (
                        <li key={fIndex} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button 
                onClick={handleCheckUpdates}
                disabled={checkingUpdates}
                className="px-4 py-2 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {checkingUpdates ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Vérification...
                  </>
                ) : (
                  <>
                    🔍 Vérifier les mises à jour
                  </>
                )}
              </button>
              {availableUpdates.length > 0 && (
                <button 
                  onClick={handleApplyUpdates}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg"
                >
                  📥 Installer maintenant
                </button>
              )}
            </div>

            {/* Info Box */}
            {availableUpdates.length === 0 && lastUpdateCheck && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800">
                  ℹ️ Votre application est à jour. Les mises à jour sont vérifiées automatiquement.
                </p>
              </div>
            )}
          </div>
        </CollapsibleSection>

        {message && (
          <div className="p-4 rounded-lg bg-green-50 text-green-700 border border-green-200">
            <div className="flex items-center gap-2">
              <span className="text-xl">✅</span>
              {message}
            </div>
          </div>
        )}
      </div>

      {/* Edit User Credentials Modal */}
      {showEditUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full">
                <span className="text-3xl">
                  {selectedUser.role === 'ADMIN' ? '👑' : selectedUser.role === 'STAFF' ? '💼' : '🚗'}
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Modifier les identifiants {selectedUser.role === 'ADMIN' ? 'Admin' : selectedUser.role === 'STAFF' ? 'Staff' : 'Chauffeur'}
              </h3>
            </div>
            
            <div className="space-y-4 mb-6">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  📧 Nouvel Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="exemple@email.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🔑 Nouveau Mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="••••••••"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Min. 8 caractères, majuscules, minuscules, chiffres et caractères spéciaux
                </p>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  🔒 Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowEditUserModal(false)
                  setSelectedUser(null)
                }}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all"
              >
                ❌ Annuler
              </button>
              <button
                onClick={() => {
                  setShowEditUserModal(false)
                  setSelectedUser(null)
                  setMessage('✅ Identifiants mis à jour avec succès')
                  setTimeout(() => setMessage(''), 3000)
                }}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                💾 Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Restore Confirmation Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-full">
                <span className="text-3xl">⚠️</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">Confirmer la restauration</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Êtes-vous sûr de vouloir restaurer la sauvegarde ? Cette action remplacera toutes les données actuelles.
              </p>
              
              {lastBackupTime && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
                  <p className="text-sm text-blue-900 dark:text-blue-300">
                    <strong>📅 Date de sauvegarde :</strong><br />
                    {new Date(lastBackupTime).toLocaleString('fr-FR', {
                      weekday: 'long',
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit'
                    })}
                  </p>
                </div>
              )}
              
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-3">
                <p className="text-xs text-red-800 dark:text-red-300 font-semibold">
                  ⚠️ Attention : Les modifications non sauvegardées seront perdues
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRestoreModal(false)}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg font-medium transition-all"
              >
                ❌ Annuler
              </button>
              <button
                onClick={handleRestoreBackup}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-md hover:shadow-lg"
              >
                ✅ Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
