'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, X, Heart, Globe, ArrowLeft, Tv, Film, Sparkles } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface NetflixHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  myListCount: number;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  totalShowsCount?: number;
}

export function NetflixHeader({
  searchQuery,
  onSearchChange,
  myListCount,
  activeTab = 'all',
  onSelectTab,
  totalShowsCount,
}: NetflixHeaderProps) {
  const pathname = usePathname();
  const { lang, setLang } = useAppSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(Boolean(searchQuery));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', labelEn: 'Home', labelAm: 'ዋና ገጽ' },
    { href: '/shows', labelEn: 'Shows', labelAm: 'ትርኢቶች', isCurrent: pathname === '/shows' },
    { href: '/gallery', labelEn: 'Gallery', labelAm: 'ጋለሪ', isCurrent: pathname === '/gallery' },
    { href: '/membersgallary', labelEn: 'Members', labelAm: 'አባላት' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-400 select-none ${
        isScrolled
          ? 'bg-[#141414]/95 backdrop-blur-md shadow-2xl py-3 border-b border-white/5'
          : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-12 flex items-center justify-between gap-4">
        {/* Left: Netflix Styled Red Brand & Nav Links */}
        <div className="flex items-center gap-6 sm:gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Bold red Netflix typeface styling */}
            <span className="text-2xl sm:text-3xl font-black text-[#E50914] tracking-tighter uppercase font-display drop-shadow">
              ESHETU
            </span>
          </Link>

          {/* Nav Links (Home, Shows, Gallery, My List) */}
          <nav className="hidden sm:flex items-center gap-4 md:gap-5 text-xs sm:text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`transition-colors font-medium ${
                  link.isCurrent
                    ? 'text-white font-bold'
                    : 'text-zinc-300 hover:text-zinc-100'
                }`}
              >
                {lang === 'am' ? link.labelAm : link.labelEn}
              </Link>
            ))}

            {/* My List Filter Tab */}
            {onSelectTab && (
              <button
                type="button"
                onClick={() => onSelectTab(activeTab === 'mylist' ? 'all' : 'mylist')}
                className={`transition-colors font-medium flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'mylist'
                    ? 'text-white font-bold'
                    : 'text-zinc-300 hover:text-zinc-100'
                }`}
              >
                <span>{lang === 'am' ? 'የኔ ዝርዝር' : 'My List'}</span>
                {myListCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                    {myListCount}
                  </span>
                )}
              </button>
            )}
          </nav>
        </div>

        {/* Right: Search Bar, Language Switcher, Back to Portal */}
        <div className="flex items-center gap-3">
          {/* Interactive Search Box */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-black/80 border border-white/40 rounded-full px-3 py-1 text-white shadow-lg animate-in fade-in zoom-in-95 duration-200">
                <Search className="w-4 h-4 text-zinc-400 mr-2 flex-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={lang === 'am' ? 'ፈልግ (ርዕስ፣ ዘውግ)...' : 'Titles, categories...'}
                  className="bg-transparent text-xs text-white placeholder-zinc-400 outline-none w-32 sm:w-48"
                  autoFocus
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
                className="p-2 text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Language Switch */}
          <button
            type="button"
            onClick={() => setLang(lang === 'am' ? 'en' : 'am')}
            className="px-2.5 py-1 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs font-bold transition-colors border border-white/10 flex items-center gap-1.5 cursor-pointer"
            title="Toggle language"
          >
            <Globe className="w-3.5 h-3.5 text-red-500" />
            <span>{lang === 'am' ? 'EN' : 'አማ'}</span>
          </button>

          {/* Profile Avatar Icon with red smile (Iconic Netflix style) */}
          <Link
            href="/"
            title="Return to Main Portal"
            className="w-8 h-8 rounded bg-gradient-to-tr from-amber-500 to-red-600 flex items-center justify-center text-white text-xs font-black shadow-md hover:ring-2 hover:ring-white transition-all overflow-hidden"
          >
            <span className="font-bold text-sm">EM</span>
          </Link>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="sm:hidden flex items-center justify-center gap-5 px-4 pt-2 text-xs border-t border-white/5 mt-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`font-medium ${
              link.isCurrent ? 'text-white font-bold' : 'text-zinc-400'
            }`}
          >
            {lang === 'am' ? link.labelAm : link.labelEn}
          </Link>
        ))}
        {onSelectTab && (
          <button
            type="button"
            onClick={() => onSelectTab(activeTab === 'mylist' ? 'all' : 'mylist')}
            className={`font-medium flex items-center gap-1 ${
              activeTab === 'mylist' ? 'text-white font-bold' : 'text-zinc-400'
            }`}
          >
            <span>{lang === 'am' ? 'የኔ ዝርዝር' : 'My List'}</span>
            {myListCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[9px] font-bold">
                {myListCount}
              </span>
            )}
          </button>
        )}
      </div>
    </header>
  );
}
