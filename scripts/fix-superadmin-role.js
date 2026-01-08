const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixSuperAdminRole() {
  try {
    console.log('🔄 Fixing Super Admin role...\n');

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: 'arwaparksp@arwaeduc.com' },
      include: { company: true }
    });

    if (!user) {
      console.log('❌ User not found. Creating new super admin...\n');
      
      // Create super admin company if doesn't exist
      let superAdminCompany = await prisma.company.findFirst({
        where: { name: 'ArwaPark Super Admin' }
      });

      if (!superAdminCompany) {
        superAdminCompany = await prisma.company.create({
          data: {
            name: 'ArwaPark Super Admin',
            contact: 'contact@arwapark.com',
            address: 'Platform Headquarters',
          }
        });
        console.log('✅ Created Super Admin company');
      }

      // Create super admin user
      const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
      const newUser = await prisma.user.create({
        data: {
          email: 'arwa@arwapark.com',
          name: 'Arwa Super Admin',
          password: hashedPassword,
          role: 'SUPERADMIN',
          companyId: superAdminCompany.id,
        }
      });

      console.log('✅ Created Super Admin user:');
      console.log({
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        companyId: newUser.companyId
      });
      console.log('\n📧 Email: arwa@arwapark.com');
      console.log('🔑 Password: SuperAdmin123!');
    } else {
      // Update existing user to SUPERADMIN role
      const updated = await prisma.user.update({
        where: { id: user.id },
        data: { 
          role: 'SUPERADMIN',
          name: 'Arwa Super Admin' 
        }
      });

      console.log('✅ Updated user role to SUPERADMIN:');
      console.log({
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        companyId: updated.companyId
      });
      console.log('\n📧 Email: arwaparksp@arwaeduc.com');
      console.log('🔑 Password: arwaparksp2026@@');
    }

    console.log('\n✅ Super Admin role fixed successfully!');
    console.log('\n🎯 Access Super Admin Dashboard:');
    console.log('   http://localhost:3000/super-admin');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixSuperAdminRole();
