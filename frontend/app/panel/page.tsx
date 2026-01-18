"use client"
import Card from '../../components/Card'

export default function PanelPage() {
    return (
        <div className="max-w-7xl mx-auto space-y-3 pb-0">
            <h1 className="text-2xl font-bold">Tableau de bord (Re-created)</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Card title="Total Revenue" amount={1000} icon="💰" />
                <Card title="Total Users" amount={50} icon="👥" />
                <Card title="Status" amount={100} icon="✅" />
            </div>
            <div className="p-4 bg-white rounded shadow">
                <p>If you see this, the routing works perfectly.</p>
                <p>Charts are temporarily removed to verify page load.</p>
            </div>
        </div>
    )
}
