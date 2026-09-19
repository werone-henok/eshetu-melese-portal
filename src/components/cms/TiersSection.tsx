'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, ArrowRight, MessageSquareQuote, X, Send, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface TierData {
  id: string;
  name: string;
  priceEtb: number;
  priceUsd: number;
  currency: string;
  description: string;
  perks: string[];
  badgeColor: string;
  isFeatured: boolean;
  ctaText?: string;
}

interface TiersSectionProps {
  config: {
    heading?: string;
    subheading?: string;
    headingAm?: string;
    subheadingAm?: string;
  };
  tiers: TierData[];
}

const TIER_TRANSLATIONS: Record<string, { name?: string; description?: string }> = {
  'Standard Supporter': {
    name: 'መደበኛ ደጋፊ',
    description: 'ለእሸቱ መለሰ ልዩ የዲጂታል ካርድ እና ለይፋዊ የቴሌግራም/ዩቲዩብ የውይይት መድረክ መግቢያ።'
  },
  'VIP Patron': {
    name: 'ቪአይፒ ደጋፊ',
    description: 'የቀጥታ ስርጭት ውይይት፣ ልዩ የቪአይፒ ማህበረሰብ መግቢያ እና ከእሸቱ መለሰ ጋር ቀጥተኛ የጥያቄና መልስ እድል።'
  },
  'Shield of Honor': {
    name: 'የክብር ጋሻ (Shield of Honor)',
    description: 'በክብር እንግድነት የሚደረግ ግብዣ፣ በቪአይፒ መቀመጫ መስተንግዶ እና በፕሮጀክቶች ላይ ቀጥተኛ ተሳትፎ።'
  }
};

const PERK_TRANSLATIONS: Record<string, string> = {
  'High-Res Digital Badge Download': 'ከፍተኛ ጥራት ያለው ይፋዊ የዲጂታል ባጅ ማውረድ',
  'Official Telegram Channel Access': 'ይፋዊ የቴሌግራም ቻናልና ማህበረሰብ መግቢያ',
  'Instant Public QR Verification': 'ፈጣን የQR ኮድ ዲጂታል ማረጋገጫ',
  'Exclusive Live Stream Q&A Access': 'ልዩ የቀጥታ ስርጭት የጥያቄና መልስ ተሳትፎ',
  'Priority Event Entry & Seating': 'በዝግጅቶች ላይ ቅድሚያ የሚሰጥ የመግቢያና የመቀመጫ እድል',
  'VIP Lounge & Meet-and-Greet': 'የቪአይፒ ላውንጅ እና ከእሸቱ መለሰ ጋር የመገናኘት እድል',
  'Lifetime Patron Recognition': 'የዕድሜ ልክ የክብር አባልነት እውቅና',
  'Executive Council Invitation': 'በአመራር ምክር ቤት ስብሰባዎች የመሳተፍ ልዩ ግብዣ'
};

