const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  const user = await prisma.user.findUnique({ 
    where: { email: 'arwaparksp@arwaeduc.com' },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      companyId: true,
      createdAt: true
    }
  })
  
  if (user) {
    console.log('✅ Super Admin found:')
    console.log(JSON.stringify(user, null, 2))
  } else {
    console.log('❌ Super Admin not found')
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
