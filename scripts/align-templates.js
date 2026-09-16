const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function alignCardTemplates() {
  console.log('Aligning Card Templates according to Card Studio designs...');

  // 1. Gold Template (1050x660, Aspect Ratio 85.60:53.98)
  const gold = await prisma.cardTemplate.findFirst({ where: { tier: { name: 'Gold' } } });
  if (gold) {
    const goldElements = [
      { id: 'logo-1', type: 'logo', label: 'Portal Logo/Header', x: 32, y: 29, fontSize: 24, fontWeight: 'bold', color: '#D4AF37', align: 'left', customText: 'ESHETU MELESE COMMUNITY', visible: false },
      { id: 'photo-1', type: 'photo', label: 'Member Photo', x: 5.6, y: 8.5, width: 32.5, height: 73, borderRadius: 50, visible: true },
      { id: 'name-1', type: 'name', label: 'Full Name', x: 42, y: 52, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', align: 'left', visible: true },
      { id: 'id-1', type: 'memberId', label: 'Member ID', x: 42, y: 67, fontSize: 18, fontWeight: '500', color: '#D4AF37', align: 'left', visible: true },
      { id: 'qr-1', type: 'qr', label: 'Verification QR Code', x: 74, y: 47, width: 22, height: 43, visible: true },
    ];
    await prisma.cardTemplate.update({ where: { id: gold.id }, data: { layoutConfig: goldElements } });
    console.log('Gold template aligned');
  }

  // 2. Silver Template (1050x660, Aspect Ratio 85.60:53.98)
  const silver = await prisma.cardTemplate.findFirst({ where: { tier: { name: 'Silver' } } });
  if (silver) {
    const silverElements = [
      { id: 'logo-1', type: 'logo', label: 'Portal Logo/Header', x: 32, y: 29, fontSize: 24, fontWeight: 'bold', color: '#D4AF37', align: 'left', customText: 'ESHETU MELESE COMMUNITY', visible: false },
      { id: 'photo-1', type: 'photo', label: 'Member Photo', x: 5.6, y: 8.5, width: 32.5, height: 73, borderRadius: 50, visible: true },
      { id: 'name-1', type: 'name', label: 'Full Name', x: 42, y: 52, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', align: 'left', visible: true },
      { id: 'id-1', type: 'memberId', label: 'Member ID', x: 42, y: 67, fontSize: 18, fontWeight: '500', color: '#CBD5E1', align: 'left', visible: true },
      { id: 'qr-1', type: 'qr', label: 'Verification QR Code', x: 74, y: 47, width: 22, height: 43, visible: true },
    ];
    await prisma.cardTemplate.update({ where: { id: silver.id }, data: { layoutConfig: silverElements } });
    console.log('Silver template aligned');
  }

  // 3. Basic Template (1050x660, Photo in golden round frame on top-right, Name & ID below, QR bottom-center)
  const basic = await prisma.cardTemplate.findFirst({ where: { tier: { name: 'Basic' } } });
  if (basic) {
    const basicElements = [
      { id: 'logo-1', type: 'logo', label: 'Portal Logo/Header', x: 32, y: 29, fontSize: 24, fontWeight: 'bold', color: '#D4AF37', align: 'left', customText: 'ESHETU MELESE COMMUNITY', visible: false },
      { id: 'photo-1', type: 'photo', label: 'Member Photo', x: 58.5, y: 15, width: 23, height: 50, borderRadius: 50, visible: true },
      { id: 'name-1', type: 'name', label: 'Full Name', x: 38, y: 48, fontSize: 28, fontWeight: 'bold', color: '#FFFFFF', align: 'left', visible: true },
      { id: 'id-1', type: 'memberId', label: 'Member ID', x: 38, y: 60, fontSize: 16, fontWeight: '500', color: '#D4AF37', align: 'left', visible: true },
      { id: 'qr-1', type: 'qr', label: 'Verification QR Code', x: 42, y: 66, width: 17, height: 32, visible: true },
    ];
    await prisma.cardTemplate.update({ where: { id: basic.id }, data: { layoutConfig: basicElements } });
    console.log('Basic template aligned');
  }

  // 4. Shield of Honor Template (800x800, Aspect Ratio 1:1, Center Shield Crest)
  const shield = await prisma.cardTemplate.findFirst({ where: { tier: { name: 'Shield of Honor' } } });
  if (shield) {
    const shieldElements = [
      { id: 'logo-1', type: 'logo', label: 'Portal Logo/Header', x: 32, y: 29, fontSize: 24, fontWeight: 'bold', color: '#D4AF37', align: 'left', customText: 'ESHETU MELESE COMMUNITY', visible: false },
      { id: 'photo-1', type: 'photo', label: 'Member Photo', x: 36, y: 18, width: 28, height: 28, borderRadius: 50, visible: true },
      { id: 'name-1', type: 'name', label: 'Full Name', x: 50, y: 49, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', align: 'center', visible: true },
      { id: 'id-1', type: 'memberId', label: 'Member ID', x: 50, y: 56, fontSize: 18, fontWeight: '500', color: '#D4AF37', align: 'center', visible: true },
      { id: 'qr-1', type: 'qr', label: 'Verification QR Code', x: 50, y: 63, width: 18, height: 18, align: 'center', visible: true },
    ];
    await prisma.cardTemplate.update({ where: { id: shield.id }, data: { layoutConfig: shieldElements } });
    console.log('Shield template aligned');
  }

  // 5. Platinum & Diamond (1050x660, Metallic Badge Frame)
  const platinum = await prisma.cardTemplate.findFirst({ where: { tier: { name: 'Platinum' } } });
  if (platinum) {
    const platElements = [
      { id: 'logo-1', type: 'logo', label: 'Portal Logo/Header', x: 32, y: 29, fontSize: 24, fontWeight: 'bold', color: '#D4AF37', align: 'left', customText: 'ESHETU MELESE COMMUNITY', visible: false },
      { id: 'photo-1', type: 'photo', label: 'Member Photo', x: 5.6, y: 8.5, width: 32.5, height: 73, borderRadius: 50, visible: true },
      { id: 'name-1', type: 'name', label: 'Full Name', x: 42, y: 52, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', align: 'left', visible: true },
      { id: 'id-1', type: 'memberId', label: 'Member ID', x: 42, y: 67, fontSize: 18, fontWeight: '500', color: '#A78BFA', align: 'left', visible: true },
      { id: 'qr-1', type: 'qr', label: 'Verification QR Code', x: 74, y: 47, width: 22, height: 43, visible: true },
    ];
    await prisma.cardTemplate.update({ where: { id: platinum.id }, data: { layoutConfig: platElements } });
    console.log('Platinum template aligned');
  }

  const diamond = await prisma.cardTemplate.findFirst({ where: { tier: { name: 'Diamond' } } });
  if (diamond) {
    const diaElements = [
      { id: 'logo-1', type: 'logo', label: 'Portal Logo/Header', x: 32, y: 29, fontSize: 24, fontWeight: 'bold', color: '#D4AF37', align: 'left', customText: 'ESHETU MELESE COMMUNITY', visible: false },
      { id: 'photo-1', type: 'photo', label: 'Member Photo', x: 5.6, y: 8.5, width: 32.5, height: 73, borderRadius: 50, visible: true },
      { id: 'name-1', type: 'name', label: 'Full Name', x: 42, y: 52, fontSize: 32, fontWeight: 'bold', color: '#FFFFFF', align: 'left', visible: true },
      { id: 'id-1', type: 'memberId', label: 'Member ID', x: 42, y: 67, fontSize: 18, fontWeight: '500', color: '#22D3EE', align: 'left', visible: true },
      { id: 'qr-1', type: 'qr', label: 'Verification QR Code', x: 74, y: 47, width: 22, height: 43, visible: true },
    ];
    await prisma.cardTemplate.update({ where: { id: diamond.id }, data: { layoutConfig: diaElements } });
    console.log('Diamond template aligned');
  }

  // Clear any cached badge URLs on approved members so they re-render dynamically
  const cleared = await prisma.member.updateMany({
    data: { generatedBadgeUrl: null },
  });
  console.log(`Cleared cached badges for ${cleared.count} members.`);

  console.log('All tier templates aligned successfully!');
}

alignCardTemplates()
  .catch(console.error)
  .then(() => prisma.$disconnect());
