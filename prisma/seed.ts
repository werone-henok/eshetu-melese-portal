import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Roles & Default Permissions
  const adminRolePerms = [
    'members:view', 'members:add', 'members:edit', 'members:approve', 'members:reject',
    'members:suspend', 'members:delete', 'cms:edit', 'sections:reorder', 'pricing:edit',
    'tiers:manage', 'cards:edit', 'badges:generate', 'export:data', 'import:members',
    'notion:sync', 'users:manage', 'themes:manage', 'settings:manage'
  ];

  const editorRolePerms = [
    'members:view', 'cms:edit', 'sections:reorder', 'pricing:edit', 'tiers:manage',
    'cards:edit', 'badges:generate', 'export:data', 'themes:manage'
  ];

  const viewerRolePerms = [
    'members:view', 'cms:preview', 'tiers:view', 'cards:view'
  ];

  await prisma.role.upsert({
    where: { name: 'ADMIN' },
    update: { permissions: adminRolePerms },
    create: { name: 'ADMIN', permissions: adminRolePerms }
  });

  await prisma.role.upsert({
    where: { name: 'EDITOR' },
    update: { permissions: editorRolePerms },
    create: { name: 'EDITOR', permissions: editorRolePerms }
  });

  await prisma.role.upsert({
    where: { name: 'VIEWER' },
    update: { permissions: viewerRolePerms },
    create: { name: 'VIEWER', permissions: viewerRolePerms }
  });

  // 2. Default Seed Users
  const adminPass = await bcrypt.hash('AdminPassword2026!', 10);
  const editorPass = await bcrypt.hash('EditorPassword2026!', 10);
  const viewerPass = await bcrypt.hash('ViewerPassword2026!', 10);

  await prisma.user.upsert({
    where: { email: 'admin@eshetumelese.com' },
    update: {},
    create: {
      email: 'admin@eshetumelese.com',
      name: 'Super Admin',
      passwordHash: adminPass,
      role: 'ADMIN',
      isActive: true,
    }
  });

  await prisma.user.upsert({
    where: { email: 'editor@eshetumelese.com' },
    update: {},
    create: {
      email: 'editor@eshetumelese.com',
      name: 'Content Editor',
      passwordHash: editorPass,
      role: 'EDITOR',
      isActive: true,
    }
  });

  await prisma.user.upsert({
    where: { email: 'viewer@eshetumelese.com' },
    update: {},
    create: {
      email: 'viewer@eshetumelese.com',
      name: 'Portal Viewer',
      passwordHash: viewerPass,
      role: 'VIEWER',
      isActive: true,
    }
  });

  // 3. Default Membership Tiers
  const defaultTiers = [
    {
      name: 'Basic',
      priceEtb: 500,
      priceUsd: 15,
      description: 'Entry-level access to the Eshetu Melese community network and basic digital card.',
      perks: ['Verified Digital Member Card', 'Access to Public Community Forum', 'Monthly Newsletter Updates'],
      badgeColor: '#64748B',
      displayOrder: 1,
      isFeatured: false,
    },
    {
      name: 'Silver',
      priceEtb: 1000,
      priceUsd: 30,
      description: 'Enhanced member privileges with monthly livestreams and special digital badges.',
      perks: ['All Basic Privileges', 'Silver Holographic Card Design', 'Priority Registration for Regional Meetups', 'Exclusive Discord/Telegram Channel'],
      badgeColor: '#94A3B8',
      displayOrder: 2,
      isFeatured: false,
    },
    {
      name: 'Gold',
      priceEtb: 2500,
      priceUsd: 75,
      description: 'Most popular community tier with VIP networking access and exclusive merchandise discounts.',
      perks: ['All Silver Privileges', 'Gold Embossed Verified Card', 'Direct Q&A during Live Broadcasts', '15% Discount on Community Events & Merch', 'Quarterly Leadership Briefing'],
      badgeColor: '#F59E0B',
      displayOrder: 3,
      isFeatured: true,
    },
    {
      name: 'Diamond',
      priceEtb: 5000,
      priceUsd: 150,
      description: 'Prestigious tier for key patrons with direct community council invitations.',
      perks: ['All Gold Privileges', 'Diamond Signature Card', 'VIP Reserved Seating at Annual Gala', 'Private Executive Mastermind Access', 'Featured Member Spotlight'],
      badgeColor: '#06B6D4',
      displayOrder: 4,
      isFeatured: false,
    },
    {
      name: 'Platinum',
      priceEtb: 10000,
      priceUsd: 300,
      description: 'Elite tier with personal recognition, direct advisory council access, and commemorative gifts.',
      perks: ['All Diamond Privileges', 'Handcrafted Platinum Member Card', '1-on-1 Annual Strategic Advisory Session', 'Honorary Founder Mention', 'Exclusive Platinum Lounge Access'],
      badgeColor: '#8B5CF6',
      displayOrder: 5,
      isFeatured: false,
    },
    {
      name: 'Shield of Honor',
      priceEtb: 25000,
      priceUsd: 750,
      description: 'The highest civilian distinction of honor for monumental contributors and visionary supporters.',
      perks: ['All Platinum Privileges', 'Custom Engraved Shield Badge', 'Permanent Hall of Fame Induction', 'Lifetime Invitation to Sovereign Assemblies', 'Direct Executive Line Access'],
      badgeColor: '#D4AF37',
      displayOrder: 6,
      isFeatured: false,
    }
  ];

  for (const t of defaultTiers) {
    await prisma.tier.upsert({
      where: { name: t.name },
      update: {
        priceEtb: t.priceEtb,
        priceUsd: t.priceUsd,
        description: t.description,
        perks: t.perks,
        badgeColor: t.badgeColor,
        displayOrder: t.displayOrder,
        isFeatured: t.isFeatured,
      },
      create: {
        name: t.name,
        priceEtb: t.priceEtb,
        priceUsd: t.priceUsd,
        description: t.description,
        perks: t.perks,
        badgeColor: t.badgeColor,
        displayOrder: t.displayOrder,
        isFeatured: t.isFeatured,
      }
    });
  }

  // 4. Default Homepage Sections
  const defaultSections = [
    {
      sectionType: 'hero',
      title: 'Hero Banner',
      displayOrder: 1,
      isVisible: true,
      configuration: {
        headline: 'Join the Official Eshetu Melese Member Community',
        subheadline: 'Connect with 3.2M+ visionary members worldwide. Unlock verified digital membership credentials, exclusive livestreams, and VIP access.',
        badgeText: 'Official Global Portal',
        ctaPrimaryText: 'Get Your Membership Card',
        ctaPrimaryUrl: '/register',
        ctaSecondaryText: 'Verify / Search Card',
        ctaSecondaryUrl: '/search',
        bgGradient: 'from-amber-950/40 via-slate-900 to-slate-950'
      }
    },
    {
      sectionType: 'stats',
      title: 'Community Impact & Statistics',
      displayOrder: 2,
      isVisible: true,
      configuration: {
        stats: [
          { label: 'Subscribers & Followers', value: '3.2M+' },
          { label: 'Active Verified Members', value: '145K+' },
          { label: 'Countries Represented', value: '68+' },
          { label: 'Community Initiatives', value: '500+' }
        ]
      }
    },
    {
      sectionType: 'benefits',
      title: 'Membership Benefits',
      displayOrder: 3,
      isVisible: true,
      configuration: {
        heading: 'Why Become a Verified Member?',
        subheading: 'Enjoy distinctive recognition, direct engagement, and tangible community privileges.',
        items: [
          { title: 'Official Digital Pass', desc: 'Tamper-proof digital badge with verifiable cryptographic QR code.', icon: 'ShieldCheck' },
          { title: 'Global Recognition', desc: 'Instant verification by phone number, ID or name anywhere across the world.', icon: 'Globe' },
          { title: 'Direct Live Access', desc: 'Exclusive member-only Q&As, roundtables, and VIP broadcast invites.', icon: 'Radio' },
          { title: 'Community Impact', desc: 'Directly fuel charitable, media, and transformational community projects.', icon: 'HeartHandshake' }
        ]
      }
    },
    {
      sectionType: 'about',
      title: 'About Comedian Eshetu Melese',
      displayOrder: 4,
      isVisible: true,
      configuration: {
        heading: 'The Visionary Voice: Comedian Eshetu Melese',
        headingAm: 'ባለራዕዩ የጥበብ ሰው፡ ኮሜዲያን እሸቱ መለሰ',
        subheading: 'Inspiring millions across Ethiopia and the global diaspora through transformative humor, storytelling, and humanitarian impact.',
        subheadingAm: 'በኢትዮጵያ እና በመላው ዓለም የሚገኙ በሚሊዮኖች የሚቆጠሩ ሰዎችን በአስተማሪ ቀልዶች፣ ታሪኮችና ሰብዓዊ በጎ አድራጎት የሚያነቃቃ።',
        mediaUrl: '/images/eshetu-portrait.png',
        mediaType: 'image',
        bio: 'Comedian Eshetu Melese is one of Ethiopia’s most celebrated comedians, cultural icons, and social motivators. Over the past decade, his YouTube channel and global appearances have garnered over 3.2M+ dedicated subscribers, bringing joy, unity, and hope to Ethiopian households worldwide.',
        bioAm: 'ኮሜዲያን እሸቱ መለሰ በኢትዮጵያ እጅግ ተወዳጅ ከሆኑት የጥበብ ሰዎች፣ የባህል አምባሳደሮች እና የህብረተሰብ አነቃቂዎች አንዱ ነው። ባለፉት አመታት በዩቲዩብ እና በአለም አቀፍ መድረኮች ከ 3.2 ሚሊዮን በላይ ተከታዮችን በማፍራት ለኢትዮጵያውያን ቤተሰቦች ደስታንና ተስፋን ሲያካፍል ቆይቷል።',
        milestones: [
          { year: '2016', title: 'National Breakthrough', desc: 'Debuted breakthrough stand-up performances across nationwide stages.' },
          { year: '2020', title: 'Global Digital Reach', desc: 'Surpassed 1M+ subscribers on YouTube with iconic cultural shows.' },
          { year: '2023', title: 'Lmetsdek Movement', desc: 'Spearheaded historical humanitarian drives supporting thousands in need.' },
          { year: '2026', title: 'Global Member Community', desc: 'Launched the official verified community network for global patrons.' }
        ]
      }
    },
    {
      sectionType: 'charity',
      title: 'Lmetsdek Charity Movement (ለመጽደቅ)',
      displayOrder: 5,
      isVisible: true,
      configuration: {
        heading: 'Lmetsdek Charity Movement',
        headingAm: 'የ"ለመጽደቅ" የበጎ አድራጎት እንቅስቃሴ',
        subheading: '“To Be Blessed” — Transforming lives across Ethiopia through direct compassion, medical support, and community building.',
        subheadingAm: 'ለመጽደቅ — በኢትዮጵያ በርካታ ወገኖችን በህክምና እርዳታ፣ በትምህርት ድጋፍና በቋሚ መኖሪያ በመደገፍ ሕይወትን መለወጥ።',
        mediaUrl: '/images/charity-hero.png',
        mediaType: 'image',
        quote: '“True greatness is not in how much you gather, but in how many souls you uplift when they have nowhere else to turn.”',
        quoteAm: '“እውነተኛ ታላቅነት በምንሰበስበው ሳይሆን፣ መጠጊያ ላጡ ወገኖች በምንዘረጋው የመረዳዳት እጅ ይለካል!”',
        causeHighlights: [
          { title: 'Medical Relief Fund', titleAm: 'የህክምና ድጋፍ', desc: 'Funded critical surgeries and life-saving treatments for over 850+ patients.', descAm: 'ከ 850 በላይ ለሚሆኑ ታካሚዎች ወሳኝ ቀዶ ጥገና እና የህክምና ድጋፍ ተደርጓል።' },
          { title: 'Orphan & Family Support', titleAm: 'የወላጅ አልባ ህፃናትና ቤተሰቦች ድጋፍ', desc: 'Direct monthly food packages, clothing, and shelter assistance to vulnerable families.', descAm: 'ለተቸገሩ አረጋውያን እና ህፃናት ቀጣይነት ያለው የምግብ፣ ልብስ እና የቤት ድጋፍ።' },
          { title: 'School Supplies & Youth', titleAm: 'የትምህርት ቁሳቁስ ድጋፍ', desc: 'Distributed backpacks, uniforms, and educational grants to 12,000+ students.', descAm: 'ከ 12,000 በላይ ለሚሆኑ ተማሪዎች የትምህርት ቁሳቁስና የትምህርት ክፍያ ተሸፍኗል።' }
        ]
      }
    },
    {
      sectionType: 'events',
      title: 'Upcoming Events & Stand-Up Tours',
      displayOrder: 6,
      isVisible: true,
      configuration: {
        heading: 'Upcoming Live Shows & World Tours',
        headingAm: 'መጪ የቀጥታ የኮሜዲ ዝግጅቶች እና የዓለም ጉብኝቶች',
        subheading: 'Experience the magic in person. VIP and verified member seatings available.',
        subheadingAm: 'በቀጥታ መድረክ ላይ የማይረሳ የደስታ ምሽት ያሳልፉ! ለክብር አባላት የተለዩ የቪአይፒ መቀመጫዎች ተዘጋጅተዋል።',
        events: [
          {
            title: 'Addis Ababa Grand Stand-Up Special',
            titleAm: 'የአዲስ አበባ ልዩ የስታንድ አፕ ኮሜዲ ምሽት',
            date: 'October 24, 2026',
            location: 'Millennium Hall, Addis Ababa',
            badge: 'Flagship Event',
            ticketUrl: '/register'
          },
          {
            title: 'North America Diaspora Tour - Washington D.C.',
            titleAm: 'የሰሜን አሜሪካ ዲያስፖራ ጉብኝት - ዋሽንግተን ዲሲ',
            date: 'December 12, 2026',
            location: 'DAR Constitution Hall, Washington D.C.',
            badge: 'International Tour',
            ticketUrl: '/register'
          },
          {
            title: 'European Comedy Gala - London',
            titleAm: 'የአውሮፓ የኮሜዲ ምሽት - ለንደን',
            date: 'January 18, 2027',
            location: 'O2 Indigo, London, UK',
            badge: 'Global Tour',
            ticketUrl: '/register'
          }
        ]
      }
    },
    {
      sectionType: 'tiers',
      title: 'Membership Tiers & Pricing',
      displayOrder: 7,
      isVisible: true,
      configuration: {
        heading: 'Select Your Membership Tier',
        subheading: 'Choose the tier that reflects your passion and dedication to our global mission.',
      }
    },
    {
      sectionType: 'how_it_works',
      title: 'How It Works',
      displayOrder: 8,
      isVisible: true,
      configuration: {
        heading: '3 Simple Steps to Get Your Card',
        subheading: 'Fast registration, flexible local & international payment options, instant verification.',
        steps: [
          { step: '01', title: 'Choose Tier & Fill Form', desc: 'Select your preferred tier and enter your name, international phone number and photo.' },
          { step: '02', title: 'Submit Payment Receipt', desc: 'Pay via Telebirr, CBE Birr, Awash Bank, or International Transfer and upload your receipt.' },
          { step: '03', title: 'Get Your Verified Digital Badge', desc: 'Once approved, download high-res PNG/WebP cards and share on Telegram, WhatsApp & Facebook.' }
        ]
      }
    },
    {
      sectionType: 'card_showcase',
      title: 'Digital Card Showcase',
      displayOrder: 9,
      isVisible: true,
      configuration: {
        heading: 'World-Class Digital Membership Cards',
        subheading: 'Engineered with crisp typography, scannable QR verification, and custom luxury tier badges.',
      }
    },
    {
      sectionType: 'testimonials',
      title: 'Member Testimonials',
      displayOrder: 10,
      isVisible: true,
      configuration: {
        heading: 'What Our Members Say',
        subheading: 'Hear from our proud members from Addis Ababa, North America, Europe, and the Middle East.',
        testimonials: [
          { quote: 'Receiving my verified Gold badge made me feel truly connected to the vision. The verification QR is so seamless!', name: 'Yared Bekele', role: 'Gold Member • Addis Ababa' },
          { quote: 'Living in Washington D.C., being part of this 3.2M+ community gives me immense pride and inspiration every week.', name: 'Bethlehem Tessema', role: 'Diamond Member • USA' },
          { quote: 'The digital card was approved in hours. Clean, professional and deeply inspiring platform!', name: 'Dawit Hailu', role: 'Platinum Member • Dubai, UAE' }
        ]
      }
    },
    {
      sectionType: 'faq',
      title: 'Frequently Asked Questions',
      displayOrder: 11,
      isVisible: true,
      configuration: {
        heading: 'Frequently Asked Questions',
        subheading: 'Everything you need to know about registration, payment verification, and card downloads.',
        faqs: [
          { q: 'How long does payment verification take?', a: 'Verification is typically completed by our administrative team within 1 to 12 hours.' },
          { q: 'Which payment methods are accepted in Ethiopia?', a: 'We accept Telebirr, CBE Birr, Awash Bank, Bank of Abyssinia, and direct bank transfers.' },
          { q: 'Can international members register from abroad?', a: 'Yes! International supporters can register using their country code (+1, +44, +971, etc.) and submit international payment confirmation.' },
          { q: 'How can anyone verify my digital membership card?', a: 'Anyone can scan the QR code on your card or search your phone number / Member ID on the public search page.' }
        ]
      }
    },
    {
      sectionType: 'social_footer',
      title: 'Call to Action & Social Channels',
      displayOrder: 12,
      isVisible: true,
      configuration: {
        heading: 'Be Part of Something Bigger Today',
        subheading: 'Join thousands of members shaping a brighter future. Register now and receive your official digital card.',
        ctaText: 'Start Registration',
        ctaUrl: '/register'
      }
    }
  ];

  for (const s of defaultSections) {
    const existing = await prisma.siteSection.findFirst({
      where: { sectionType: s.sectionType }
    });
    if (!existing) {
      await prisma.siteSection.create({ data: s });
    } else {
      await prisma.siteSection.update({
        where: { id: existing.id },
        data: {
          title: s.title,
          displayOrder: s.displayOrder,
          configuration: s.configuration
        }
      });
    }
  }

  // 5. Default Themes
  const defaultThemeConfig = {
    colors: {
      primary: '#D4AF37', // Luxury Gold
      primaryHover: '#B89628',
      secondary: '#0F172A', // Slate 900
      accent: '#F59E0B', // Amber
      background: '#0B0F19',
      surface: '#111827',
      card: '#1E293B',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      border: '#334155',
    },
    typography: {
      fontHeading: 'Inter, sans-serif',
      fontBody: 'Inter, sans-serif',
    },
    appearance: {
      borderRadius: '0.75rem',
      buttonRadius: '0.5rem',
      cardShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
    }
  };

  await prisma.theme.upsert({
    where: { name: 'Gold Luxury Default' },
    update: { configuration: defaultThemeConfig, isActive: true },
    create: { name: 'Gold Luxury Default', configuration: defaultThemeConfig, isActive: true }
  });

  console.log('✅ Database seeded successfully with Tiers, CMS Sections, Themes, and Roles!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
