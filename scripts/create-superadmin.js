const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const pwd = await bcrypt.hash('password', 10)
  const company = await prisma.company.findFirst()
  const companyId = company ? company.id : ''

  const existing = await prisma.user.findUnique({ where: { email: 'super@demo.com' } })
  if (existing) {
    console.log('super@demo.com already exists')
    return
  }

  const user = await prisma.user.create({ data: { email: 'super@demo.com', password: pwd, name: 'Super Admin', role: 'SUPERADMIN', companyId } })
  console.log('Created super admin:', user.email)
}

main().catch(e => { console.error(e); process.exit(1) }).finally(async () => { await prisma.$disconnect() })
