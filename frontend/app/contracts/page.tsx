import Link from 'next/link'

export default function ContractsIndex() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-blue-600 text-white p-4 rounded-t-lg">
        <h1 className="text-xl font-bold">Contrats</h1>
      </div>
      <div className="bg-white p-6 rounded-b-lg shadow-lg">
        <p className="mb-4">Gérez vos contrats ici.</p>
        <div className="flex gap-2">
          <Link href="/contracts/create" className="bg-green-600 text-white px-4 py-2 rounded">Créer un contrat</Link>
        </div>
      </div>
    </div>
  )
}
