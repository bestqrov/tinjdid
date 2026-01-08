"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import axios from '../lib/axios'

interface CompanyProfile {
  name: string
  logo?: string
  tagline?: string
}

interface PageHeaderProps {
  title: string
  gradientFrom?: string
  gradientTo?: string
  children?: React.ReactNode
}

export default function PageHeader({ 
  title, 
  gradientFrom = 'blue-600', 
  gradientTo = 'blue-700',
  children 
}: PageHeaderProps) {
  const [companyProfile, setCompanyProfile] = useState<CompanyProfile | null>(null)

  useEffect(() => {
    const loadCompanyProfile = async () => {
      try {
        const response = await axios.get('/settings/company-profile')
        setCompanyProfile(response.data)
      } catch (error) {
        console.error('Error loading company profile:', error)
      }
    }
    loadCompanyProfile()
  }, [])

  return (
    <div className={`bg-gradient-to-r from-${gradientFrom} to-${gradientTo} text-white p-6 rounded-t-lg shadow-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {companyProfile?.logo && (
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 backdrop-blur-sm">
              <Image
                src={`http://localhost:3001${companyProfile.logo}`}
                alt={companyProfile.name || 'Company Logo'}
                fill
                className="object-contain p-1"
              />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {companyProfile?.name && (
              <p className="text-sm text-white/80 mt-1">{companyProfile.name}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
