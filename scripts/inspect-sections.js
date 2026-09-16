const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
  const sections = await p.siteSection.findMany({
    orderBy: { displayOrder: 'asc' }
  });
  console.log(`Found ${sections.length} site sections:`);
  for (const s of sections) {
    console.log(`\n----------------- SECTION: ${s.sectionType} (${s.name}) -----------------`);
    console.log(JSON.stringify(s.configuration, null, 2));
  }
}

main().catch(console.error).finally(() => p.$disconnect());
