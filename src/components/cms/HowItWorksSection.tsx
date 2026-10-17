'use client';

import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface HowItWorksProps {
  config: {
    heading?: string;
    headingAm?: string;
    subheading?: string;
    subheadingAm?: string;
    steps?: { step: string; title: string; titleAm?: string; desc: string; descAm?: string }[];
  };
}

export function HowItWorksSection({ config }: HowItWorksProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'የአባልነት ካርድዎን ለማግኘት 3 ቀላል ደረጃዎች'
      : config?.heading || '3 Simple Steps to Get Your Card';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm ||
        'ፈጣን ምዝገባ፣ አመቺ የአገር ውስጥና ዓለም አቀፍ የክፍያ አማራጮች እና ፈጣን ማረጋገጫ።'
      : config?.subheading ||
        'Fast registration, flexible local & international payment options, instant verification.';

  const defaultSteps = [
    {
      step: '01',
      title: 'Choose Tier & Fill Form',
      titleAm: 'ደረጃዎን ይምረጡና ቅጹን ይሙሉ',
      desc: 'Select your preferred tier and enter your name, international phone number (+251/global) and photo.',
      descAm: 'የሚፈልጉትን ደረጃ ይምረጡ፣ ስምዎን፣ ዓለም አቀፍ ስልክ ቁጥርዎን እና ፎቶዎን ያስገቡ።',
    },
    {
      step: '02',
      title: 'Submit Payment Receipt',
      titleAm: 'የክፍያ ደረሰኝዎን ያስገቡ',
      desc: 'Pay via Telebirr, CBE Birr, Awash Bank, or International Transfer and upload your receipt screenshot/PDF.',
      descAm: 'በቴሌብር፣ በሲቢኢ ብር፣ በአዋሽ ባንክ ወይም በዓለም አቀፍ ክፍያ ይክፈሉና ደረሰኝዎን ይጫኑ።',
    },
    {
      step: '03',
      title: 'Get Verified Digital Badge',
      titleAm: 'የተረጋገጠ ዲጂታል ካርድዎን ይቀበሉ',
      desc: 'Once approved by admin, instantly download high-res PNG/WebP cards and share on Telegram, WhatsApp & Facebook.',
      descAm: 'በአስተዳዳሪው እንደተረጋገጠ ወዲያውኑ ከፍተኛ ጥራት ያለው ዲጂታል ካርድዎን ያውርዱ እና ያጋሩ።',
    },
  ];

  const steps = config?.steps || defaultSteps;

  return (
    <section id="how-it-works" className="py-24 lg:py-32 relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-600/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-md">
            <span>{lang === 'am' ? 'የአሰራር ቅደም ተከተል' : 'Streamlined Workflow'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-8 sm:p-9 rounded-3xl glass-panel hover:glass-panel-gold shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="text-4xl sm:text-5xl font-black text-amber-500/30 group-hover:text-amber-500/60 font-mono transition-colors">
                    {item.step}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 dark:text-amber-400 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 font-display tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors">
                  {lang === 'am' && item.titleAm ? item.titleAm : item.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300/80 leading-relaxed font-sans">
                  {lang === 'am' && item.descAm ? item.descAm : item.desc}
                </p>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'am' ? 'ቀጥተኛ የዲጂታል ማረጋገጫ' : 'Zero-Code Verification'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
