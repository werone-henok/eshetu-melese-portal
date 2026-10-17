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
    <section id="tiers" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-5 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 animate-pulse" />
            <span>{lang === 'am' ? 'የአባልነት አማራጮች' : 'Membership Privileges'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier, idx) => {
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
                className={`relative flex flex-col justify-between rounded-3xl p-8 sm:p-9 transition-all duration-300 ${
                  isShieldOfHonor
                    ? 'glass-panel-gold lg:-translate-y-2'
                    : isFeatured
                    ? 'glass-panel-violet lg:-translate-y-3'
                    : 'glass-panel hover:-translate-y-1'
                }`}
              >
                {/* Featured Badge */}
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-500 text-white text-xs font-black uppercase tracking-wider shadow-lg shadow-violet-500/25">
                    <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
                    <span>{lang === 'am' ? 'ተመራጭ ደረጃ' : 'Most Popular'}</span>
                  </div>
                )}

                {isShieldOfHonor && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-slate-950 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? 'የክብር ደረጃ' : 'Exclusive VIP'}</span>
                  </div>
                )}

                <div>
                  {/* Tier Title & Badge Indicator */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white font-display tracking-tight">
                      {localizedTierName}
                    </h3>
                    <div className="relative">
                      <span
                        className="w-4 h-4 rounded-full block shadow-md"
                        style={{ backgroundColor: tier.badgeColor || '#E5A93C' }}
                      />
                      <span
                        className="absolute inset-0 rounded-full animate-ping opacity-40"
                        style={{ backgroundColor: tier.badgeColor || '#E5A93C' }}
                      />
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 dark:text-slate-300/90 mb-7 min-h-[44px] leading-relaxed font-sans">
                    {localizedDescription}
                  </p>

                  {/* Pricing Display */}
                  <div
                    className={`mb-8 p-5 rounded-2xl border transition-colors ${
                      isShieldOfHonor
                        ? 'bg-amber-100/70 dark:bg-amber-950/20 border-amber-500/30'
                        : isFeatured
                        ? 'bg-violet-100/70 dark:bg-violet-950/25 border-violet-500/30'
                        : 'bg-slate-100/80 dark:bg-slate-950/50 border-slate-200 dark:border-white/5'
                    }`}
                  >
                    {isShieldOfHonor ? (
                      <div className="py-1">
                        <span className="text-2xl font-black text-gradient-gold block tracking-wide font-display">
                          {lang === 'am' ? 'ልዩ የክብር ደረጃ' : 'Distinction of Honor'}
                        </span>
                        <span className="text-xs text-amber-800 dark:text-amber-200/80 block mt-1 font-medium">
                          {lang === 'am' ? 'በቀጥታ በመነጋገር የሚወሰን' : 'Executive Patron Tier'}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline gap-2">
                          <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                            {tier.priceEtb.toLocaleString()}
                          </span>
                          <span className="text-amber-600 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">ETB</span>
                          {tier.priceUsd > 0 && (
                            <span className="text-slate-500 dark:text-slate-400 text-xs ml-auto font-mono">
                              (~${tier.priceUsd} USD)
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 block mt-1.5 font-medium">
                          {lang === 'am' ? 'ይፋዊ የአባልነት መዋጮ' : 'Official Member Contribution'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Perks List */}
                  <div className="space-y-3.5 mb-8">
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                      {lang === 'am' ? 'የተካተቱ ጥቅሞች' : 'Included Privileges'}
                    </p>
                    {Array.isArray(tier.perks) &&
                      tier.perks.map((perk, pIdx) => {
                        const localizedPerk =
                          lang === 'am' && PERK_TRANSLATIONS[perk]
                            ? PERK_TRANSLATIONS[perk]
                            : perk;
                        return (
                          <div key={pIdx} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
                            <div
                              className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                isFeatured
                                  ? 'bg-violet-500/15 text-violet-600 dark:text-violet-400'
                                  : isShieldOfHonor
                                  ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                                  : 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[2.5]" />
                            </div>
                            <span className="leading-snug">{localizedPerk}</span>
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
                    className="w-full btn-luxury-gold flex items-center justify-center gap-2 py-4 px-6 text-sm cursor-pointer"
                  >
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>{lang === 'am' ? 'እንነጋገር / ያግኙን' : "Let's Talk / Contact Us"}</span>
                  </button>
                ) : isFeatured ? (
                  <Link
                    href={`/register?tier=${tier.id}`}
                    className="w-full btn-luxury-violet flex items-center justify-center gap-2 py-4 px-6 text-sm"
                  >
                    <span>
                      {tier.ctaText || (lang === 'am' ? `${tier.name} አባል ይሁኑ` : `Join as ${tier.name}`)}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    href={`/register?tier=${tier.id}`}
                    className="w-full btn-luxury-ghost flex items-center justify-center gap-2 py-4 px-6 text-sm"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 dark:bg-[#0B0F19]/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl glass-panel-gold p-6 sm:p-8 shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-glow-gold">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white font-display">
                  {lang === 'am' ? 'የክብር ጋሻ (Shield of Honor) ልዩ ግንኙነት' : 'Shield of Honor VIP Inquiry'}
                </h3>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
                  {lang === 'am' ? 'ከእሸቱ መለሰ ልዩ ቡድን ጋር በቀጥታ ይነጋገሩ' : 'Direct VIP Protocol Desk'}
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  {lang === 'am' ? 'መልእክትዎ በተሳካ ሁኔታ ተልኳል!' : 'Inquiry Received Successfully!'}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-xs mx-auto">
                  {lang === 'am'
                    ? 'የእሸቱ መለሰ ፕሮቶኮል አስተባባሪ በአጭር ጊዜ ውስጥ በስልክ ወይም በቴሌግራም ያገኝዎታል። እናመሰግናለን!'
                    : 'Our executive coordination team will contact you shortly via phone or message. Thank you!'}
                </p>
              </div>
            ) : (
              <div>
                <p className="text-xs text-slate-600 dark:text-slate-300 mb-5 leading-relaxed">
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
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 text-xs font-bold transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>Telegram VIP</span>
                  </a>
                  <a
                    href="tel:+251911234567"
                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{lang === 'am' ? 'በቀጥታ ይደውሉ' : 'Direct Call'}</span>
                  </a>
                </div>

                {/* Inquiry Form */}
                <form onSubmit={handleContactSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'am' ? 'ሙሉ ስም' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder={lang === 'am' ? 'ስምዎን ያስገቡ' : 'Your name'}
                      className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'am' ? 'ስልክ ቁጥር' : 'Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="+251 9..."
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        {lang === 'am' ? 'ኢሜይል (አማራጭ)' : 'Email (Optional)'}
                      </label>
                      <input
                        type="email"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        placeholder="email@domain.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      {lang === 'am' ? 'መልእክት ወይም ጥያቄ' : 'Message / Questions'}
                    </label>
                    <textarea
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder={lang === 'am' ? 'ስለ ክብር ጋሻ አባልነት ማወቅ የፈለጉትን እዚህ ያካፍሉን...' : 'Inquire about Shield of Honor membership...'}
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-950/80 border border-slate-300 dark:border-white/10 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full btn-luxury-gold py-3.5 px-4 text-sm cursor-pointer"
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
