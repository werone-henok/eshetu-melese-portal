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
    <footer className="relative border-t border-slate-800 bg-slate-950 pt-20 pb-12 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Call to Action Card */}
        <div className="rounded-3xl p-8 sm:p-14 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/30 text-center mb-16 shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight max-w-2xl mx-auto">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-xl mx-auto">
            {subheading}
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              href={ctaUrl}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base shadow-xl shadow-amber-500/25 transition-all hover:scale-105"
            >
              <span>{ctaText}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer Meta & Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            {branding?.logoUrl ? (
              <img src={branding.logoUrl} alt="Logo" className="w-4 h-4 object-contain rounded" />
            ) : (
              <ShieldCheck className="w-4 h-4 text-amber-500" />
            )}
            <span>
              {lang === 'am'
                ? `ይፋዊ የ${siteName} የአባላት መድረክ • መብቱ በህግ የተጠበቀ ነው © 2026`
                : `Official ${siteName} Member Portal • All Rights Reserved © 2026`}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/search" className="hover:text-slate-300 transition-colors">
              {lang === 'am' ? 'ካርድ አረጋግጥ' : 'Verify Badge'}
            </Link>
            <Link href="/#tiers" className="hover:text-slate-300 transition-colors">
              {lang === 'am' ? 'የአባልነት ደረጃዎች' : 'Pricing Tiers'}
            </Link>
            <Link href="/admin/login" className="hover:text-amber-400 transition-colors">
              {lang === 'am' ? 'የአስተዳዳሪ መግቢያ' : 'Staff CMS Login'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
