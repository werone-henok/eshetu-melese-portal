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
    <section id="charity" className="py-24 lg:py-32 relative overflow-hidden border-t border-white/5">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[600px] h-[400px] bg-rose-500/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="rounded-3xl p-8 sm:p-12 lg:p-16 glass-panel-gold relative overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <HeartHandshake className="w-4 h-4 text-rose-400" />
                <span>{lang === 'am' ? 'በጎ አድራጎትና ማህበራዊ አሻራ' : 'Humanitarian Impact'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15] font-display">
                {heading}
              </h2>

              <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed font-sans">
                {description}
              </p>

              <div className="space-y-3.5 pt-2 text-sm text-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{lang === 'am' ? 'ለአቅመ ደካሞች የመኖሪያ ቤቶችን መገንባት' : 'Building safe shelters for vulnerable families'}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{lang === 'am' ? 'የህክምና እና የትምህርት ወጪዎችን መሸፈን' : 'Emergency medical funding & child scholarships'}</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  href="/register"
                  className="btn-luxury-gold inline-flex items-center gap-3 px-8 py-4 text-sm"
                >
                  <span>{lang === 'am' ? 'በአባልነት ይደግፉ' : 'Support Through Membership'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Media Showcase */}
            <div className="relative rounded-2xl overflow-hidden glass-panel aspect-video flex items-center justify-center shadow-2xl p-1">
              <div className="w-full h-full rounded-xl overflow-hidden bg-slate-950 flex items-center justify-center">
                {mediaUrl && !imgError ? (
                  <img
                    src={mediaUrl}
                    alt="Lmetsdek Charity"
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-8 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
                      <HeartHandshake className="w-8 h-8" />
                    </div>
                    <h4 className="text-2xl font-black text-white font-display">"ለመጽደቅ"</h4>
                    <p className="text-xs text-slate-400 max-w-sm">
                      {lang === 'am' ? 'የኮሜዲያን እሸቱ መለሰ የበጎ አድራጎት ተነሳሽነት' : 'Comedian Eshetu Melese Charity Initiative'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
