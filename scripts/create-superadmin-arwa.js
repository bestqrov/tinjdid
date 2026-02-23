const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcrypt')

const prisma = new PrismaClient()

async function main() {
  const pwd = await bcrypt.hash('arwaparksp2026@@', 10)
  const company = await prisma.company.findFirst()
  const companyId = company ? company.id : ''

  // Check if user exists
  const existing = await prisma.user.findUnique({ where: { email: 'arwaparksp@arwaeduc.com' } })
  
  if (existing) {
    // Update existing user
    const updated = await prisma.user.update({
      where: { email: 'arwaparksp@arwaeduc.com' },
      data: { 
        password: pwd, 
        name: 'Super Admin', 
        role: 'ADMIN',
        companyId 
      }
    })
    console.log('✅ Updated super admin:', updated.email)
  } else {
    // Create new user
    const user = await prisma.user.create({ 
      data: { 
        email: 'arwaparksp@arwaeduc.com', 
        password: pwd, 
        name: 'Super Admin', 
        role: 'ADMIN', 
        companyId 
      } 
    })
    console.log('✅ Created super admin:', user.email)
  }
}

main()
  .catch(e => { 
    console.error('❌ Error:', e); 
    process.exit(1) 
  })
  .finally(async () => { 
    await prisma.$disconnect() 
  })
