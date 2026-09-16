const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Perfect layouts based on exact pixel coordinates of card artwork backgrounds:
// 1. Standard Landscape Tiers: Silver, Gold, Diamond, Platinum (aspect ratio 85.60:53.98 or 16:9, ~1.6 ratio)
//    - Photo circle: starts at x: 4.8%, y: 14%, width: 33% (1:1 square aspect ratio) perfectly fills the metallic ring.
//    - Member Full Name: x: 41%, y: 44%, fontSize: 26, color: '#FFFFFF', align: 'left', fontWeight: 'bold'
//    - Member ID: x: 41%, y: 58%, fontSize: 16, color: badgeColor, align: 'left', fontWeight: '500'
//    - QR Code: x: 41%, y: 68%, width: 18%, 1:1 aspect ratio. Placed cleanly below member ID, avoiding the mascot circle at x: 70%+!
//
// 2. Basic Tier:
//    - Photo circle is on the right side: x: 62%, y: 15%, width: 28%
//    - Full Name: x: 34%, y: 44%, fontSize: 26, color: '#FFFFFF', align: 'left'
//    - Member ID: x: 34%, y: 58%, fontSize: 16, color: '#94A3B8', align: 'left'
//    - QR Code: x: 34%, y: 68%, width: 18%
//
// 3. Shield of Honor: (1:1 ratio) - untouched because user confirmed "the alignment for the shield of honor card is good".

const tierColorMap = {
  Silver: '#E2E8F0',
  Gold: '#F59E0B',
  Diamond: '#38BDF8',
  Platinum: '#C084FC',
  Basic: '#94A3B8',
};

async function updateTemplates() {
  const templates = await prisma.cardTemplate.findMany({
    include: { tier: true },
  });

  for (const t of templates) {
    const tierName = t.tier?.name;
    if (!tierName) continue;

    if (tierName === 'Shield of Honor') {
      console.log('Skipping Shield of Honor (already perfect)');
      continue;
    }

    const idColor = tierColorMap[tierName] || '#F59E0B';

    let newLayout;
    if (['Silver', 'Gold', 'Diamond', 'Platinum'].includes(tierName)) {
      newLayout = [
        {
          id: 'logo-1',
          type: 'logo',
          label: 'Portal Logo/Header',
          x: 32,
          y: 29,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#D4AF37',
          align: 'left',
          customText: 'ESHETU MELESE COMMUNITY',
          visible: false,
        },
        {
          id: 'photo-1',
          type: 'photo',
          label: 'Member Photo',
          x: 4.8,
          y: 13.5,
          width: 33.5,
          height: 33.5,
          borderRadius: 50,
          visible: true,
        },
        {
          id: 'name-1',
          type: 'name',
          label: 'Full Name',
          x: 41,
          y: 44,
          fontSize: 28,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'left',
          visible: true,
        },
        {
          id: 'id-1',
          type: 'memberId',
          label: 'Member ID',
          x: 41,
          y: 57,
          fontSize: 16,
          fontWeight: '600',
          color: idColor,
          align: 'left',
          visible: true,
        },
        {
          id: 'qr-1',
          type: 'qr',
          label: 'Verification QR Code',
          x: 41,
          y: 66,
          width: 19,
          height: 19,
          visible: true,
        },
      ];
    } else if (tierName === 'Basic') {
      newLayout = [
        {
          id: 'logo-1',
          type: 'logo',
          label: 'Portal Logo/Header',
          x: 32,
          y: 29,
          fontSize: 24,
          fontWeight: 'bold',
          color: '#D4AF37',
          align: 'left',
          customText: 'ESHETU MELESE COMMUNITY',
          visible: false,
        },
        {
          id: 'photo-1',
          type: 'photo',
          label: 'Member Photo',
          x: 62,
          y: 14,
          width: 28,
          height: 28,
          borderRadius: 50,
          visible: true,
        },
        {
          id: 'name-1',
          type: 'name',
          label: 'Full Name',
          x: 34,
          y: 44,
          fontSize: 26,
          fontWeight: 'bold',
          color: '#FFFFFF',
          align: 'left',
          visible: true,
        },
        {
          id: 'id-1',
          type: 'memberId',
          label: 'Member ID',
          x: 34,
          y: 57,
          fontSize: 16,
          fontWeight: '600',
          color: '#94A3B8',
          align: 'left',
          visible: true,
        },
        {
          id: 'qr-1',
          type: 'qr',
          label: 'Verification QR Code',
          x: 34,
          y: 66,
          width: 19,
          height: 19,
          visible: true,
        },
      ];
    }

    if (newLayout) {
      await prisma.cardTemplate.update({
        where: { id: t.id },
        data: {
          aspectRatio: '85.60:53.98',
          layoutConfig: newLayout,
        },
      });
      console.log(`Successfully updated layout template for Tier: ${tierName}`);
    }
  }
}

updateTemplates()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
