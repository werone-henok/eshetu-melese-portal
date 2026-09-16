const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function s() {
  const templates = await p.cardTemplate.findMany({
    select: {
      id: true,
      name: true,
      tierId: true,
      tier: { select: { id: true, name: true } },
      createdAt: true
    }
  });
  console.log('Templates in CardTemplate table:');
  console.log(JSON.stringify(templates, null, 2));
}

s().catch(console.error).then(() => p.$disconnect());
