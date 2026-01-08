"use client"
import React from 'react';
import Link from 'next/link';
import { useAuth } from '../../lib/auth';
import { useRouter } from 'next/navigation';

export default function DashboardStaff() {
  const { user } = useAuth();
  const router = useRouter();
  React.useEffect(() => {
    if (!user || user.role !== 'STAFF') {
      router.replace('/login');
    }
  }, [user, router]);
  if (!user || user.role !== 'STAFF') return null;
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord Secrétaire</h1>
        <div className="grid grid-cols-1 gap-6">
          {/* Tasks Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-2 text-blue-600 flex items-center gap-2">📝 Tâches</h2>
            <ul className="text-gray-700 list-disc pl-5">
              <li>Vérifier les nouveaux documents reçus</li>
              <li>Suivre les demandes de rendez-vous</li>
              <li>Envoyer les factures en attente</li>
              {/* Ajouter dynamiquement les tâches ici */}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
