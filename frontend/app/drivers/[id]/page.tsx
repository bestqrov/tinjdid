"use client"
import { useQuery } from '@tanstack/react-query'
import { useParams, useRouter } from 'next/navigation'
import axios from '../../../lib/axios'
import Card from '../../../components/Card'
import Link from 'next/link'

export default function DriverDetail() {
  const params = useParams()
  const id = (params as any)?.id
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['driver', id],
    queryFn: async () => {
      const res = await axios.get(`/drivers/${id}`)
      return res.data
    },
    enabled: !!id
  })

  async function remove() {
    if (!confirm('Supprimer ce chauffeur ?')) return
    try {
      await axios.delete(`/drivers/${id}`)
      router.push('/drivers')
    } catch (error) {
      alert('Erreur lors de la suppression')
    }
  }

  if (isLoading) return <div className="flex justify-center items-center h-32"><div className="text-sm">Chargement...</div></div>

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <span className="text-3xl">👨‍🚗</span>
          {data?.name}
        </h1>
        <div className="flex gap-2">
          <Link href={`/drivers/${id}/edit`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
            <span>✏️</span>
            Modifier
          </Link>
          <button onClick={remove} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 text-sm transition-colors">
            <span>🗑️</span>
            Supprimer
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Informations personnelles" icon="👤">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-600">Nom:</span>
              <p className="font-medium">{data?.name}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Email:</span>
              <p className="font-medium">{data?.email || 'Non spécifié'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Adresse:</span>
              <p className="font-medium">{data?.address || 'Non spécifiée'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Numéro CIN:</span>
              <p className="font-medium">{data?.cinNumber || 'Non spécifié'}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Statut:</span>
              <p className={`font-medium ${data?.available ? 'text-green-600' : 'text-red-600'}`}>
                {data?.available ? '✅ Disponible' : '❌ Indisponible'}
              </p>
            </div>
          </div>
        </Card>

        <Card title="Contact" icon="📞">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-600">📱 Téléphone:</span>
              <p className="font-medium">{data?.phone}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">💬 WhatsApp:</span>
              <p className="font-medium">{data?.whatsapp || 'Non spécifié'}</p>
            </div>
          </div>
        </Card>

        <Card title="Langues parlées" icon="🌍">
          <div className="space-y-2">
            {data?.languages?.length > 0 ? (
              data.languages.map((lang: string, index: number) => (
                <span key={index} className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm mr-2 mb-2">
                  {lang}
                </span>
              ))
            ) : (
              <p className="text-slate-500 text-sm">Aucune langue spécifiée</p>
            )}
          </div>
        </Card>

        <Card title="Véhicule assigné" icon="🚗">
          <div className="space-y-3">
            {data?.vehicle ? (
              <>
                <div>
                  <span className="text-sm text-slate-600">Plaque:</span>
                  <p className="font-medium">{data.vehicle.plate}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Type:</span>
                  <p className="font-medium">{data.vehicle.type}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600">Capacité:</span>
                  <p className="font-medium">{data.vehicle.capacity} passagers</p>
                </div>
              </>
            ) : (
              <p className="text-slate-500 text-sm">Aucun véhicule assigné</p>
            )}
          </div>
        </Card>

        <Card title="Documents" icon="📎">
          <div className="space-y-3">
            {data?.driverPhoto ? (
              <div>
                <span className="text-sm text-slate-600">📸 Photo:</span>
                <div className="mt-1">
                  <img src={data.driverPhoto} alt="Driver photo" className="w-20 h-20 object-cover rounded-lg border" />
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">📸 Aucune photo</p>
            )}

            {data?.driverLicense ? (
              <div>
                <span className="text-sm text-slate-600">🚗 Permis:</span>
                <div className="mt-1">
                  <a href={data.driverLicense} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                    📄 Voir le permis
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">🚗 Aucun permis</p>
            )}

            {data?.cin ? (
              <div>
                <span className="text-sm text-slate-600">🆔 CIN:</span>
                <div className="mt-1">
                  <a href={data.cin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                    📄 Voir la CIN
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">🆔 Aucune CIN</p>
            )}

            {data?.cv ? (
              <div>
                <span className="text-sm text-slate-600">📄 CV:</span>
                <div className="mt-1">
                  <a href={data.cv} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 text-sm underline">
                    📄 Voir le CV
                  </a>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 text-sm">📄 Aucun CV</p>
            )}
          </div>
        </Card>

        <Card title="Statistiques" icon="📊">
          <div className="space-y-3">
            <div>
              <span className="text-sm text-slate-600">Trajets effectués:</span>
              <p className="font-medium text-lg">{data?.trips?.length || 0}</p>
            </div>
            <div>
              <span className="text-sm text-slate-600">Date d'ajout:</span>
              <p className="font-medium">{new Date(data?.createdAt).toLocaleDateString('fr-FR')}</p>
            </div>
          </div>
        </Card>
      </div>

      {data?.trips?.length > 0 && (
        <Card title="Trajets récents" icon="📅" className="mt-6">
          <div className="space-y-2">
            {data.trips.slice(0, 5).map((trip: any) => (
              <div key={trip.id} className="flex justify-between items-center p-3 bg-slate-50 rounded">
                <div>
                  <p className="font-medium">{trip.pickup} → {trip.dropoff}</p>
                  <p className="text-sm text-slate-600">{new Date(trip.date).toLocaleDateString('fr-FR')}</p>
                </div>
                <span className="text-sm font-medium">{trip.price} MAD</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}