import { z } from 'zod'

export const tripSchema = z.object({
  date: z.string().min(1, { message: 'Date et heure sont obligatoires' }),
  pickup: z.string().min(1, { message: 'Lieu de prise en charge obligatoire' }),
  dropoff: z.string().min(1, { message: 'Lieu de dépôt obligatoire' }),
  tripType: z.enum(['AIRPORT','EXCURSION','CITY_TOUR']),
  vehicleId: z.string().optional(),
  driverId: z.string().optional(),
  price: z.number().min(0, { message: 'Le prix doit être positif' }),
})

export const quoteSchema = z.object({
  amount: z.number().min(0, { message: 'Montant invalide' }),
  currency: z.enum(['MAD','EUR']).optional(),
  pdfUrl: z.string().url().optional(),
  status: z.string().optional(),
  tripId: z.string().optional(),
})

export const invoiceSchema = z.object({
  amount: z.number().min(0, { message: 'Montant invalide' }),
  currency: z.enum(['MAD','EUR']).optional(),
  tva: z.boolean().optional(),
  tripId: z.string().optional(),
  pdfUrl: z.string().url().optional(),
})

export const chargeSchema = z.object({
  type: z.string().min(1, { message: 'Type obligatoire' }),
  description: z.string().optional(),
  amount: z.number().min(0, { message: 'Montant invalide' }),
  currency: z.enum(['MAD','EUR']).optional(),
  tripId: z.string().optional(),
  date: z.string().min(1, { message: 'Date obligatoire' }),
})

export const driverSchema = z.object({
  name: z.string().min(1, { message: 'Nom obligatoire' }),
  phone: z.string().min(1, { message: 'Téléphone obligatoire' }),
  whatsapp: z.string().optional(),
  email: z.string().email({ message: 'Email invalide' }).optional().or(z.literal('')),
  address: z.string().optional(),
  cinNumber: z.string().optional(),
  languages: z.array(z.string()).optional(),
  available: z.boolean().optional(),
  vehicleId: z.string().optional(),
  driverPhoto: z.string().optional(),
  driverLicense: z.string().optional(),
  cin: z.string().optional(),
  cv: z.string().optional(),
})

export type TripInput = z.infer<typeof tripSchema>
export type QuoteInput = z.infer<typeof quoteSchema>
export type InvoiceInput = z.infer<typeof invoiceSchema>
export type ChargeInput = z.infer<typeof chargeSchema>
export type DriverInput = z.infer<typeof driverSchema>
