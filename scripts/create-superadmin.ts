import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const pwd = await bcrypt.hash('password', 10)
  // pick first company if exists
  const company = await prisma.company.findFirst()
  const companyId = company ? company.id : undefined

  const existing = await prisma.user.findUnique({ where: { email: 'super@demo.com' } })
  if (existing) {
    console.log('super@demo.com already exists')
    return
  }

  const user = await prisma.user.create({ data: { email: 'super@demo.com', password: pwd, name: 'Super Admin', role: 'SUPERADMIN', companyId: companyId || '' } })
  console.log('Created super admin:', user.email)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
