'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, UserCheck, Search, LayoutDashboard, Languages, Sun, Moon, Menu, X } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

export function NavigationHeader() {
  const { lang, setLang, colorMode, toggleColorMode, branding, t } = useAppSettings();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const displayName = lang === 'am' ? (branding?.siteNameAm || 'እሸቱ መለሰ') : (branding?.siteName || 'ESHETU MELESE');
  const displayTagline = lang === 'am' ? (branding?.taglineAm || 'ይፋዊ የአባላት ፖርታል') : (branding?.tagline || 'Official Member Portal');

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-slate-950/90 border-b border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <Link href="/" className="flex items-center gap-3 group">
          {branding?.logoUrl ? (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <img
                src={branding.logoUrl}
                alt={displayName}
                className="w-full h-full object-contain p-0.5"
              />
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-950" />
            </div>
          )}
          <div>
            <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight text-slate-100 block group-hover:text-amber-400 transition-colors">
              {displayName}
            </span>
            <span className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-500/90 font-medium block">
              {displayTagline}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Large Screens) */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          <Link href="/#about" className="hover:text-amber-500 transition-colors">
            {t('nav.about', 'About', 'ስለ እሸቱ')}
          </Link>
          <Link href="/#charity" className="hover:text-amber-500 transition-colors">
            {t('nav.charity', 'Lmetsdek Charity', 'ለመጽደቅ በጎ አድራጎት')}
          </Link>
          <Link href="/#events" className="hover:text-amber-500 transition-colors">
            {t('nav.events', 'Events', 'ዝግጅቶች')}
          </Link>
          <Link href="/#tiers" className="hover:text-amber-500 transition-colors">
            {t('nav.tiers', 'Tiers & Pricing', 'ደረጃዎችና ዋጋ')}
          </Link>
          <Link href="/membersgallary" className="hover:text-amber-500 transition-colors">
            {t('nav.gallery', 'Members Gallery', 'የአባላት ጋለሪ')}
          </Link>
          <Link href="/#faq" className="hover:text-amber-500 transition-colors">
            {t('nav.faq', 'FAQ', 'ተደጋጋሚ ጥያቄዎች')}
          </Link>
        </nav>

        {/* Action Buttons & Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-bold text-amber-500 transition-colors shadow-sm"
            title="Switch Language (English / አማርኛ)"
            suppressHydrationWarning
          >
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            <span>{mounted ? (lang === 'en' ? 'አማርኛ' : 'EN') : 'አማርኛ'}</span>
          </button>

          {/* Light / Dark Mode Toggle */}
          <button
            type="button"
            onClick={toggleColorMode}
            className="p-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-amber-500 transition-colors shadow-sm"
            title="Toggle Theme"
            suppressHydrationWarning
          >
            {mounted && colorMode === 'light' ? <Moon className="w-4 h-4 text-slate-700" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>

          {/* Verify Card Link (Hidden on smallest mobile, available in drawer) */}
          <Link
            href="/search"
            className="hidden sm:flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold transition-all hover:border-slate-600 shadow-sm"
          >
            <Search className="w-3.5 h-3.5 text-amber-500" />
            <span>{t('nav.verify', 'Verify Card', 'ካርድ አረጋግጥ')}</span>
          </Link>

          {/* Join Now CTA */}
          <Link
            href="/register"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 transition-all hover:scale-[1.02]"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t('nav.joinNow', 'Join Now', 'አባል ይሁኑ')}</span>
          </Link>

          {/* Staff Login */}
          <Link
            href="/admin/login"
            title="Staff CMS Login"
            className="hidden sm:flex p-2 rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-amber-500 transition-colors shadow-sm"
          >
            <LayoutDashboard className="w-4 h-4" />
          </Link>

          {/* Mobile & Tablet Hamburger Toggle Button (visible below lg) */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl border border-slate-700 bg-slate-900/90 text-slate-300 hover:text-amber-400 hover:border-amber-500/50 transition-colors focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile & Tablet Navigation Menu Dropdown / Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              {t('nav.about', 'About', 'ስለ እሸቱ')}
            </Link>
            <Link
              href="/#charity"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              {t('nav.charity', 'Lmetsdek Charity', 'ለመጽደቅ በጎ አድራጎት')}
            </Link>
            <Link
              href="/#events"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              {t('nav.events', 'Events', 'ዝግጅቶች')}
            </Link>
            <Link
              href="/#tiers"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              {t('nav.tiers', 'Tiers & Pricing', 'ደረጃዎችና ዋጋ')}
            </Link>
            <Link
              href="/membersgallary"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              {t('nav.gallery', 'Members Gallery', 'የአባላት ጋለሪ')}
            </Link>
            <Link
              href="/#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              {t('nav.faq', 'FAQ', 'ተደጋጋሚ ጥያቄዎች')}
            </Link>
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-200 hover:text-amber-400 hover:bg-slate-900/80 transition-colors"
            >
              <Search className="w-4 h-4 text-amber-500" />
              <span>{t('nav.verify', 'Verify Card', 'ካርድ አረጋግጥ')}</span>
            </Link>
          </nav>

          <div className="pt-3 border-t border-slate-800/80 flex flex-col gap-2">
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('nav.joinNow', 'Join Now', 'አባል ይሁኑ')}</span>
            </Link>

            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-amber-400 text-xs font-medium"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t('nav.staffLogin', 'Staff / Admin Portal', 'የሰራተኞች / የአድሚን መግቢያ')}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
