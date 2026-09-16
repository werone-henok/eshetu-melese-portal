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
    <section id="how-it-works" className="py-20 lg:py-28 relative bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between"
            >
              <div>
                <span className="text-5xl font-black text-amber-500/25 font-mono mb-4 block">
                  {item.step}
                </span>
                <h3 className="text-xl font-bold text-slate-100 mb-3">
                  {lang === 'am' && item.titleAm ? item.titleAm : item.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lang === 'am' && item.descAm ? item.descAm : item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-semibold text-amber-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'am' ? 'ቀጥተኛ የዲጂታል ማረጋገጫ' : 'Zero-Code Verification'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
