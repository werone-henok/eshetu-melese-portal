'use client';

import React from 'react';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import { MediaCarouselSection } from '@/components/cms/MediaCarouselSection';
import { useAppSettings } from '@/context/AppSettingsContext';
import { Film, Sparkles, ArrowRight, ShieldCheck, Download, Users } from 'lucide-react';
import Link from 'next/link';

export default function GalleryPage() {
  const { lang, t } = useAppSettings();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <NavigationHeader />

      <main>
        {/* Hero Banner for Media Vault */}
        <div className="relative pt-12 pb-6 sm:pt-16 sm:pb-8 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{lang === 'am' ? 'ይፋዊ የሚዲያ እና የቪዲዮ ማህደር' : 'Official Media & Footage Vault'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight font-display max-w-4xl mx-auto">
              {lang === 'am'
                ? 'ከመጋረጃው ጀርባ የዱባይ ቀረጻ እና የመድረክ ኮሜዲ ማህደር'
                : 'Behind The Scenes Dubai Footage & Stand-Up Comedy Gallery'}
            </h1>

            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              {lang === 'am'
                ? 'በዱባይ የተከናወነውን የላቀ ስቱዲዮ ቀረጻ፣ ያልታዩ የቀጥታ ቪዲዮዎች፣ የስታንድ-አፕ ኮሜዲ ኮንሰርቶች እና ይፋዊ ፖስተሮችን በከፍተኛ ጥራት ይመልከቱ።'
                : 'Explore exclusive high-definition video reels from our Dubai production set, alongside official stand-up concert stills and tour announcements.'}
            </p>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/membersgallary"
                className="px-5 py-2.5 rounded-xl bg-slate-200 dark:bg-white/10 hover:bg-slate-300 dark:hover:bg-white/15 text-slate-800 dark:text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>{lang === 'am' ? 'የአባላት ካርድ ጋለሪን ይመልከቱ' : 'Explore Members Digital Passes'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Responsive Media Carousel & Slideshow */}
        <MediaCarouselSection />
      </main>
    </div>
  );
}
