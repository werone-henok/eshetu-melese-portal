'use client';

import React, { useEffect, useState, use } from 'react';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import {
  ShieldCheck,
  Download,
  Share2,
  ArrowLeft,
  MessageSquare,
  Send,
  CreditCard,
  Award,
  Printer,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import { DigitalCardCanvas } from '@/components/cards/DigitalCardCanvas';
import { CertificateCanvas } from '@/components/certificate/CertificateCanvas';
import { CertificateTemplateConfig } from '@/lib/certificate-types';
import { useAppSettings } from '@/context/AppSettingsContext';

export default function MemberCardDetailsPage({ params }: { params: Promise<{ code: string }> }) {
  const { lang } = useAppSettings();
  const { code } = use(params);
  const [member, setMember] = useState<any | null>(null);
  const [certificateTemplate, setCertificateTemplate] = useState<CertificateTemplateConfig | null>(null);
  const [activeTab, setActiveTab] = useState<'card' | 'certificate'>('card');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [mRes, cRes] = await Promise.all([
          fetch(`/api/members/search?q=${encodeURIComponent(code)}`),
          fetch('/api/certificate/template'),
        ]);

        const mData = await mRes.json();
        if (mRes.ok && mData.results?.length > 0) {
          setMember(mData.results[0]);
        } else {
          setError(lang === 'am' ? 'የተረጋገጠ የአባልነት ካርድ አልተገኘም።' : 'Verified member pass not found.');
        }

        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.template) {
            setCertificateTemplate(cData.template);
          }
        }
      } catch (err: any) {
        setError(lang === 'am' ? 'የአባልነት መረጃውን መጫን አልተቻለም።' : 'Failed to retrieve membership information.');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [code, lang]);

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const shareTelegram = () => {
    const text = lang === 'am'
      ? `የ${member?.fullName} ይፋዊ የእሸቱ መለሰ / ደንክ ቱዩብ ማረጋገጫን ይመልከቱ:`
      : `Check out ${member?.fullName}'s Official Eshetu Melese / Donkey Tube pass:`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareWhatsApp = () => {
    const text = lang === 'am'
      ? `ይፋዊ የተረጋገጠ የእሸቱ መለሰ / ደንክ ቱዩብ ማረጋገጫ - ${member?.fullName}: ${currentUrl}`
      : `Official Verified Eshetu Melese / Donkey Tube pass for ${member?.fullName}: ${currentUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, '_blank');
  };

  const copyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100">
      <NavigationHeader />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/search"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-amber-600 dark:text-slate-400 dark:hover:text-amber-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{lang === 'am' ? 'ወደ ካርድ ማረጋገጫ ተመለስ' : 'Back to Verification Search'}</span>
        </Link>

        {loading && (
          <div className="text-center py-20 text-slate-500 dark:text-slate-400">
            {lang === 'am' ? 'መረጃው እየተጫነ ነው...' : 'Loading membership details...'}
          </div>
        )}

        {error && (
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center shadow-xl">
            <h2 className="text-xl font-bold text-rose-500 dark:text-rose-400 mb-2">{error}</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {lang === 'am'
                ? `የአባልነት መለያ "${code}" አልተረጋገጠም ወይም አልተገኘም።`
                : `The membership code "${code}" may be pending verification or does not exist.`}
            </p>
          </div>
        )}

        {member && (
          <div className="space-y-10">
            {/* View Switcher: ID Card vs Certificate */}
            <div className="flex items-center justify-center">
              <div className="inline-flex p-1.5 rounded-2xl bg-slate-200/90 dark:bg-slate-800/90 border border-slate-300 dark:border-slate-700 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'card'
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-100'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{lang === 'am' ? 'የአባልነት ዲጂታል ካርድ' : 'Digital ID Card'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('certificate')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    activeTab === 'certificate'
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-100'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>{lang === 'am' ? 'የምስጋና ሰርተፍኬት' : 'Certificate of Acknowledgement'}</span>
                </button>
              </div>
            </div>

            {/* Showcase Container */}
            <div className="rounded-3xl p-6 sm:p-10 bg-white dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800 shadow-xl dark:shadow-2xl backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800 mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                      {activeTab === 'card'
                        ? lang === 'am' ? 'ይፋዊ የተረጋገጠ ባጅ' : 'Official Cryptographic Badge'
                        : lang === 'am' ? 'ይፋዊ የምስጋና ሰርተፍኬት' : 'Official Acknowledgement Certificate'}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
                    {member.fullName}
                  </h1>
                </div>

                <span
                  className="self-start sm:self-auto px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider shadow-md"
                  style={{
                    backgroundColor: `${member.badgeColor || '#D4AF37'}20`,
                    color: member.badgeColor || '#D4AF37',
                    border: `1px solid ${member.badgeColor || '#D4AF37'}40`,
                  }}
                >
                  {member.tierName} {lang === 'am' ? 'አባል' : 'Member'}
                </span>
              </div>

              {/* Render Selected View */}
              {activeTab === 'card' ? (
                <div>
                  <div className="max-w-2xl mx-auto">
                    <DigitalCardCanvas
                      member={member}
                      template={member.template}
                      fallbackImageUrl={member.generatedBadgeUrl}
                    />
                  </div>

                  {/* Card Download Buttons */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4">
                    <a
                      href={`/api/cards/download/${encodeURIComponent(member.membershipCode)}`}
                      download={`Eshetu-Melese-Card-${member.membershipCode}.png`}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      <span>{lang === 'am' ? 'ካርዱን በከፍተኛ ጥራት (PNG) አውርድ' : 'Download ID Card (PNG)'}</span>
                    </a>

                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all"
                    >
                      <Share2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>
                        {copied
                          ? lang === 'am' ? 'ሊንኩ ተገልብጧል!' : 'Link Copied!'
                          : lang === 'am' ? 'የካርዱን ሊንክ ገልብጥ' : 'Copy Pass Link'}
                      </span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="max-w-3xl mx-auto">
                    <CertificateCanvas
                      member={member}
                      template={certificateTemplate}
                    />
                  </div>

                  {/* Certificate Download & Print Buttons */}
                  <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-center gap-4">
                    {/* PNG Download */}
                    <a
                      href={`/api/certificate/download/${encodeURIComponent(member.membershipCode)}`}
                      download={`DonkeyTube-Certificate-${member.membershipCode}.png`}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
                    >
                      <Download className="w-4 h-4" />
                      <span>
                        {lang === 'am' ? 'ሰርተፍኬቱን በከፍተኛ ጥራት (PNG) አውርድ' : 'Download Certificate (PNG)'}
                      </span>
                    </a>

                    {/* PDF / Print View */}
                    <Link
                      href={`/card/${encodeURIComponent(member.membershipCode)}/certificate/print`}
                      target="_blank"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 font-bold text-sm shadow-lg transition-all hover:scale-105"
                    >
                      <Printer className="w-4 h-4" />
                      <span>
                        {lang === 'am' ? 'ሰርተፍኬቱን አትም / በPDF አስቀምጥ' : 'Print / Save Certificate (PDF)'}
                      </span>
                    </Link>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={copyLink}
                      className="flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-sm font-semibold transition-all"
                    >
                      <Share2 className="w-4 h-4 text-amber-500 dark:text-amber-400" />
                      <span>
                        {copied
                          ? lang === 'am' ? 'ሊንኩ ተገልብጧል!' : 'Link Copied!'
                          : lang === 'am' ? 'ሊንክ ገልብጥ' : 'Copy Link'}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Social Share Box */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-lg text-center">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
                {lang === 'am' ? 'ማረጋገጫዎን በማህበራዊ ሚዲያ ያጋሩ' : 'Share Official Pass & Certificate On Social Media'}
              </h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={shareTelegram}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#229ED9]/20 hover:bg-[#229ED9]/30 text-[#229ED9] border border-[#229ED9]/30 font-semibold text-xs transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Telegram</span>
                </button>

                <button
                  type="button"
                  onClick={shareWhatsApp}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 text-[#25D366] border border-[#25D366]/30 font-semibold text-xs transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={shareFacebook}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/30 text-[#1877F2] border border-[#1877F2]/30 font-semibold text-xs transition-all"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Facebook</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
