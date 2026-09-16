const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function s() {
  const tiers = await p.tier.findMany({
    select: {
      id: true,
      name: true,
      cardTemplates: {
        select: { id: true, name: true, width: true, height: true, layoutConfig: true }
      }
    }
  });
  console.log(JSON.stringify(tiers, null, 2));
}

s().catch(console.error).then(() => p.$disconnect());
