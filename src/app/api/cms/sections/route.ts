import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { enforceAuth, createAuditLog } from '@/lib/auth';

// GET all website sections (Public or Admin)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeHidden = searchParams.get('all') === 'true';

    const where: any = { page: 'home' };
    if (!includeHidden) {
      where.isVisible = true;
    }

    let rawSections = await prisma.siteSection.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    });

    let sections = rawSections.map((s) => {
      if (s.sectionType === 'stats') {
        return { ...s, sectionType: 'socials' };
      }
      return s;
    });

    // If database has 0 sections, initialize with standard default sections automatically
    if (sections.length === 0) {
      const defaultSections = [
        {
          page: 'home',
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
          page: 'home',
          sectionType: 'socials',
          title: 'Official Social Communities & Reach',
          displayOrder: 2,
          isVisible: true,
          configuration: {
            heading: 'Official Social Communities & Follower Reach',
            headingAm: 'ይፋዊ የማህበራዊ ሚዲያ ገጾች እና ተከታዮች',
            subheading: 'Join over 3.2M+ supporters across official YouTube, Telegram, TikTok, and Facebook communities.',
            subheadingAm: 'በመላው ዓለም ከ 3.2M+ በላይ ተከታዮች ጋር በቀጥታ ይገናኙ፤ በሁሉም ማህበራዊ አውታሮች ቤተሰብ ይሁኑ።',
            socials: [
              {
                platform: 'youtube',
                name: 'YouTube',
                nameAm: 'ዩቲዩብ',
                handle: '@eshetumelese',
                count: '3.2M+',
                countLabel: 'Subscribers',
                countLabelAm: 'ተመዝጋቢዎች',
                url: 'https://youtube.com/@eshetumelese',
                color: '#FF0000',
              },
              {
                platform: 'telegram',
                name: 'Telegram',
                nameAm: 'ቴሌግራም',
                handle: 't.me/eshetumelese',
                count: '480K+',
                countLabel: 'Channel Members',
                countLabelAm: 'የቻናል አባላት',
                url: 'https://t.me/eshetumelese',
                color: '#229ED9',
              },
              {
                platform: 'tiktok',
                name: 'TikTok',
                nameAm: 'ቲክቶክ',
                handle: '@eshetumelese',
                count: '1.8M+',
                countLabel: 'Followers',
                countLabelAm: 'ተከታዮች',
                url: 'https://tiktok.com/@eshetumelese',
                color: '#FE2C55',
              },
              {
                platform: 'facebook',
                name: 'Facebook',
                nameAm: 'ፌስቡክ',
                handle: 'facebook.com/eshetumelese',
                count: '1.2M+',
                countLabel: 'Followers',
                countLabelAm: 'ተከታዮች',
                url: 'https://facebook.com/eshetumelese',
                color: '#1877F2',
              },
            ]
          }
        },

        {
          page: 'home',
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
          page: 'home',
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
          page: 'home',
          sectionType: 'charity',
          title: 'Lmetsdek Charity Movement (ለመጽደቅ)',
          displayOrder: 5,
          isVisible: true,
          configuration: {
            heading: 'Lmetsdek Charity Movement',
            headingAm: 'የ"ለመጽደቅ" የበጎ አድራጎት እንቅስቃሴ',
            subheading: '“To Be Blessed” — Transforming lives across Ethiopia through direct compassion, medical support, and community building.',
            subheadingAm: 'ለመጽደቅ — በኢትዮጵያ በርካታ ወገኖችን በህክምና እርዳታ፣ በትምህርት ድጋፍና በቋሚ መኖሪያ በመደገፍ ሕይወትን መለወጥ።',
            mediaUrl: '/images/lmetsdek-charity.jpg',
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
          page: 'home',
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
          page: 'home',
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
          page: 'home',
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
          page: 'home',
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
          page: 'home',
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
          page: 'home',
          sectionType: 'faq',
          title: 'Frequently Asked Questions',
          displayOrder: 11,
          isVisible: true,
          configuration: {
            heading: 'Frequently Asked Questions',
            subheading: 'Everything you need to know about registration, payment verification, and card downloads.',
            faqs: [
              { q: 'How long does payment verification take?', a: 'Typically within 1 to 4 hours. Once your transaction ID or receipt screenshot is reviewed by our staff, your card status updates automatically to APPROVED and you receive access.' },
              { q: 'Can Ethiopian Diaspora members pay from abroad?', a: 'Yes! International supporters can pay via Western Union, MoneyGram, Zelle, PayPal or international wire transfer. Detailed payment accounts are displayed on the registration form.' },
              { q: 'What can I do with my digital badge?', a: 'You can download it as high-definition image to keep on your phone, print physical plastic ID cards, or show its scannable QR code at community events for VIP seating.' },
              { q: 'How does someone verify that my card is authentic?', a: 'Anyone can visit the public "Verify Card" page and search your Membership Code or phone number, or scan the cryptographic QR code directly on your card to view your live verification profile.' }
            ]
          }
        },
        {
          page: 'home',
          sectionType: 'cta',
          title: 'Call to Action (CTA)',
          displayOrder: 12,
          isVisible: true,
          configuration: {
            headline: 'Be Counted. Join 3.2M+ Supporters Worldwide.',
            subheadline: 'Select your tier, receive your verified digital membership badge, and help empower communities across Ethiopia.',
            ctaText: 'Register Today',
            ctaUrl: '/register'
          }
        },
        {
          page: 'home',
          sectionType: 'social_footer',
          title: 'Social Links & Footer',
          displayOrder: 13,
          isVisible: true,
          configuration: {
            youtubeUrl: 'https://youtube.com/@eshetumelese',
            telegramUrl: 'https://t.me/eshetumelese',
            facebookUrl: 'https://facebook.com/eshetumelese',
            tiktokUrl: 'https://tiktok.com/@eshetumelese',
            copyrightText: '© 2026 Comedian Eshetu Melese Community Portal. All rights reserved.'
          }
        }
      ];

      for (const s of defaultSections) {
        await prisma.siteSection.create({ data: s });
      }

      sections = await prisma.siteSection.findMany({
        where,
        orderBy: { displayOrder: 'asc' },
      });
    }

    return NextResponse.json(
      { success: true, sections },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch sections' }, { status: 500 });
  }
}

