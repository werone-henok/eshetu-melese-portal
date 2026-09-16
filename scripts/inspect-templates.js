const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const templates = await p.cardTemplate.findMany({
    include: { tier: true }
  });
  for (const t of templates) {
    console.log(`\n=================== TIER: ${t.tier?.name} (${t.aspectRatio}) ===================`);
    let elements = t.layoutConfig;
    if (typeof elements === 'string') {
      try {
        elements = JSON.parse(elements);
      } catch (e) {
        console.log('Error parsing JSON:', t.layoutConfig?.slice(0, 100));
      }
    }
    console.log(JSON.stringify(elements, null, 2));
  }
}

main()
  .catch(console.error)
  .finally(() => p.$disconnect());
