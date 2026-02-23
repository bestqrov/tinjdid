'use client'

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

const translations = {
  en: {
    nav: {
      features: 'Features',
      pricing: 'Pricing',
      login: 'Login',
      requestDemo: 'Request Demo',
    },
    hero: {
      badge: '🚀 #1 Fleet Management Solution in Morocco',
      title1: 'Transform Your',
      title2: 'Transport Business',
      title3: 'Into a Digital Powerhouse',
      subtitle: 'The complete all-in-one platform trusted by',
      companies: '50+ companies',
      subtitle2: 'across Morocco',
      benefits: 'Automate operations • Track in real-time • Increase profits • Stay compliant • Scale faster',
      ctaDemo: 'Get Your Free Demo',
      ctaLearn: 'See How It Works',
      badge1: 'No credit card required',
      badge2: 'Setup in 5 minutes',
      badge3: '24/7 Support',
      vehiclesTitle: 'Manage Any Type of Vehicle',
      vehiclesSubtitle: 'From luxury 4x4s to large tour buses - we\'ve got you covered',
      bus: 'Tourist Buses',
      busDesc: '30-50 seats • Long distance trips • Luxury coaches',
      van: 'Vans & Minivans',
      vanDesc: '7-20 seats • Airport transfers • Group tours',
      car: '4x4 Vehicles',
      carDesc: 'Premium SUVs • Desert tours • VIP service',
      stat1: 'Vehicles Tracked',
      stat2: 'Active Companies',
      stat3: 'Trips Managed',
      stat4: 'Satisfaction Rate',
    },
    howItWorks: {
      title: 'How to Get Your',
      titleHighlight: 'Free Demo',
      subtitle: 'Start managing your fleet in just 3 simple steps. No credit card required!',
      step1Title: 'Fill the Form',
      step1Desc: 'Click "Request Demo" and tell us about your fleet size, company name, and transport needs.',
      step1Time: '2 minutes',
      step1Badge: 'Free',
      step2Title: 'Get Contacted',
      step2Desc: 'Our team will reach out within 24 hours to schedule a personalized demo session for you.',
      step2Time: 'Within 24h',
      step2Badge: 'WhatsApp/Email',
      step3Title: 'Start Your Demo',
      step3Desc: 'Experience the full platform with your data. Test all features for 14 days - completely free!',
      step3Time: '14 days free',
      step3Badge: 'Full access',
      ctaTitle: 'Ready to Transform Your Business?',
      ctaSubtitle: 'Join 50+ companies already managing their fleets with ArwaPark. No commitment, no credit card.',
      ctaButton: 'Request Your Free Demo Now',
      ctaBadges: '✓ No credit card required  •  ✓ 14-day full access  •  ✓ Cancel anytime',
    },
    features: {
      title: 'Manage Your Agency with ArwaPark',
      subtitle: 'Powerful features designed specifically for touristic transport operations',
      fleet: 'Fleet Management',
      fleetDesc: 'Track all your vehicles, maintenance schedules, documents, and availability in real-time.',
      trips: 'Trip Planning',
      tripsDesc: 'Plan and optimize routes, assign drivers, track trip progress, and manage client bookings.',
      invoicing: 'Invoicing & Quotes',
      invoicingDesc: 'Generate professional invoices and quotes automatically with Moroccan tax compliance.',
      expenses: 'Expense Tracking',
      expensesDesc: 'Monitor fuel consumption, maintenance costs, and all operational expenses with detailed reports.',
      drivers: 'Driver Management',
      driversDesc: 'Manage driver information, licenses, contracts, and performance metrics efficiently.',
      admin: 'Administrative Documents',
      adminDesc: 'Manage all administrative documents with smart alerts for expiring insurance, licenses, and permits.',
      alerts: 'Smart Alerts',
      alertsDesc: 'Automatic notifications for upcoming document renewals, maintenance schedules, and compliance deadlines.',
      security: 'Secure & Compliant',
      securityDesc: 'Bank-level security with full compliance to Moroccan transport and tax regulations.',
    },
    pricing: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that fits your fleet size and business needs',
      starter: 'Starter',
      starterDesc: 'Perfect for small fleets',
      month: '/month',
      vehicles10: 'Up to 10 vehicles',
      staff1: '1 staff account',
      drivers5: '5 driver accounts',
      reporting: 'Basic reporting',
      support: 'Email support',
      requestDemo: 'Request Demo',
      pro: 'Pro',
      proDesc: 'For growing businesses',
      vehicles50: 'Up to 50 vehicles',
      staff5: '5 staff accounts',
      driversUnlimited: 'Unlimited drivers',
      analytics: 'Advanced analytics',
      supportPriority: 'Priority support',
      api: 'API access',
      enterprise: 'Enterprise',
      enterpriseDesc: 'For large operations',
      custom: 'Custom',
      vehiclesUnlimited: 'Unlimited vehicles',
      usersUnlimited: 'Unlimited users',
      integrations: 'Custom integrations',
      accountManager: 'Dedicated account manager',
      support24: '24/7 phone support',
      contactSales: 'Contact Sales',
    },
    cta: {
      title: 'Ready to Transform Your Fleet Management?',
      subtitle: 'Join hundreds of transport companies already using ArwaPark to streamline their operations',
      button: 'Get Started Today',
    },
    footer: {
      tagline: 'Professional fleet management for touristic transport companies in Morocco',
      product: 'Product',
      features: 'Features',
      pricing: 'Pricing',
      demo: 'Request Demo',
      company: 'Company',
      about: 'About Us',
      contact: 'Contact',
      login: 'Login',
      contactTitle: 'Contact',
      rights: '© 2025 ArwaPark. All rights reserved.',
    },
  },
  fr: {
    nav: {
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      login: 'Connexion',
      requestDemo: 'Demander une Démo',
    },
    hero: {
      badge: '🚀 Solution N°1 de Gestion de Flotte en afrique ',
      title1: 'Transformez Votre',
      title2: 'Entreprise de Transport',
      title3: 'En Puissance Digitale',
      subtitle: 'La plateforme tout-en-un de confiance pour',
      companies: 'plus de 50 entreprises',
      subtitle2: 'à travers le Maroc',
      benefits: 'Automatisez les opérations • Suivez en temps réel • Augmentez les profits • Restez conforme • Évoluez plus rapidement',
      ctaDemo: 'Obtenez Votre Démo Gratuite',
      ctaLearn: 'Voir Comment Ça Marche',
      badge1: 'Aucune carte bancaire requise',
      badge2: 'Configuration en 5 minutes',
      badge3: 'Support 24/7',
      vehiclesTitle: 'Gérez Tout Type de Véhicule',
      vehiclesSubtitle: 'Des 4x4 de luxe aux grands bus touristiques - nous avons tout prévu',
      bus: 'Bus Touristiques',
      busDesc: '30-50 places • Voyages longue distance • Autocars de luxe',
      van: 'Vans & Minivans',
      vanDesc: '7-20 places • Transferts aéroport • Circuits groupes',
      car: 'Véhicules 4x4',
      carDesc: 'SUV Premium • Circuits désert • Service VIP',
      stat1: 'Véhicules Suivis',
      stat2: 'Entreprises Actives',
      stat3: 'Voyages Gérés',
      stat4: 'Taux de Satisfaction',
    },
    howItWorks: {
      title: 'Comment Obtenir Votre',
      titleHighlight: 'Démo Gratuite',
      subtitle: 'Commencez à gérer votre flotte en 3 étapes simples. Aucune carte bancaire requise !',
      step1Title: 'Remplissez le Formulaire',
      step1Desc: 'Cliquez sur "Demander une Démo" et parlez-nous de votre flotte, nom de l\'entreprise et besoins.',
      step1Time: '2 minutes',
      step1Badge: 'Gratuit',
      step2Title: 'Nous Vous Contactons',
      step2Desc: 'Notre équipe vous contactera sous 24h pour planifier une session de démo personnalisée.',
      step2Time: 'Sous 24h',
      step2Badge: 'WhatsApp/Email',
      step3Title: 'Démarrez Votre Démo',
      step3Desc: 'Découvrez la plateforme complète avec vos données. Testez toutes les fonctionnalités pendant 14 jours - gratuitement !',
      step3Time: '14 jours gratuits',
      step3Badge: 'Accès complet',
      ctaTitle: 'Prêt à Transformer Votre Entreprise ?',
      ctaSubtitle: 'Rejoignez plus de 50 entreprises qui gèrent déjà leur flotte avec ArwaPark. Sans engagement, sans carte bancaire.',
      ctaButton: 'Demandez Votre Démo Gratuite Maintenant',
      ctaBadges: '✓ Aucune carte requise  •  ✓ Accès complet 14 jours  •  ✓ Annulez à tout moment',
    },
    features: {
      title: 'Gérez Votre Agence avec ArwaPark',
      subtitle: 'Fonctionnalités puissantes conçues spécifiquement pour les opérations de transport touristique',
      fleet: 'Gestion de Flotte',
      fleetDesc: 'Suivez tous vos véhicules, calendriers d\'entretien, documents et disponibilité en temps réel.',
      trips: 'Planification de Trajets',
      tripsDesc: 'Planifiez et optimisez les itinéraires, affectez les chauffeurs, suivez la progression et gérez les réservations.',
      invoicing: 'Facturation & Devis',
      invoicingDesc: 'Générez automatiquement des factures et devis professionnels conformes à la fiscalité marocaine.',
      expenses: 'Suivi des Dépenses',
      expensesDesc: 'Surveillez la consommation de carburant, les coûts d\'entretien et toutes les dépenses opérationnelles avec des rapports détaillés.',
      drivers: 'Gestion des Chauffeurs',
      driversDesc: 'Gérez les informations des chauffeurs, permis, contrats et métriques de performance efficacement.',
      admin: 'Documents Administratifs',
      adminDesc: 'Gérez tous les documents administratifs avec des alertes intelligentes pour les assurances, permis et autorisations expirantes.',
      alerts: 'Alertes Intelligentes',
      alertsDesc: 'Notifications automatiques pour les renouvellements de documents, calendriers d\'entretien et échéances de conformité.',
      security: 'Sécurisé & Conforme',
      securityDesc: 'Sécurité bancaire avec conformité totale aux réglementations marocaines du transport et de la fiscalité.',
    },
    pricing: {
      title: 'Tarification Simple et Transparente',
      subtitle: 'Choisissez le plan adapté à la taille de votre flotte et vos besoins',
      starter: 'Starter',
      starterDesc: 'Parfait pour les petites flottes',
      month: '/mois',
      vehicles10: 'Jusqu\'à 10 véhicules',
      staff1: '1 compte personnel',
      drivers5: '5 comptes chauffeurs',
      reporting: 'Rapports basiques',
      support: 'Support email',
      requestDemo: 'Demander une Démo',
      pro: 'Pro',
      proDesc: 'Pour les entreprises en croissance',
      vehicles50: 'Jusqu\'à 50 véhicules',
      staff5: '5 comptes personnels',
      driversUnlimited: 'Chauffeurs illimités',
      analytics: 'Analyses avancées',
      supportPriority: 'Support prioritaire',
      api: 'Accès API',
      enterprise: 'Enterprise',
      enterpriseDesc: 'Pour les grandes opérations',
      custom: 'Sur mesure',
      vehiclesUnlimited: 'Véhicules illimités',
      usersUnlimited: 'Utilisateurs illimités',
      integrations: 'Intégrations personnalisées',
      accountManager: 'Gestionnaire de compte dédié',
      support24: 'Support téléphonique 24/7',
      contactSales: 'Contacter les Ventes',
    },
    cta: {
      title: 'Prêt à Transformer Votre Gestion de Flotte ?',
      subtitle: 'Rejoignez des centaines d\'entreprises de transport qui utilisent déjà ArwaPark pour optimiser leurs opérations',
      button: 'Commencer Aujourd\'hui',
    },
    footer: {
      tagline: 'Gestion de flotte professionnelle pour les entreprises de transport touristique au Maroc',
      product: 'Produit',
      features: 'Fonctionnalités',
      pricing: 'Tarifs',
      demo: 'Demander une Démo',
      company: 'Entreprise',
      about: 'À Propos',
      contact: 'Contact',
      login: 'Connexion',
      contactTitle: 'Contact',
      rights: '© 2025 ArwaPark. Tous droits réservés.',
    },
  },
}

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDemoForm, setShowDemoForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanType | undefined>()
  const [language, setLanguage] = useState<Language>('fr')

  const t = translations[language]

  const openDemoForm = (plan?: PlanType) => {
    setSelectedPlan(plan)
    setShowDemoForm(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              {/* Professional Logo */}
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 rounded-lg flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform">
                  <span className="text-white font-black text-xl">A</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-2xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                  ArwaPark
                </span>
                <span className="text-[10px] text-gray-500 font-semibold -mt-1">Fleet Management</span>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition">{t.nav.features}</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition">{t.nav.pricing}</a>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 transition">
                {t.nav.login}
              </Link>
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="text-gray-700 hover:text-blue-600 transition flex items-center gap-2"
                title={language === 'en' ? 'Switch to French' : 'Passer à l\'anglais'}
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'FR' : 'EN'}
              </button>
              <button
                onClick={() => openDemoForm()}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
              >
                {t.nav.requestDemo}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-blue-600 transition">{t.nav.features}</a>
              <a href="#pricing" className="block text-gray-700 hover:text-blue-600 transition">{t.nav.pricing}</a>
              <Link href="/login" className="block text-gray-700 hover:text-blue-600 transition">
                {t.nav.login}
              </Link>
              <button
                onClick={() => setLanguage(language === 'en' ? 'fr' : 'en')}
                className="w-full text-left text-gray-700 hover:text-blue-600 transition flex items-center gap-2 py-2"
              >
                <Globe className="w-4 h-4" />
                {language === 'en' ? 'Français' : 'English'}
              </button>
              <button
                onClick={() => openDemoForm()}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition"
              >
                {t.nav.requestDemo}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 via-white to-indigo-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                {t.hero.badge}
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-6 leading-tight">
              {t.hero.title1}{' '}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
                {t.hero.title2}
              </span>
              <br />{t.hero.title3}
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-4 leading-relaxed font-medium">
              {t.hero.subtitle} <span className="font-bold text-blue-600">{t.hero.companies}</span> {t.hero.subtitle2}
            </p>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              {t.hero.benefits}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button
                onClick={() => openDemoForm()}
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-5 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transform flex items-center gap-3 relative overflow-hidden"
              >
                <span className="relative z-10">{t.hero.ctaDemo}</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <a
                href="#how-it-works"
                className="group border-3 border-gray-900 text-gray-900 px-10 py-5 rounded-xl text-lg font-bold hover:bg-gray-900 hover:text-white transition-all hover:scale-105 transform"
              >
                {t.hero.ctaLearn}
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t.hero.badge1}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t.hero.badge2}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <span>{t.hero.badge3}</span>
              </div>
            </div>
          </div>

          {/* Vehicle Types Showcase - Redesigned */}
          <div className="mt-20 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 border border-white/50">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Manage Any Type of Vehicle
                </h3>
                <p className="text-gray-600">From luxury 4x4s to large tour buses - we've got you covered</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Bus Card */}
                <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-blue-500">
                  <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    PREMIUM
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-4 group-hover:shadow-2xl transition-shadow">
                      <Bus className="w-16 h-16 text-blue-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{t.hero.bus}</h4>
                    <p className="text-gray-600 text-sm">
                      {t.hero.busDesc}
                    </p>
                  </div>
                </div>

                {/* Van Card */}
                <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-purple-500">
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-4 group-hover:shadow-2xl transition-shadow">
                      <Truck className="w-16 h-16 text-purple-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{t.hero.van}</h4>
                    <p className="text-gray-600 text-sm">
                      {t.hero.vanDesc}
                    </p>
                  </div>
                </div>

                {/* 4x4 Card */}
                <div className="group relative bg-gradient-to-br from-indigo-50 to-indigo-100 p-8 rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-indigo-500">
                  <div className="absolute top-4 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-4 group-hover:shadow-2xl transition-shadow">
                      <Car className="w-16 h-16 text-indigo-600" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{t.hero.car}</h4>
                    <p className="text-gray-600 text-sm">
                      {t.hero.carDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Stats bar */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-blue-600 mb-1">+270</div>
                    <div className="text-sm text-gray-600">{t.hero.stat1}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-600 mb-1">50+</div>
                    <div className="text-sm text-gray-600">{t.hero.stat2}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-indigo-600 mb-1">+130</div>
                    <div className="text-sm text-gray-600">{t.hero.stat3}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-600 mb-1">98%</div>
                    <div className="text-sm text-gray-600">{t.hero.stat4}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.howItWorks.title} <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{t.howItWorks.titleHighlight}</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.howItWorks.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 border-2 border-transparent hover:border-blue-500">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">1</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t.howItWorks.step1Title}</h3>
                  <p className="text-gray-600 text-center mb-4">
                    {t.howItWorks.step1Desc}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">{t.howItWorks.step1Time}</span>
                    <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">{t.howItWorks.step1Badge}</span>
                  </div>
                </div>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 border-2 border-transparent hover:border-purple-500">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">2</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t.howItWorks.step2Title}</h3>
                  <p className="text-gray-600 text-center mb-4">
                    {t.howItWorks.step2Desc}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full font-semibold">{t.howItWorks.step2Time}</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-semibold">{t.howItWorks.step2Badge}</span>
                  </div>
                </div>
              </div>
              {/* Arrow */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                <ArrowRight className="w-8 h-8 text-purple-400" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all hover:-translate-y-2 duration-300 border-2 border-green-200 hover:border-green-400">
                <div className="absolute -top-6 left-8">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">3</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">{t.howItWorks.step3Title}</h3>
                  <p className="text-gray-600 text-center mb-4">
                    {t.howItWorks.step3Desc}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-semibold">{t.howItWorks.step3Time}</span>
                    <span className="text-xs bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full font-semibold">{t.howItWorks.step3Badge}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Box */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {t.howItWorks.ctaTitle}
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              {t.howItWorks.ctaSubtitle}
            </p>
            <button
              onClick={() => openDemoForm()}
              className="bg-white text-blue-600 px-10 py-5 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all shadow-xl hover:scale-105 transform inline-flex items-center gap-3"
            >
              <span>{t.howItWorks.ctaButton}</span>
              <ArrowRight className="w-6 h-6" />
            </button>
            <p className="text-blue-100 text-sm mt-4">
              {t.howItWorks.ctaBadges}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.features.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.features.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.fleet}</h3>
              <p className="text-gray-600">
                {t.features.fleetDesc}
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.trips}</h3>
              <p className="text-gray-600">
                {t.features.tripsDesc}
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.invoicing}</h3>
              <p className="text-gray-600">
                {t.features.invoicingDesc}
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.expenses}</h3>
              <p className="text-gray-600">
                {t.features.expensesDesc}
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.drivers}</h3>
              <p className="text-gray-600">
                {t.features.driversDesc}
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <ClipboardCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.admin}</h3>
              <p className="text-gray-600">
                {t.features.adminDesc}
              </p>
            </div>

            {/* Feature 7 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Bell className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.alerts}</h3>
              <p className="text-gray-600">
                {t.features.alertsDesc}
              </p>
            </div>

            {/* Feature 8 */}
            <div className="p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg transition">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{t.features.security}</h3>
              <p className="text-gray-600">
                {t.features.securityDesc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t.pricing.title}
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {t.pricing.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.pricing.starter}</h3>
              <p className="text-gray-600 mb-6">{t.pricing.starterDesc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">999 DH</span>
                <span className="text-gray-600">{t.pricing.month}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.vehicles10}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.staff1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.drivers5}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.reporting}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.support}</span>
                </li>
              </ul>
              <button
                onClick={() => openDemoForm('STARTER')}
                className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                {t.pricing.requestDemo}
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-8 border-2 border-blue-600 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                POPULAR
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{t.pricing.pro}</h3>
              <p className="text-blue-100 mb-6">{t.pricing.proDesc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-white">1,999 DH</span>
                <span className="text-blue-100">{t.pricing.month}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{t.pricing.vehicles50}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{t.pricing.staff5}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{t.pricing.driversUnlimited}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{t.pricing.analytics}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{t.pricing.supportPriority}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-white">{t.pricing.api}</span>
                </li>
              </ul>
              <button
                onClick={() => openDemoForm('PRO')}
                className="w-full bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                {t.pricing.requestDemo}
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:border-blue-500 transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{t.pricing.enterprise}</h3>
              <p className="text-gray-600 mb-6">{t.pricing.enterpriseDesc}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">{t.pricing.custom}</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.vehiclesUnlimited}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.usersUnlimited}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.integrations}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.accountManager}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{t.pricing.support24}</span>
                </li>
              </ul>
              <button
                onClick={() => openDemoForm('ENTERPRISE')}
                className="w-full border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
              >
                {t.pricing.contactSales}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t.cta.title}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t.cta.subtitle}
          </p>
          <button
            onClick={() => openDemoForm()}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition shadow-xl inline-flex items-center gap-2"
          >
            {t.cta.button}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" fill="#3B82F6"/>
                  <text x="20" y="26" fontFamily="Arial, sans-serif" fontSize="18" fontWeight="bold" fill="white" textAnchor="middle">A</text>
                </svg>
                <span className="text-xl font-bold text-white">ArwaPark</span>
              </div>
              <p className="text-sm text-gray-400">
                {t.footer.tagline}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">{t.footer.product}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-blue-400 transition">{t.footer.features}</a></li>
                <li><a href="#pricing" className="hover:text-blue-400 transition">{t.footer.pricing}</a></li>
                <li><button onClick={() => openDemoForm()} className="hover:text-blue-400 transition">{t.footer.demo}</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">{t.footer.company}</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-400 transition">{t.footer.about}</a></li>
                <li><a href="#" className="hover:text-blue-400 transition">{t.footer.contact}</a></li>
                <li><Link href="/login" className="hover:text-blue-400 transition">{t.footer.login}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-3">{t.footer.contactTitle}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📧 contact@arwapark.com</li>
                <li>📞 +212 608183886</li>
                <li>📍 Agadir, Morocco</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-500">
            <p>{t.footer.rights}</p>
          </div>
        </div>
      </footer>

      {/* Demo Request Modal */}
      {showDemoForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Request a Demo</h2>
              <button
                onClick={() => {
                  setShowDemoForm(false)
                  setSelectedPlan(undefined)
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <DemoRequestForm
                selectedPlan={selectedPlan}
                onClose={() => {
                  setShowDemoForm(false)
                  setSelectedPlan(undefined)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
