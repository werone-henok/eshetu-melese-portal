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
    <section id="about" className="py-20 lg:py-28 relative bg-slate-950/70 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Media / Photo Showcase */}
          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 bg-slate-900 aspect-4/3 flex items-center justify-center">
              {mediaUrl && !imgError ? (
                <img
                  src={mediaUrl}
                  alt="Comedian Eshetu Melese"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 p-8 flex flex-col justify-end">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center text-slate-950 font-black text-2xl mb-4 shadow-xl">
                    EM
                  </div>
                  <h3 className="text-2xl font-black text-slate-100">ESHETU MELESE</h3>
                  <p className="text-amber-400 text-sm font-semibold">Comedian &middot; Philanthropist &middot; Host</p>
                </div>
              )}
            </div>
          </div>

          {/* Bio & Highlights */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Mic className="w-3.5 h-3.5" />
              <span>{lang === 'am' ? 'የህይወት ጉዞ' : 'The Visionary'}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
              {heading}
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              {bio}
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black text-amber-400 font-mono block">3.2M+</span>
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'am' ? 'ተከታዮችና ተመልካቾች' : 'Subscribers & Global Fans'}
                </span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-2xl font-black text-emerald-400 font-mono block">10+ Yrs</span>
                <span className="text-xs text-slate-400 font-medium">
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
