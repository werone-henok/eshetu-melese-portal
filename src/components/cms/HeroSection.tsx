'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, CheckCircle2, QrCode, Shield, Star, Users } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import { motion } from 'framer-motion';

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
    mediaUrl?: string;
  };
}

export function HeroSection({ config }: HeroProps) {
  const { lang } = useAppSettings();

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
  const mediaUrl = config?.mediaUrl;

  return (
    <section className="relative overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-36">
      {/* Multi-layered Ambient Light Leaks (Champagne Gold + Electric Violet) */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-tr from-violet-600/20 via-amber-400/15 to-transparent blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/4 -right-48 w-[450px] h-[450px] bg-violet-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 -left-48 w-[450px] h-[450px] bg-amber-500/12 blur-[120px] pointer-events-none rounded-full" />

      {/* Decorative Grid Mesh Subtle Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:32px_32px] pointer-events-none opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
        {/* Floating Portal Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-400/10 backdrop-blur-xl mb-8 shadow-glow-gold hover:border-amber-400/50 transition-all cursor-default"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span className="text-xs sm:text-sm font-bold text-amber-200 tracking-wider uppercase font-heading">
            {badgeText}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </motion.div>

        {/* Dynamic CMS Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-heading text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white max-w-5xl mx-auto leading-[1.08] sm:leading-[1.12]"
        >
          {headline.split(' ').map((word, i) =>
            ['Official', 'Eshetu', 'Melese', 'Community', 'Verified', 'እሸቱ', 'መለሰ'].some((highlight) =>
              word.toLowerCase().includes(highlight.toLowerCase())
            ) ? (
              <span
                key={i}
                className="text-gradient-gold inline-block"
              >
                {word}{' '}
              </span>
            ) : (
              word + ' '
            )
          )}
        </motion.h1>

        {/* Dynamic CMS Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 sm:mt-8 text-lg sm:text-xl lg:text-2xl text-slate-300/90 max-w-3xl mx-auto font-normal leading-relaxed"
        >
          {subheadline}
        </motion.p>

        {/* Optional Hero Media Artwork */}
        {mediaUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-10 mb-6 max-w-4xl mx-auto rounded-3xl overflow-hidden p-1.5 bg-gradient-to-b from-amber-400/30 via-violet-500/20 to-transparent shadow-2xl shadow-violet-950/40"
          >
            <div className="rounded-[22px] overflow-hidden bg-charcoal-950 border border-white/10">
              <img
                src={mediaUrl}
                alt={headline}
                className="w-full h-auto max-h-[460px] object-cover mx-auto hover:scale-[1.01] transition-transform duration-700"
              />
            </div>
          </motion.div>
        )}

        {/* CTA Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto sm:max-w-none"
        >
          <Link
            href={ctaPrimaryUrl}
            className="btn-luxury-gold w-full sm:w-auto text-base sm:text-lg group"
          >
            <span>{ctaPrimaryText}</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href={ctaSecondaryUrl}
            className="btn-luxury-ghost w-full sm:w-auto text-base sm:text-lg group"
          >
            <QrCode className="w-5 h-5 text-violet-400 group-hover:scale-110 transition-transform" />
            <span>{ctaSecondaryText}</span>
          </Link>
        </motion.div>

        {/* Value Micro-props / Social Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="mt-14 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm text-slate-300 font-medium"
        >
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border-white/10">
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
            <span>{lang === 'am' ? 'ፈጣን የQR ማረጋገጫ' : 'Instant Cryptographic Verification'}</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border-white/10">
            <CheckCircle2 className="w-4 h-4 text-violet-400" />
            <span>{lang === 'am' ? 'በቴሌብርና ሲቢኢ ብር የሚከፈል' : 'Telebirr, CBE & International Wire'}</span>
          </div>
          <div className="glass-panel px-4 py-2 rounded-full flex items-center gap-2 border-white/10">
            <Users className="w-4 h-4 text-amber-400" />
            <span>{lang === 'am' ? 'ለመላው የዲያስፖራ አባላት ክፍት' : 'Global Community in 50+ Countries'}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
