'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  TrendingUp,
  Award,
  Video,
  Users,
  Building2,
  Tv,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  Mail,
  Phone,
  FileText,
  Star,
  Film,
  Layers,
  Heart,
  Globe2,
  ChevronRight,
  Send,
  Loader2,
  Check,
  Plane,
  Coins,
  Cpu,
  Hotel,
  ShoppingBag,
  Sparkle
} from 'lucide-react';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import { useAppSettings } from '@/context/AppSettingsContext';

export default function MarketingPage() {
  const { lang, setLang } = useAppSettings();

  // Active filter for corporate clients
  const [activePartnerCategory, setActivePartnerCategory] = useState<string>('all');

  // Inquiry Form State
  const [formState, setFormState] = useState({
    companyName: '',
    industry: 'Aviation & Finance',
    contactPerson: '',
    email: '',
    phone: '',
    campaignType: 'Integrated Sponsorship & Show Placement',
    budgetRange: 'Standard Corporate Package',
    message: '',
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch('/api/marketing/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry.');
      }

      setFormSuccess(
        lang === 'am'
          ? 'እናመሰግናለን! የማስታወቂያ አጋርነት ጥያቄዎ በተሳካ ሁኔታ ደርሶናል ። የኮርፖሬት ማርኬቲንግ ክፍላችን በ24 ሰዓት ውስጥ ያገኝዎታል ።'
          : 'Thank you! Your corporate partnership request has been received. Our marketing desk will contact you within 24 hours.'
      );

      setFormState({
        companyName: '',
        industry: 'Aviation & Finance',
        contactPerson: '',
        email: '',
        phone: '',
        campaignType: 'Integrated Sponsorship & Show Placement',
        budgetRange: 'Standard Corporate Package',
        message: '',
      });
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const partnerCategories = [
    { id: 'all', labelEn: 'All Brands (30+)', labelAm: 'ሁሉም ብራንዶች (30+)' },
    { id: 'aviation-finance', labelEn: 'Aviation & Finance', labelAm: 'አቪዬሽን እና ፋይናንስ' },
    { id: 'tech-transport', labelEn: 'Tech & Transport', labelAm: 'ቴክኖሎጂ እና ትራንስፖርት' },
    { id: 'hospitality-realestate', labelEn: 'Hospitality & Real Estate', labelAm: 'ሆስፒታሊቲ እና ሪል እስቴት' },
    { id: 'fmcg-health', labelEn: 'FMCG, Trade & Health', labelAm: 'ምርት ማምረቻ፣ ንግድና ጤና' },
    { id: 'diaspora', labelEn: 'US Diaspora Brands', labelAm: 'የአሜሪካ ዳያስፖራ ብራንዶች' },
  ];

  const partnersData = [
    // Aviation & Finance
    { name: 'Ethiopian Airlines', nameAm: 'የኢትዮጵያ አየር መንገድ', category: 'aviation-finance', tag: 'Flagship Partner', icon: Plane },
    { name: 'Dashen Bank', nameAm: 'ዳሸን ባንክ', category: 'aviation-finance', tag: 'Banking & FinTech', icon: Coins },
    { name: 'Ahadu Bank', nameAm: 'አሃዱ ባንክ', category: 'aviation-finance', tag: 'Banking & FinTech', icon: Coins },

    // Tech & Transport
    { name: 'Ashewa Technology Solution', nameAm: 'አሸዋ ቴክኖሎጂ ሶሉሽን', category: 'tech-transport', tag: 'Digital Platforms', icon: Cpu },
    { name: 'Ashewa.com', nameAm: 'አሸዋ ዶት ኮም', category: 'tech-transport', tag: 'E-Commerce', icon: Cpu },
    { name: 'Wegen Fund (USA)', nameAm: 'ወገን ፈንድ (አሜሪካ)', category: 'tech-transport', tag: 'Global FinTech', icon: Globe2 },
    { name: 'DStv Ethiopia', nameAm: 'ዲኤስ ቲቪ (DStv)', category: 'tech-transport', tag: 'Broadcast Media', icon: Tv },
    { name: 'Arada FM', nameAm: 'አራዳ ኤፍ ኤም', category: 'tech-transport', tag: 'Radio & Media', icon: Tv },
    { name: 'RIDE Transport', nameAm: 'ራይድ (RIDE)', category: 'tech-transport', tag: 'Ride Hailing', icon: Cpu },

    // Hospitality & Real Estate
    { name: 'Kuriftu Resort & Spa', nameAm: 'ኩሪፍቱ ሪዞርት', category: 'hospitality-realestate', tag: 'Luxury Hospitality', icon: Hotel },
    { name: 'Marriott Executive Apartments', nameAm: 'ማርዮት አዲስ ሆቴል', category: 'hospitality-realestate', tag: '5-Star Hospitality', icon: Hotel },
    { name: 'Negash Resort', nameAm: 'ነጋሽ ሪዞርት', category: 'hospitality-realestate', tag: 'Resort & Tourism', icon: Hotel },
    { name: 'Adwest Hotel', nameAm: 'አድዌስት ሆቴል', category: 'hospitality-realestate', tag: 'Boutique Hotel', icon: Hotel },
    { name: 'Ethio Best Real Estate', nameAm: 'ኢትዮ ቤስት ሪል እስቴት', category: 'hospitality-realestate', tag: 'Urban Real Estate', icon: Building2 },
    { name: 'Fison Real Estate', nameAm: 'ፊሶን ሪልስቴት', category: 'hospitality-realestate', tag: 'Luxury Living', icon: Building2 },

    // FMCG, Trade & Health
    { name: 'Knorr (Green Gursha)', nameAm: 'ክኖር (ግሪን ጉርሻ)', category: 'fmcg-health', tag: 'Global FMCG Food', icon: ShoppingBag },
    { name: 'Kaffa Coffee', nameAm: 'ከፋ ኮፊ', category: 'fmcg-health', tag: 'Premium Beverage', icon: ShoppingBag },
    { name: 'One Water', nameAm: 'ዋን ውሃ', category: 'fmcg-health', tag: 'Pure Mineral Water', icon: ShoppingBag },
    { name: 'Dradis Aluminum', nameAm: 'ድራዲስ አልሙኒየም', category: 'fmcg-health', tag: 'Industrial Manufacturing', icon: Building2 },
    { name: 'Kasma Furniture', nameAm: 'ካስማ ፈርኒቸር', category: 'fmcg-health', tag: 'Interior Design', icon: Building2 },
    { name: 'SMILE Dental Clinic', nameAm: 'SMILE ዴንታል', category: 'fmcg-health', tag: 'Specialized Healthcare', icon: Heart },
    { name: 'Mekrez Hospital', nameAm: 'መቅረዝ ሆስፒታል', category: 'fmcg-health', tag: 'General Medical Care', icon: Heart },
    { name: 'Life Line Home Care', nameAm: 'ላይፍ ላይን የቤት ለቤት ህክምና', category: 'fmcg-health', tag: 'Home Healthcare', icon: Heart },
    { name: 'Asheten Mental Health', nameAm: 'አሸተን የአእምሮ ህክምና', category: 'fmcg-health', tag: 'Mental Health Clinic', icon: Heart },
    { name: 'Zion Physiotherapy', nameAm: 'ዛየን ፊዝዮ ቴራፒ', category: 'fmcg-health', tag: 'Physical Therapy', icon: Heart },
    { name: 'KT Catering', nameAm: 'ኬቲ ኬተሪንግ', category: 'fmcg-health', tag: 'Food & Events', icon: ShoppingBag },
    { name: 'Escafer Culinary School', nameAm: 'እስካፌር የምግብ ማሰልጠኛ', category: 'fmcg-health', tag: 'Culinary Academy', icon: Award },
    { name: 'Yonas Mobile', nameAm: 'ዮናስ ሞባይል', category: 'fmcg-health', tag: 'Consumer Electronics', icon: Cpu },
    { name: 'Helen Bridal & Decor', nameAm: 'ሄለን ብራይዳል እና ዲኮር', category: 'fmcg-health', tag: 'Events & Bridal', icon: Sparkles },
    { name: 'ETS Ticket Office', nameAm: 'ETS ትኬት ኦፊስ', category: 'fmcg-health', tag: 'Travel & Ticketing', icon: Globe2 },
    { name: 'Asnake Advert', nameAm: 'አስናቀ አድቨርት', category: 'fmcg-health', tag: 'Advertising Agency', icon: Tv },

    // Diaspora
    { name: 'Arif Foods (USA)', nameAm: 'አሪፍ ፉድስ (አሜሪካ)', category: 'diaspora', tag: 'North America FMCG', icon: Globe2 },
    { name: 'Walia Teff (USA)', nameAm: 'ዋሊያ ጤፍ (አሜሪካ)', category: 'diaspora', tag: 'Diaspora Staples', icon: Globe2 },
    { name: 'Smart Fidel (USA)', nameAm: 'ስማርት ፊደል (አሜሪካ)', category: 'diaspora', tag: 'EdTech & Cultural', icon: Award },
  ];

  const filteredPartners = activePartnerCategory === 'all'
    ? partnersData
    : partnersData.filter(p => p.category === activePartnerCategory);

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Retain Global Portal Header */}
      <NavigationHeader />

      {/* Sub-Header Breadcrumb & Quick Action */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              {lang === 'am' ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-amber-400 font-semibold">
              {lang === 'am' ? 'የድርጅቱ መገለጫ እና ማርኬቲንግ' : 'Company Profile & Corporate Marketing'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#inquiry"
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 font-semibold hover:bg-amber-500 hover:text-slate-950 transition-all text-xs flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'የማስታወቂያ አጋርነት ይጠይቁ' : 'Book Corporate Campaign'}</span>
            </a>
          </div>
        </div>
      </div>

      <main className="space-y-24 pb-28">
        {/* ============================================================ */}
        {/* HERO SECTION: COMPANY PROFILE & DIGITAL REACH               */}
        {/* ============================================================ */}
        <section className="relative pt-16 sm:pt-24 pb-12 overflow-hidden">
          {/* Subtle Glow Spheres */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-amber-500/15 via-rose-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
          <div className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto space-y-6">
              {/* Pillar Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>
                  {lang === 'am'
                    ? 'ጥንቅቅ መልቲ ሚዲያ እና ኤቨንት ኦርጋናይዘር (ዶንኪ ቲዩብ)'
                    : 'Donkey Tube Media Group • Tinqiq Multi-Media & Event Organizer'}
                </span>
              </div>

              {/* Grand Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.15] font-display">
                {lang === 'am' ? (
                  <>
                    “ድምጽ ለሌላቸው ድምጽ እንሁን” <br />
                    <span className="text-gradient-gold">
                      የኢትዮጵያ ግዙፉ የዲጂታል ሚዲያ እና የተፅዕኖ ማዕከል
                    </span>
                  </>
                ) : (
                  <>
                    “Voice for the Voiceless” <br />
                    <span className="text-gradient-gold">
                      Ethiopia’s Premier Digital Media & Influential Production House
                    </span>
                  </>
                )}
              </h1>

              {/* Sub-Headline */}
              <p className="text-slate-300/90 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto font-sans">
                {lang === 'am'
                  ? 'በኮሜዲያን እሸቱ መለሰ የተመሰረተ፣ ባለፉት 9 ዓመታት በማህበራዊ፣ ባህላዊ እና ኢኮኖሚያዊ ጉዳዮች ላይ ግንዛቤን በመፍጠር፣ ከ7 ሚሊዮን በላይ ንቁ ተከታዮችንና ከ500 ሚሊዮን በላይ እይታዎችን ያስመዘገበ ታዋቂ ተቋም።'
                  : 'Founded by Comedian Eshetu Melese, championing community upliftment, transformative humor, and social change across 9+ years with over 7M+ active followers and 500M+ lifetime views.'}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                <a
                  href="#inquiry"
                  className="btn-luxury-gold px-8 py-4 text-sm sm:text-base flex items-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{lang === 'am' ? 'የማስታወቂያ አጋርነት ይጀምሩ' : 'Launch Brand Campaign'}</span>
                </a>

                <a
                  href="#reach"
                  className="btn-luxury-ghost px-7 py-4 text-sm sm:text-base flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'am' ? 'የተደራሽነት አሃዞችን ይመልከቱ' : 'View Audience Metrics'}</span>
                </a>
              </div>
            </div>

            {/* High-Impact Stat Grid Bar */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { number: '7M+', labelEn: 'Active Followers', labelAm: 'ንቁ ተከታዮች', highlight: 'from-amber-400 via-amber-300 to-amber-500' },
                { number: '500M+', labelEn: 'Lifetime Video Views', labelAm: 'አጠቃላይ እይታዎች', highlight: 'from-amber-400 to-yellow-500' },
                { number: '3.27M+', labelEn: 'YouTube Subscribers', labelAm: 'የዩቲዩብ ቤተሰቦች', highlight: 'from-rose-400 to-red-500' },
                { number: '9.8M', labelEn: 'Single Video Record', labelAm: 'የአንድ ቪዲዮ ከፍተኛ እይታ', highlight: 'from-purple-400 to-indigo-400' },
                { number: '50+', labelEn: 'Full-Time Team', labelAm: 'ቋሚ ባለሙያዎች', highlight: 'from-blue-400 to-cyan-400' },
                { number: '1.406B+', labelEn: 'ETB Mobilized for CSR', labelAm: 'ለበጎ አድራጎት የተሰበሰበ', highlight: 'from-emerald-400 to-teal-400' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl glass-panel hover:glass-panel-gold transition-all text-center group hover:-translate-y-1"
                >
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${stat.highlight} bg-clip-text text-transparent group-hover:scale-105 transition-transform font-mono`}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-slate-300 mt-1.5 font-medium">
                    {lang === 'am' ? stat.labelAm : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 1. COMPANY PROFILE, VISION, MISSION & VALUES                 */}
        {/* ============================================================ */}
        <section id="profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 1' : 'Section 1'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {lang === 'am' ? 'የድርጅቱ መገለጫ እና ዋና ዓላማ' : 'Company Profile & Core Purpose'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ዶንኪ ቲዩብ (ጥንቅቅ መልቲ ሚዲያ እና ኤቨንት ኦርጋናይዘር) የተመሰረተበትን ራዕይ፣ ተልዕኮ እና መሰረታዊ ድርጅታዊ እሴቶች'
                : 'The foundational vision, mission, and core values that drive Donkey Tube Media Group'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Vision & Mission Cards */}
            <div className="lg:col-span-7 space-y-6">
              {/* Vision Card */}
              <div className="p-7 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <Sparkle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'am' ? 'ራዕይ (Vision Statement)' : 'Our Vision'}
                    </h3>
                    <span className="text-xs text-amber-500/80 font-medium">Inspiring Society Through Quality Media</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-1">
                  {lang === 'am'
                    ? 'ሚዲያን ለበጎ አላማ በመጠቀም ታማኝነት፣ አንድነት እና ማህበረሰባዊ እድገት የሚሰበክበት፣ ጥራት ያለው እና በጎ ተፅዕኖ ፈጣሪ የሚዲያ ስነ-ምህዳር መገንባት ።'
                    : 'To build a high-caliber, ethical, and transformative media ecosystem that leverages creative storytelling to advance societal unity, community trust, and sustainable national progress.'}
                </p>
              </div>

              {/* Mission Card */}
              <div className="p-7 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-900/50 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl space-y-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <TargetIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'am' ? 'ተልዕኮ (Mission Statement)' : 'Our Mission'}
                    </h3>
                    <span className="text-xs text-blue-400/80 font-medium">Empowerment, Education & Philanthropy</span>
                  </div>
                </div>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed pl-1">
                  {lang === 'am'
                    ? 'ስልጠናዎችን እና የMentorship ፕሮግራሞችን በመስጠት ቀጣዩን የሚዲያ ትውልድ ማብቃት (እስካሁን ከ1,000 በላይ ዩቲዩበሮችን አስመርቋል)፣ የራሱን የሚዲያ አካዳሚ መመስረት፣ እና እንደ አካል ጉዳተኛ ልጆች ያሏቸው እናቶች ያሉ የተገለሉ የህብረተሰብ ክፍሎችን በገጠር እና በከተማ የድጋፍ ማዕከላት በኩል መርዳት ።'
                    : 'To empower the next generation of creative media leaders through intensive training and mentorship (over 1,000+ creators graduated to date), establish our premier Media Academy, and champion marginalized societal groups—including mothers of children with special needs—through dedicated urban and rural support hubs.'}
                </p>
              </div>

              {/* Organizational Capacity Card */}
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Users className="w-7 h-7 text-amber-400" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white mb-1">
                    {lang === 'am' ? 'የሰው ኃይል እና ድርጅታዊ አቅም (50+ ቋሚ ሰራተኞች)' : 'Workforce & Corporate Infrastructure (50+ Staff)'}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-400 leading-normal">
                    {lang === 'am'
                      ? 'ከተራ የዩቲዩብ ቻናሎች በተለየ መልኩ ሰፊ የስራ ዕድል የፈጠረ ተቋም ሲሆን፣ በአሁኑ ሰዓት ከ50 በላይ ቋሚ ሰራተኞችን ይዞ የሚንቀሳቀስ በሚገባ የተዋቀረ የሚዲያ ቤት ነው። ተቋሙ የራሱ የዲጂታል እና ግራፊክስ ዲዛይን ክፍል ያለው ሲሆን፣ የቪዲዮዎችን አፈፃፀም እና የታዳሚ መረጃዎችን (Data/Analytics) በየቀኑ በመከታተል ይዘቶችን ከዘመናዊ የቴክኖሎጂ አዝማሚያዎች ጋር ያጣጥማል ።'
                      : 'Unlike conventional YouTube channels, Donkey Tube is a fully incorporated media enterprise employing over 50 full-time specialists. Housing dedicated graphic design, data analytics, and audience intelligence desks, our team monitors viewer retention metrics daily to keep campaigns ahead of contemporary market trends.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Core Values (4 Pillars) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-7 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-6">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-500 tracking-wider">
                  {lang === 'am' ? 'ድርጅታዊ እሴቶች' : 'Pillars of Excellence'}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {lang === 'am' ? '4ቱ መሰረታዊ ድርጅታዊ እሴቶች' : 'Our 4 Core Organizational Values'}
                </h3>
              </div>

              <div className="space-y-4">
                {[
                  {
                    num: '01',
                    titleAm: 'ታማኝነት (Integrity)',
                    titleEn: 'Integrity',
                    descAm: 'በሁሉም ይዘቶች እና ግንኙነቶች ከፍተኛ የሞራል እና የሙያ ስነ-ምግባርን መጠበቅ ።',
                    descEn: 'Maintaining the highest moral, ethical, and journalistic standards across all content and partnerships.',
                  },
                  {
                    num: '02',
                    titleAm: 'የህዝብ አመኔታ (Community Trust)',
                    titleEn: 'Community Trust',
                    descAm: 'ትክክለኛ እና እውነተኛ ድምፅ በመሆን የህዝብን እምነት ማቆየት ።',
                    descEn: 'Remaining an authentic and unwavering voice that commands deep, genuine public loyalty.',
                  },
                  {
                    num: '03',
                    titleAm: 'በጎ ተፅዕኖ (Positive Impact)',
                    titleEn: 'Positive Impact',
                    descAm: 'አንድነትን እና ማህበረሰባዊ እድገትን የሚያነቃቁ ይዘቶችን ማምረት ።',
                    descEn: 'Producing narratives that actively foster unity, economic vitality, and social harmony.',
                  },
                  {
                    num: '04',
                    titleAm: 'ማብቃት (Education & Empowerment)',
                    titleEn: 'Education & Empowerment',
                    descAm: 'ማህበረሰቡን በሚዲያ እውቀት ማበልፀግ ።',
                    descEn: 'Equipping our community and young creators with vital media literacy and technical skills.',
                  },
                ].map((val, idx) => (
                  <div key={idx} className="flex gap-4 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <span className="text-sm font-black text-amber-500/80">{val.num}</span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-200">
                        {lang === 'am' ? val.titleAm : val.titleEn}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                        {lang === 'am' ? val.descAm : val.descEn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-800 text-xs text-slate-500 flex items-center justify-between">
                <span>{lang === 'am' ? 'በሜይ 12, 2017 የተመሰረተ' : 'Established May 12, 2017'}</span>
                <span className="text-amber-500 font-semibold">{lang === 'am' ? '9 ዓመታት የላቀ አገልግሎት' : '9 Years of Excellence'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. DIGITAL MARKET DOMINANCE & AUDIENCE REACH                 */}
        {/* ============================================================ */}
        <section id="reach" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 2' : 'Section 2'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {lang === 'am' ? 'የዲጂታል ገበያ የበላይነት እና የተደራሽነት አቅም' : 'Digital Market Dominance & Aggregate Reach'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'በዋና ዋና ዲጂታል መድረኮች ላይ ከ7 ሚሊዮን በላይ ንቁ ተከታዮችን ያቀፈ ግዙፍ ማህበረሰብ'
                : 'Over 7 Million active cross-platform followers commanding unmatched attention in Ethiopia and the Global Diaspora'}
            </p>
          </div>

          {/* Social Platform Breakout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* YouTube Card */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-red-950/30 via-slate-900/90 to-slate-900/60 border border-red-500/20 hover:border-red-500/50 transition-all shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
                  <Video className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold">
                  YouTube
                </span>
              </div>
              <div className="text-4xl font-black text-white">3.27M+</div>
              <div className="text-sm font-semibold text-red-400 mt-1">
                {lang === 'am' ? 'ሰብስክራይበርስ (Subscribers)' : 'Subscribers'}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የቪዲዮ ብዛት:' : 'Total Videos:'}</span>
                  <span className="font-bold text-white">2,100+ High Quality</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'አጠቃላይ እይታዎች:' : 'Lifetime Views:'}</span>
                  <span className="font-bold text-white">500M+ Views</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የአንድ ቪዲዮ ከፍተኛ እይታ:' : 'Peak Single Video:'}</span>
                  <span className="font-bold text-amber-400">9.8 Million Views</span>
                </div>
              </div>
            </div>

            {/* TikTok Card */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-pink-950/30 via-slate-900/90 to-slate-900/60 border border-pink-500/20 hover:border-pink-500/50 transition-all shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-pink-600/20 text-pink-500 border border-pink-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 text-xs font-bold">
                  TikTok
                </span>
              </div>
              <div className="text-4xl font-black text-white">2.8M+</div>
              <div className="text-sm font-semibold text-pink-400 mt-1">
                {lang === 'am' ? 'ተከታዮች (Followers)' : 'Followers'}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የተሳትፎ ምጣኔ:' : 'Viral Velocity:'}</span>
                  <span className="font-bold text-white">Ultra-High Engagement</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የታዳሚ ስብጥር:' : 'Audience:'}</span>
                  <span className="font-bold text-white">Youth & Gen Z Dynamic</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የተቀናጀ ዘመቻ:' : 'Campaign Strategy:'}</span>
                  <span className="font-bold text-amber-400">Cross-Post Viral Clips</span>
                </div>
              </div>
            </div>

            {/* Facebook Card */}
            <div className="p-7 rounded-2xl bg-gradient-to-b from-blue-950/30 via-slate-900/90 to-slate-900/60 border border-blue-500/20 hover:border-blue-500/50 transition-all shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-600/20 text-blue-500 border border-blue-500/30">
                  <Globe2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-bold">
                  Facebook
                </span>
              </div>
              <div className="text-4xl font-black text-white">1.7M+</div>
              <div className="text-sm font-semibold text-blue-400 mt-1">
                {lang === 'am' ? 'ተከታዮች (Followers)' : 'Followers'}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-800 space-y-2 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የዳያስፖራ ሽፋን:' : 'Diaspora Coverage:'}</span>
                  <span className="font-bold text-white">North America & Europe</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የሀገር ውስጥ ተደራሽነት:' : 'Domestic Depth:'}</span>
                  <span className="font-bold text-white">35+ Age Demographics</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የምርት ስም ትስስር:' : 'Brand Recall:'}</span>
                  <span className="font-bold text-amber-400">Trusted Community Hub</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Dominance & Formats Banner */}
          <div className="p-7 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/80 to-slate-950 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">16+</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {lang === 'am' ? 'የተለያዩ ተወዳጅ የሾው ዓይነቶች' : 'Distinct Popular Show Formats'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-white">11 Full Hours</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {lang === 'am' ? 'ሙሉ የአንድ ሰዓት የስታንዳፕ ኮሜዲ ስራዎች' : 'Full 1-Hour Standup Specials'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400">9.8M Views</div>
                <div className="text-xs sm:text-sm text-slate-400">
                  {lang === 'am' ? 'የአንድ ነጠላ ቪዲዮ ከፍተኛ እይታ' : 'Highest Single Video Milestone'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. KEY LEADERSHIP PROFILE: COMEDIAN ESHETU MELESE           */}
        {/* ============================================================ */}
        <section id="leadership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 3' : 'Section 3'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {lang === 'am' ? 'የድርጅቱ መስራች እና ዋና ስራ አስፈፃሚ ብቃት' : 'Key Leadership Profile & Accreditations'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ኮሜዲያን እሸቱ መለሰ — የተከበረ የኪነ-ጥበብ ባለሙያ፣ ስራ ፈጣሪ እና ታዋቂ በጎ አድራጊ'
                : 'Comedian Eshetu Melese — Founder, CEO, Theatrical Arts Scholar & Philanthropist'}
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900/95 via-slate-900/70 to-slate-950 border border-slate-800 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Leader Photo with Luxury Border Glow */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-64 sm:w-80 h-80 sm:h-96 rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-950 shadow-2xl">
                    <img
                      src="/images/eshetu-portrait.png"
                      alt="Comedian Eshetu Melese"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-4 left-4 right-4 text-center">
                      <span className="font-extrabold text-white text-lg block">ኮሜዲያን እሸቱ መለሰ</span>
                      <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">Founder & CEO</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Leadership Biography & Honors */}
              <div className="lg:col-span-7 space-y-6">
                <div>
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                    {lang === 'am' ? 'የትምህርት እና ሙያ ዝግጅት' : 'Education & Credentials'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2">
                    {lang === 'am' ? 'ኮሜዲያን እሸቱ መለሰ' : 'Comedian Eshetu Melese'}
                  </h3>
                  <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                    {lang === 'am'
                      ? 'ከአዲስ አበባ ዩኒቨርሲቲ በቲያትሪካል አርት (Theatrical Arts) የመጀመሪያ ዲግሪ ያለው ሲሆን፣ በአሁኑ ወቅት እውቅ ስታንዳፕ ኮሜዲያን፣ የቴሌቪዥን ሆስት፣ አነቃቂ ንግግር አድራጊ፣ ስራ ፈጣሪ እና ታዋቂ በጎ አድራጊ ነው ።'
                      : 'Holds a Bachelor of Arts Degree in Theatrical Arts from Addis Ababa University. Renowned nationally and globally as a master stand-up comedian, acclaimed television host, transformational keynote speaker, serial media entrepreneur, and leading philanthropist.'}
                  </p>
                </div>

                {/* Accreditations & Awards Grid */}
                <div className="space-y-3.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">
                    {lang === 'am' ? 'እውቅና እና ዓለምአቀፍ ሽልማቶች' : 'Prestigious Recognitions & Awards'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {lang === 'am' ? 'በባህልና ቱሪዝም ሚኒስቴር' : 'Ministry of Culture & Tourism'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'am' ? 'ከፍተኛ ሀገራዊ እውቅና እና የምስክር ወረቀት' : 'Highest National Honorary Recognition'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {lang === 'am' ? 'Seed Award (ዩናይትድ ስቴትስ)' : 'The Seed Award (USA)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'am' ? 'በአሜሪካን አገር ለወጣቶች በጎ ተጽእኖ ፈጣሪ' : 'Youth Leadership & Impact Laureate'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {lang === 'am' ? 'ቢቂላ አዋርድ (ካናዳ ቶሮንቶ 2023)' : 'Bikila Award (Toronto, Canada)'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'am' ? 'በማህበረሰብ አገልግሎት የላቀ ተሸላሚ' : 'Excellence in Community Service'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-white">
                          {lang === 'am' ? '30+ ተጨማሪ ሰርተፊኬቶች' : '30+ Honorary Global Diplomas'}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {lang === 'am' ? 'ከአሜሪካ፣ አውሮፓ እና ሀገር ውስጥ ተቋማት' : 'Conferred by diaspora and global summits'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>
                    {lang === 'am'
                      ? 'ከሀገር ውጪም በአሜሪካ ትልልቅ መድረኮች ላይ በሺዎች የሚቆጠሩ ታዳሚዎች በተገኙበት ስራዎቹን አቅርቦ ትልቅ ሀገራዊ ኩራት ሆኗል ።'
                      : 'Commanded premier diaspora halls across North America and Europe, drawing thousands per event and uniting global Ethiopian communities.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. CORPORATE PARTNERSHIPS & MULTI-MILLION REACH             */}
        {/* ============================================================ */}
        <section id="partners" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 4' : 'Section 4'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {lang === 'am' ? 'የኮርፖሬት ደንበኞች አጋርነት እና የተቀናጀ ተደራሽነት' : 'Corporate Partnerships & Multi-Million Views Penetration'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ከሀገር ውስጥ ግዙፍ የመንግስት እና የግል ተቋማት ጀምሮ እስከ ዓለምአቀፍ ታዋቂ ብራንዶች ድረስ ሰፊ እና ስኬታማ የማስታወቂያ አጋርነቶች'
                : 'Trusted by flagship governmental institutions, premier private conglomerates, and global international diaspora brands'}
            </p>
          </div>

          {/* Value Proposition Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-amber-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-amber-400" />
                <span>{lang === 'am' ? 'የሚሊዮኖች እይታ ዋስትና (1M – 7.8M+ እይታዎች)' : 'Guaranteed Multi-Million Views Penetration'}</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {lang === 'am'
                  ? 'በዶንኪ ቲዩብ መድረኮች ላይ የሚለቀቁ የማስታወቂያ ይዘቶች በአማካይ ከ1 ሚሊዮን እስከ 7.8 ሚሊዮን በላይ እይታዎችን (Views) በአንድ ቪዲዮ ብቻ የማስመዝገብ ብቃት አላቸው። ይህም አንድ ብራንድ በአጭር ጊዜ ውስጥ በሀገር ውስጥና በዓለም አቀፍ ደረጃ በከፍተኛ ሁኔታ እንዲታወቅና የገበያ ትስስሩ እንዲያድግ ያደርጋል።'
                  : 'Sponsorship content deployed on Donkey Tube channels consistently yields between 1,000,000 to 7,800,000+ views per single production, providing unmatched rapid brand resonance and top-of-mind consumer recall.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center gap-2.5 text-blue-400 font-bold text-base">
                <Layers className="w-5 h-5 text-blue-400" />
                <span>{lang === 'am' ? 'የተደራረበ የዲጂታል ትስስር አጠቃቀም (Cross-Platform)' : 'Cross-Platform Integrated Blitz'}</span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                {lang === 'am'
                  ? 'ማስታወቂያዎቻችን በአንድ መድረክ ላይ ብቻ የሚቀሩ ሳይሆኑ፣ በዩቲዩብ ከተመዘገበው በተጨማሪ በቲክቶክ እና በፌስቡክ ገጾቻችን ጭምር በተቀናጀ መልኩ ስለሚሰራጩ፤ የምርት ስምዎ (Brand Awareness) ከእይታ ገደብ በላይ በህዝብ አእምሮ ውስጥ ተቀርጾ እንዲቀር ያደርጋል።'
                  : 'Campaigns are never isolated to a single feed. We synchronize YouTube integrated placements with TikTok bite-sized viral cuts and Facebook community discussions, guaranteeing comprehensive brand immersion.'}
              </p>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {partnerCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActivePartnerCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                  activePartnerCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-md shadow-amber-500/20'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                {lang === 'am' ? cat.labelAm : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Interactive Partners Directory Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredPartners.map((partner, idx) => {
              const IconComp = partner.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 hover:bg-slate-900/90 transition-all flex items-center gap-3.5 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate group-hover:text-amber-400 transition-colors">
                      {lang === 'am' ? partner.nameAm : partner.name}
                    </div>
                    <div className="text-[11px] text-slate-400 truncate">
                      {partner.tag}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. SOCIAL IMPACT & CSR: 1.406 BILLION ETB MOBILIZED          */}
        {/* ============================================================ */}
        <section id="csr" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl">
            {/* Background Image with Dark Tint */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/lmetsdek-charity.jpg"
                alt="Social Impact"
                className="w-full h-full object-cover opacity-25 filter grayscale-[30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/80" />
            </div>

            <div className="relative z-10 p-8 sm:p-14 max-w-3xl space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <Heart className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'am' ? 'ክፍል 5 • ወደር የሌለው የማህበራዊ ኃላፊነት' : 'Section 5 • Social Impact & CSR'}</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-black text-white leading-tight">
                {lang === 'am' ? (
                  <>
                    ከ1.406 ቢሊዮን ብር በላይ <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                      የህዝብ አመኔታ እና የተከናወኑ ግዙፍ የበጎ አድራጎት ፕሮጀክቶች
                    </span>
                  </>
                ) : (
                  <>
                    Over 1.406 Billion ETB <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
                      Direct Public Trust & Life-Saving Humanitarian Drives
                    </span>
                  </>
                )}
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {lang === 'am'
                  ? 'ዶንኪ ቲዩብ ማስታወቂያዎችን ወደ ገበያ ከመቀየር ባለፈ፣ በህዝብ ዘንድ ፍፁም ተዓማኒነት (Ultimate Trust) ያለው ተቋም ነው። እስካሁን ድረስ ከ1 ቢሊዮን 406 ሚሊዮን ብር በላይ ($1,406,000,000+) በቀጥታ ከተጠቃሚዎች በማሰባሰብ ግዙፍ ፕሮጀክቶችን በተሳካ ሁኔታ አጠናቆ አስረክቧል ።'
                  : 'Beyond commercial brand acceleration, Donkey Tube commands absolute public confidence. To date, over 1,406,000,000+ ETB has been directly mobilized from loyal viewers, successfully funding critical medical operations, food subsidies, and shelter projects nationwide.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-extrabold text-emerald-400">850+ Patients</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {lang === 'am' ? 'ወሳኝ የቀዶ ጥገና ድጋፍ' : 'Critical Surgeries Funded'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-extrabold text-emerald-400">12,000+ Students</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {lang === 'am' ? 'የትምህርት ቁሳቁስና ክፍያ' : 'School Supplies & Grants'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-xl font-extrabold text-emerald-400">100% Transparent</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {lang === 'am' ? 'ፍፁም ታማኝነትና ቁጥጥር' : 'Direct Accountability'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. TECHNICAL & CREATIVE PRODUCTION EXCELLENCE                 */}
        {/* ============================================================ */}
        <section id="production" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 6' : 'Section 6'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              {lang === 'am' ? 'የፈጠራ፣ የስክሪፕት እና የፕሮዳክሽን ቴክኒካዊ ብቃት' : 'Technical & Creative Production Excellence'}
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ከመጀመሪያው ሃሳብ መነጨት (Concept) እስከ መጨረሻው የቪዲዮ እትም (Final Output) ድረስ ያለው ሙሉ የፊልም እና ቪዲዮ ፕሮዳክሽን ሰንሰለት'
                : 'End-to-end proprietary cinematography, scriptwriting, and Hollywood-grade post-production pipelines'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 6.1: Strategic Scriptwriting */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'am' ? '6.1. ስልታዊ እና ፈጠራ የተሞላበት የስክሪፕት ስራ' : 'Strategic Scriptwriting & Storytelling'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'የስክሪፕት ደራሲያኖቻችን መልዕክቶችን ከተመልካች ስነ-ልቦና ጋር በማጣጣም፣ አሰልቺ መረጃዎችን እንኳ ሳቢ በሆነ የStorytelling አቀራረብ የመቀየር ልዩ ክህሎት አላቸው።'
                      : 'Master copywriters blend audience psychology with irresistible narrative storytelling, transforming dense information into engaging, shareable stories.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'እያንዳንዱ ይዘት ከመቀረጹ በፊት ጥልቅ ምርምር (Research) የሚደረግበት ሲሆን፣ የደንበኞቻችንን የንግድ ዓላማና ማህበረሰባዊ እሴት ጠብቆ ይዘጋጃል።'
                      : 'Every production undergoes rigorous pre-shoot research, aligning seamlessly with client brand identity and social values.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 6.2: Complete Production Gear & Talent */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'am' ? '6.2. የተሟላ የፕሮዳክሽን ግብዓቶች እና የባለሙያዎች ጥምረት' : 'Complete In-House Rigs & Master Talent'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'ተቋማችን ሙሉ የፕሮዳክሽን መቅረጫ መሳሪያዎች፣ የድምፅ እና የብርሃን (Lighting) እቃዎች ባለቤት በመሆኑ ከኪራይ ጋር ተያይዘው የሚመጡ መዘግየቶችን ሙሉ በሙሉ ያስቀራል።'
                      : '100% owned cinema cameras, multi-point lighting arrays, and audio equipment, eliminating third-party rental delays entirely.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'በፊልም እና ሚዲያ ኢንዱስትሪ ውስጥ የረጅም ዓመታት ልምድ ያላቸው ሲኒማቶግራፈሮቻችን እና የብርሃን ባለሙያዎቻችን እያንዳንዱን ፍሬም በከፍተኛ ጥንቃቄ ይቀርጻሉ።'
                      : 'Seasoned directors of photography, sound engineers, and lighting artists craft each frame with high cinematic precision.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 6.3: Advanced Post-Production & Editing */}
            <div className="p-8 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/40 transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white">
                {lang === 'am' ? '6.3. አለምአቀፍ ደረጃውን የጠበቀ የቪዲዮ ኤዲቲንግ' : 'Advanced Post-Production & Editing'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'ዘመናዊ ሶፍትዌሮችን (እንደ Adobe Premiere Pro እና DaVinci Resolve) በመጠቀም የቪዲዮዎችን ቀለም (Color Grading)፣ የድምፅ ጥራትና VFX በጥንቃቄ ይሰራል ።'
                      : 'Industry-standard suites (Adobe Premiere Pro & DaVinci Resolve) for broadcast color grading, sound design, and VFX polish.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'ከ2,100 በላይ ቪዲዮዎች ያሏቸው ፈጣን መቆራረጥ (Pacing) እና ከፍተኛ የዕይታ ማቆየት ፍጥነት (Retention Rate) የቴክኒክ ብቃታችን ማረጋገጫ ነው።'
                      : 'Proven retention across 2,100+ videos; dynamic pacing that holds viewers spellbound from first second to call-to-action.'}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* INTERACTIVE INQUIRY FORM: BOOK A CAMPAIGN                    */}
        {/* ============================================================ */}
        <section id="inquiry" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="p-8 sm:p-12 rounded-3xl glass-panel-gold shadow-2xl relative overflow-hidden">
            {/* Subtle Accent Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/15 blur-[100px] rounded-full pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {lang === 'am' ? 'የማስታወቂያ አጋርነት ማመልከቻ' : 'Corporate Booking Desk'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white font-display tracking-tight">
                {lang === 'am' ? 'ብራንድዎን በሚሊዮኖች ልብ ውስጥ ይትከሉ' : 'Accelerate Your Brand with Donkey Tube'}
              </h2>
              <p className="text-slate-300/80 text-xs sm:text-sm font-sans leading-relaxed">
                {lang === 'am'
                  ? 'ከዚህ በታች ያለውን ቅጽ በመሙላት የማስታወቂያ ፍላጎትዎን ያስመዝግቡ። የኮርፖሬት ክፍላችን በ24 ሰዓት ውስጥ ሙሉ የዋጋ ዝርዝርና እቅድ ያቀርብልዎታል ።'
                  : 'Submit your brand inquiry below. Our corporate media desk will review and provide a customized cross-platform proposal within 24 hours.'}
              </p>
            </div>

            {formSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የድርጅቱ / የምርት ስም *' : 'Company / Brand Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    placeholder="e.g. Ethiopian Airlines, Kuriftu Resort..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የስራው ዘርፍ *' : 'Industry Sector *'}
                  </label>
                  <select
                    value={formState.industry}
                    onChange={(e) => setFormState({ ...formState, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/70 border border-white/10 text-slate-100 focus:outline-none focus:border-amber-400 text-sm"
                  >
                    <option value="Aviation & Finance">Aviation & Finance (አቪዬሽን እና ፋይናንስ)</option>
                    <option value="Tech & Mobility">Technology & Transportation (ቴክኖሎጂ እና ትራንስፖርት)</option>
                    <option value="Hospitality & Real Estate">Hospitality & Real Estate (ሆስፒታሊቲ እና ሪል እስቴት)</option>
                    <option value="FMCG & Food">FMCG, Food & Beverage (የምግብ እና መጠጥ ምርቶች)</option>
                    <option value="Healthcare & Wellness">Healthcare & Wellness (የጤና እና ህክምና)</option>
                    <option value="Diaspora Brands">Global Diaspora Brand (የዳያስፖራ ብራንድ)</option>
                    <option value="Other">Other Enterprise (ሌላ ዘርፍ)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የእውቂያ ሰው ስም *' : 'Contact Person *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.contactPerson}
                    onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                    placeholder="e.g. Dawit Bekele (Marketing Director)"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'ስልክ ቁጥር (WhatsApp / Call) *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+251 911 234567"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'ኢሜይል (Email)' : 'Corporate Email'}
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="marketing@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የዘመቻው አይነት (Campaign Target)' : 'Campaign Target'}
                  </label>
                  <select
                    value={formState.campaignType}
                    onChange={(e) => setFormState({ ...formState, campaignType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-500 text-sm"
                  >
                    <option value="Integrated Sponsorship & Show Placement">Integrated YouTube Show Placement</option>
                    <option value="Cross-Platform Blitz (YouTube + TikTok + Facebook)">Cross-Platform Blitz (YouTube + TikTok + Facebook)</option>
                    <option value="Dedicated Documentary / Commercial Video">Dedicated Commercial Film Production</option>
                    <option value="VIP Event / Live Tour Sponsorship">VIP Tour & Live Event Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {lang === 'am' ? 'የበጀት / የጊዜ እቅድ' : 'Budget / Timeline'}
                  </label>
                  <input
                    type="text"
                    value={formState.budgetRange}
                    onChange={(e) => setFormState({ ...formState, budgetRange: e.target.value })}
                    placeholder="e.g. Immediate Launch / Q4 2026"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {lang === 'am' ? 'ተጨማሪ መልዕክት / ማብራሪያ' : 'Campaign Goals / Additional Notes'}
                </label>
                <textarea
                  rows={3}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  placeholder={
                    lang === 'am'
                      ? 'ስለ ብራንድዎ ማስተላለፍ የሚፈልጉትን ዋና መልዕክት በአጭሩ ያብራሩልን...'
                      : 'Tell us briefly about your marketing objectives or target audience...'
                  }
                  className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full btn-luxury-gold py-4 text-sm sm:text-base flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{lang === 'am' ? 'እየተላከ ነው...' : 'Submitting Request...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>{lang === 'am' ? 'የማስታወቂያ ጥያቄውን ላክ' : 'Submit Corporate Inquiry'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Contact Cards */}
            <div className="mt-8 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-center text-xs">
              <a
                href="https://t.me/eshetumelese"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-400 flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-blue-400" />
                <span>Telegram: @eshetumelese</span>
              </a>

              <a
                href="mailto:marketing@eshetumelese.com"
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-amber-400 flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>marketing@eshetumelese.com</span>
              </a>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 flex items-center justify-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-800 bg-slate-950/90 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Donkey Tube (Tinqiq Multi-Media & Event Organizer). Founded by Comedian Eshetu Melese. All rights reserved.</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-slate-400">
            <Link href="/" className="hover:text-amber-400 transition-colors">Portal Home</Link>
            <span>•</span>
            <Link href="/register" className="hover:text-amber-400 transition-colors">Member Registration</Link>
            <span>•</span>
            <Link href="/search" className="hover:text-amber-400 transition-colors">Verify Card</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function TargetIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}
