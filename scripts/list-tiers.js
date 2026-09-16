const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const tiers = await p.tier.findMany();
  console.log('TIERS:', tiers.map(t => ({ id: t.id, name: t.name, badgeColor: t.badgeColor })));
}

main().finally(() => p.$disconnect());
