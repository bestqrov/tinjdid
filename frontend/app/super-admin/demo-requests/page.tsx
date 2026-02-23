'use client'

import { useEffect, useState } from 'react'
import { safeFetchJson } from '@/lib/safeFetch'
import PageHeader from '@/components/PageHeader'
import {
  Users,
  Building2,
  Mail,
  Phone,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react'

interface DemoRequest {
  id: string
  companyName: string
  fullName: string
  email: string
  phone: string
  fleetSize: string
  interestedPlan: string
  message?: string
  status: 'NEW' | 'CONTACTED' | 'CONVERTED' | 'REJECTED'
  createdAt: string
  updatedAt: string
}

interface Stats {
  total: number
  new: number
  contacted: number
  converted: number
  rejected: number
  conversionRate: string
}

export default function DemoRequestsPage() {
  const [requests, setRequests] = useState<DemoRequest[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedRequest, setSelectedRequest] = useState<DemoRequest | null>(null)

  useEffect(() => {
    fetchData()
  }, [selectedStatus])

  const fetchData = async () => {
    try {
      const statusParam = selectedStatus !== 'all' ? `?status=${selectedStatus}` : ''
      const [requestsData, statsData] = await Promise.all([
        safeFetchJson(`/demo-requests${statusParam}`),
        safeFetchJson('/demo-requests/stats'),
      ])
      setRequests(requestsData)
      setStats(statsData)
    } catch (error) {
      console.error('Failed to fetch demo requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: string) => {
    try {
      await safeFetchJson(`/demo-requests/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      fetchData()
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const deleteRequest = async (id: string) => {
    if (!confirm('Are you sure you want to delete this demo request?')) return

    try {
      await safeFetchJson(`/demo-requests/${id}`, {
        method: 'DELETE',
      })
      fetchData()
      setSelectedRequest(null)
    } catch (error) {
      console.error('Failed to delete request:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const styles = {
      NEW: 'bg-blue-100 text-blue-700 border-blue-200',
      CONTACTED: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      CONVERTED: 'bg-green-100 text-green-700 border-green-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
    }
    return styles[status as keyof typeof styles] || styles.NEW
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'NEW':
        return <Clock className="w-4 h-4" />
      case 'CONTACTED':
        return <Phone className="w-4 h-4" />
      case 'CONVERTED':
        return <CheckCircle2 className="w-4 h-4" />
      case 'REJECTED':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Demo Requests"
      />

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Total</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg shadow border border-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-blue-600">New</span>
            </div>
            <p className="text-2xl font-bold text-blue-700">{stats.new}</p>
          </div>

          <div className="bg-yellow-50 p-4 rounded-lg shadow border border-yellow-200">
            <div className="flex items-center gap-2 mb-1">
              <Phone className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-yellow-600">Contacted</span>
            </div>
            <p className="text-2xl font-bold text-yellow-700">{stats.contacted}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg shadow border border-green-200">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-600">Converted</span>
            </div>
            <p className="text-2xl font-bold text-green-700">{stats.converted}</p>
          </div>

          <div className="bg-red-50 p-4 rounded-lg shadow border border-red-200">
            <div className="flex items-center gap-2 mb-1">
              <XCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">Rejected</span>
            </div>
            <p className="text-2xl font-bold text-red-700">{stats.rejected}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg shadow border border-purple-200">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-600">Conv. Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-700">{stats.conversionRate}%</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedStatus === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Requests
          </button>
          <button
            onClick={() => setSelectedStatus('NEW')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedStatus === 'NEW'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            New
          </button>
          <button
            onClick={() => setSelectedStatus('CONTACTED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedStatus === 'CONTACTED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Contacted
          </button>
          <button
            onClick={() => setSelectedStatus('CONVERTED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedStatus === 'CONVERTED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Converted
          </button>
          <button
            onClick={() => setSelectedStatus('REJECTED')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedStatus === 'REJECTED'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Contact</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Fleet Size</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Plan</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                    No demo requests found
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">{request.companyName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{request.fullName}</p>
                        <p className="text-gray-500 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {request.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{request.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {request.fleetSize} vehicles
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700">
                        {request.interestedPlan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={request.status}
                        onChange={(e) => updateStatus(request.id, e.target.value)}
                        className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(
                          request.status
                        )}`}
                      >
                        <option value="NEW">New</option>
                        <option value="CONTACTED">Contacted</option>
                        <option value="CONVERTED">Converted</option>
                        <option value="REJECTED">Rejected</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(request.createdAt).toLocaleDateString('fr-MA')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedRequest(request)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteRequest(request.id)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Demo Request Details</h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-full border ${getStatusBadge(
                    selectedRequest.status
                  )}`}
                >
                  {getStatusIcon(selectedRequest.status)}
                  {selectedRequest.status}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(selectedRequest.createdAt).toLocaleString('fr-MA')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Company Name</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.companyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Contact Person</label>
                  <p className="text-lg font-semibold text-gray-900">{selectedRequest.fullName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Email</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {selectedRequest.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {selectedRequest.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Fleet Size</label>
                  <p className="text-gray-900">{selectedRequest.fleetSize} vehicles</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Interested Plan</label>
                  <p className="text-gray-900 font-semibold">{selectedRequest.interestedPlan}</p>
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Message</label>
                  <p className="text-gray-700 bg-gray-50 p-4 rounded-lg mt-1">
                    {selectedRequest.message}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <label className="text-sm font-medium text-gray-500 block mb-2">Update Status</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'CONTACTED')
                      setSelectedRequest(null)
                    }}
                    className="flex-1 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 transition"
                  >
                    Mark as Contacted
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'CONVERTED')
                      setSelectedRequest(null)
                    }}
                    className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-200 transition"
                  >
                    Mark as Converted
                  </button>
                  <button
                    onClick={() => {
                      updateStatus(selectedRequest.id, 'REJECTED')
                      setSelectedRequest(null)
                    }}
                    className="flex-1 bg-red-100 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-200 transition"
                  >
                    Mark as Rejected
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
