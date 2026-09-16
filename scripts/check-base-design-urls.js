const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function s() {
  const templates = await p.cardTemplate.findMany({
    select: {
      id: true,
      name: true,
      tier: { select: { name: true } },
      baseDesignUrl: true
    }
  });
  for (let t of templates) {
    console.log('Tier:', t.tier?.name, '| baseDesignUrl length/type:', t.baseDesignUrl?.slice(0, 50));
  }
}

s().catch(console.error).then(() => p.$disconnect());
