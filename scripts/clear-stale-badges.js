const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function s() {
  const count = await p.member.updateMany({
    data: { generatedBadgeUrl: null }
  });
  console.log('Cleared generatedBadgeUrl for', count.count, 'members');
}

s().catch(console.error).then(() => p.$disconnect());
