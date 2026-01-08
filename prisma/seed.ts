import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const pwd = await bcrypt.hash('password', 10)

  // Create company
  const company = await prisma.company.create({
    data: {
      name: 'Demo Tours',
      address: '123 Avenue des Voyageurs, Casablanca',
      contact: '+212600000000',
      timezone: 'Africa/Casablanca',
    }
  })

  // Create users
  const admin = await prisma.user.create({ data: { email: 'admin@demo.com', password: pwd, name: 'Admin', role: 'ADMIN', companyId: company.id } })
  const staff = await prisma.user.create({ data: { email: 'staff@demo.com', password: pwd, name: 'Staff', role: 'STAFF', companyId: company.id } })
  const driverUser = await prisma.user.create({ data: { email: 'driver@demo.com', password: pwd, name: 'Driver', role: 'DRIVER', companyId: company.id } })

  // Vehicles
  const v1 = await prisma.vehicle.create({ data: { companyId: company.id, type: 'VAN', seats: 8, plate: '123-ABC', status: 'ACTIVE', costPerKm: 0.5 } })
  const v2 = await prisma.vehicle.create({ data: { companyId: company.id, type: 'VIP', seats: 4, plate: 'VIP-01', status: 'ACTIVE', costPerKm: 1.0 } })

  // Drivers
  const d1 = await prisma.driver.create({ data: { companyId: company.id, name: 'Driver One', phone: '+212600000001', languages: ['EN','FR'], available: true, vehicleId: v1.id } })
  const d2 = await prisma.driver.create({ data: { companyId: company.id, name: 'Driver Two', phone: '+212600000002', languages: ['AR'], available: true } })

  // Trips
  const trip1 = await prisma.trip.create({ data: { companyId: company.id, date: new Date(), pickup: 'Airport Casablanca', dropoff: 'Hotel Demo', tripType: 'AIRPORT', vehicleId: v1.id, driverId: d1.id, clientName: 'Hotel Demo', price: 300, currency: 'MAD', status: 'PLANNED' } })
  const trip2 = await prisma.trip.create({ data: { companyId: company.id, date: new Date('2025-12-15'), pickup: 'Rabat Centre', dropoff: 'Marrakech', tripType: 'CITY_TOUR', vehicleId: v2.id, driverId: d2.id, clientName: 'STE ISLANE MANGANESE SARL', price: 1500, currency: 'MAD', status: 'DONE' } })

  // Quote for trip
  const quote1 = await prisma.quote.create({ data: { companyId: company.id, tripId: trip1.id, amount: 300, currency: 'MAD', status: 'SENT' } })

  // Invoice for trip
  const invoice1 = await prisma.invoice.create({ 
    data: { 
      companyId: company.id, 
      tripId: trip1.id, 
      amount: 330, 
      currency: 'MAD', 
      tva: true,
      tvaPercent: 20, 
      status: 'SENT',
      numero: 'FAC-2025-001',
      clientName: 'Hotel Demo',
      clientIce: '000123456789012',
      lines: [
        { designation: 'Transport Aéroport', quantite: '1', puHT: '330.00', montantHT: '330.00' }
      ]
    } 
  })

  // Example invoice matching the design
  const invoice2 = await prisma.invoice.create({ 
    data: { 
      companyId: company.id, 
      tripId: trip2.id, 
      amount: 16000.00, 
      currency: 'MAD', 
      tva: true,
      tvaPercent: 20, 
      status: 'SENT',
      numero: '0004BA/34',
      date: new Date('2025-12-01'),
      dateDelivrance: new Date('2025-12-01'),
      clientName: 'STE ISLANE MANGANESE SARL',
      clientIce: '002987654321098',
      lines: [
        { designation: 'Travaux de fonçage', quantite: '150', puHT: '80.00', montantHT: '12000.00' },
        { designation: 'Exploitation minière', quantite: '40', puHT: '100.00', montantHT: '4000.00' }
      ]
    } 
  })

  // Another example invoice
  const invoice3 = await prisma.invoice.create({ 
    data: { 
      companyId: company.id, 
      amount: 20000.00, 
      currency: 'MAD', 
      tva: true,
      tvaPercent: 20, 
      status: 'DRAFT',
      numero: '0005BA/34',
      date: new Date('2026-01-03'),
      dateDelivrance: new Date('2026-01-03'),
      clientName: 'STE CONSTRUCTION ABC',
      clientIce: '001234567890123',
      lines: [
        { designation: 'Services de construction', quantite: '200', puHT: '100.00', montantHT: '20000.00' }
      ]
    } 
  })

  // Charges
  await prisma.charge.create({ data: { companyId: company.id, tripId: trip1.id, type: 'FUEL', amount: 30, currency: 'MAD', description: 'Fuel for airport transfer', date: new Date() } })

  console.log('Seed: company', company.id, 'admin', admin.email, 'staff', staff.email, 'driver', driverUser.email)
  console.log('Created 3 example invoices:', invoice1.numero, invoice2.numero, invoice3.numero)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
