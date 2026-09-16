const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function s() {
  const m = await p.member.findMany({
    where: { status: 'APPROVED' },
    select: {
      id: true,
      fullName: true,
      membershipCode: true,
      generatedBadgeUrl: true,
      tier: {
        select: {
          name: true,
          cardTemplates: {
            select: { id: true, layoutConfig: true, isActive: true }
          }
        }
      }
    }
  });

  for (let x of m) {
    console.log('Member:', x.fullName, '| Tier:', x.tier.name, '| badgeUrl:', x.generatedBadgeUrl ? 'YES' : 'NO');
    console.log('Templates for tier:', x.tier.cardTemplates.length);
    for (let t of x.tier.cardTemplates) {
      console.log(' Template active:', t.isActive, 'layoutConfig elements:', t.layoutConfig?.length);
      console.log('   Elements:', JSON.stringify(t.layoutConfig));
    }
  }
}

s().catch(console.error).then(() => p.$disconnect());
