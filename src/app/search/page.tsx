'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import { Search, ShieldCheck, Download, Share2, AlertCircle, Loader2, Award, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { DigitalCardCanvas } from '@/components/cards/DigitalCardCanvas';
import { useAppSettings } from '@/context/AppSettingsContext';

function SearchComponent() {
  const { lang, t } = useAppSettings();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;
    setError(null);
    setLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/members/search?q=${encodeURIComponent(searchTerm.trim())}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || (lang === 'am' ? 'ፍለጋው አልተሳካም' : 'Search failed'));
      }

      setResults(data.results || []);
    } catch (err: any) {
      setError(err.message || (lang === 'am' ? 'አባላትን መፈለግ አልተቻለም።' : 'Failed to search members.'));
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{lang === 'am' ? 'ይፋዊ የአባላት ማረጋገጫ' : 'Official Public Verification'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-100 tracking-tight">
          {lang === 'am' ? 'የአባልነት ካርድ ያረጋግጡ' : 'Verify Membership Pass'}
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base">
          {lang === 'am'
            ? 'ትክክለኛነቱን ለማረጋገጥ ስልክ ቁጥር፣ የአባልነት መለያ (ID) ወይም ሙሉ ስም ያስገቡ።'
            : 'Search by Phone Number (with or without +251), Membership Code, or Full Name to verify credentials.'}
        </p>
      </div>

      {/* Search Input Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto mb-12">
        <div className="relative flex items-center rounded-2xl border-2 border-slate-700 bg-slate-900/90 shadow-2xl focus-within:border-amber-400 transition-all p-1.5">
          <Search className="w-5 h-5 text-slate-400 ml-3.5" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={
              lang === 'am'
                ? 'ለምሳሌ፡ 0911234567፣ +251911234567፣ EM-2026-0001 ወይም አበበ'
                : 'e.g. 0911234567, +251911234567, EM-2026-0001, or Abebe'
            }
            className="flex-1 bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 text-base focus:outline-none"
            suppressHydrationWarning
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-sm shadow-md transition-all shrink-0"
            suppressHydrationWarning
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (lang === 'am' ? 'ፈልግ' : 'Search')}
          </button>
        </div>
      </form>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm text-center">
          {error}
        </div>
      )}

      {/* Search Results */}
      {hasSearched && !loading && results.length === 0 && !error && (
        <div className="max-w-lg mx-auto text-center p-8 rounded-3xl bg-slate-900/60 border border-slate-800">
          <AlertCircle className="w-10 h-10 text-amber-500/80 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-200">
            {lang === 'am' ? 'የተረጋገጠ አባል አልተገኘም' : 'No Verified Member Found'}
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            {lang === 'am'
              ? `በ"${query}" የተረጋገጠ የአባልነት መረጃ ማግኘት አልተቻለም። በቅርቡ የተመዘገቡ ከሆነ፣ የክፍያ ማረጋገጫ ከ1 እስከ 12 ሰዓታት እንደሚወስድ እንገልጻለን።`
              : `We could not find an approved membership with "${query}". If you recently registered, please note that payment verification takes 1-12 hours.`}
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {results.map((member) => (
            <div
              key={member.membershipCode}
              className="rounded-3xl p-6 bg-slate-900/90 border border-slate-800 shadow-2xl hover:border-amber-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                      {lang === 'am' ? 'የተረጋገጠ አባል' : 'Verified Member'}
                    </span>
                  </div>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase"
                    style={{
                      backgroundColor: `${member.badgeColor || '#D4AF37'}20`,
                      color: member.badgeColor || '#D4AF37',
                    }}
                  >
                    {member.tierName}
                  </span>
                </div>

                {/* Badge Image / Interactive Studio Design Canvas */}
                <div className="my-6">
                  <DigitalCardCanvas
                    member={member}
                    template={member.template}
                    fallbackImageUrl={member.generatedBadgeUrl}
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-slate-100">{member.fullName}</h3>
                  <p className="font-mono text-xs text-amber-400 font-semibold">
                    ID: {member.membershipCode} &bull; {member.country}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
                <Link
                  href={`/card/${member.membershipCode}`}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                >
                  <span>{lang === 'am' ? 'ሙሉ ካርዱን ይመልከቱ' : 'Open Full Card'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                {member.generatedBadgeUrl && (
                  <a
                    href={member.generatedBadgeUrl}
                    download={`Badge-${member.membershipCode}.png`}
                    className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all border border-slate-700"
                    title={lang === 'am' ? 'ካርዱን ያውርዱ' : 'Download Badge PNG'}
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100">
      <NavigationHeader />
      <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading search...</div>}>
        <SearchComponent />
      </Suspense>
    </div>
  );
}
