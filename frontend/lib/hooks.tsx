"use client"
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from './axios'

export function useDashboard(companyId?: string, start?: string, end?: string) {
  return useQuery({
    queryKey: ['dashboard', companyId, start, end],
    queryFn: async () => {
      const res = await axios.get('finance/dashboard/stats', { params: { companyId, start, end } })
      return res.data
    }
  })
}

export function useDownloadInvoicePdf() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.get(`finance/invoices/${id}/pdf`, { responseType: 'blob' })
      return res.data
    }
  })
}

export function useDownloadQuotePdf() {
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await axios.get(`finance/quotes/${id}/pdf`, { responseType: 'blob' })
      return res.data
    }
  })
}

export function useTripProfit(id?: string) {
  return useQuery({
    queryKey: ['trip', 'profit', id],
    queryFn: async () => {
      if (!id) return null
      const res = await axios.get(`trips/${id}/profit`)
      return res.data
    },
    enabled: !!id
  })
}

export function useDrivers(companyId?: string) {
  return useQuery({
    queryKey: ['drivers', companyId],
    queryFn: async () => {
      const res = await axios.get(`drivers?companyId=${companyId}`)
      return res.data
    }
  })
}

export function useDriver(id?: string) {
  return useQuery({
    queryKey: ['driver', id],
    queryFn: async () => {
      if (!id) return null
      const res = await axios.get(`drivers/${id}`)
      return res.data
    },
    enabled: !!id
  })
}
