'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface FaqItem {
  q: string;
  qAm?: string;
  a: string;
  aAm?: string;
}

interface FaqSectionProps {
  config: {
    heading?: string;
    headingAm?: string;
    subheading?: string;
    subheadingAm?: string;
    faqs?: FaqItem[];
  };
}

export function FaqSection({ config }: FaqSectionProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'ተደጋግመው የሚጠየቁ ጥያቄዎች'
      : config?.heading || 'Frequently Asked Questions';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm ||
        'ስለ ምዝገባ፣ ስለ ክፍያ ማረጋገጫ እና የዲጂታል ካርድ አወሳሰድ ማወቅ ያለብዎት መረጃዎች ሁሉ።'
      : config?.subheading ||
        'Everything you need to know about registration, payment verification, and card downloads.';

  const defaultFaqs: FaqItem[] = [
    {
      q: 'How long does payment verification take?',
      qAm: 'የክፍያ ማረጋገጫ ምን ያህል ጊዜ ይወስዳል?',
      a: 'Verification is typically completed by our administrative team within 1 to 12 hours after submitting your payment reference.',
      aAm: 'የክፍያ መረጃዎን እና ደረሰኝዎን ካስገቡ በኋላ በ 1 እስከ 12 ሰዓታት ውስጥ በአስተዳዳሪ ቡድናችን ይረጋገጣል።',
    },
    {
      q: 'Which payment methods are accepted in Ethiopia?',
      qAm: 'በኢትዮጵያ ውስጥ ተቀባይነት ያላቸው የክፍያ ዘዴዎች የትኞቹ ናቸው?',
      a: 'We accept Telebirr, CBE Birr, Awash Bank, Bank of Abyssinia, and direct bank transfer receipts.',
      aAm: 'ቴሌብር፣ የኢትዮጵያ ንግድ ባንክ (CBE Birr)፣ አዋሽ ባንክ፣ አቢሲንያ ባንክ እና ቀጥተኛ የባንክ ዝውውር ደረሰኞችን እንቀበላለን።',
    },
    {
      q: 'Can international members register from abroad?',
      qAm: 'በውጭ አገር የሚኖሩ አባላት መመዝገብ ይችላሉ?',
      a: 'Yes! International supporters can select their country (+1, +44, +971, +49, etc.) and submit international payment confirmation.',
      aAm: 'አዎ! በውጭ አገር የሚኖሩ ደጋፊዎች የአገራቸውን መለያ ቁጥር (+1, +44, +971, ወዘተ) በመምረጥና የክፍያ ማረጋገጫ በማስገባት በቀላሉ መመዝገብ ይችላሉ።',
    },
    {
      q: 'How can anyone verify my digital membership card?',
      qAm: 'ማንኛውም ሰው የእኔን ዲጂታል ካርድ እንዴት ማረጋገጥ ይችላል?',
      a: 'Anyone can scan the QR code on your card or enter your phone number or Member ID into the public verification search tool.',
      aAm: 'ማንኛውም ሰው በካርድዎ ላይ ያለውን የQR ኮድ በመቃኘት ወይም ስልክ ቁጥርዎን/የአባልነት መለያዎን በይፋዊው የማረጋገጫ ገጽ ላይ በመፈለግ ማረጋገጥ ይችላል።',
    },
  ];

  const faqs = config?.faqs || defaultFaqs;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 lg:py-32 relative overflow-hidden border-t border-slate-200 dark:border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-amber-500/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-md">
            <HelpCircle className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{lang === 'am' ? 'እገዛና ድጋፍ' : 'Support & Clarity'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className={`rounded-2xl transition-all duration-300 overflow-hidden ${
                  isOpen ? 'glass-panel-gold shadow-glow-gold' : 'glass-panel hover:border-amber-500/40 dark:hover:border-white/20'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 sm:p-7 text-left text-slate-900 dark:text-white font-bold text-base sm:text-lg hover:text-amber-600 dark:hover:text-amber-300 transition-colors font-display"
                >
                  <span className="pr-4">{(lang === 'am' && faq.qAm) ? faq.qAm : faq.q}</span>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300 ${
                      isOpen ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 rotate-180' : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-6 sm:px-7 pb-6 sm:pb-7 text-slate-600 dark:text-slate-300/90 text-sm sm:text-base leading-relaxed border-t border-slate-200 dark:border-white/5 pt-4 font-sans">
                    {(lang === 'am' && faq.aAm) ? faq.aAm : faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