export function TiersSection({ config, tiers }: TiersSectionProps) {
  const { lang, t, branding } = useAppSettings();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setIsContactModalOpen(false);
      setContactName('');
      setContactPhone('');
      setContactEmail('');
      setContactMessage('');
    }, 2500);
  };

  const heading =
    lang === 'am'
      ? config?.headingAm || 'የአባልነት ደረጃዎን ይምረጡ'
      : config?.heading || 'Select Your Membership Tier';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm || 'የማህበረሰባችን አካል በመሆን ልዩ ጥቅማ ጥቅሞችን እና የተረጋገጠ የዲጂታል ካርድ ያግኙ።'
      : config?.subheading ||
        'Choose the tier that reflects your passion and dedication to our global mission. Prices update dynamically from CMS.';

  return (
    <section id="tiers" className="py-20 lg:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400 font-normal">
            {subheading}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => {
            const isFeatured = tier.isFeatured;
            const isShieldOfHonor =
              tier.name.toLowerCase().includes('shield') ||
              tier.name.toLowerCase().includes('honor');

            const localizedTierName =
              lang === 'am' && TIER_TRANSLATIONS[tier.name]?.name
                ? TIER_TRANSLATIONS[tier.name].name!
                : tier.name;

            const localizedDescription =
              lang === 'am' && TIER_TRANSLATIONS[tier.name]?.description
                ? TIER_TRANSLATIONS[tier.name].description!
                : tier.description;

            return (
              <div
                key={tier.id}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all duration-300 ${
                  isFeatured
                    ? 'bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500 shadow-2xl shadow-amber-500/15 lg:-translate-y-2'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 shadow-xl'
                }`}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'ተመራጭ ደረጃ' : 'Most Popular'}</span>
                  </div>
                )}

                <div>
                  {/* Tier Title & Badge Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-slate-100">{localizedTierName}</h3>
                    <span
                      className="w-4 h-4 rounded-full shadow-md"
                      style={{ backgroundColor: tier.badgeColor || '#E5A93C' }}
                    />
                  </div>

                  <p className="text-sm text-slate-400 mb-6 min-h-[40px] leading-relaxed">
                    {localizedDescription}
                  </p>

                  {/* Pricing Display */}
                  <div className="mb-8 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                    {isShieldOfHonor ? (
                      <div className="py-1">
                        <span className="text-2xl font-extrabold text-amber-400 block tracking-wide">
                          {lang === 'am' ? 'ልዩ የክብር ደረጃ' : 'Distinction of Honor'}
                        </span>
                        <span className="text-xs text-slate-400 block mt-1">
                          {lang === 'am' ? 'በቀጥታ በመነጋገር የሚወሰን' : 'Custom VIP Patron Tier'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl font-extrabold text-slate-100 font-mono">
                            {tier.priceEtb.toLocaleString()}
                          </span>
                          <span className="text-amber-400 font-bold text-sm uppercase">ETB</span>
                          {tier.priceUsd > 0 && (
                            <span className="text-slate-400 text-xs ml-auto">
                              (~${tier.priceUsd} USD)
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-400 block mt-1">
                          {lang === 'am' ? 'ይፋዊ የአባልነት መዋጮ' : 'Official Member Contribution'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Perks List */}
                  <div className="space-y-3 mb-8">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                      {lang === 'am' ? 'የተካተቱ ጥቅሞች' : 'Included Privileges'}
                    </p>
                    {Array.isArray(tier.perks) &&
                      tier.perks.map((perk, idx) => {
                        const localizedPerk =
                          lang === 'am' && PERK_TRANSLATIONS[perk]
                            ? PERK_TRANSLATIONS[perk]
                            : perk;
                        return (
                          <div key={idx} className="flex items-start gap-3 text-sm text-slate-300">
                            <div className="mt-0.5 w-4 h-4 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                              <Check className="w-3 h-3" />
                            </div>
                            <span>{localizedPerk}</span>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Registration or Contact CTA */}
                {isShieldOfHonor ? (
                  <button
                    type="button"
                    onClick={() => setIsContactModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
                  >
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>{lang === 'am' ? 'እንነጋገር / ያግኙን' : "Let's Talk / Contact Us"}</span>
                  </button>
                ) : (
                  <Link
                    href={`/register?tier=${tier.id}`}
                    className={`w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl font-bold text-sm transition-all ${
                      isFeatured
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 hover:scale-[1.02]'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700'
                    }`}
                  >
                    <span>
                      {tier.ctaText || (lang === 'am' ? `${tier.name} አባል ይሁኑ` : `Join as ${tier.name}`)}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Shield of Honor / Contact Us VIP Inquiry Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-slate-900 border border-amber-500/40 p-6 sm:p-8 shadow-2xl shadow-amber-500/10">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-100">
                  {lang === 'am' ? 'የክብር ጋሻ (Shield of Honor) ልዩ ግንኙነት' : 'Shield of Honor VIP Inquiry'}
                </h3>
                <p className="text-xs text-amber-400 font-semibold">
                  {lang === 'am' ? 'ከእሸቱ መለሰ ልዩ ቡድን ጋር በቀጥታ ይነጋገሩ' : 'Direct VIP Protocol Desk'}
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-100">
                  {lang === 'am' ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!' : 'Inquiry Received Successfully!'}
                </h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  {lang === 'am'
                    ? 'የእሸቱ መለሰ ፕሮቶኮል አስተባባሪ በአጭር ጊዜ ውስጥ በስልክ ወይም በቴሌግራም ያገኝዎታል። እናመሰግናለን!'
                    : 'Our executive coordination team will contact you shortly via phone or message. Thank you!'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-300 mb-5 leading-relaxed">
                  {lang === 'am'
                    ? 'የክብር ጋሻ አባልነት በከፍተኛ ደረጃ ለሚደግፉ ደጋፊዎች የተዘጋጀ ሲሆን፣ ጥያቄዎን ወይም አስተያየትዎን ከዚህ በታች ያስገቡ፤ የፕሮቶኮል ቡድናችን ያነጋግርዎታል።'
                    : 'The Shield of Honor tier offers bespoke executive recognition, honorary banquet invitations, and direct consultation. Send your inquiry below or reach out directly.'}
                </p>

                {/* Direct Instant Channels */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <a
                    href="https://t.me/eshetumelese"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 hover:bg-sky-500/20 text-xs font-bold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram VIP</span>
                  </a>
                  <a
                    href="tel:+251911234567"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'am' ? 'በቀጥታ ይደውሉ' : 'Direct Call'}</span>
                  </a>
                </div>

                {/* Inquiry Form */}
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={lang === 'am' ? 'ስምዎን ያስገቡ' : 'Your name'}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        {lang === 'am' ? 'ኢሜይል (አማራጭ)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      {lang === 'am' ? 'መልእክት ወይም ጥያቄ' : 'Message / Questions'}
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={lang === 'am' ? 'ስለ ክብር ጋሻ አባልነት ማወቅ የፈለጉትን እዚህ ያካፍሉን...' : 'Inquire about Shield of Honor membership...'}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-95"
                  >
                    {lang === 'am' ? 'ጥያቄዬን ላክ' : 'Submit VIP Inquiry'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
