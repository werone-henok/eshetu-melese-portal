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
    <section id="faq" className="py-20 lg:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'እገዛና ድጋፍ' : 'Support & Help'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {subheading}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800/80 bg-slate-900/60 overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left text-slate-100 font-bold text-lg hover:text-amber-400 transition-colors"
                >
                  <span>{(lang === 'am' && faq.qAm) ? faq.qAm : faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-amber-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800/40 pt-4">
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
