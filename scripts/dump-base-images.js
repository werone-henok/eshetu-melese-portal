const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function run() {
  const templates = await p.cardTemplate.findMany({ include: { tier: true } });
  for (const t of templates) {
    if (t.baseDesignUrl && t.baseDesignUrl.startsWith('data:image')) {
      const base64Data = t.baseDesignUrl.replace(/^data:image\/\w+;base64,/, '');
      const buf = Buffer.from(base64Data, 'base64');
      const filename = 'base-' + (t.tier?.name || 'card').toLowerCase().replace(/\s+/g, '-') + '.jpg';
      const outPath = path.join(process.cwd(), 'public', filename);
      fs.writeFileSync(outPath, buf);
      console.log('Saved', t.tier?.name, 'to', outPath, buf.length, 'bytes');
    }
  }
}

run()
  .catch(console.error)
  .finally(() => p.$disconnect());
