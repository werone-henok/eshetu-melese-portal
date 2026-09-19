'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import {
  Search,
  ShieldCheck,
  Download,
  Printer,
  Share2,
  AlertCircle,
  Loader2,
  Award,
  ExternalLink,
  Users,
  Filter,
  Sparkles,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { DigitalCardCanvas } from '@/components/cards/DigitalCardCanvas';
import { useAppSettings } from '@/context/AppSettingsContext';

function GalleryContent() {
  const { lang, t } = useAppSettings();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTier, setActiveTier] = useState<string>('ALL');
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [downloadingCode, setDownloadingCode] = useState<string | null>(null);
  const [printingCode, setPrintingCode] = useState<string | null>(null);

  // Download Card as High-Res PNG
  const handleDownloadCard = async (member: any) => {
    setDownloadingCode(member.membershipCode);
    try {
      // Use direct streaming download endpoint which automatically generates high-res badge if needed
      const downloadUrl = `/api/cards/download/${encodeURIComponent(member.membershipCode)}`;
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `Eshetu-Melese-Card-${member.membershipCode}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error('Download failed:', e);
      window.open(`/api/cards/download/${encodeURIComponent(member.membershipCode)}`, '_blank');
    } finally {
      setTimeout(() => setDownloadingCode(null), 1200);
    }
  };

  // Print Card Directly
  const handlePrintCard = (member: any) => {
    setPrintingCode(member.membershipCode);
    try {
      const cardEl = document.getElementById(`gallery-card-${member.membershipCode}`);
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (!printWindow) {
        window.print();
        return;
      }

      const cardHtml = cardEl ? cardEl.outerHTML : '';
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Official Digital Card - ${member.fullName} (${member.membershipCode})</title>
            <style>
              @page {
                size: auto;
                margin: 15mm;
              }
              *, *::before, *::after {
                box-sizing: border-box;
              }
              body {
                margin: 0;
                padding: 24px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                background: #ffffff;
                color: #000000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 90vh;
              }
              .print-container {
                max-width: 650px;
                width: 100%;
                text-align: center;
              }
              .header {
                margin-bottom: 24px;
              }
              .header h2 {
                margin: 0 0 6px 0;
                font-size: 24px;
                font-weight: 800;
                color: #0f172a;
              }
              .header p {
                margin: 0;
                font-size: 13px;
                color: #64748b;
              }
              .card-wrapper {
                width: 100%;
                max-width: 580px;
                margin: 0 auto 24px auto;
                border-radius: 24px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.18);
                background: #0f172a;
              }
              .card-wrapper img {
                width: 100%;
                height: auto;
                display: block;
              }
              /* Digital Card Canvas Standalone Styling for Print */
              .digital-card-canvas {
                position: relative !important;
                width: 100% !important;
                overflow: hidden !important;
                border-radius: 24px !important;
                background-size: cover !important;
                background-position: center !important;
                border: 2px solid #f59e0b !important;
                box-sizing: border-box !important;
              }
              .card-dynamic-layer {
                position: absolute !important;
                box-sizing: border-box !important;
              }
              .card-dynamic-layer img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                display: block !important;
              }
              .footer {
                margin-top: 16px;
                font-size: 12px;
                color: #94a3b8;
              }
              @media print {
                body {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>

          </head>
          <body>
            <div class="print-container">
              <div class="header">
                <h2>Eshetu Melese Official Community Portal</h2>
                <p>Verified Digital Membership Pass &bull; ${member.tierName} Tier &bull; Code: ${member.membershipCode}</p>
              </div>
              <div class="card-wrapper">
                ${
                  member.generatedBadgeUrl
                    ? `<img src="${member.generatedBadgeUrl}" alt="${member.fullName} Pass" />`
                    : cardHtml
                }
              </div>
              <div class="footer">
                Verified Cryptographic Badge &bull; comedianeshetu.com &bull; Scan QR Code to Verify
              </div>
            </div>
            <script>
              window.onload = function() {
                window.focus();
                window.print();
                setTimeout(function() { window.close(); }, 500);
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (e) {
      console.error('Print failed:', e);
      window.print();
    } finally {
      setTimeout(() => setPrintingCode(null), 1000);
    }
  };

  // Fetch initial members or execute search
  const fetchMembers = async (searchTerm: string = '') => {
    setSearching(true);
    try {
      const url = searchTerm.trim()
        ? `/api/members/search?q=${encodeURIComponent(searchTerm.trim())}`
        : `/api/members/search`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.results || []);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchMembers(initialQuery);
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers(query);
  };

  // Extract tiers for filter chips
  const tiers = React.useMemo(() => {
    const list = Array.from(new Set(members.map((m) => m.tierName).filter(Boolean)));
    return ['ALL', ...list];
  }, [members]);

  // Filtered members by tier
  const filtered = React.useMemo(() => {
    if (activeTier === 'ALL') return members;
    return members.filter((m) => m.tierName?.toLowerCase() === activeTier.toLowerCase());
  }, [members, activeTier]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Award className="w-3.5 h-3.5" />
          <span>{t('gallery.badge', 'Official Community Registry', 'ይፋዊ የአባላት መዝገብ')}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
          {t('gallery.title', 'Members Gallery & Digital Passes', 'የአባላት ጋለሪ እና ዲጂታል ካርዶች')}
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          {t(
            'gallery.desc',
            'Explore the community directory of verified patrons and fans. Search below using your name, phone number, email address, or membership code.',
            'የተረጋገጡ የክብር አባላትን ካርዶች እዚህ ይመልከቱ። ስም፣ ስልክ ቁጥር፣ ኢሜይል ወይም የአባልነት መለያ በማስገባት ካርድዎን በቀላሉ ያግኙ።'
          )}
        </p>
      </div>

      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto mb-10">
        <form onSubmit={handleSearchSubmit} className="relative" suppressHydrationWarning>
          <div className="flex items-center bg-slate-900/90 border-2 border-slate-700 hover:border-amber-500/50 focus-within:border-amber-400 rounded-2xl p-2 shadow-2xl transition-all">
            <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t(
                'gallery.searchPlaceholder',
                'Search by Full Name, Phone Number, Email, or Member Code...',
                'በስም፣ በስልክ ቁጥር፣ በኢሜይል ወይም በካርድ መለያ ይፈልጉ...'
              )}
              className="w-full px-4 py-2.5 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
              suppressHydrationWarning
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  fetchMembers('');
                }}
                className="text-xs text-slate-400 hover:text-slate-200 px-2"
                suppressHydrationWarning
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              disabled={searching}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md transition-all shrink-0 flex items-center gap-1.5"
              suppressHydrationWarning
            >
              {searching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>{t('gallery.searchBtn', 'Search', 'ፈልግ')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Tier Filter Tabs */}
        {tiers.length > 1 && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {tiers.map((tier) => (
              <button
                key={tier}
                type="button"
                onClick={() => setActiveTier(tier)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  activeTier === tier
                    ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                    : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tier === 'ALL' ? t('gallery.allTiers', 'All Tiers', 'ሁሉም ደረጃዎች') : tier}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 text-amber-400 animate-spin mx-auto mb-3" />
          <p className="text-sm text-slate-400">
            {lang === 'am' ? 'የተረጋገጡ የአባላት ዲጂታል ካርዶች እየተጫኑ ነው...' : 'Loading verified member digital cards...'}
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="max-w-md mx-auto text-center py-16 px-6 rounded-3xl bg-slate-900/60 border border-slate-800">
          <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">
            {lang === 'am' ? 'ምንም አባል አልተገኘም' : 'No Members Found'}
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            {lang === 'am'
              ? `በ"${query}" የተገኘ አባል የለም። እባክዎ ስልክ ቁጥርዎን፣ ስምዎን ወይም ኢሜይልዎን በሌላ የፊደል አጻጻፍ ይሞክሩ።`
              : `We couldn't find any verified member matching "${query}". Try searching with an alternate phone number, name spelling, or email.`}
          </p>
        </div>
      ) : (
        /* Member Card Gallery Grid */
        <div>
          <div className="flex items-center justify-between mb-6 text-xs text-slate-400 px-2 font-medium">
            <span>
              {lang === 'am' ? (
                <>
                  <strong className="text-slate-200">{filtered.length}</strong> ይፋዊ የአባላት ዲጂታል ካርዶች እየታዩ ነው
                </>
              ) : (
                <>
                  Showing <strong className="text-slate-200">{filtered.length}</strong> official member digital passes
                </>
              )}
            </span>
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              {lang === 'am' ? 'የተረጋገጠ ዲጂታል ካርድ' : 'Cryptographically Verified'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((member) => (
              <div
                key={member.membershipCode}
                className="group flex flex-col justify-between p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
              >
                {/* Top Info Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                      {lang === 'am' ? 'የተረጋገጠ' : 'Verified'}
                    </span>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase"
                    style={{
                      backgroundColor: `${member.badgeColor || '#D4AF37'}25`,
                      color: member.badgeColor || '#D4AF37',
                      border: `1px solid ${member.badgeColor || '#D4AF37'}40`,
                    }}
                  >
                    {member.tierName}
                  </span>
                </div>

                {/* Published Digital Card Canvas from Studio */}
                <div id={`gallery-card-${member.membershipCode}`} className="w-full my-1">
                  <DigitalCardCanvas
                    id={`canvas-el-${member.membershipCode}`}
                    member={member}
                    template={member.template}
                    fallbackImageUrl={member.generatedBadgeUrl}
                  />
                </div>

                {/* Card Quick Action Toolbar: Download, Print & Details */}
                <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-100 line-clamp-1">{member.fullName}</h3>
                      <p className="font-mono text-[11px] text-amber-400 font-semibold mt-0.5">
                        {member.membershipCode}
                      </p>
                    </div>

                    <Link
                      href={`/card/${member.membershipCode}`}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 font-bold text-xs transition-all shrink-0"
                    >
                      <span>{lang === 'am' ? 'ዝርዝር' : 'Details'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* Dedicated Download & Print Buttons for Each Card */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleDownloadCard(member)}
                      disabled={downloadingCode === member.membershipCode}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/10 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                      title={lang === 'am' ? 'ካርዱን አውርድ (PNG)' : 'Download Card (PNG)'}
                    >
                      {downloadingCode === member.membershipCode ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      <span>{lang === 'am' ? 'አውርድ' : 'Download'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handlePrintCard(member)}
                      disabled={printingCode === member.membershipCode}
                      className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700/80 font-bold text-xs shadow-sm transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                      title={lang === 'am' ? 'ካርዱን አትም' : 'Print Card'}
                    >
                      {printingCode === member.membershipCode ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Printer className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{lang === 'am' ? 'አትም' : 'Print'}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function MembersGalleryPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      <NavigationHeader />
      <main>
        <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading members gallery...</div>}>
          <GalleryContent />
        </Suspense>
      </main>
    </div>
  );
}
