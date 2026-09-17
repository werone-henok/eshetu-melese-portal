// Reset admin account script for cPanel
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdmin() {
  const newEmail = process.env.ADMIN_EMAIL || 'admin@eshetumelese.com';
  const newPassword = process.env.ADMIN_PASSWORD || 'AdminPassword2026!';
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  console.log('🔄 Resetting admin account...');

  // 1. Ensure ADMIN role exists
  await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: {},
    create: {
      name: 'ADMIN',
      permissions: [
        'members:view', 'members:add', 'members:edit', 'members:approve', 'members:reject',
        'members:suspend', 'members:delete', 'cms:edit', 'sections:reorder', 'pricing:edit',
        'tiers:manage', 'cards:edit', 'badges:generate', 'export:data', 'import:members',
        'notion:sync', 'users:manage', 'themes:manage', 'settings:manage'
      ]
    }
  });

  // 2. Find any existing admin user or update/create default
  const existingUsers = await prisma.user.findMany();
  console.log(`📋 Found ${existingUsers.length} user(s) in database:`);
  existingUsers.forEach(u => console.log(`   - Email: ${u.email} | Role: ${u.role} | Active: ${u.isActive}`));

  const user = await prisma.user.upsert({
    where: { email: newEmail },
    update: {
      passwordHash: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    },
    create: {
      email: newEmail,
      name: 'Super Admin',
      passwordHash: hashedPassword,
      role: 'ADMIN',
      isActive: true,
    }
  });

  console.log('\n✅ Admin credentials successfully reset!');
  console.log('-------------------------------------------');
  console.log(`   Email:    ${newEmail}`);
  console.log(`   Password: ${newPassword}`);
  console.log('-------------------------------------------');
}

resetAdmin()
  .catch(err => {
    console.error('❌ Error resetting admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
