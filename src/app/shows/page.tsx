'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Play,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Share2,
  Sparkles,
  Info,
  Tv,
  Film,
  Award,
  Heart,
  TrendingUp,
  Volume2,
  VolumeX,
  Check,
  Flame,
  Clock,
  Layers,
  ArrowRight
} from 'lucide-react';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import { useAppSettings } from '@/context/AppSettingsContext';
import { ALL_SHOWS, SHOW_CATEGORIES, ShowItem, ShowCategory } from '@/data/showsData';

export default function ShowsPage() {
  const { lang, t } = useAppSettings();

  // State
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedVideo, setSelectedVideo] = useState<ShowItem | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [heroIndex, setHeroIndex] = useState<number>(0);

  // Top featured billboard shows
  const featuredShows = useMemo(() => {
    return [
      ALL_SHOWS[0], // Amazing kids - Mesud
      ALL_SHOWS[5], // Gash Eshetu
      ALL_SHOWS[11], // Standup / Corporate
      ALL_SHOWS[27], // Standup comedy
      ALL_SHOWS[44]  // Best productions
    ].filter(Boolean);
  }, []);

  const currentHero = featuredShows[heroIndex] || ALL_SHOWS[0];

  // Rotate billboard every 10 seconds if no video modal is active
  useEffect(() => {
    if (selectedVideo) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % featuredShows.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [featuredShows.length, selectedVideo]);

  // Filter shows by category and search
  const filteredShows = useMemo(() => {
    return ALL_SHOWS.filter((show) => {
      const matchesCategory =
        activeCategory === 'all' || show.categorySlug === activeCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        show.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        show.categoryLabelAm.includes(searchQuery);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Group shows by category for row carousels
  const groupedByCategory = useMemo(() => {
    const map: Record<string, ShowItem[]> = {};
    for (const cat of SHOW_CATEGORIES) {
      map[cat.slug] = ALL_SHOWS.filter((s) => s.categorySlug === cat.slug);
    }
    return map;
  }, []);

  // Copy video link handler
  const handleShare = (video: ShowItem) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(video.url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  // Keyboard escape to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedVideo(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <NavigationHeader />

      {/* ======================================================== */}
      {/* 1. NETFLIX-STYLE BILLBOARD HERO BANNER                  */}
      {/* ======================================================== */}
      <section className="relative w-full min-h-[580px] sm:min-h-[680px] flex items-end pb-16 sm:pb-24 pt-24 overflow-hidden">
        {/* Cinematic Backdrop Image with Blur and Gradient */}
        <div className="absolute inset-0 z-0">
          <img
            key={currentHero.id}
            src={currentHero.maxResThumbnailUrl}
            alt={currentHero.title}
            className="w-full h-full object-cover object-center filter brightness-60 scale-105 transition-all duration-1000 ease-out"
          />
          {/* Multi-layered Netflix Vignette: Dark Bottom, Dark Left, Dark Top */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#07090E] via-[#07090E]/80 to-transparent max-w-4xl" />
          <div className="absolute inset-0 bg-radial from-transparent via-transparent to-[#07090E]/80" />
        </div>

        {/* Billboard Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl space-y-4 sm:space-y-6">
            {/* Netflix-style Top Badge */}
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-red-600/30">
                <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
                DONKEY TUBE ORIGINAL
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-amber-400 font-extrabold text-xs border border-white/10">
                {currentHero.badge}
              </span>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                Full Episode
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md">
              {currentHero.title}
            </h1>

            {/* Category Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 font-medium leading-relaxed drop-shadow line-clamp-3">
              {lang === 'am'
                ? `በኮሜዲያን እሸቱ መለሰ የተዘጋጀው ታዋቂው የ"${currentHero.categoryLabelAm}" ተከታታይ ዝግጅት። አሁኑኑ በቀጥታ ይመልከቱ!`
                : `Premier entertainment from Donkey Tube Media Group. Part of the acclaimed "${currentHero.categoryLabel}" series hosted by Comedian Eshetu Melese.`}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 pt-2 flex-wrap">
              <button
                type="button"
                onClick={() => setSelectedVideo(currentHero)}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Play className="w-5 h-5 fill-slate-950" />
                <span>{lang === 'am' ? 'አሁን ይመልከቱ' : 'Play Episode'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShare(currentHero)}
                className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base backdrop-blur-md border border-white/20 flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                {isCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'am' ? 'ሊንኩ ተቀድቷል!' : 'Link Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>{lang === 'am' ? 'አጋራ' : 'Share'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Billboard Carousel Dots */}
        <div className="absolute right-4 sm:right-8 bottom-6 z-20 flex items-center gap-2">
          {featuredShows.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setHeroIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                heroIndex === idx ? 'w-8 bg-amber-500' : 'w-2 bg-white/30 hover:bg-white/60'
              }`}
              aria-label={`Featured Slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. STICKY SUB-BAR: SEARCH & CATEGORY PILLS              */}
      {/* ======================================================== */}
      <div className="sticky top-20 z-30 bg-[#07090E]/90 backdrop-blur-2xl border-y border-white/10 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto scrollbar-none pb-1 md:pb-0">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                activeCategory === 'all'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
              }`}
            >
              {lang === 'am' ? `ሁሉም (${ALL_SHOWS.length})` : `All Shows (${ALL_SHOWS.length})`}
            </button>

            {SHOW_CATEGORIES.map((cat) => {
              const count = groupedByCategory[cat.slug]?.length || 0;
              const isSelected = activeCategory === cat.slug;
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-white/5 text-slate-400 border-white/10 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <span>{lang === 'am' ? cat.labelAm : cat.labelEn}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-72 shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'am' ? 'ቪዲዮዎችን ይፈልጉ...' : 'Search 60+ shows...'}
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. SHOWS CATALOG: NETFLIX-STYLE ROWS OR SEARCH RESULTS   */}
      {/* ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-14">
        {/* When searching or filtering a single category, show as grid */}
        {searchQuery.trim() || activeCategory !== 'all' ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  {searchQuery.trim()
                    ? `${lang === 'am' ? 'የፍለጋ ውጤቶች' : 'Search Results'} (${filteredShows.length})`
                    : `${
                        lang === 'am'
                          ? SHOW_CATEGORIES.find((c) => c.slug === activeCategory)?.labelAm
                          : SHOW_CATEGORIES.find((c) => c.slug === activeCategory)?.labelEn
                      } (${filteredShows.length})`}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {lang === 'am'
                    ? 'በኮሜዲያን እሸቱ መለሰ የተዘጋጁ ይፋዊ የቪዲዮ ስራዎች'
                    : 'Official episodes streaming directly from Donkey Tube'}
                </p>
              </div>

              {(searchQuery || activeCategory !== 'all') && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="text-xs text-amber-400 hover:underline font-bold"
                >
                  {lang === 'am' ? 'ሁሉንም አሳይ' : 'Reset Filters'}
                </button>
              )}
            </div>

            {filteredShows.length === 0 ? (
              <div className="py-20 text-center space-y-3 rounded-2xl bg-white/5 border border-white/10">
                <Tv className="w-10 h-10 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white">
                  {lang === 'am' ? 'ምንም ቪዲዮ አልተገኘም' : 'No shows found'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'am' ? 'እባክዎ ሌላ ቃል ሞክረው ይፈልጉ' : 'Try adjusting your search query'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                {filteredShows.map((show) => (
                  <NetflixCard key={show.uniqueId} show={show} onSelect={() => setSelectedVideo(show)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Default: Full Netflix Catalog with Horizontal Scrollable Rows */
          SHOW_CATEGORIES.map((cat) => {
            const showsInCat = groupedByCategory[cat.slug] || [];
            if (showsInCat.length === 0) return null;

            return (
              <NetflixRowSection
                key={cat.slug}
                category={cat}
                shows={showsInCat}
                onSelect={(show) => setSelectedVideo(show)}
                lang={lang}
              />
            );
          })
        )}
      </main>

      {/* ======================================================== */}
      {/* 4. CINEMA VIDEO PLAYER MODAL                             */}
      {/* ======================================================== */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-200"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-[#0E131F] border border-white/15 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Modal Bar */}
            <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900/90 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                  {selectedVideo.categoryLabel}
                </span>
                <span className="text-slate-500 text-xs">•</span>
                <span className="text-xs text-slate-400 font-semibold">{selectedVideo.author}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleShare(selectedVideo)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Copy video link"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                </button>
                <a
                  href={selectedVideo.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Watch on YouTube"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-rose-500 hover:text-white text-slate-400 transition-colors"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Embedded 16:9 Video Player */}
            <div className="relative w-full aspect-video bg-black shrink-0">
              <iframe
                src={selectedVideo.embedUrl}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>

            {/* Modal Bottom Metadata & Next Up Playlist */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <h3 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {selectedVideo.title}
                </h3>
                <span className="self-start sm:self-center px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-xs whitespace-nowrap">
                  {selectedVideo.badge}
                </span>
              </div>

              {/* Related Videos in same Category */}
              <div className="pt-3 border-t border-white/10 space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {lang === 'am' ? 'በዚህ ዘውግ ውስጥ ያሉ ሌሎች ቪዲዮዎች' : 'More in this series'}
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ALL_SHOWS.filter(
                    (s) => s.categorySlug === selectedVideo.categorySlug && s.id !== selectedVideo.id
                  )
                    .slice(0, 4)
                    .map((item) => (
                      <div
                        key={item.uniqueId}
                        onClick={() => setSelectedVideo(item)}
                        className="group/mini relative rounded-xl overflow-hidden bg-slate-900 border border-white/10 hover:border-amber-500/50 cursor-pointer transition-all"
                      >
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="w-full h-full object-cover group-hover/mini:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-[11px] font-bold text-white truncate group-hover/mini:text-amber-400">
                            {item.title}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ========================================================
// NETFLIX ROW SECTION COMPONENT (Horizontal Scrolling)
// ========================================================
interface NetflixRowSectionProps {
  category: ShowCategory;
  shows: ShowItem[];
  onSelect: (show: ShowItem) => void;
  lang: string;
}

function NetflixRowSection({ category, shows, onSelect, lang }: NetflixRowSectionProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  const scroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const offset = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -offset : offset,
      behavior: 'smooth'
    });
  };

  useEffect(() => {
    checkScroll();
  }, [shows]);

  return (
    <section className="space-y-3.5 relative group/row">
      {/* Row Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'am' ? category.labelAm : category.labelEn}</span>
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-400 font-extrabold text-[10px] tracking-wider uppercase border border-white/10">
            {shows.length} {lang === 'am' ? 'ክፍሎች' : 'Episodes'}
          </span>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden sm:inline">
          {lang === 'am' ? category.taglineAm : category.taglineEn}
        </span>
      </div>

      {/* Horizontal Carousel Track with Left/Right Buttons */}
      <div className="relative">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-r from-[#07090E] via-[#07090E]/80 to-transparent flex items-center justify-start pl-2 text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer"
            aria-label="Scroll Left"
          >
            <div className="p-2 rounded-full bg-slate-900/90 border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-transform">
              <ChevronLeft className="w-5 h-5 text-amber-400" />
            </div>
          </button>
        )}

        {/* Scrollable Row */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex items-center gap-4 overflow-x-auto scrollbar-none py-3 px-1 scroll-smooth"
        >
          {shows.map((show) => (
            <div key={show.uniqueId} className="w-64 sm:w-72 md:w-80 shrink-0">
              <NetflixCard show={show} onSelect={() => onSelect(show)} />
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-12 bg-gradient-to-l from-[#07090E] via-[#07090E]/80 to-transparent flex items-center justify-end pr-2 text-white opacity-0 group-hover/row:opacity-100 transition-opacity duration-200 cursor-pointer"
            aria-label="Scroll Right"
          >
            <div className="p-2 rounded-full bg-slate-900/90 border border-white/20 shadow-xl hover:scale-110 active:scale-95 transition-transform">
              <ChevronRight className="w-5 h-5 text-amber-400" />
            </div>
          </button>
        )}
      </div>
    </section>
  );
}

// ========================================================
// NETFLIX CARD COMPONENT (16:9 with Hover Preview)
// ========================================================
interface NetflixCardProps {
  show: ShowItem;
  onSelect: () => void;
}

function NetflixCard({ show, onSelect }: NetflixCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      onClick={onSelect}
      className="group relative rounded-2xl overflow-hidden bg-slate-900/90 border border-white/10 hover:border-amber-500/60 shadow-lg hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer flex flex-col"
    >
      {/* 16:9 Thumbnail Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
        <img
          src={imageError ? show.thumbnailUrl : show.maxResThumbnailUrl}
          onError={() => setImageError(true)}
          alt={show.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Play Icon Circle Overlay on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-950/30">
          <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl shadow-amber-500/40 transform group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
          </div>
        </div>

        {/* Top Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-black uppercase text-amber-400 border border-white/15">
            {show.badge}
          </span>
        </div>
      </div>

      {/* Card Info Tray */}
      <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
        <h4 className="text-xs sm:text-sm font-extrabold text-white line-clamp-2 leading-snug group-hover:text-amber-400 transition-colors">
          {show.title}
        </h4>

        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
          <span className="truncate max-w-[150px] font-medium">{show.categoryLabel}</span>
          <span className="font-bold text-amber-500 text-[10px] uppercase">Watch Now</span>
        </div>
      </div>
    </div>
  );
}
