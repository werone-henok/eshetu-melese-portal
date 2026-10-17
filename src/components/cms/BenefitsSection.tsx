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
    <section id="benefits" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-md">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'am' ? 'የአባልነት ጠቀሜታዎች' : 'Member Exclusives'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300/90 font-normal max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item, idx) => {
            const Icon = getIcon(item.icon);
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-3xl glass-panel hover:glass-panel-gold transition-all duration-300 shadow-xl hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:shadow-glow-gold transition-all">
                    <Icon className="w-7 h-7 text-amber-400 group-hover:text-amber-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-white mb-3 font-display tracking-tight group-hover:text-gradient-gold transition-all">
                    {lang === 'am' && item.titleAm ? item.titleAm : item.title}
                  </h3>
                  <p className="text-sm text-slate-300/80 leading-relaxed font-sans">
                    {lang === 'am' && item.descAm ? item.descAm : item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
