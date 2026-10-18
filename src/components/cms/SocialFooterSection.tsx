'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface FooterProps {
  config: {
    heading?: string;
    subheading?: string;
    ctaText?: string;
    ctaUrl?: string;
  };
}

export function SocialFooterSection({ config }: FooterProps) {
  const { lang, branding } = useAppSettings();

  const defaultHeading = lang === 'am' ? 'ዛሬውኑ የዚህ ታላቅ ጉዞ አካል ይሁኑ' : 'Be Part of Something Bigger Today';
  const defaultSubheading = lang === 'am'
    ? 'በዓለም ዙሪያ ካሉ በሺዎች ከሚቆጠሩ አባላት ጋር ይቀላቀሉ። አሁኑኑ ተመዝግበው ይፋዊ የዲጂታል አባልነት ካርድዎን ይቀበሉ።'
    : 'Join thousands of visionary members worldwide. Register now to receive your official digital card.';
  const defaultCtaText = lang === 'am' ? 'ምዝገባ ጀምር' : 'Start Registration';

  const heading = (lang === 'am' && !config?.heading) ? defaultHeading : (config?.heading || defaultHeading);
  const subheading = (lang === 'am' && !config?.subheading) ? defaultSubheading : (config?.subheading || defaultSubheading);
  const ctaText = (lang === 'am' && !config?.ctaText) ? defaultCtaText : (config?.ctaText || defaultCtaText);
  const ctaUrl = config?.ctaUrl || '/register';
  const siteName = lang === 'am' ? (branding?.siteNameAm || 'እሸቱ መለሰ') : (branding?.siteName || 'Eshetu Melese');

  return (
    <footer className="relative border-t border-slate-200 dark:border-white/5 bg-slate-100 dark:bg-[#070A12] pt-24 pb-14 overflow-hidden transition-colors duration-300">
      {/* Background ambient light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-amber-500/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        {/* Call to Action Card */}
        <div className="rounded-3xl p-10 sm:p-16 glass-panel-gold text-center mb-20 shadow-2xl relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-md">
            <span>{lang === 'am' ? 'ይቀላቀሉን' : 'Join Our Global Family'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight max-w-2xl mx-auto font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-700 dark:text-slate-300/90 max-w-xl mx-auto font-sans leading-relaxed">
            {subheading}
          </p>
          <div className="mt-9 flex justify-center">
            <Link
              href={ctaUrl}
              className="btn-luxury-gold inline-flex items-center gap-3 px-9 py-4 text-sm sm:text-base cursor-pointer"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer Meta & Copyright */}
        <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2.5">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-5 h-5 object-contain rounded" />
            ) : (
              <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-500 dark:text-amber-400 flex items-center justify-center">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            )}
            <span className="font-medium">
              {lang === 'am'
                ? `ይፋዊ የ${siteName} የአባላት መድረክ • መብቱ በህግ የተጠበቀ ነው © 2026`
                : `Official ${siteName} Member Portal • All Rights Reserved © 2026`}
            </span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <Link href="/search" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              {lang === 'am' ? 'ካርድ አረጋግጥ' : 'Verify Badge'}
            </Link>
            <Link href="/marketing" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              {lang === 'am' ? 'የድርጅቱ መገለጫ' : 'Company Profile'}
            </Link>
            <Link href="/#tiers" className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              {lang === 'am' ? 'የአባልነት ደረጃዎች' : 'Pricing Tiers'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
