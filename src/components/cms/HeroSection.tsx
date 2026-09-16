'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, ArrowRight, CheckCircle2, QrCode } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface HeroProps {
  config: {
    headline?: string;
    headlineAm?: string;
    subheadline?: string;
    subheadlineAm?: string;
    badgeText?: string;
    badgeTextAm?: string;
    ctaPrimaryText?: string;
    ctaPrimaryTextAm?: string;
    ctaPrimaryUrl?: string;
    ctaSecondaryText?: string;
    ctaSecondaryTextAm?: string;
    ctaSecondaryUrl?: string;
  };
}

export function HeroSection({ config }: HeroProps) {
  const { lang, t } = useAppSettings();

  const headline =
    lang === 'am'
      ? config?.headlineAm || 'የኮሜዲያን እሸቱ መለሰ ይፋዊ የአባላት ማህበረሰብን ይቀላቀሉ'
      : config?.headline || 'Join the Official Eshetu Melese Member Community';

  const subheadline =
    lang === 'am'
      ? config?.subheadlineAm ||
        'በዓለም ዙሪያ ካሉ ከ 3.2 ሚሊዮን በላይ አባላት ጋር ይገናኙ። የተረጋገጠ የዲጂታል አባልነት ካርድ፣ የቀጥታ ስርጭቶች እና ልዩ የቪአይፒ መብቶችን ያግኙ።'
      : config?.subheadline ||
        'Connect with 3.2M+ visionary members worldwide. Unlock verified digital membership credentials, exclusive livestreams, and VIP access.';

  const badgeText =
    lang === 'am'
      ? config?.badgeTextAm || 'ይፋዊ ዓለም አቀፍ ፖርታል'
      : config?.badgeText || 'Official Global Portal';

  const ctaPrimaryText =
    lang === 'am'
      ? config?.ctaPrimaryTextAm || 'የአባልነት ካርድዎን ያግኙ'
      : config?.ctaPrimaryText || 'Get Your Membership Card';

  const ctaPrimaryUrl = config?.ctaPrimaryUrl || '/register';

  const ctaSecondaryText =
    lang === 'am'
      ? config?.ctaSecondaryTextAm || 'ካርድ ያረጋግጡ / ይፈልጉ'
      : config?.ctaSecondaryText || 'Verify / Search Card';

  const ctaSecondaryUrl = config?.ctaSecondaryUrl || '/search';

  return (
    <section className="relative overflow-hidden pt-12 pb-24 lg:pt-20 lg:pb-32">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-amber-500/15 via-amber-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Portal Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 backdrop-blur-md mb-8 shadow-inner">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-semibold text-amber-300 tracking-wide uppercase">
            {badgeText}
          </span>
        </div>

        {/* Dynamic CMS Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-100 max-w-5xl mx-auto leading-[1.1] sm:leading-[1.15]">
          {headline.split(' ').map((word, i) =>
            ['Official', 'Eshetu', 'Melese', 'Community', 'Verified'].some((highlight) =>
              word.toLowerCase().includes(highlight.toLowerCase())
            ) ? (
              <span
                key={i}
                className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent"
              >
                {word}{' '}
              </span>
            ) : (
              word + ' '
            )
          )}
        </h1>

        {/* Dynamic CMS Subheadline */}
        <p className="mt-6 sm:mt-8 text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed">
          {subheadline}
        </p>

        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none">
          <Link
            href={ctaPrimaryUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.03] active:scale-[0.98]"
          >
            <span>{ctaPrimaryText}</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href={ctaSecondaryUrl}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl border border-slate-700 bg-slate-900/90 hover:bg-slate-800 hover:border-slate-600 text-slate-200 font-semibold text-base backdrop-blur-md shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <QrCode className="w-5 h-5 text-amber-400" />
            <span>{ctaSecondaryText}</span>
          </Link>
        </div>

        {/* Value Micro-props */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-slate-400 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{lang === 'am' ? 'ፈጣን የQR ማረጋገጫ' : 'Instant QR Verification'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{lang === 'am' ? 'በቴሌብርና ሲቢኢ ብር የሚከፈል' : 'Telebirr & CBE Birr Accepted'}</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{lang === 'am' ? 'ለመላው የዲያስፖራ አባላት ክፍት' : 'Global Diaspora Supported'}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
