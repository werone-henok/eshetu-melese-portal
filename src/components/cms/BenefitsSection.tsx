'use client';

import React from 'react';
import { ShieldCheck, Globe, Radio, HeartHandshake, Zap } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface BenefitsSectionProps {
  config: {
    heading?: string;
    headingAm?: string;
    subheading?: string;
    subheadingAm?: string;
    items?: { title: string; titleAm?: string; desc: string; descAm?: string; icon?: string }[];
  };
}

export function BenefitsSection({ config }: BenefitsSectionProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'ለምን የተረጋገጠ አባል መሆን አለብዎት?'
      : config?.heading || 'Why Become a Verified Member?';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm || 'ልዩ እውቅና፣ ቀጥተኛ ግንኙነት እና ተጨባጭ የማህበረሰብ ጥቅሞችን ያግኙ።'
      : config?.subheading ||
        'Enjoy distinctive recognition, direct engagement, and tangible community privileges.';

  const defaultItems = [
    {
      title: 'Official Digital Pass',
      titleAm: 'ይፋዊ የዲጂታል ካርድ',
      desc: 'Tamper-proof digital badge with verifiable cryptographic QR code.',
      descAm: 'የማይቀየር፣ በQR ኮድ የሚረጋገጥ ዘመናዊ ዲጂታል የአባልነት ካርድ።',
      icon: 'ShieldCheck',
    },
    {
      title: 'Global Recognition',
      titleAm: 'ዓለም አቀፍ እውቅና',
      desc: 'Instant verification by phone number, ID or name anywhere across the world.',
      descAm: 'በዓለም ዙሪያ በስልክ ቁጥር፣ በአባልነት መለያ ወይም በስም ወዲያውኑ የሚረጋገጥ።',
      icon: 'Globe',
    },
    {
      title: 'Direct Live Access',
      titleAm: 'የቀጥታ ስርጭት ዕድል',
      desc: 'Exclusive member-only Q&As, roundtables, and VIP broadcast invites.',
      descAm: 'ለአባላት ብቻ የተዘጋጁ የጥያቄና መልስ መድረኮች እና የቪአይፒ የቀጥታ ስርጭቶች።',
      icon: 'Radio',
    },
    {
      title: 'Community Impact',
      titleAm: 'የማህበረሰብ አሻራ',
      desc: 'Directly fuel charitable, media, and transformational community projects.',
      descAm: 'በጎ አድራጎቶችን፣ የበረከት ስራዎችን እና ማህበራዊ ፕሮጀክቶችን በቀጥታ መደገፍ።',
      icon: 'HeartHandshake',
    },
  ];

  const items = config?.items || defaultItems;

  const getIcon = (name?: string) => {
    switch (name) {
      case 'Globe':
        return Globe;
      case 'Radio':
        return Radio;
      case 'HeartHandshake':
        return HeartHandshake;
      default:
        return ShieldCheck;
    }
  };

  return (
    <section id="benefits" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl bg-slate-900/50 hover:bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1.5"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/10 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-100 mb-3 group-hover:text-amber-300 transition-colors">
                  {lang === 'am' && item.titleAm ? item.titleAm : item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lang === 'am' && item.descAm ? item.descAm : item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
