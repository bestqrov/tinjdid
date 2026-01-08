const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkSuperAdmin() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: 'arwaparksp@arwaeduc.com' }
    });
    
    if (user) {
      console.log('✓ Super Admin User Found:');
      console.log('  Email:', user.email);
      console.log('  Role:', user.role);
      console.log('  ID:', user.id);
    } else {
      console.log('✗ Super Admin user NOT FOUND');
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkSuperAdmin();
