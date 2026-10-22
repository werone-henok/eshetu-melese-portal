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
  Sparkle,
  Flag,
  HandHeart,
  Landmark,
  Target,
  Shield,
  Bot,
  Lightbulb,
  Scale,
  BookOpen
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
    { name: 'Ethiopian Airlines', nameAm: 'የኢትዮጵያ አየር መንገድ', category: 'aviation-finance', tag: 'Flagship Partner', logo: '/partners/ethiopian-airlines.svg' },
    { name: 'Dashen Bank', nameAm: 'ዳሸን ባንክ', category: 'aviation-finance', tag: 'Banking & FinTech', logo: '/partners/dashen-bank.png' },
    { name: 'Ahadu Bank', nameAm: 'አሃዱ ባንክ', category: 'aviation-finance', tag: 'Banking & FinTech', logo: '/partners/ahadu-bank.svg' },

    // Tech & Transport
    { name: 'Ashewa Technology Solution', nameAm: 'አሸዋ ቴክኖሎጂ ሶሉሽን', category: 'tech-transport', tag: 'Digital Platforms', logo: '/partners/ashewa-technology.png' },
    { name: 'Ashewa.com', nameAm: 'አሸዋ ዶት ኮም', category: 'tech-transport', tag: 'E-Commerce', logo: '/partners/ashewa-com.png' },
    { name: 'Wegen Fund (USA)', nameAm: 'ወገን ፈንድ (አሜሪካ)', category: 'tech-transport', tag: 'Global FinTech', logo: '/partners/wegen-fund.png' },
    { name: 'DStv Ethiopia', nameAm: 'ዲኤስ ቲቪ (DStv)', category: 'tech-transport', tag: 'Broadcast Media', logo: '/partners/dstv.svg' },
    { name: 'Arada FM', nameAm: 'አራዳ ኤፍ ኤም', category: 'tech-transport', tag: 'Radio & Media', logo: '/partners/arada-fm.png' },
    { name: 'RIDE Transport', nameAm: 'ራይድ (RIDE)', category: 'tech-transport', tag: 'Ride Hailing', logo: '/partners/ride.svg' },

    // Hospitality & Real Estate
    { name: 'Kuriftu Resort & Spa', nameAm: 'ኩሪፍቱ ሪዞርት', category: 'hospitality-realestate', tag: 'Luxury Hospitality', logo: '/partners/kuriftu.png' },
    { name: 'Marriott Executive Apartments', nameAm: 'ማርዮት አዲስ ሆቴል', category: 'hospitality-realestate', tag: '5-Star Hospitality', logo: '/partners/marriott.png' },
    { name: 'Negash Resort', nameAm: 'ነጋሽ ሪዞርት', category: 'hospitality-realestate', tag: 'Resort & Tourism', logo: '/partners/negash-resort.png' },
    { name: 'Adwest Hotel', nameAm: 'አድዌስት ሆቴል', category: 'hospitality-realestate', tag: 'Boutique Hotel', logo: '/partners/adwest-hotel.png' },
    { name: 'Ethio Best Real Estate', nameAm: 'ኢትዮ ቤስት ሪል እስቴት', category: 'hospitality-realestate', tag: 'Urban Real Estate', logo: '/partners/ethio-best-realestate.png' },
    { name: 'Phison Real Estate', nameAm: 'ፊሶን ሪልስቴት', category: 'hospitality-realestate', tag: 'Luxury Living', logo: '/partners/phison-realestate.png' },

    // FMCG, Trade & Health
    { name: 'Knorr (Green Gursha)', nameAm: 'ክኖር (ግሪን ጉርሻ)', category: 'fmcg-health', tag: 'Global FMCG Food', logo: '/partners/knorr.webp' },
    { name: 'Kaffa Coffee', nameAm: 'ከፋ ኮፊ', category: 'fmcg-health', tag: 'Premium Beverage', logo: '/partners/kaffa-coffee.jpg' },
    { name: 'One Water', nameAm: 'ዋን ውሃ', category: 'fmcg-health', tag: 'Pure Mineral Water', logo: '/partners/one-water.png' },
    { name: 'Dradis Aluminum', nameAm: 'ድራዲስ አልሙኒየም', category: 'fmcg-health', tag: 'Industrial Manufacturing', logo: '/partners/dradis-aluminum.png' },
    { name: 'Kasma Furniture', nameAm: 'ካስማ ፈርኒቸር', category: 'fmcg-health', tag: 'Interior Design', logo: '/partners/kasma-furniture.png' },
    { name: 'SMILE Dental Clinic', nameAm: 'SMILE ዴንታል', category: 'fmcg-health', tag: 'Specialized Healthcare', logo: '/partners/smile-dental.png' },
    { name: 'Mekrez Hospital', nameAm: 'መቅረዝ ሆስፒታል', category: 'fmcg-health', tag: 'General Medical Care', logo: '/partners/mekrez-hospital.jpg' },
    { name: 'Life Line Home Care', nameAm: 'ላይፍ ላይን የቤት ለቤት ህክምና', category: 'fmcg-health', tag: 'Home Healthcare', logo: '/partners/lifeline-homecare.png' },
    { name: 'Asheten Mental Health', nameAm: 'አሸተን የአእምሮ ህክምና', category: 'fmcg-health', tag: 'Mental Health Clinic', logo: '/partners/asheten-mental-health.png' },
    { name: 'Zion Physiotherapy', nameAm: 'ዛየን ፊዝዮ ቴራፒ', category: 'fmcg-health', tag: 'Physical Therapy', logo: '/partners/zion-physiotherapy.jpg' },
    { name: 'KT Catering', nameAm: 'ኬቲ ኬተሪንግ', category: 'fmcg-health', tag: 'Food & Events', logo: '/partners/kt-catering.png' },
    { name: 'Escafer Culinary School', nameAm: 'እስካፌር የምግብ ማሰልጠኛ', category: 'fmcg-health', tag: 'Culinary Academy', logo: '/partners/escafer-culinary.png' },
    { name: 'Yonas Mobile', nameAm: 'ዮናስ ሞባይል', category: 'fmcg-health', tag: 'Consumer Electronics', logo: '/partners/yonas-mobile.jpg' },
    { name: 'Helen Bridal & Decor', nameAm: 'ሄለን ብራይዳል እና ዲኮር', category: 'fmcg-health', tag: 'Events & Bridal', logo: '/partners/helen-bridal.svg' },
    { name: 'ETS Ticket Office', nameAm: 'ETS ትኬት ኦፊስ', category: 'fmcg-health', tag: 'Travel & Ticketing', logo: '/partners/ets-ticket.webp' },
    { name: 'Asnake Advert', nameAm: 'አስናቀ አድቨርት', category: 'fmcg-health', tag: 'Advertising Agency', logo: '/partners/asnake-advert.png' },

    // Diaspora
    { name: 'Arif Foods (USA)', nameAm: 'አሪፍ ፉድስ (አሜሪካ)', category: 'diaspora', tag: 'North America FMCG', logo: '/partners/arif-foods.png' },
    { name: 'Walia Teff (USA)', nameAm: 'ዋሊያ ጤፍ (አሜሪካ)', category: 'diaspora', tag: 'Diaspora Staples', logo: '/partners/walia-teff.png' },
    { name: 'Smart Fidel (USA)', nameAm: 'ስማርት ፊደል (አሜሪካ)', category: 'diaspora', tag: 'EdTech & Cultural', logo: '/partners/smart-fidel.png' },
  ];

  const filteredPartners = activePartnerCategory === 'all'
    ? partnersData
    : partnersData.filter(p => p.category === activePartnerCategory);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070A12] text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      {/* Retain Global Portal Header */}
      <NavigationHeader />

      {/* Sub-Header Breadcrumb & Quick Action */}
      <div className="bg-white/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md sticky top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Link href="/" className="hover:text-amber-500 transition-colors">
              {lang === 'am' ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600" />
            <span className="text-amber-600 dark:text-amber-400 font-semibold">
              {lang === 'am' ? 'የድርጅቱ መገለጫ እና ማርኬቲንግ' : 'Company Profile & Corporate Marketing'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#inquiry"
              className="px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-semibold hover:bg-amber-500 hover:text-slate-950 transition-all text-xs flex items-center gap-1.5"
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
              <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-400 text-xs sm:text-sm font-semibold tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-500 dark:text-amber-400 animate-pulse" />
                <span>
                  {lang === 'am'
                    ? 'ጥንቅቅ መልቲ ሚዲያ እና ኤቨንት ኦርጋናይዘር (ዶንኪ ቲዩብ)'
                    : 'Donkey Tube Media Group • Tinqiq Multi-Media & Event Organizer'}
                </span>
              </div>

              {/* Grand Main Headline */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.15] font-display">
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
              <p className="text-slate-600 dark:text-slate-300/90 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-3xl mx-auto font-sans">
                {lang === 'am'
                  ? 'በኮሜዲያን እሸቱ መለሰ የተመሰረተ፣ ባለፉት 8 ዓመታት በማህበራዊ፣ ባህላዊ እና ኢኮኖሚያዊ ጉዳዮች ላይ ግንዛቤን በመፍጠር፣ ከ8 ሚሊዮን በላይ ንቁ ተከታዮችንና ከ677 ሚሊዮን በላይ እይታዎችን ያስመዘገበ ታዋቂ ተቋም።'
                  : 'Founded by Comedian Eshetu Melese, championing community upliftment, ethical storytelling, and social transformation across 8+ years with over 8M+ active community members and 677M+ lifetime views.'}
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
                  <TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                  <span>{lang === 'am' ? 'የተደራሽነት አሃዞችን ይመልከቱ' : 'View Audience Metrics'}</span>
                </a>
              </div>
            </div>

            {/* High-Impact Stat Grid Bar */}
            <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {[
                { number: '8M+', labelEn: 'Active Community', labelAm: 'ንቁ ማህበረሰብ', highlight: 'from-amber-500 via-amber-400 to-amber-600' },
                { number: '677M+', labelEn: 'Lifetime Video Views', labelAm: 'አጠቃላይ እይታዎች', highlight: 'from-amber-500 to-yellow-600' },
                { number: '3.3M+', labelEn: 'YouTube Subscribers', labelAm: 'የዩቲዩብ ቤተሰቦች', highlight: 'from-rose-500 to-red-600' },
                { number: '9.8M', labelEn: 'Single Video Record', labelAm: 'የአንድ ቪዲዮ ከፍተኛ እይታ', highlight: 'from-purple-500 to-indigo-500' },
                { number: '12+', labelEn: 'Permanent Media Team', labelAm: 'ቋሚ ባለሙያዎች', highlight: 'from-blue-500 to-cyan-500' },
                { number: '1.406B+', labelEn: 'ETB Mobilized for CSR', labelAm: 'ለበጎ አድራጎት የተሰበሰበ', highlight: 'from-emerald-500 to-teal-500' },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 dark:hover:border-amber-500/50 shadow-sm dark:shadow-md transition-all text-center group hover:-translate-y-1"
                >
                  <div className={`text-2xl sm:text-3xl font-black bg-gradient-to-r ${stat.highlight} bg-clip-text text-transparent group-hover:scale-105 transition-transform font-mono`}>
                    {stat.number}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium">
                    {lang === 'am' ? stat.labelAm : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 1. COMPANY PROFILE, VISION, MISSION & FOUNDATIONAL PILLARS   */}
        {/* ============================================================ */}
        <section id="profile" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32 space-y-16">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="text-amber-600 dark:text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 1' : 'Section 1'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የድርጅቱ መገለጫ እና ዋና ዓላማ' : 'Company Profile & Core Purpose'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ዶንኪ ቲዩብ (ጥንቅቅ መልቲ ሚዲያ እና ኤቨንት ኦርጋናይዘር) የተመሰረተበትን ራዕይ፣ ተልዕኮ፣ 3ቱ የማይነቃነቁ መሰረታዊ ምሰሶዎች እና 6ቱ ተቋማዊ እሴቶች'
                : 'The foundational vision, mission, 3 unshakeable pillars, core institutional values, and strategic goals driving Donkey Tube Media Group'}
            </p>
          </div>

          {/* Vision & Mission Highlight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-950 border border-slate-200 dark:border-amber-500/20 hover:border-amber-500/50 transition-all shadow-lg dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
              <div className="flex items-center gap-3.5 mb-5 relative z-10">
                <div className="p-3 rounded-2xl bg-amber-500/15 text-amber-500 border border-amber-500/30">
                  <Sparkle className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-amber-600 dark:text-amber-400 block">
                    {lang === 'am' ? 'ተቋማዊ ራዕይ' : 'Institutional Vision'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {lang === 'am' ? 'ራዕይ (Vision Statement)' : 'Our Vision'}
                  </h3>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed relative z-10 italic">
                {lang === 'am'
                  ? '“በአሉታዊና በጊዜያዊ አጀንዳዎች (Clickbait) የሚመራ ሳይሆን በተጨባጭ ማህበራዊ ለውጥ (Impact) ላይ የተመሰረተ፣ የህዝብ ባለቤትነት የተረጋገጠለት፣ ኢትዮጵያዊ እሴትንና መንፈሳዊ ስብዕናን ጠብቆ ለትውልድ ብርሃን የሚሆን ቀዳሚ አዎንታዊ ሚዲያ መሆን።”'
                  : '“To be a premier positive media beacon for generations—anchored in tangible social impact rather than fleeting clickbait, genuinely owned by the public, preserving Ethiopian values, moral dignity, and spiritual conscience.”'}
              </p>
            </div>

            {/* Mission Card */}
            <div className="p-8 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900/90 dark:via-slate-900/70 dark:to-slate-950 border border-slate-200 dark:border-blue-500/20 hover:border-blue-500/50 transition-all shadow-lg dark:shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
              <div className="flex items-center gap-3.5 mb-5 relative z-10">
                <div className="p-3 rounded-2xl bg-blue-500/15 text-blue-500 border border-blue-500/30">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[11px] font-bold tracking-widest uppercase text-blue-600 dark:text-blue-400 block">
                    {lang === 'am' ? 'ተቋማዊ ተልዕኮ' : 'Institutional Mission'}
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    {lang === 'am' ? 'ተልዕኮ (Mission Statement)' : 'Our Mission'}
                  </h3>
                </div>
              </div>
              <p className="text-slate-700 dark:text-slate-200 text-sm sm:text-base leading-relaxed relative z-10 italic">
                {lang === 'am'
                  ? '“ከብሔር እና ከፖለቲካ ወገንተኝነት ነፃ በመሆን፤ ማህበረሰብን የሚያንጹ፣ ተስፋንና ፈጣሪን የሚያስከብሩ ይዘቶችን በጥራት ማዘጋጀት፤ ድምፅ ላጡ የታማሚ ልጆች እናቶች ድምፅ በመሆን ፈጣን ሰብአዊና ልማታዊ ድጋፍ ማስተባበር፤ እንዲሁም ወጣቱን ከሱስና ከቁስ-አምላኪነት ባህል ጠብቆ በስነ-ምግባር የታነጸ ሀገር ወዳድ ዜጋ እንዲሆን መስራት።”'
                  : '“To craft high-caliber productions free from ethnic or political partisanship that uplift society, inspire hope, and honor the Creator; to be an unwavering voice for distressed mothers of critically ill children by coordinating rapid humanitarian and developmental relief; and to safeguard youth from addiction and unchecked materialism, nurturing ethical and patriotic citizens.”'}
              </p>
            </div>
          </div>

          {/* 3 Unshakeable Foundational Pillars */}
          <div className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                <Landmark className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'መሰረታዊ ምሰሶዎች' : 'Core Foundations'}</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'am' ? '3ቱ የማይነቃነቁ መሰረታዊ ምሰሶዎች' : 'The 3 Unshakeable Foundational Pillars'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                {lang === 'am'
                  ? 'ዶንኪ ቲዩብ (ጥንቅቅ መልቲ ሚዲያ) ስራውን በጽናት የሚመራባቸው 3 የማይናወጡ የሞራል እና የእምነት ምሰሶዎች'
                  : 'The immutable ethical and cultural bedrocks governing every Donkey Tube production and public engagement'}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Pillar 1: Ethiopian Identity & Unity */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 transition-all shadow-md space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Flag className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest block">
                      {lang === 'am' ? 'ምሰሶ 1' : 'Pillar 01'}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {lang === 'am' ? '1. ኢትዮጵያዊነት' : '1. Ethiopian Identity & Unity'}
                    </h4>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ከብሔርተኝነት የጸዳ አንድነት:' : 'Non-Partisan Unity:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'የትኛውም ብሔር ተለይቶ ጥቃት አይፈጸምበትም፤ የሁሉም ብሔር ድምጽ የሚሰማበት የጋራ ቤት ሆኖ ያገለግላል።'
                          : 'A welcoming shared home where no ethnic identity is attacked or alienated, giving voice to every community.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'በመረጃ ቋት ውስጥ ብሔርን አለመመዝገብ:' : 'Zero Ethnic Tracking:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'በተቋሙ ዳታቤዝ ውስጥ "ብሔር" የሚል ሰንጠረዥ የለም፤ ማንም ሰው መስፈርቱን እስካሟላ ድረስ በእኩልነት ይስተናገዳል።'
                          : 'Participant databases have zero ethnic metrics; benevolence and participation are awarded strictly on merit and need.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ሀገራዊ አንድነትና እሴት:' : 'Nationwide Harmony:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'እንደ ጎሬ፣ ጅማ እና ሐዋሳ በመዘዋወር ኢትዮጵያዊነትን ማጠናከር፤ እንዲሁም የጉዞ አድዋ የሰላም መልዕክትን ማስተጋባት።'
                          : 'Touring diverse regional towns including Gore, Jimma, Hawassa, and broadcasting Adwa peace initiatives.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ባህልንና ትውልድን መጠበቅ:' : 'Preserving Culture:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'የባህል መሸርሸርንና ቁስ-አምላኪነትን በገንቢ ሂስ መመከት፣ የጥንት ሥነ-ምግባራዊ ልዕልናን ማጉላት።'
                          : 'Actively countering social media cultural erosion, vanity, and shallow materialism through constructive satire.'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pillar 2: Universal Humanity & Compassion */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 transition-all shadow-md space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <HandHeart className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest block">
                      {lang === 'am' ? 'ምሰሶ 2' : 'Pillar 02'}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {lang === 'am' ? '2. ሰብአዊነት' : '2. Universal Humanity & Compassion'}
                    </h4>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ድንበር ተሻጋሪ ቅድሚያ:' : 'Borderless Dignity:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'ከድንበር፣ ከዘርና ከሃይማኖት በላይ ለሰው ልጅ ቅድሚያ መስጠት፤ በችግር ውስጥ ለነበሩ ሶሪያውያንም ጭምር ድጋፍ ተደርጓል።'
                          : 'Extending compassion across borders; direct humanitarian relief rendered to vulnerable Syrian refugees alongside Ethiopians.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ለችግረኞችና እናቶች መድረስ:' : 'Mothers & Sick Children:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'በየሳምንቱ ታማሚ ልጆች ወዳሏቸው እናቶች ቤት በአካል በመሄድ ለ400+ እናቶች የገንዘብና የህክምና ድጋፍ ማድረስ።'
                          : 'Weekly home visits delivering continuous medical and livelihood sustenance to over 400+ mothers of critically ill children.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'የቦረና ረሃብ እና የጦርነት ተጎጂዎች:' : 'Disaster & War Relief:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'በቦረና በአንድ ምሽት 8M+ ብር ማሰባሰብ፤ እንዲሁም ለ1,000 የጦርነት ተጎጂ አባወራዎች ከቀይ መስቀል ጋር ቀጥታ አካውንት መክፈት።'
                          : 'Mobilized 8M+ ETB overnight for Borena famine, and opened verified bank accounts for 1,000 war-displaced families via Red Cross.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'የ"ይድናል" የወጣቶች ማገገሚያ:' : '“Yidnal” Youth Recovery:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'ወጣቶችን ከሱስና ከመንገድ ማዳን፤ በሱስ ተጎድተው የወደቁትን ወደ ማገገሚያ (Rehab) በማስገባት ህይወታቸውን መለወጥ።'
                          : 'Rescuing young individuals battling severe addiction, funding rehabilitation enrollment to restore productive lives.'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Pillar 3: Spirituality & Faith */}
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-purple-500/40 transition-all shadow-md space-y-5 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-[11px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest block">
                      {lang === 'am' ? 'ምሰሶ 3' : 'Pillar 03'}
                    </span>
                    <h4 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                      {lang === 'am' ? '3. መንፈሳዊነት እና ፈሪሃ-እግዚአብሔር' : '3. Spirituality & Faith'}
                    </h4>
                  </div>
                  <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'የገዳማትና ቅርሶች ህልውና:' : 'Monastery Preservation:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'ደብረ ሊባኖስ፣ ጥቁሯ ማርያም፣ ተድባማርያም፣ ዋልድባ እና በጀርመን፣ እንግሊዝ፣ ኳታር፣ አሜሪካ ላሉ አድባራት ድጋፍ ማሰባሰብ።'
                          : 'Major fundraising and documentaries for historic monasteries (Debre Libanos, Waldba) and diaspora churches globally.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ሁሉን አቀፍ የእምነት አንድነት:' : 'Interfaith Benevolence:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'የኡስታዝ አቡበከር፣ መስዑድ እና ዳሩ ሰላም መስጊድ ድጋፎች፤ እንዲሁም የፓስተር ጻድቁና ረ/ፕ ዘበነ ለማ የጋራ መድረክ።'
                          : 'Promoting mutual respect: featuring Islamic charitable drives (Darul Salam Mosque) alongside prominent spiritual leaders.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'መንፈሳዊ እውቀት ማሰራጨት:' : 'Spiritual Illumination:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'በ"ዶንኪ በጎ" ቻናል በኩል ሊቃውንትን በማቅረብ ስለ እምነት ጥያቄዎች እና ፍትሐ ነገሥት ትምህርት መስጠት።'
                          : 'Dedicated “Donkey Bego” channel hosting scholars to explore Fetha Negest, moral doctrine, and spiritual depth.'}
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        <strong className="text-slate-900 dark:text-white">
                          {lang === 'am' ? 'በረከትን መፈለግ:' : 'Divine Blessing:'}{' '}
                        </strong>
                        {lang === 'am'
                          ? 'የሚገኘው ዋጋ ምድራዊ ሳይሆን ሰማያዊ በረከት እንደሆነ ማመንና ክብሩን ለፈጣሪ መስጠት።'
                          : 'Steadfast conviction that the ultimate reward is heavenly blessing, consecrating all community success to the Almighty.'}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Core Institutional Values */}
          <div className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase font-extrabold text-amber-600 dark:text-amber-500 tracking-wider">
                  {lang === 'am' ? 'ተቋማዊ እሴቶች' : 'Institutional Values'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {lang === 'am' ? '6ቱ ተቋማዊ እሴቶች (Core Values)' : 'The 6 Institutional Core Values'}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {lang === 'am' ? 'በሁሉም ስራዎቻችን የሚንጸባረቁ መርሆች' : 'Guiding principles embedded across every production'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                {
                  num: '01',
                  icon: Flag,
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10 border-amber-500/20',
                  titleAm: 'ኢትዮጵያዊነት (Ethiopian Identity)',
                  titleEn: 'Ethiopian Identity & Unity',
                  descAm: 'የሁሉንም ብሄር፣ ሃይማኖትና ስፍራ ሰዎች አዎንታዊ ድምጽ በእኩልነት ማስተናገድ፤ የጋራ ታሪክንና የሞራል ልዕልናን ማጉላት።',
                  descEn: 'Equitably championing every community, celebrating ancient heritage, and fostering undivided national pride.',
                },
                {
                  num: '02',
                  icon: HandHeart,
                  color: 'text-rose-500',
                  bg: 'bg-rose-500/10 border-rose-500/20',
                  titleAm: 'ሰብአዊነት (Universal Humanity)',
                  titleEn: 'Universal Humanity',
                  descAm: 'ከድንበር፣ ከዘርና ከቋንቋ በላይ ለሰው ልጅ ክብር ቅድሚያ መስጠት፤ ለተጎዱና ለህሙማን አፋጣኝ የሰብአዊ እርዳታ ማድረስ።',
                  descEn: 'Prioritizing unconditional human dignity beyond geographic or cultural borders with immediate emergency relief.',
                },
                {
                  num: '03',
                  icon: ShieldCheck,
                  color: 'text-purple-500',
                  bg: 'bg-purple-500/10 border-purple-500/20',
                  titleAm: 'መንፈሳዊነት እና ፈሪሃ-እግዚአብሔር',
                  titleEn: 'Spirituality & Integrity',
                  descAm: 'የሚሰራው መልካም ስራ ሁሉ ባለቤት እግዚአብሔር እንደሆነ ማመን፣ ክብሩን ለፈጣሪ መስጠትና በታማኝነት መመራት።',
                  descEn: 'Anchoring every benevolent initiative in God-fearing integrity, acknowledging the Creator as the author of all goodness.',
                },
                {
                  num: '04',
                  icon: Target,
                  color: 'text-emerald-500',
                  bg: 'bg-emerald-500/10 border-emerald-500/20',
                  titleAm: 'ተጨባጭ ለውጥ (Impact over Influence)',
                  titleEn: 'Impact over Influence',
                  descAm: 'በቪው እና በተከታይ ብዛት ብቻ ሳይሆን መሬት ላይ በሚታይ እውነተኛ ለውጥ (ት/ቤት፣ መንገድ፣ ውሃ፣ የታማሚዎች ህክምና) ላይ ማተኮር።',
                  descEn: 'Measuring triumph not by vanity impressions, but by verifiable ground results—roads, clinics, water wells, and schools.',
                },
                {
                  num: '05',
                  icon: Scale,
                  color: 'text-blue-500',
                  bg: 'bg-blue-500/10 border-blue-500/20',
                  titleAm: 'ግልጽነትና ተጠያቂነት (Transparency)',
                  titleEn: 'Transparency & Accountability',
                  descAm: 'የበጎ አድራጎት ገንዘብን በህጋዊ ሰነድና በባንክ ስቴትመንት ማረጋገጥ፤ የሚዲያ አባልነት (Membership) ገቢን ከእርዳታ ፈንድ መለየት።',
                  descEn: 'Audited statements, open bank verification, and strict operational division between membership dues and charity funds.',
                },
                {
                  num: '06',
                  icon: Award,
                  color: 'text-amber-500',
                  bg: 'bg-amber-500/10 border-amber-500/20',
                  titleAm: 'መስዋዕትነት እና ሙያዊ ጥራት',
                  titleEn: 'Sacrifice & Professionalism',
                  descAm: 'ሙያው የሚጠይቀውን የጊዜ እና የጉልበት መስዋዕትነት በመክፈል ዓለምአቀፍ ደረጃውን የጠበቀ የጥበብ ስራ ማበርከት።',
                  descEn: 'Relentless work ethic, cinematic perfectionism, and deep personal sacrifice to deliver gold-standard media.',
                },
              ].map((val, idx) => {
                const IconComponent = val.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800/80 hover:border-amber-500/40 transition-all space-y-3 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className={`p-2.5 rounded-xl border ${val.bg} ${val.color}`}>
                        <IconComponent className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-black text-slate-400 dark:text-slate-500">
                        {val.num}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
                      {lang === 'am' ? val.titleAm : val.titleEn}
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">
                      {lang === 'am' ? val.descAm : val.descEn}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 6 Strategic Goals */}
          <div className="space-y-6 pt-4">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs uppercase font-extrabold text-blue-600 dark:text-blue-400 tracking-wider">
                {lang === 'am' ? 'ስትራቴጂካዊ ፍኖተ-ካርታ' : 'Strategic Roadmap'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {lang === 'am' ? '4. ስትራቴጂካዊ ግቦች (Strategic Goals)' : 'Our 6 Strategic Goals'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                {lang === 'am'
                  ? 'ተቋሙ ወደፊት የሚራመድባቸው እና ማህበረሰቡን ወደ ላቀ ደረጃ የሚያሸጋግሩ ዋና ዋና ስትራቴጂካዊ ግቦች'
                  : 'Milestones engineered to scale creative excellence, philanthropy, and global media competitiveness'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  goal: '01',
                  icon: BookOpen,
                  badgeAm: 'የትውልድ ግንባታ',
                  badgeEn: 'Youth & Content',
                  titleAm: 'ግብ 1፡ የትውልድ ግንባታና አዎንታዊ ሚዲያ (Content Creation)',
                  titleEn: 'Goal 1: Generational Media & Youth Character',
                  descAm: 'በ"ድንቅ ልጆች"፣ "ጀግና መፍጠር" እና "አንድ ሰው ህይወት" የህጻናት ተሰጥኦን ማውጣት፤ በ"ኖርማል አይደለም" ማህበራዊ ሂስ ጎጂ ልማዶችን መዋጋት።',
                  descEn: 'Unleashing child genius via “Dink Lijocho”, inspiring role models via “Jegna Mefter”, and eliminating toxic social vices via “Normal Aydelem”.',
                },
                {
                  goal: '02',
                  icon: HandHeart,
                  badgeAm: 'ማህበረሰብ ልማት',
                  badgeEn: 'Development',
                  titleAm: 'ግብ 2፡ ማህበረሰብ አቀፍ የልማትና የበጎ አድራጎት እንቅስቃሴ',
                  titleEn: 'Goal 2: Community Development & Infrastructure',
                  descAm: 'በየሳምንቱ ታማሚ ልጆች ላሏቸው በመቶዎች ለሚቆጠሩ እናቶች የህክምና ድጋፍ ማሰባሰብ፤ እንዲሁም የገጠር መንገድ፣ የንጹህ ውሃ እና የመንደር ግንባታ ማከናወን።',
                  descEn: 'Weekly direct subsidies for mothers of critically ill children alongside potable clean water, rural access roads, and model village creation.',
                },
                {
                  goal: '03',
                  icon: Landmark,
                  badgeAm: 'ቅርስ ጥበቃ',
                  badgeEn: 'Heritage',
                  titleAm: 'ግብ 3፡ ቅርሶችንና ታሪካዊ ቦታዎችን መጠበቅ (Heritage Preservation)',
                  titleEn: 'Goal 3: Cultural & Ancient Monastery Heritage',
                  descAm: 'በሀገር ውስጥም ሆነ በውጭ ሀገራት የሚገኙ ጥንታዊ አድባራትን፣ ገዳማትንና ቅርሶችን በዶክመንተሪ ማስተዋወቅና በገንዘብ ማሰባሰብ ህልውናቸውን መደገፍ።',
                  descEn: 'Producing cinematic documentaries and global fundraising appeals to restore, safeguard, and sustain ancient Ethiopian shrines.',
                },
                {
                  goal: '04',
                  icon: ShieldCheck,
                  badgeAm: 'ተቋማዊ ነፃነት',
                  badgeEn: 'Independence',
                  titleAm: 'ግብ 4፡ ተቋማዊና ፋይናንሳዊ ነፃነትን ማረጋገጥ (Financial Independence)',
                  titleEn: 'Goal 4: Institutional & Financial Independence',
                  descAm: 'ሚዲያው ለትርፍ ብቻ ከሚሮጡ ጎጂ ስፖንሰሮች (አልኮል) እና ከአልጎሪዝም ጥገኝነት ነፃ ሆኖ በህዝብ አባልነት (Membership) አስተማማኝ ህልውናን መገንባት።',
                  descEn: 'Severing reliance on algorithm volatility and harmful advertisers (alcohol) by anchoring sustainability to our verified public Membership model.',
                },
                {
                  goal: '05',
                  icon: Globe2,
                  badgeAm: 'ዓለምአቀፍ ብራንድ',
                  badgeEn: 'Global Brand',
                  titleAm: 'ግብ 5፡ የቲክቶክ እና የኢንስታግራም ዓለም አቀፍ ማስታወቂያዎች',
                  titleEn: 'Goal 5: Worldwide Brand Campaign Placements',
                  descAm: 'በአለም አቀፍ ደረጃ ላሉ ድርጅቶች የቲክቶክ እና የኢንስታግራም ማስታወቂያዎችን በከፍተኛ ፈጠራ በመስራት ዓለም አቀፍ ተቀባይነት ያለው ብራንድ መፍጠር።',
                  descEn: 'Executing viral cross-platform campaigns on TikTok and Instagram tailored for multinational enterprises and diaspora corporate leaders.',
                },
                {
                  goal: '06',
                  icon: Bot,
                  badgeAm: 'ኤአይ ፈጠራ',
                  badgeEn: 'AI Innovation',
                  titleAm: 'ግብ 6፡ ኤአይን ተጠቅሞ ዓለም አቀፍ ይዘትና ማርኬቲንግ መፍጠር',
                  titleEn: 'Goal 6: AI-Driven Global Content & Market Expansion',
                  descAm: 'ዘመናዊ የArtificial Intelligence ቴክኖሎጂዎችን በመጠቀም ዓለም አቀፍ ደረጃውን የጠበቀ ይዘት ማፍራትና ሰፊ የዓለም አቀፍ ማርኬቲንግ እድሎችን ማስፋት።',
                  descEn: 'Harnessing generative AI tools to innovate global storytelling formats, unlocking unprecedented worldwide commercial and creative opportunities.',
                },
              ].map((item, idx) => {
                const GoalIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
                          <GoalIcon className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-700 dark:text-slate-300">
                          {lang === 'am' ? item.badgeAm : item.badgeEn}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                        {lang === 'am' ? item.titleAm : item.titleEn}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">
                        {lang === 'am' ? item.descAm : item.descEn}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Workforce & Organizational Infrastructure Card */}
          <div className="p-8 rounded-3xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col lg:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-3xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Users className="w-10 h-10 text-amber-500" />
            </div>
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 text-xs font-bold uppercase tracking-wider">
                  {lang === 'am' ? 'የሰው ኃይል እና ድርጅታዊ አቅም' : 'Corporate Infrastructure'}
                </span>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                  {lang === 'am' ? '12+ ቋሚ ባለሙያዎች' : '12+ Permanent Staff & Film Crew'}
                </span>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">
                {lang === 'am'
                  ? 'ሙሉ የፊልም እና ቪዲዮ ፕሮዳክሽን ባለቤትነት (In-House Production Power)'
                  : 'Complete In-House Cinema Cinematography & Post-Production Suites'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {lang === 'am'
                  ? 'ዶንኪ ቲዩብ ከተራ የዩቲዩብ ቻናሎች በተለየ መልኩ ሰፊ የስራ ዕድል የፈጠረ ተቋም ሲሆን፣ በአሁኑ ሰዓት ከ12 በላይ ቋሚ ሰራተኞችን ይዞ የሚንቀሳቀስ በሚገባ የተዋቀረ የሚዲያ ቤት ነው። ተቋሙ የራሱ የሆኑ ዘመናዊ የሲኒማ ካሜራዎች፣ የድምፅና የመብራት እቃዎች ባለቤት በመሆኑ ከኪራይ መዘግየት የጸዳ ሲሆን፣ በAdobe Premiere Pro እና DaVinci Resolve ዓለምአቀፍ ደረጃቸውን የጠበቁ የቀለም ማስተካከያ (Color Grading) እና VFX ስራዎችን ያከናውናል።'
                  : 'Unlike informal channels, Donkey Tube is a fully structured media powerhouse employing over 12 full-time permanent professionals. Owning 100% of its broadcast cinema camera rigs, wireless multi-point sound, and lighting grids eliminates equipment rental delays entirely, backed by Hollywood-grade DaVinci Resolve and Adobe Premiere post-production pipelines.'}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. DIGITAL MARKET DOMINANCE & AUDIENCE REACH                 */}
        {/* ============================================================ */}
        <section id="reach" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-amber-600 dark:text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 2' : 'Section 2'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የዲጂታል ገበያ የበላይነት እና የተደራሽነት አቅም' : 'Digital Market Dominance & Aggregate Reach'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'በዋና ዋና ዲጂታል መድረኮች ላይ ከ8 ሚሊዮን በላይ ንቁ ተከታዮችን ያቀፈ ግዙፍ ማህበረሰብ'
                : 'Over 8 Million active cross-platform followers commanding unmatched attention in Ethiopia and the Global Diaspora'}
            </p>
          </div>

          {/* Social Platform Breakout Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* YouTube Card */}
            <div className="p-7 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-red-950/30 dark:via-slate-900/90 dark:to-slate-900/60 border border-slate-200 dark:border-red-500/20 hover:border-red-500/50 transition-all shadow-md dark:shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-red-600/10 dark:bg-red-600/20 text-red-600 dark:text-red-500 border border-red-500/20 dark:border-red-500/30">
                  <Video className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 text-xs font-bold">
                  YouTube
                </span>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white">3.3M+</div>
              <div className="text-sm font-semibold text-red-600 dark:text-red-400 mt-1">
                {lang === 'am' ? 'ሰብስክራይበርስ (Subscribers)' : 'Subscribers'}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የቪዲዮ ብዛት:' : 'Total Videos:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">2,100+ High Quality</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'አጠቃላይ እይታዎች:' : 'Lifetime Views:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">677M+ Views</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የአንድ ቪዲዮ ከፍተኛ እይታ:' : 'Peak Single Video:'}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">9.8 Million Views</span>
                </div>
              </div>
            </div>

            {/* TikTok Card */}
            <div className="p-7 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-pink-950/30 dark:via-slate-900/90 dark:to-slate-900/60 border border-slate-200 dark:border-pink-500/20 hover:border-pink-500/50 transition-all shadow-md dark:shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-pink-600/10 dark:bg-pink-600/20 text-pink-600 dark:text-pink-500 border border-pink-500/20 dark:border-pink-500/30">
                  <Sparkles className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20 text-xs font-bold">
                  TikTok
                </span>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white">2.9M+</div>
              <div className="text-sm font-semibold text-pink-600 dark:text-pink-400 mt-1">
                {lang === 'am' ? 'ተከታዮች (Followers)' : 'Followers'}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የተሳትፎ ምጣኔ:' : 'Viral Velocity:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">Ultra-High Engagement</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የታዳሚ ስብጥር:' : 'Audience:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">Youth & Gen Z Dynamic</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የተቀናጀ ዘመቻ:' : 'Campaign Strategy:'}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">Cross-Post Viral Clips</span>
                </div>
              </div>
            </div>

            {/* Facebook Card */}
            <div className="p-7 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-blue-950/30 dark:via-slate-900/90 dark:to-slate-900/60 border border-slate-200 dark:border-blue-500/20 hover:border-blue-500/50 transition-all shadow-md dark:shadow-xl relative overflow-hidden group">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-600/10 dark:bg-blue-600/20 text-blue-600 dark:text-blue-500 border border-blue-500/20 dark:border-blue-500/30">
                  <Globe2 className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-xs font-bold">
                  Facebook
                </span>
              </div>
              <div className="text-4xl font-black text-slate-900 dark:text-white">1.7M+</div>
              <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-1">
                {lang === 'am' ? 'ተከታዮች (Followers)' : 'Followers'}
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የዳያስፖራ ሽፋን:' : 'Diaspora Coverage:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">North America & Europe</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የሀገር ውስጥ ተደራሽነት:' : 'Domestic Depth:'}</span>
                  <span className="font-bold text-slate-900 dark:text-white">35+ Age Demographics</span>
                </div>
                <div className="flex justify-between">
                  <span>{lang === 'am' ? 'የምርት ስም ትስስር:' : 'Brand Recall:'}</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">Trusted Community Hub</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Dominance & Formats Banner */}
          <div className="p-7 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-900/80 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-md grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Tv className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">16+</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {lang === 'am' ? 'የተለያዩ ተወዳጅ የሾው ዓይነቶች' : 'Distinct Popular Show Formats'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <Film className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-900 dark:text-white">11 Full Hours</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {lang === 'am' ? 'ሙሉ የአንድ ሰዓት የስታንዳፕ ኮሜዲ ስራዎች' : 'Full 1-Hour Standup Specials'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <div className="text-2xl font-black text-amber-600 dark:text-amber-400">9.8M Views</div>
                <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  {lang === 'am' ? 'የአንድ ነጠላ ቪዲዮ ከፍተኛ እይታ' : 'Highest Single Video Milestone'}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* 3. KEY LEADERSHIP PROFILE: COMEDIAN ESHETU MELESE           */}
        {/* ============================================================ */}
        <section id="leadership" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <div className="text-amber-500 text-xs font-bold tracking-widest uppercase">
              {lang === 'am' ? 'ክፍል 3' : 'Section 3'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የድርጅቱ መስራች እና ዋና ስራ አስፈፃሚ ብቃት' : 'Key Leadership Profile & Accreditations'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ኮሜዲያን እሸቱ መለሰ — የተከበረ የኪነ-ጥበብ ባለሙያ፣ ስራ ፈጣሪ እና ታዋቂ በጎ አድራጊ'
                : 'Comedian Eshetu Melese — Founder, CEO, Theatrical Arts Scholar & Philanthropist'}
            </p>
          </div>

          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-gradient-to-br dark:from-slate-900/95 dark:via-slate-900/70 dark:to-slate-950 border border-slate-200 dark:border-slate-800 shadow-xl dark:shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Leader Photo with Luxury Border Glow */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative group">
                  <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />
                  <div className="relative w-64 sm:w-80 h-[380px] sm:h-[450px] rounded-2xl overflow-hidden border-2 border-amber-500/40 bg-slate-950 shadow-2xl">
                    <img
                      src="/images/eshetu-award.jpg"
                      alt="Comedian Eshetu Melese"
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
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
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-bold uppercase tracking-wider">
                    {lang === 'am' ? 'የትምህርት እና ሙያ ዝግጅት' : 'Education & Credentials'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {lang === 'am' ? 'ኮሜዲያን እሸቱ መለሰ' : 'Comedian Eshetu Melese'}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed mt-3">
                    {lang === 'am'
                      ? 'ከአዲስ አበባ ዩኒቨርሲቲ በቲያትሪካል አርት (Theatrical Arts) የመጀመሪያ ዲግሪ ያለው ሲሆን፣ በአሁኑ ወቅት እውቅ ስታንዳፕ ኮሜዲያን፣ የቴሌቪዥን ሆስት፣ አነቃቂ ንግግር አድራጊ፣ ስራ ፈጣሪ እና ታዋቂ በጎ አድራጊ ነው ።'
                      : 'Holds a Bachelor of Arts Degree in Theatrical Arts from Addis Ababa University. Renowned nationally and globally as a master stand-up comedian, acclaimed television host, transformational keynote speaker, serial media entrepreneur, and leading philanthropist.'}
                  </p>
                </div>

                {/* Accreditations & Awards Grid */}
                <div className="space-y-3.5 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">
                    {lang === 'am' ? 'እውቅና እና ዓለምአቀፍ ሽልማቶች' : 'Prestigious Recognitions & Awards'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {lang === 'am' ? 'በባህልና ቱሪዝም ሚኒስቴር' : 'Ministry of Culture & Tourism'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lang === 'am' ? 'ከፍተኛ ሀገራዊ እውቅና እና የምስክር ወረቀት' : 'Highest National Honorary Recognition'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {lang === 'am' ? 'Seed Award (ዩናይትድ ስቴትስ)' : 'The Seed Award (USA)'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lang === 'am' ? 'በአሜሪካን አገር ለወጣቶች በጎ ተጽእኖ ፈጣሪ' : 'Youth Leadership & Impact Laureate'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {lang === 'am' ? 'ቢቂላ አዋርድ (ካናዳ ቶሮንቶ 2023)' : 'Bikila Award (Toronto, Canada)'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lang === 'am' ? 'በማህበረሰብ አገልግሎት የላቀ ተሸላሚ' : 'Excellence in Community Service'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
                      <Award className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          {lang === 'am' ? '30+ ተጨማሪ ሰርተፊኬቶች' : '30+ Honorary Global Diplomas'}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          {lang === 'am' ? 'ከአሜሪካ፣ አውሮፓ እና ሀገር ውስጥ ተቋማት' : 'Conferred by diaspora and global summits'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 flex items-center gap-3">
                  <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
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
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የኮርፖሬት ደንበኞች አጋርነት እና የተቀናጀ ተደራሽነት' : 'Corporate Partnerships & Multi-Million Views Penetration'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ከሀገር ውስጥ ግዙፍ የመንግስት እና የግል ተቋማት ጀምሮ እስከ ዓለምአቀፍ ታዋቂ ብራንዶች ድረስ ሰፊ እና ስኬታማ የማስታወቂያ አጋርነቶች'
                : 'Trusted by flagship governmental institutions, premier private conglomerates, and global international diaspora brands'}
            </p>
          </div>

          {/* Value Proposition Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2.5 text-amber-600 dark:text-amber-400 font-bold text-base">
                <CheckCircle2 className="w-5 h-5 text-amber-500" />
                <span>{lang === 'am' ? 'የሚሊዮኖች እይታ ዋስትና (1M – 7.8M+ እይታዎች)' : 'Guaranteed Multi-Million Views Penetration'}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
                {lang === 'am'
                  ? 'በዶንኪ ቲዩብ መድረኮች ላይ የሚለቀቁ የማስታወቂያ ይዘቶች በአማካይ ከ1 ሚሊዮን እስከ 7.8 ሚሊዮን በላይ እይታዎችን (Views) በአንድ ቪዲዮ ብቻ የማስመዝገብ ብቃት አላቸው። ይህም አንድ ብራንድ በአጭር ጊዜ ውስጥ በሀገር ውስጥና በዓለም አቀፍ ደረጃ በከፍተኛ ሁኔታ እንዲታወቅና የገበያ ትስስሩ እንዲያድግ ያደርጋል።'
                  : 'Sponsorship content deployed on Donkey Tube channels consistently yields between 1,000,000 to 7,800,000+ views per single production, providing unmatched rapid brand resonance and top-of-mind consumer recall.'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
              <div className="flex items-center gap-2.5 text-blue-600 dark:text-blue-400 font-bold text-base">
                <Layers className="w-5 h-5 text-blue-500" />
                <span>{lang === 'am' ? 'የተደራረበ የዲጂታል ትስስር አጠቃቀም (Cross-Platform)' : 'Cross-Platform Integrated Blitz'}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">
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
                    : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {lang === 'am' ? cat.labelAm : cat.labelEn}
              </button>
            ))}
          </div>

          {/* Continuous Single-Line Partner Brands Marquee */}
          <div className="relative w-full overflow-hidden py-4 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {/* Left and Right Fade Gradients */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-slate-50 dark:from-[#070A12] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-slate-50 dark:from-[#070A12] to-transparent z-10" />

            <div className="partner-marquee-track flex items-center gap-4 sm:gap-5">
              {[...filteredPartners, ...filteredPartners].map((partner, idx) => (
                <div
                  key={`${partner.name}-${idx}`}
                  className="px-5 py-4 sm:px-6 sm:py-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800/90 hover:border-amber-500/50 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm hover:shadow-lg transition-all flex items-center gap-4 group min-w-[290px] sm:min-w-[340px] shrink-0"
                >
                  <div className="w-18 h-14 sm:w-22 sm:h-16 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200/90 dark:border-slate-800/90 flex items-center justify-center p-2 shadow-xs overflow-hidden group-hover:scale-105 group-hover:border-amber-500/40 transition-all shrink-0">
                    <img
                      src={partner.logo}
                      alt={partner.name}
                      className="max-h-11 sm:max-h-12 max-w-full object-contain filter group-hover:brightness-105 transition-all"
                      loading="lazy"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white truncate group-hover:text-amber-500 transition-colors">
                      {lang === 'am' ? partner.nameAm : partner.name}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {partner.tag}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. SOCIAL IMPACT & CSR: 1.406 BILLION ETB MOBILIZED          */}
        {/* ============================================================ */}
        <section id="csr" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
          <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xl">
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
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
                  <div className="text-xl font-extrabold text-emerald-400">400+ Mothers</div>
                  <div className="text-xs text-slate-300 mt-1">
                    {lang === 'am' ? 'ሳምንታዊ የቤት ለቤት ድጋፍ' : 'Weekly Medical & Living Aid'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
                  <div className="text-xl font-extrabold text-emerald-400">1,000 Families</div>
                  <div className="text-xs text-slate-300 mt-1">
                    {lang === 'am' ? 'የቀይ መስቀል ቀጥታ አካውንት' : 'Red Cross Direct Accounts'}
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80">
                  <div className="text-xl font-extrabold text-emerald-400">100% Audited</div>
                  <div className="text-xs text-slate-300 mt-1">
                    {lang === 'am' ? 'ህጋዊ የባንክ ስቴትመንት' : 'Verified Bank Statements'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 6 Key Verified CSR Campaigns Grid */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                titleAm: 'ለ400+ ታማሚ ልጆች እናቶች ሳምንታዊ ቀጥታ ድጋፍ',
                titleEn: 'Weekly Aid to 400+ Mothers of Sick Children',
                descAm: 'በየሳምንቱ ታማሚ ልጆች ወዳሏቸው እናቶች ቤት በአካል በመሄድ፣ ከ400 በላይ ለሚሆኑ እናቶች ቀጣይነት ያለው የገንዘብና የህክምና ድጋፍ ማድረስ።',
                descEn: 'Regular in-person home visits delivering essential direct financial and hospital medical funding to 400+ mothers.',
                tag: 'Healthcare & Family',
                color: 'text-rose-500 border-rose-500/20 bg-rose-500/10',
              },
              {
                titleAm: 'የቦረና ረሃብ አፋጣኝ ምላሽ (በአንድ ምሽት 8M+ ብር)',
                titleEn: 'Borena Emergency Drought & Famine Relief',
                descAm: 'በቦረና ለተከሰተው ከባድ ረሃብ በአንድ ምሽት ብቻ ከ8 ሚሊዮን ብር በላይ በማሰባሰብ አስቸኳይ የምግብ እህል ለተጎዱ ወገኖች እንዲደርስ ተደርጓል።',
                descEn: 'Rapid mobilization campaign raising over 8 Million ETB in a single evening to deliver emergency food grain.',
                tag: 'Emergency Relief',
                color: 'text-amber-500 border-amber-500/20 bg-amber-500/10',
              },
              {
                titleAm: 'ለሰሜን ጦርነት ተጎጂ 1,000 አባወራዎች ቀጥታ ድጋፍ',
                titleEn: '1,000 War-Affected Households Direct Relief',
                descAm: 'በሰሜኑ ጦርነት ረሃብና መፈናቀል ለገጠማቸው፣ በተለይም ነፍሰጡርና አጥቢ እናቶች ከኢትዮጵያ ቀይ መስቀል ጋር በመተባበር የባንክ አካውንት በማስከፈት ገንዘብ በቀጥታ ገቢ ተደርጓል።',
                descEn: 'Partnered with Ethiopian Red Cross to open direct bank accounts for 1,000 displaced families, nursing mothers, and wounded.',
                tag: 'Conflict Support',
                color: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
              },
              {
                titleAm: 'የ"ይድናል" የወጣቶች ማገገሚያ ፕሮግራም',
                titleEn: '“Yidnal” Youth Street Recovery & Rehabilitation',
                descAm: 'ወጣቶችን ከሱስና ከመንገድ ህይወት ለማዳን ግንዛቤ ከመፍጠር ባለፈ፣ በሱስ ተጎድተው የወደቁትን ወደ ማገገሚያ (Rehab) ማዕከላት በማስገባት ህይወታቸውን መለወጥ።',
                descEn: 'Directly rescuing street youth battling severe addiction, sponsoring full clinical rehab enrollment to rebuild productive lives.',
                tag: 'Youth Rehab',
                color: 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10',
              },
              {
                titleAm: 'የጥንታዊ ገዳማትና ቅርሶች ህልውና መጠበቅ',
                titleEn: 'Monastery & Historic Heritage Restoration',
                descAm: 'ደብረ ሊባኖስ፣ ጥቁሯ ማርያም፣ ተድባማርያም፣ ዋልድባ እንዲሁም በውጭ ሀገራት (ጀርመን፣ እንግሊዝ፣ ኳታር፣ አሜሪካ) ላሉ አድባራት ከፍተኛ ገንዘብ ማሰባሰብና ዶክመንተሪ ሰርቷል።',
                descEn: 'Preserving ancient spiritual heritage (Debre Libanos, Waldba, Tedba Maryam) and global diaspora holy sanctuaries through documentary appeals.',
                tag: 'Heritage & Faith',
                color: 'text-purple-500 border-purple-500/20 bg-purple-500/10',
              },
              {
                titleAm: 'የእምነት ልዩነት የሌለው ሁለንተናዊ በጎነትና ልማት',
                titleEn: 'Interfaith Benevolence & Potable Water Projects',
                descAm: 'የነኢማ ሙዘይን፣ ኡስታዝ አቡበከር እና የዳሩ ሰላም መስጊድ ድጋፍ፤ እንዲሁም በመሰረተ ልማት ለሚቸገሩ የገጠር ማህበረሰቦች የመንገድና የንጹህ መጠጥ ውሃ ፕሮጀክቶች ተሰርተዋል።',
                descEn: 'Borderless compassion supporting Islamic community appeals (Darul Salam Mosque, Ustaz Abubeker) alongside clean water well drilling and rural roads.',
                tag: 'Interfaith & Water',
                color: 'text-teal-500 border-teal-500/20 bg-teal-500/10',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3 shadow-xs"
              >
                <div className="space-y-2">
                  <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider inline-block ${item.color}`}>
                    {item.tag}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                    {lang === 'am' ? item.titleAm : item.titleEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300/90 leading-relaxed">
                    {lang === 'am' ? item.descAm : item.descEn}
                  </p>
                </div>
              </div>
            ))}
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
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {lang === 'am' ? 'የፈጠራ፣ የስክሪፕት እና የፕሮዳክሽን ቴክኒካዊ ብቃት' : 'Technical & Creative Production Excellence'}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base">
              {lang === 'am'
                ? 'ከመጀመሪያው ሃሳብ መነጨት (Concept) እስከ መጨረሻው የቪዲዮ እትም (Final Output) ድረስ ያለው ሙሉ የፊልም እና ቪዲዮ ፕሮዳክሽን ሰንሰለት'
                : 'End-to-end proprietary cinematography, scriptwriting, and Hollywood-grade post-production pipelines'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 6.1: Strategic Scriptwriting */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-none transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'am' ? '6.1. ስልታዊ እና ፈጠራ የተሞላበት የስክሪፕት ስራ' : 'Strategic Scriptwriting & Storytelling'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'የስክሪፕት ደራሲያኖቻችን መልዕክቶችን ከተመልካች ስነ-ልቦና ጋር በማጣጣም፣ አሰልቺ መረጃዎችን እንኳ ሳቢ በሆነ የStorytelling አቀራረብ የመቀየር ልዩ ክህሎት አላቸው።'
                      : 'Master copywriters blend audience psychology with irresistible narrative storytelling, transforming dense information into engaging, shareable stories.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'እያንዳንዱ ይዘት ከመቀረጹ በፊት ጥልቅ ምርምር (Research) የሚደረግበት ሲሆን፣ የደንበኞቻችንን የንግድ ዓላማና ማህበረሰባዊ እሴት ጠብቆ ይዘጋጃል።'
                      : 'Every production undergoes rigorous pre-shoot research, aligning seamlessly with client brand identity and social values.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 6.2: Complete Production Gear & Talent */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-none transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                <Film className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'am' ? '6.2. የተሟላ የፕሮዳክሽን ግብዓቶች እና የባለሙያዎች ጥምረት' : 'Complete In-House Rigs & Master Talent'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'ተቋማችን ሙሉ የፕሮዳክሽን መቅረጫ መሳሪያዎች፣ የድምፅ እና የብርሃን (Lighting) እቃዎች ባለቤት በመሆኑ ከኪራይ ጋር ተያይዘው የሚመጡ መዘግየቶችን ሙሉ በሙሉ ያስቀራል።'
                      : '100% owned cinema cameras, multi-point lighting arrays, and audio equipment, eliminating third-party rental delays entirely.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'በፊልም እና ሚዲያ ኢንዱስትሪ ውስጥ የረጅም ዓመታት ልምድ ያላቸው ሲኒማቶግራፈሮቻችን እና የብርሃን ባለሙያዎቻችን እያንዳንዱን ፍሬም በከፍተኛ ጥንቃቄ ይቀርጻሉ።'
                      : 'Seasoned directors of photography, sound engineers, and lighting artists craft each frame with high cinematic precision.'}
                  </span>
                </li>
              </ul>
            </div>

            {/* Pillar 6.3: Advanced Post-Production & Editing */}
            <div className="p-8 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-slate-900 dark:to-slate-950 border border-slate-200 dark:border-slate-800 hover:border-amber-500/40 shadow-sm dark:shadow-none transition-all space-y-4 group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                <Video className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {lang === 'am' ? '6.3. አለምአቀፍ ደረጃውን የጠበቀ የቪዲዮ ኤዲቲንግ' : 'Advanced Post-Production & Editing'}
              </h3>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                  <span>
                    {lang === 'am'
                      ? 'ዘመናዊ ሶፍትዌሮችን (እንደ Adobe Premiere Pro እና DaVinci Resolve) በመጠቀም የቪዲዮዎችን ቀለም (Color Grading)፣ የድምፅ ጥራትና VFX በጥንቃቄ ይሰራል ።'
                      : 'Industry-standard suites (Adobe Premiere Pro & DaVinci Resolve) for broadcast color grading, sound design, and VFX polish.'}
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
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
          <div className="p-8 sm:p-12 rounded-3xl bg-white dark:bg-slate-900/90 border-2 border-amber-500/30 dark:border-amber-500/20 shadow-2xl relative overflow-hidden">
            {/* Subtle Accent Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
              <span className="px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                {lang === 'am' ? 'የማስታወቂያ አጋርነት ማመልከቻ' : 'Corporate Booking Desk'}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                {lang === 'am' ? 'ብራንድዎን በሚሊዮኖች ልብ ውስጥ ይትከሉ' : 'Accelerate Your Brand with Donkey Tube'}
              </h2>
              <p className="text-slate-600 dark:text-slate-300/80 text-xs sm:text-sm font-sans leading-relaxed">
                {lang === 'am'
                  ? 'ከዚህ በታች ያለውን ቅጽ በመሙላት የማስታወቂያ ፍላጎትዎን ያስመዝግቡ። የኮርፖሬት ክፍላችን በ24 ሰዓት ውስጥ ሙሉ የዋጋ ዝርዝርና እቅድ ያቀርብልዎታል ።'
                  : 'Submit your brand inquiry below. Our corporate media desk will review and provide a customized cross-platform proposal within 24 hours.'}
              </p>
            </div>

            {formSuccess && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <span>{formSuccess}</span>
              </div>
            )}

            {formError && (
              <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-sm">
                {formError}
              </div>
            )}

            <form onSubmit={handleInquirySubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'የድርጅቱ / የምርት ስም *' : 'Company / Brand Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.companyName}
                    onChange={(e) => setFormState({ ...formState, companyName: e.target.value })}
                    placeholder="e.g. Ethiopian Airlines, Kuriftu Resort..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'የስራው ዘርፍ *' : 'Industry Sector *'}
                  </label>
                  <select
                    value={formState.industry}
                    onChange={(e) => setFormState({ ...formState, industry: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
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
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'የእውቂያ ሰው ስም *' : 'Contact Person *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.contactPerson}
                    onChange={(e) => setFormState({ ...formState, contactPerson: e.target.value })}
                    placeholder="e.g. Dawit Bekele (Marketing Director)"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'ስልክ ቁጥር (WhatsApp / Call) *' : 'Phone Number *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={formState.phone}
                    onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                    placeholder="+251 911 234567"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'ኢሜይል (Email)' : 'Corporate Email'}
                  </label>
                  <input
                    type="email"
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    placeholder="marketing@company.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'የዘመቻው አይነት (Campaign Target)' : 'Campaign Target'}
                  </label>
                  <select
                    value={formState.campaignType}
                    onChange={(e) => setFormState({ ...formState, campaignType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  >
                    <option value="Integrated Sponsorship & Show Placement">Integrated YouTube Show Placement</option>
                    <option value="Cross-Platform Blitz (YouTube + TikTok + Facebook)">Cross-Platform Blitz (YouTube + TikTok + Facebook)</option>
                    <option value="Dedicated Documentary / Commercial Video">Dedicated Commercial Film Production</option>
                    <option value="VIP Event / Live Tour Sponsorship">VIP Tour & Live Event Sponsorship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {lang === 'am' ? 'የበጀት / የጊዜ እቅድ' : 'Budget / Timeline'}
                  </label>
                  <input
                    type="text"
                    value={formState.budgetRange}
                    onChange={(e) => setFormState({ ...formState, budgetRange: e.target.value })}
                    placeholder="e.g. Immediate Launch / Q4 2026"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
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
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-sm resize-none transition-colors"
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
            <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 text-center text-xs">
              <a
                href="https://t.me/DonkeyTubeSupport"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-sky-500/50 hover:bg-sky-500/[0.04] text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center gap-2.5 transition-all font-semibold shadow-xs overflow-hidden"
              >
                <svg className="w-4 h-4 text-[#229ED9] fill-current shrink-0" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.62 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.05-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.98-1.73 6.64-2.87 7.97-3.44 3.79-1.61 4.58-1.89 5.09-1.9.11 0 .37.03.53.16.14.12.18.28.2.45-.01.07.01.22 0 .33z"/>
                </svg>
                <span className="truncate">@DonkeyTubeSupport</span>
              </a>

              <a
                href="mailto:marketing@comedianeshetu.com"
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 hover:bg-amber-500/[0.04] text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 flex items-center justify-center gap-2.5 transition-all font-semibold shadow-xs overflow-hidden"
              >
                <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="truncate">marketing@comedianeshetu.com</span>
              </a>

              <a
                href="tel:+251913610673"
                className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-500/[0.04] text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center justify-center gap-2.5 transition-all font-semibold shadow-xs overflow-hidden"
              >
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span className="truncate">+251913610673</span>
              </a>

              <div className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-2.5 font-semibold shadow-xs overflow-hidden">
                <Building2 className="w-4 h-4 text-purple-500 shrink-0" />
                <span className="truncate">Addis Ababa, Ethiopia</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/90 py-8 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 Donkey Tube (Tinqiq Multi-Media & Event Organizer). Founded by Comedian Eshetu Melese. All rights reserved.</p>
          <div className="mt-2 flex items-center justify-center gap-4 text-slate-600 dark:text-slate-400">
            <Link href="/" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Portal Home</Link>
            <span>•</span>
            <Link href="/register" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Member Registration</Link>
            <span>•</span>
            <Link href="/search" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Verify Card</Link>
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
