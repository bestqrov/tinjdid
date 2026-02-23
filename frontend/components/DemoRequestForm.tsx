'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Mail, Phone, Users, Building2, CheckCircle2 } from 'lucide-react'

interface DemoFormData {
  companyName: string
  fullName: string
  email: string
  phone: string
  fleetSize: string
  interestedPlan: 'STARTER' | 'PRO' | 'ENTERPRISE'
  message?: string
}

interface DemoRequestFormProps {
  selectedPlan?: 'STARTER' | 'PRO' | 'ENTERPRISE'
  onClose?: () => void
}

export default function DemoRequestForm({ selectedPlan, onClose }: DemoRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<DemoFormData>({
    defaultValues: {
      interestedPlan: selectedPlan || 'STARTER',
    },
  })

  const onSubmit = async (data: DemoFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/demo-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to submit demo request')
      }

      setIsSuccess(true)
      setTimeout(() => {
        onClose?.()
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
        <p className="text-gray-600">
          Thank you for your interest. Our team will contact you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          <Building2 className="w-4 h-4" />
          Company Name *
        </label>
        <input
          type="text"
          {...register('companyName', { required: 'Company name is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your company name"
        />
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          {...register('fullName', { required: 'Full name is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Your full name"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          <Mail className="w-4 h-4" />
          Email Address *
        </label>
        <input
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address',
            },
          })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="you@company.com"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          <Phone className="w-4 h-4" />
          Phone Number *
        </label>
        <input
          type="tel"
          {...register('phone', { required: 'Phone number is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="+212 6XX XXX XXX"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
          <Users className="w-4 h-4" />
          Fleet Size *
        </label>
        <input
          type="number"
          {...register('fleetSize', { required: 'Fleet size is required', min: 1 })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Number of vehicles"
        />
        {errors.fleetSize && (
          <p className="text-red-500 text-sm mt-1">{errors.fleetSize.message}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Interested Plan *
        </label>
        <select
          {...register('interestedPlan', { required: true })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="STARTER">Starter Plan</option>
          <option value="PRO">Pro Plan</option>
          <option value="ENTERPRISE">Enterprise Plan</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Additional Message
        </label>
        <textarea
          {...register('message')}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Tell us about your needs..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Request Demo'}
      </button>

      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to receive communications from ArwaPark.
      </p>
    </form>
  )
}
