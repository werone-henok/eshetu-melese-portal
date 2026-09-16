const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function s() {
  const tiers = await p.tier.findMany({
    select: {
      name: true,
      cardTemplates: {
        select: { id: true, layoutConfig: true }
      }
    }
  });
  for (const t of tiers) {
    console.log('=== Tier:', t.name);
    for (const c of t.cardTemplates) {
      console.log('Template Elements:', c.layoutConfig?.map(e => ({ type: e.type, x: e.x, y: e.y, width: e.width, height: e.height, fontSize: e.fontSize, align: e.align })));
    }
  }
}

s().catch(console.error).then(() => p.$disconnect());