// POST create new section (Admin / Editor)
export async function POST(req: NextRequest) {
  const auth = await enforceAuth(req, 'canRearrangeSections');
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await req.json();
    const { sectionType, title, configuration, displayOrder, isVisible } = body;

    const count = await prisma.siteSection.count();
    const section = await prisma.siteSection.create({
      data: {
        page: 'home',
        sectionType: sectionType || 'custom',
        title: title || 'New Section',
        configuration: configuration || {},
        displayOrder: displayOrder !== undefined ? displayOrder : count + 1,
        isVisible: isVisible !== undefined ? isVisible : true,
      },
    });

    await createAuditLog({
      userId: auth.user.userId,
      action: 'SECTION_CREATED',
      entityType: 'SiteSection',
      entityId: section.id,
      newValue: section,
      req,
    });

    return NextResponse.json({ success: true, section });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create section' }, { status: 500 });
  }
}

// PUT batch reorder sections (Admin / Editor)
export async function PUT(req: NextRequest) {
  const auth = await enforceAuth(req, 'canRearrangeSections');
  if (auth instanceof NextResponse) return auth;

  try {
    const { orderedIds } = await req.json(); // Array of { id: string, displayOrder: number, isVisible?: boolean }

    if (!Array.isArray(orderedIds)) {
      return NextResponse.json({ error: 'orderedIds must be an array' }, { status: 400 });
    }

    const updates = orderedIds.map((item, index) =>
      prisma.siteSection.update({
        where: { id: item.id },
        data: {
          displayOrder: item.displayOrder !== undefined ? item.displayOrder : index + 1,
          ...(item.isVisible !== undefined ? { isVisible: item.isVisible } : {}),
        },
      })
    );

    await prisma.$transaction(updates);

    await createAuditLog({
      userId: auth.user.userId,
      action: 'SECTIONS_REORDERED',
      entityType: 'SiteSection',
      newValue: { count: orderedIds.length },
      req,
    });

    return NextResponse.json({ success: true, message: 'Section order updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to reorder sections' }, { status: 500 });
  }
}
