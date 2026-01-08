const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function seedPlans() {
  console.log('🌱 Seeding subscription plans...')

  const plans = [
    {
      name: 'Basic',
      type: 'BASIC',
      description: 'Plan de démarrage pour petites entreprises',
      maxUsers: 5,
      maxVehicles: 10,
      maxTrips: 100,
      priceMonthly: 500,
      priceYearly: 5000,
      modulesEnabled: ['trips', 'vehicles', 'drivers'],
      isActive: true,
      features: {
        dashboard: true,
        reports: false,
        api: false,
        support: 'email',
      },
    },
    {
      name: 'Pro',
      type: 'PRO',
      description: 'Plan professionnel pour entreprises en croissance',
      maxUsers: 20,
      maxVehicles: 50,
      maxTrips: 500,
      priceMonthly: 1500,
      priceYearly: 15000,
      modulesEnabled: [
        'trips',
        'vehicles',
        'drivers',
        'invoices',
        'quotes',
        'contracts',
        'administratif',
      ],
      isActive: true,
      features: {
        dashboard: true,
        reports: true,
        api: true,
        support: 'priority',
        customization: true,
      },
    },
    {
      name: 'Enterprise',
      type: 'ENTERPRISE',
      description: 'Solution complète pour grandes flottes',
      maxUsers: 100,
      maxVehicles: 200,
      maxTrips: 2000,
      priceMonthly: 3500,
      priceYearly: 35000,
      modulesEnabled: [
        'trips',
        'vehicles',
        'drivers',
        'invoices',
        'quotes',
        'contracts',
        'administratif',
        'consommation',
        'finance',
        'settings',
      ],
      isActive: true,
      features: {
        dashboard: true,
        reports: true,
        api: true,
        support: 'dedicated',
        customization: true,
        multiLanguage: true,
        advancedAnalytics: true,
        whiteLabel: true,
      },
    },
  ]

  for (const plan of plans) {
    const existing = await prisma.subscriptionPlan.findUnique({
      where: { name: plan.name },
    })

    if (existing) {
      console.log(`✓ Plan "${plan.name}" existe déjà, mise à jour...`)
      await prisma.subscriptionPlan.update({
        where: { id: existing.id },
        data: plan,
      })
    } else {
      console.log(`✓ Création du plan "${plan.name}"...`)
      await prisma.subscriptionPlan.create({
        data: plan,
      })
    }
  }

  console.log('✅ Plans d\'abonnement créés avec succès!')
}

async function seedPlatformSettings() {
  console.log('🌱 Seeding platform settings...')

  const existing = await prisma.platformSettings.findFirst()

  if (existing) {
    console.log('✓ Paramètres plateforme existent déjà')
  } else {
    await prisma.platformSettings.create({
      data: {
        platformName: 'ArwaPark',
        supportEmail: 'support@arwapark.com',
        defaultLanguage: 'FR',
        enabledLanguages: ['FR', 'AR', 'EN'],
        maintenanceMode: false,
      },
    })
    console.log('✅ Paramètres plateforme créés!')
  }
}

async function main() {
  try {
    await seedPlans()
    await seedPlatformSettings()
    console.log('\n🎉 Seed completed successfully!')
  } catch (error) {
    console.error('❌ Error seeding:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
