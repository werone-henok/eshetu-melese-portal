'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldCheck,
  UserCheck,
  Search,
  LayoutDashboard,
  Languages,
  Sun,
  Moon,
  Menu,
  X,
  Sparkles,
  Building2,
  Film,
  Users,
  ChevronDown,
  ArrowRight,
  HelpCircle,
  Calendar,
  Heart,
  Award,
} from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

export function NavigationHeader() {
  const { lang, setLang, colorMode, toggleColorMode, branding, t } = useAppSettings();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setIsScrolled(window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMoreDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayName =
    lang === 'am' ? branding?.siteNameAm || 'እሸቱ መለሰ' : branding?.siteName || 'ESHETU MELESE';
  const displayTagline =
    lang === 'am' ? branding?.taglineAm || 'ይፋዊ ፖርታል' : branding?.tagline || 'Official Portal';

  // Core navigation items - strictly single word labels in English & Amharic
  const primaryNavItems = [
    {
      href: '/#about',
      labelEn: 'About',
      labelAm: 'ስለ',
      icon: Sparkles,
      active: pathname === '/' && false, // Anchor link
    },
    {
      href: '/#charity',
      labelEn: 'Charity',
      labelAm: 'ለመጽደቅ',
      icon: Heart,
      active: false,
    },
    {
      href: '/#events',
      labelEn: 'Events',
      labelAm: 'ዝግጅቶች',
      icon: Calendar,
      active: false,
    },
    {
      href: '/#tiers',
      labelEn: 'Tiers',
      labelAm: 'ደረጃዎች',
      icon: Award,
      active: false,
    },
    {
      href: '/gallery',
      labelEn: 'Media',
      labelAm: 'ሚዲያ',
      icon: Film,
      badge: 'Dubai',
      active: pathname === '/gallery',
    },
  ];

  const secondaryNavItems = [
    {
      href: '/membersgallary',
      labelEn: 'Members',
      labelAm: 'አባላት',
      icon: Users,
      descEn: 'Verified passes directory',
      descAm: 'የተረጋገጡ አባላት መዝገብ',
      active: pathname === '/membersgallary',
    },
    {
      href: '/marketing',
      labelEn: 'Profile',
      labelAm: 'መገለጫ',
      icon: Building2,
      descEn: 'Official company dossier',
      descAm: 'የድርጅት ይፋዊ መገለጫ',
      active: pathname === '/marketing',
    },
    {
      href: '/#faq',
      labelEn: 'FAQ',
      labelAm: 'ጥያቄዎች',
      icon: HelpCircle,
      descEn: 'Frequently asked questions',
      descAm: 'ተደጋጋሚ የጋራ ጥያቄዎች',
      active: false,
    },
  ];

  const allNavItems = [...primaryNavItems, ...secondaryNavItems];

  return (
    <>
      {/* Top Edge-to-Edge Scroll Fade Curtain: Smoothly fades any scrolling content behind and above the navbar */}
      <div
        className={`fixed top-0 inset-x-0 h-28 sm:h-36 pointer-events-none z-40 bg-gradient-to-b from-slate-50 via-slate-50/95 to-transparent dark:from-[#0B0F19] dark:via-[#0B0F19]/95 dark:to-transparent transition-opacity duration-300 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`}
        aria-hidden="true"
      />

      <header className="sticky top-2 sm:top-4 z-50 w-full px-3 sm:px-6 transition-all duration-300">
        {/* Floating Dynamic Island Container */}
        <div
          className={`max-w-7xl mx-auto rounded-2xl sm:rounded-full ${
            isScrolled
              ? 'bg-white/95 dark:bg-[#0B0F19]/95 border-slate-300 dark:border-white/15 shadow-2xl shadow-slate-950/15'
              : 'bg-white/85 dark:bg-[#0B0F19]/85 border-slate-200/90 dark:border-white/10 shadow-xl shadow-slate-950/5'
          } backdrop-blur-2xl border px-3.5 sm:px-6 h-16 sm:h-18 flex items-center justify-between transition-all duration-300`}
        >
          {/* Brand Identity (Left) */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          {branding?.logoUrl ? (
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl overflow-hidden border border-amber-500/30 bg-amber-50 dark:bg-[#0E1526] flex items-center justify-center shadow-md shadow-amber-500/10 group-hover:scale-105 group-hover:border-amber-400 transition-all shrink-0">
              <img src={branding.logoUrl} alt={displayName} className="w-full h-full object-contain p-1" />
            </div>
          ) : (
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-all shrink-0">
              <ShieldCheck className="w-5 h-5 text-slate-950" />
            </div>
          )}
          <div className="hidden xs:block">
            <span className="font-heading font-extrabold text-sm sm:text-base tracking-tight text-slate-900 dark:text-white block group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors leading-tight">
              {displayName}
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-600 dark:text-amber-400/90 font-bold block leading-none mt-0.5">
              {displayTagline}
            </span>
          </div>
        </Link>

        {/* ========================================================================= */}
        {/* TRENDING CENTER NAVIGATION: Modern Floating Pill Dock with Glider Effect  */}
        {/* ========================================================================= */}
        <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.06] rounded-full p-1 shadow-inner backdrop-blur-md">
          {/* Primary single-word items (always visible on desktop) */}
          {primaryNavItems.map((item) => {
            const label = lang === 'am' ? item.labelAm : item.labelEn;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  item.active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10'
                }`}
              >
                <span>{label}</span>
                {item.badge && !item.active && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-300 border border-amber-500/30">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          {/* Wide Desktop View (>= 1280px): Show Members, Profile & FAQ directly */}
          <div className="hidden xl:flex items-center gap-1">
            {secondaryNavItems.map((item) => {
              const label = lang === 'am' ? item.labelAm : item.labelEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-3 xl:px-3.5 py-1.5 rounded-full text-xs xl:text-[13px] font-semibold tracking-tight whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    item.active
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10'
                  }`}
                >
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Compact Desktop View (1024px - 1279px): Trending "More ▾" Glass Dropdown */}
          <div ref={dropdownRef} className="relative xl:hidden">
            <button
              type="button"
              onClick={() => setMoreDropdownOpen((prev) => !prev)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold tracking-tight whitespace-nowrap transition-all cursor-pointer ${
                moreDropdownOpen
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/10'
              }`}
            >
              <span>{t('nav.more', 'More', 'ተጨማሪ')}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  moreDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Glass Flyout Dropdown Menu */}
            {moreDropdownOpen && (
              <div className="absolute right-0 mt-2.5 w-60 rounded-2xl bg-white/95 dark:bg-[#0E1526]/95 backdrop-blur-2xl border border-slate-200 dark:border-white/10 p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                {secondaryNavItems.map((item) => {
                  const Icon = item.icon;
                  const label = lang === 'am' ? item.labelAm : item.labelEn;
                  const desc = lang === 'am' ? item.descAm : item.descEn;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMoreDropdownOpen(false)}
                      className={`flex items-start gap-3 p-2.5 rounded-xl transition-all ${
                        item.active
                          ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30'
                          : 'hover:bg-slate-100 dark:hover:bg-white/5 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold whitespace-nowrap">{label}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Action Controls & CTA (Right) */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-[11px] font-bold text-amber-600 dark:text-amber-300 transition-all cursor-pointer shadow-sm"
            title="Switch Language (English / አማርኛ)"
            suppressHydrationWarning
          >
            <Languages className="w-3.5 h-3.5 text-amber-500" />
            <span>{mounted ? (lang === 'en' ? 'አማርኛ' : 'EN') : 'አማርኛ'}</span>
          </button>

          {/* Theme Mode Toggle */}
          <button
            type="button"
            onClick={toggleColorMode}
            className="p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-700 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 transition-all cursor-pointer shadow-sm"
            title="Toggle Light/Dark Theme"
            suppressHydrationWarning
          >
            {mounted && colorMode === 'light' ? (
              <Moon className="w-3.5 h-3.5 text-slate-700" />
            ) : (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            )}
          </button>

          {/* Verify Card Pill */}
          <Link
            href="/search"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] hover:border-violet-500/40 text-slate-700 dark:text-slate-200 text-xs font-semibold whitespace-nowrap transition-all shadow-sm"
          >
            <Search className="w-3 h-3 text-violet-500 dark:text-violet-400" />
            <span>{t('nav.verify', 'Verify', 'አረጋግጥ')}</span>
          </Link>

          {/* Primary Join CTA Pill Button */}
          <Link
            href="/register"
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 text-xs font-extrabold shadow-md shadow-amber-500/25 hover:shadow-lg hover:shadow-amber-500/35 transition-all duration-200 hover:scale-[1.03] active:scale-95 whitespace-nowrap"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t('nav.joinNow', 'Join', 'አባል')}</span>
          </Link>

          {/* Staff Login Icon */}
          <Link
            href="/admin/login"
            title="Staff CMS Login"
            className="hidden sm:flex p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] hover:bg-slate-200 dark:hover:bg-white/[0.08] text-slate-600 dark:text-slate-400 hover:text-amber-500 transition-all shadow-sm"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((p) => !p)}
            className="lg:hidden p-2 rounded-full border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.04] text-slate-700 dark:text-slate-200 hover:text-amber-500 transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE FULL-SCREEN FROSTED GLASS DRAWER                                   */}
      {/* ========================================================================= */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-3 top-20 z-50 rounded-3xl bg-white/95 dark:bg-[#0B0F19]/98 backdrop-blur-3xl border border-slate-200 dark:border-white/10 p-5 shadow-2xl animate-in fade-in slide-in-from-top-3 duration-200 max-h-[85vh] overflow-y-auto">
          {/* Mobile Nav Links Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const label = lang === 'am' ? item.labelAm : item.labelEn;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-xs font-bold whitespace-nowrap ${
                    item.active
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                      : 'bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 text-slate-700 dark:text-slate-200 hover:border-amber-400/40 hover:text-amber-500'
                  }`}
                >
                  <Icon className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </div>

          {/* Quick Actions in Mobile Drawer */}
          <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-2">
            <Link
              href="/search"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-3 rounded-2xl bg-violet-500/10 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-bold"
            >
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-violet-500" />
                <span>{t('nav.verify', 'Verify', 'አረጋግጥ')}</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-extrabold text-sm shadow-lg shadow-amber-500/25"
            >
              <UserCheck className="w-4 h-4" />
              <span>{t('nav.joinNow', 'Join', 'አባል ይሁኑ')}</span>
            </Link>

            <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400 hover:text-amber-500 font-medium"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Staff Portal</span>
              </Link>

              <button
                type="button"
                onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
                className="font-bold text-amber-600 dark:text-amber-400 underline underline-offset-4"
              >
                {lang === 'en' ? 'አማርኛ' : 'English'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  </>
);
}
