"use client"
import { useState } from 'react'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import axios from '../../lib/axios'
import FormSection from '../../components/FormSection'
import PageHeader from '../../components/PageHeader'

export default function VehiclesPage() {
  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') || '' : ''
  const qc = useQueryClient()
  
  const [showForm, setShowForm] = useState(false)

  // Vehicle fields
  const [immatricule, setImmatricule] = useState('')
  const [typeAcquisition, setTypeAcquisition] = useState('ACHAT')
  const [nom, setNom] = useState('')
  const [code, setCode] = useState('')
  const [dateMiseEnCirculation, setDateMiseEnCirculation] = useState('')
  const [centreCout, setCentreCout] = useState('')
  const [numeroOrdre, setNumeroOrdre] = useState('')
  const [carteGrise, setCarteGrise] = useState('')
  const [numeroChassis, setNumeroChassis] = useState('')
  const [numeroW, setNumeroW] = useState('')
  const [couleur, setCouleur] = useState('')
  const [codeCle, setCodeCle] = useState('')
  const [datePrevueRestitution, setDatePrevueRestitution] = useState('')
  const [kilometrageInitial, setKilometrageInitial] = useState('0')
  const [indiceHoraireInitial, setIndiceHoraireInitial] = useState('0')
  const [photoPrincipale, setPhotoPrincipale] = useState<File | null>(null)
  const [commentaire, setCommentaire] = useState('')

  // Model fields
  const [modele, setModele] = useState('')

  // Acquisition fields
  const [concessionnaire, setConcessionnaire] = useState('')
  const [dateAchat, setDateAchat] = useState('')
  const [numeroContrat, setNumeroContrat] = useState('')
  const [garantie, setGarantie] = useState('')
  const [montantHT, setMontantHT] = useState('0.00')
  const [tva, setTva] = useState('0.00')

  // Validation functions
  const isImmatriculValid = immatricule.length >= 3
  const isNomValid = nom.length === 0 || nom.length >= 2
  const isCodeValid = code.length === 0 || code.length >= 2
  const isDateMiseEnCirculationValid = !dateMiseEnCirculation || new Date(dateMiseEnCirculation) <= new Date()
  const isDatePrevueRestitutionValid = !datePrevueRestitution || new Date(datePrevueRestitution) >= new Date()
  const isDateAchatValid = !dateAchat || new Date(dateAchat) <= new Date()
  const isKilometrageValid = parseFloat(kilometrageInitial) >= 0
  const isIndiceHoraireValid = parseFloat(indiceHoraireInitial) >= 0
  const isMontantHTValid = parseFloat(montantHT) >= 0
  const isTvaValid = parseFloat(tva) >= 0 && parseFloat(tva) <= 100
  const isPhotoValid = !photoPrincipale || photoPrincipale.size <= 5 * 1024 * 1024 // 5MB
  const isFormValid = isImmatriculValid && isNomValid && isCodeValid && isDateMiseEnCirculationValid && 
                      isDatePrevueRestitutionValid && isDateAchatValid && isKilometrageValid && 
                      isIndiceHoraireValid && isMontantHTValid && isTvaValid && isPhotoValid

  // Query vehicles
  const { data: vehicles = [] } = useQuery({
    queryKey: ['vehicles', companyId],
    queryFn: async () => {
      const res = await axios.get(`/vehicles?companyId=${companyId}`)
      return res.data
    },
    enabled: !!companyId,
  })

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      console.log('Sending vehicle data:', payload)
      const formData = new FormData()
      Object.keys(payload).forEach(key => {
        if (payload[key] !== null && payload[key] !== undefined && payload[key] !== '') {
          formData.append(key, payload[key])
        }
      })
      console.log('FormData entries:', Array.from(formData.entries()))
      const response = await axios.post(`/vehicles?companyId=${companyId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      return response.data
    },
    onSuccess() {
      alert('✓ Véhicule ajouté avec succès!')
      qc.invalidateQueries({ queryKey: ['vehicles', companyId] })
      resetForm()
      setShowForm(false)
    },
    onError(error: any) {
      console.error('=== ERROR DETAILS ===')
      console.error('Full error object:', error)
      console.error('Error response:', error.response)
      console.error('Error response data:', error.response?.data)
      console.error('Error status:', error.response?.status)
      console.error('=====================')
      
      let errorMsg = 'Erreur inconnue'
      
      if (error.response?.data?.message) {
        const msg = error.response.data.message
        if (Array.isArray(msg)) {
          errorMsg = msg.join('\n• ')
          errorMsg = '• ' + errorMsg
        } else {
          errorMsg = msg
        }
      } else if (error.message) {
        errorMsg = error.message
      }
      
      alert('✗ Erreur lors de l\'ajout du véhicule:\n\n' + errorMsg)
    }
  })

  function resetForm() {
    setImmatricule('')
    setNom('')
    setCode('')
    setDateMiseEnCirculation('')
    setCentreCout('')
    setNumeroOrdre('')
    setCarteGrise('')
    setNumeroChassis('')
    setNumeroW('')
    setCouleur('')
    setCodeCle('')
    setDatePrevueRestitution('')
    setKilometrageInitial('0')
    setIndiceHoraireInitial('0')
    setPhotoPrincipale(null)
    setCommentaire('')
    setModele('')
    setConcessionnaire('')
    setDateAchat('')
    setNumeroContrat('')
    setGarantie('')
    setMontantHT('0.00')
    setTva('0.00')
  }

  function onSubmit(e: any) {
    e.preventDefault()
    
    // Validate required field
    if (!immatricule || immatricule.length < 3) {
      alert('⚠️ L\'immatricule est obligatoire et doit contenir au moins 3 caractères')
      return
    }
    
    // Build clean payload - only include fields with values
    const payload: any = {
      immatricule: immatricule.trim(),
      typeAcquisition
    }
    
    // Add optional string fields
    if (nom) payload.nom = nom.trim()
    if (code) payload.code = code.trim()
    if (centreCout) payload.centreCout = centreCout.trim()
    if (numeroOrdre) payload.numeroOrdre = numeroOrdre.trim()
    if (carteGrise) payload.carteGrise = carteGrise.trim()
    if (numeroChassis) payload.numeroChassis = numeroChassis.trim()
    if (numeroW) payload.numeroW = numeroW.trim()
    if (couleur) payload.couleur = couleur.trim()
    if (codeCle) payload.codeCle = codeCle.trim()
    if (commentaire) payload.commentaire = commentaire.trim()
    if (modele) payload.modele = modele.trim()
    if (concessionnaire) payload.concessionnaire = concessionnaire.trim()
    if (numeroContrat) payload.numeroContrat = numeroContrat.trim()
    if (garantie) payload.garantie = garantie.trim()
    
    // Add date fields
    if (dateMiseEnCirculation) payload.dateMiseEnCirculation = dateMiseEnCirculation
    if (datePrevueRestitution) payload.datePrevueRestitution = datePrevueRestitution
    if (dateAchat) payload.dateAchat = dateAchat
    
    // Add numeric fields
    const kmValue = parseFloat(kilometrageInitial)
    if (!isNaN(kmValue) && kmValue > 0) payload.kilometrageInitial = kmValue
    
    const indiceValue = parseFloat(indiceHoraireInitial)
    if (!isNaN(indiceValue) && indiceValue > 0) payload.indiceHoraireInitial = indiceValue
    
    const montantValue = parseFloat(montantHT)
    if (!isNaN(montantValue) && montantValue > 0) payload.montantHT = montantValue
    
    const tvaValue = parseFloat(tva)
    if (!isNaN(tvaValue) && tvaValue >= 0) payload.tva = tvaValue
    
    // Add photo if present
    if (photoPrincipale) payload.photoPrincipale = photoPrincipale
    
    console.log('Submitting vehicle with payload:', payload)
    mutation.mutate(payload)
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <PageHeader 
        title="🚗 Véhicules" 
        gradientFrom="blue-600" 
        gradientTo="indigo-700"
      />

      <div className="bg-white rounded-b-lg shadow-lg p-6">
        {/* Vehicles List */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>📋</span>
              Liste des véhicules
            </h2>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              <span className="text-xl">{showForm ? '✕' : '+'}</span>
              {showForm ? 'Fermer le formulaire' : 'Ajouter un véhicule'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="p-3 text-left">Immatricule</th>
                  <th className="p-3 text-left">Nom</th>
                  <th className="p-3 text-left">Modèle</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Date circulation</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      Aucun véhicule enregistré
                    </td>
                  </tr>
                ) : (
                  vehicles.map((vehicle: any) => (
                    <tr key={vehicle.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-semibold">{vehicle.immatricule}</td>
                      <td className="p-3">{vehicle.nom}</td>
                      <td className="p-3">{vehicle.modele}</td>
                      <td className="p-3">{vehicle.typeAcquisition}</td>
                      <td className="p-3">{vehicle.dateMiseEnCirculation ? new Date(vehicle.dateMiseEnCirculation).toLocaleDateString('fr-FR') : '-'}</td>
                      <td className="p-3">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">✏️</button>
                        <button className="text-red-600 hover:text-red-800">🗑️</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Form - Toggle Visibility */}
        {showForm && (
        <form onSubmit={onSubmit} className="space-y-6 border-t pt-6">
          {/* Guide Box */}
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <div className="flex items-start gap-3 text-sm">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">i</div>
              <div>
                <p className="text-gray-700 font-medium mb-1">Guide d'utilisation :</p>
                <ul className="text-gray-600 space-y-1 text-xs">
                  <li>• Les champs marqués d'un <span className="text-red-600 font-bold">*</span> sont obligatoires</li>
                  <li>• <strong>Immatricule</strong> : Minimum 3 caractères (requis)</li>
                  <li>• <strong>Photo</strong> : Taille maximale 5 MB</li>
                  <li>• <strong>Dates</strong> : Vérifiez que les dates sont cohérentes</li>
                  <li>• Les indicateurs ✓ (vert) et ⚠️ (rouge) vous guident en temps réel</li>
                </ul>
              </div>
            </div>
          </div>
          {/* Véhicule Section */}
          <FormSection title="Véhicule" icon="🚙" color="blue">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Immatricule <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={immatricule}
                    onChange={(e) => setImmatricule(e.target.value)}
                    placeholder="Ex: 12345-A-67"
                    required
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      immatricule && !isImmatriculValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {immatricule && !isImmatriculValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="Minimum 3 caractères requis">⚠️</span>
                  )}
                  {immatricule && isImmatriculValid && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {immatricule && !isImmatriculValid ? (
                  <p className="text-xs text-red-600 mt-1">⚠️ L'immatricule doit contenir au moins 3 caractères</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Numéro d'immatriculation du véhicule</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'acquisition
                </label>
                <select
                  value={typeAcquisition}
                  onChange={(e) => setTypeAcquisition(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ACHAT">ACHAT</option>
                  <option value="LOCATION">LOCATION</option>
                  <option value="LEASING">LEASING</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date mise en circulation <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateMiseEnCirculation}
                    onChange={(e) => setDateMiseEnCirculation(e.target.value)}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      dateMiseEnCirculation && !isDateMiseEnCirculationValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {dateMiseEnCirculation && !isDateMiseEnCirculationValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="La date ne peut pas être dans le futur">⚠️</span>
                  )}
                  {dateMiseEnCirculation && isDateMiseEnCirculationValid && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {dateMiseEnCirculation && !isDateMiseEnCirculationValid ? (
                  <p className="text-xs text-red-600 mt-1">⚠️ La date ne peut pas être dans le futur</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Première date de circulation</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    placeholder="Ex: Véhicule de direction"
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      nom && !isNomValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {nom && !isNomValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="Minimum 2 caractères">⚠️</span>
                  )}
                  {nom && isNomValid && nom.length > 0 && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {nom && !isNomValid && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Le nom doit contenir au moins 2 caractères</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Centre de coût
                </label>
                <input
                  type="text"
                  value={centreCout}
                  onChange={(e) => setCentreCout(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Ex: VH-001"
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      code && !isCodeValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {code && !isCodeValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="Minimum 2 caractères">⚠️</span>
                  )}
                  {code && isCodeValid && code.length > 0 && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {code && !isCodeValid && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Le code doit contenir au moins 2 caractères</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro d'ordre
                </label>
                <input
                  type="text"
                  value={numeroOrdre}
                  onChange={(e) => setNumeroOrdre(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carte grise
                </label>
                <input
                  type="text"
                  value={carteGrise}
                  onChange={(e) => setCarteGrise(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  N° de châssis
                </label>
                <input
                  type="text"
                  value={numeroChassis}
                  onChange={(e) => setNumeroChassis(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro W
                </label>
                <input
                  type="text"
                  value={numeroW}
                  onChange={(e) => setNumeroW(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Couleur
                </label>
                <input
                  type="text"
                  value={couleur}
                  onChange={(e) => setCouleur(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code clé
                </label>
                <input
                  type="text"
                  value={codeCle}
                  onChange={(e) => setCodeCle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date prévue de restitution <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={datePrevueRestitution}
                    onChange={(e) => setDatePrevueRestitution(e.target.value)}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      datePrevueRestitution && !isDatePrevueRestitutionValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {datePrevueRestitution && !isDatePrevueRestitutionValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="La date doit être dans le futur">⚠️</span>
                  )}
                  {datePrevueRestitution && isDatePrevueRestitutionValid && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {datePrevueRestitution && !isDatePrevueRestitutionValid ? (
                  <p className="text-xs text-red-600 mt-1">⚠️ La date doit être dans le futur</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Pour les locations/leasing</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kilométrage initial (Km)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={kilometrageInitial}
                    onChange={(e) => setKilometrageInitial(e.target.value)}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isKilometrageValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {!isKilometrageValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="Doit être positif">⚠️</span>
                  )}
                  {isKilometrageValid && parseFloat(kilometrageInitial) > 0 && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {!isKilometrageValid && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Le kilométrage doit être positif</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Indice horaire initial (H)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={indiceHoraireInitial}
                    onChange={(e) => setIndiceHoraireInitial(e.target.value)}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      !isIndiceHoraireValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {!isIndiceHoraireValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="Doit être positif">⚠️</span>
                  )}
                  {isIndiceHoraireValid && parseFloat(indiceHoraireInitial) > 0 && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {!isIndiceHoraireValid && (
                  <p className="text-xs text-red-600 mt-1">⚠️ L'indice horaire doit être positif</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo principale <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoPrincipale(e.target.files?.[0] || null)}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm ${
                      photoPrincipale && !isPhotoValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                </div>
                {photoPrincipale && !isPhotoValid ? (
                  <p className="text-xs text-red-600 mt-1">⚠️ Le fichier est trop volumineux (max 5 MB)</p>
                ) : photoPrincipale && isPhotoValid ? (
                  <p className="text-xs text-green-600 mt-1">✓ Photo valide: {photoPrincipale.name}</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Image du véhicule - Max 5 MB</p>
                )}
              </div>

              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire
                </label>
                <textarea
                  value={commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </FormSection>

          {/* Modèle Section */}
          <FormSection title="Modèle" icon="🏷️" color="purple">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modèle
                </label>
                <input
                  type="text"
                  value={modele}
                  onChange={(e) => setModele(e.target.value)}
                  placeholder="Choisir"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </FormSection>

          {/* Acquisition achat Section */}
          <FormSection title="Acquisition achat" icon="💰" color="green">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Concessionnaire
                </label>
                <input
                  type="text"
                  value={concessionnaire}
                  onChange={(e) => setConcessionnaire(e.target.value)}
                  placeholder="Choisir"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date d'achat <span className="text-xs text-gray-500">(optionnel)</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={dateAchat}
                    onChange={(e) => setDateAchat(e.target.value)}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      dateAchat && !isDateAchatValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {dateAchat && !isDateAchatValid && (
                    <span className="absolute right-3 top-2.5 text-red-500" title="La date ne peut pas être dans le futur">⚠️</span>
                  )}
                  {dateAchat && isDateAchatValid && (
                    <span className="absolute right-3 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                </div>
                {dateAchat && !isDateAchatValid ? (
                  <p className="text-xs text-red-600 mt-1">⚠️ La date ne peut pas être dans le futur</p>
                ) : (
                  <p className="text-xs text-gray-500 mt-1">Date d'acquisition du véhicule</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro contrat
                </label>
                <input
                  type="text"
                  value={numeroContrat}
                  onChange={(e) => setNumeroContrat(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant HT (DH)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={montantHT}
                    onChange={(e) => setMontantHT(e.target.value)}
                    className={`w-full px-4 py-2 pr-16 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isMontantHTValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {!isMontantHTValid && (
                    <span className="absolute right-12 top-2.5 text-red-500" title="Doit être positif">⚠️</span>
                  )}
                  {isMontantHTValid && parseFloat(montantHT) > 0 && (
                    <span className="absolute right-12 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">DH</span>
                </div>
                {!isMontantHTValid && (
                  <p className="text-xs text-red-600 mt-1">⚠️ Le montant doit être positif</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Garantie
                </label>
                <input
                  type="text"
                  value={garantie}
                  onChange={(e) => setGarantie(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TVA (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={tva}
                    onChange={(e) => setTva(e.target.value)}
                    className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      !isTvaValid ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                  {!isTvaValid && (
                    <span className="absolute right-8 top-2.5 text-red-500" title="Entre 0 et 100">⚠️</span>
                  )}
                  {isTvaValid && parseFloat(tva) >= 0 && (
                    <span className="absolute right-8 top-2.5 text-green-500" title="Valide">✓</span>
                  )}
                  <span className="absolute right-3 top-2 text-gray-500 text-sm">%</span>
                </div>
                {!isTvaValid && (
                  <p className="text-xs text-red-600 mt-1">⚠️ La TVA doit être entre 0 et 100%</p>
                )}
              </div>
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                resetForm()
                setShowForm(false)
              }}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !isFormValid}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              title={!isFormValid ? 'Corrigez les erreurs avant de soumettre' : ''}
            >
              {mutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
        )}
      </div>
    </div>
  )
}
