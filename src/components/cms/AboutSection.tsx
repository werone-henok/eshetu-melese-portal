'use client';

import React from 'react';
import { Award, Users, Mic, Heart, Play } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface AboutSectionProps {
  config: {
    heading?: string;
    subheading?: string;
    mediaUrl?: string;
    headingAm?: string;
    subheadingAm?: string;
    bio?: string;
    bioAm?: string;
  };
}

export function AboutSection({ config }: AboutSectionProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'ስለ ኮሜዲያን እሸቱ መለሰ'
      : config?.heading || 'About Comedian Eshetu Melese';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm || 'በኢትዮጵያ እና በአለም ዙሪያ በሚሊዮኖች የሚቆጠሩ ሰዎችን የሚያስደስት እና የሚያነቃቃ ድምጽ።'
      : config?.subheading ||
        'Renowned Ethiopian comedian, storyteller, and philanthropist touching millions of lives worldwide.';

  const bio =
    lang === 'am'
      ? config?.bioAm ||
        'እሸቱ መለሰ በኢትዮጵያ የኪነ-ጥበብ ታሪክ ውስጥ እጅግ ተወዳጅ ከሆኑ ኮሜዲያኖች እና የቴሌቪዥን አዘጋጆች አንዱ ነው። በታዋቂው "የእሸቱ የልጆች ሾው" እና "ዲና" ዝግጅቶች እንዲሁም በፈጠራ ስራዎቹ 3.2 ሚሊዮን በላይ ተከታዮችን በማፍራት ለብዙዎች ተስፋን እና ሳቅን አበርክቷል።'
      : config?.bio ||
        'Eshetu Melese is one of Ethiopia’s most iconic stand-up comedians, show hosts, and visionary media creators. Founder of Donkey Tube with over 3.2M+ subscribers, his unique comedy, storytelling, and transformative projects bridge laughter with profound social impact.';

  const [imgError, setImgError] = React.useState(false);
  const mediaUrl = config?.mediaUrl || '/images/eshetu-portrait.png';

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Media / Photo Showcase */}
          <div className="relative group">
            {/* Ambient Aura */}
            <div className="absolute -inset-2 bg-gradient-to-r from-amber-500/30 via-violet-600/20 to-amber-500/30 rounded-[32px] blur-xl opacity-60 group-hover:opacity-100 transition duration-700" />

            <div className="relative rounded-3xl overflow-hidden glass-panel-gold aspect-4/3 flex items-center justify-center p-2">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
                {mediaUrl && !imgError ? (
                  <img
                    src={mediaUrl}
                    alt="Comedian Eshetu Melese"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-8 flex flex-col justify-end">
                    <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-2xl mb-4 shadow-xl">
                      EM
                    </div>
                    <h3 className="text-2xl font-black text-white font-display">ESHETU MELESE</h3>
                    <p className="text-amber-400 text-sm font-semibold">Comedian &middot; Philanthropist &middot; Host</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Highlights */}
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm backdrop-blur-md">
              <Mic className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
              <span>{lang === 'am' ? 'የህይወት ጉዞ' : 'The Visionary'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] font-display">
              {heading}
            </h2>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300/90 leading-relaxed font-normal font-sans">
              {bio}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-200 dark:border-white/10">
              <div className="p-5 rounded-2xl glass-panel-gold">
                <span className="text-3xl font-black text-gradient-gold font-mono block">3.2M+</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block mt-1">
                  {lang === 'am' ? 'ተከታዮችና ተመልካቾች' : 'Subscribers & Global Fans'}
                </span>
              </div>
              <div className="p-5 rounded-2xl glass-panel-violet">
                <span className="text-3xl font-black text-gradient-violet font-mono block">10+ Yrs</span>
                <span className="text-xs text-slate-600 dark:text-slate-300 font-medium block mt-1">
                  {lang === 'am' ? 'የኪነ-ጥበብ አገልግሎት' : 'Artistic & Community Leadership'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
