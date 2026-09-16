'use client';

import React from 'react';
import Link from 'next/link';
import { HeartHandshake, Sparkles, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface CharitySectionProps {
  config: {
    heading?: string;
    subheading?: string;
    headingAm?: string;
    subheadingAm?: string;
    mediaUrl?: string;
    description?: string;
    descriptionAm?: string;
  };
}

export function CharitySection({ config }: CharitySectionProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'የ"ለመጽደቅ" (Lmetsdek) የበጎ አድራጎት ንቅናቄ'
      : config?.heading || 'The "Lmetsdek" ("ለመጽደቅ") Charity Movement';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm || 'ሳቅን ከተግባራዊ ደግነት እና ህይወትን ከመቀየር ጋር የሚያስተሳስር ታሪካዊ የበጎ አድራጎት ፕሮጀክት።'
      : config?.subheading ||
        'Transforming lives and uplifting vulnerable families through transformative community compassion.';

  const description =
    lang === 'am'
      ? config?.descriptionAm ||
        'በኮሜዲያን እሸቱ መለሰ የተመሰረተው የ"ለመጽደቅ" በጎ አድራጎት ፕሮጀክት በመቶዎች ለሚቆጠሩ ችግረኞች፣ አቅመ ደካሞች እና ለህጻናት ድጋፍ በማድረግ፣ ቤት በመስራት እና የህክምና ወጪዎችን በመሸፈን የብዙዎችን እንባ ያበሰ ታላቅ ሰብአዊ ስራ ነው። አባላት በዚህ ታላቅ የበረከት ስራ ላይ ቀጥተኛ አሻራ ያኖራሉ።'
      : config?.description ||
        'Founded and led by Comedian Eshetu Melese, the "Lmetsdek" charitable initiative builds homes, provides emergency medical relief, and sponsors underprivileged children across Ethiopia. Every member contribution directly empowers this mission of hope.';

  const [imgError, setImgError] = React.useState(false);
  const mediaUrl = config?.mediaUrl || '/images/lmetsdek-charity.jpg';

  return (
    <section id="charity" className="py-20 lg:py-28 relative overflow-hidden bg-slate-900/40 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-500/30 shadow-2xl relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-4 h-4" />
                <span>{lang === 'am' ? 'በጎ አድራጎትና ማህበራዊ አሻራ' : 'Humanitarian Impact'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight leading-tight">
                {heading}
              </h2>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                {description}
              </p>

              <div className="space-y-3 pt-2 text-sm text-slate-300">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{lang === 'am' ? 'ለአቅመ ደካሞች የመኖሪያ ቤቶችን መገንባት' : 'Building safe shelters for vulnerable families'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
                  <span>{lang === 'am' ? 'የህክምና እና የትምህርት ወጪዎችን መሸፈን' : 'Emergency medical funding & child scholarships'}</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all hover:scale-105"
                >
                  <span>{lang === 'am' ? 'በአባልነት ይደግፉ' : 'Support Through Membership'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Media Showcase */}
            <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video flex items-center justify-center shadow-xl">
              {mediaUrl && !imgError ? (
                <img
                  src={mediaUrl}
                  alt="Lmetsdek Charity"
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                    <HeartHandshake className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-black text-slate-100">"ለመጽደቅ"</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    {lang === 'am' ? 'የኮሜዲያን እሸቱ መለሰ የበጎ አድራጎት ተነሳሽነት' : 'Comedian Eshetu Melese Charity Initiative'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
