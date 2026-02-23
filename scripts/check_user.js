const { PrismaClient } = require('@prisma/client');
;(async () => {
  const prisma = new PrismaClient();
  try {
    const u = await prisma.user.findUnique({ where: { email: 'admin@demo.com' } });
    console.log('USER', u ? JSON.stringify(u, null, 2) : 'NOTFOUND');
  } catch (e) {
    console.error('ERR', e);
  } finally {
    await prisma.$disconnect();
  }
})();
