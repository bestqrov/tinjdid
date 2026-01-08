"use client"

import { useState } from 'react'
import Link from 'next/link'
import { 
  Truck, 
  MapPin, 
  FileText, 
  TrendingUp, 
  Shield, 
  Clock, 
  Users, 
  CheckCircle2,
  ArrowRight,
  Menu,
  X,
  Bell,
  ClipboardCheck,
  Bus,
  Car,
  Globe
} from 'lucide-react'
import DemoRequestForm from '@/components/DemoRequestForm'

type PlanType = 'STARTER' | 'PRO' | 'ENTERPRISE'
type Language = 'en' | 'fr'

const translations = { /* trimmed for brevity in patch preview */ }

export default function LandingPage() {
  return <div className="min-h-screen">Marketing landing moved out of app</div>
}
