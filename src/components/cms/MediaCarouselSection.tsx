'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Minimize2,
  ExternalLink,
  Film,
  Camera,
  Sparkles,
  MapPin,
  Calendar,
  Grid,
  Sliders,
  X,
  Download,
  Info,
  Check,
} from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';
import { MEDIA_GALLERY_ITEMS, MediaGalleryItem } from '@/data/mediaGalleryData';

interface MediaCarouselSectionProps {
  config?: {
    heading?: string;
    headingAm?: string;
    subheading?: string;
    subheadingAm?: string;
  };
}

export function MediaCarouselSection({ config }: MediaCarouselSectionProps) {
  const { lang, t } = useAppSettings();

  // Filters & State
  const [activeFilter, setActiveFilter] = useState<'all' | 'bts' | 'comedy' | 'video'>('all');
  const [viewMode, setViewMode] = useState<'carousel' | 'grid'>('carousel');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);

  // Modals
  const [activeModalItem, setActiveModalItem] = useState<MediaGalleryItem | null>(null);
  const [imageLoaded, setImageLoaded] = useState<Record<string, boolean>>({});

  // Touch swipe support
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const filmstripRef = useRef<HTMLDivElement>(null);

  // Filter items
  const filteredItems = React.useMemo(() => {
    if (activeFilter === 'bts') {
      return MEDIA_GALLERY_ITEMS.filter((item) => item.category === 'bts');
    }
    if (activeFilter === 'comedy') {
      return MEDIA_GALLERY_ITEMS.filter((item) => item.category === 'comedy');
    }
    if (activeFilter === 'video') {
      return MEDIA_GALLERY_ITEMS.filter((item) => item.type === 'video');
    }
    return MEDIA_GALLERY_ITEMS;
  }, [activeFilter]);

  // Keep index within bounds when filter changes
  useEffect(() => {
    setCurrentIndex(0);
    setProgress(0);
  }, [activeFilter]);

  const currentItem: MediaGalleryItem = filteredItems[currentIndex] || filteredItems[0] || MEDIA_GALLERY_ITEMS[0];

  // Auto-play timer with progress ticker
  const SLIDE_DURATION_MS = 6000;
  const TICK_INTERVAL_MS = 100;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
    setProgress(0);
  }, [filteredItems.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
    setProgress(0);
  }, [filteredItems.length]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx);
    setProgress(0);
  };

  // Autoplay ticker
  useEffect(() => {
    if (!isPlaying || activeModalItem !== null || viewMode === 'grid') {
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          nextSlide();
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPlaying, activeModalItem, viewMode, nextSlide]);

  // Scroll active thumbnail into view
  useEffect(() => {
    if (!filmstripRef.current) return;
    const activeThumb = filmstripRef.current.children[currentIndex] as HTMLElement;
    if (activeThumb) {
      activeThumb.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalItem) {
        if (e.key === 'Escape') setActiveModalItem(null);
        if (e.key === 'ArrowRight') {
          const curIdx = filteredItems.findIndex((it) => it.id === activeModalItem.id);
          if (curIdx !== -1) {
            setActiveModalItem(filteredItems[(curIdx + 1) % filteredItems.length]);
          }
        }
        if (e.key === 'ArrowLeft') {
          const curIdx = filteredItems.findIndex((it) => it.id === activeModalItem.id);
          if (curIdx !== -1) {
            setActiveModalItem(filteredItems[(curIdx - 1 + filteredItems.length) % filteredItems.length]);
          }
        }
        return;
      }

      if (viewMode === 'carousel') {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
        if (e.key === ' ') {
          e.preventDefault();
          setIsPlaying((p) => !p);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalItem, filteredItems, nextSlide, prevSlide, viewMode]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) nextSlide();
    else if (diff < -50) prevSlide();
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const heading =
    lang === 'am'
      ? config?.headingAm || 'ከመጋረጃው ጀርባ የዱባይ ቀረጻ እና የመድረክ ኮሜዲ'
      : config?.heading || 'Behind The Scenes & Live Comedy Tour';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm ||
        'በዱባይ የተከናወነውን የላቀ የስቱዲዮ ቀረጻ፣ ያልታዩ የቀጥታ ቪዲዮዎች እና ታላላቅ የመድረክ ስታንድ-አፕ ኮሜዲ ድምቀቶችን እዚህ ይመልከቱ።'
      : config?.subheading ||
        'Immerse in exclusive behind-the-scenes Dubai studio footage, directorial reels, and iconic live stand-up comedy performance captures.';

  return (
    <section
      id="media-gallery"
      className="py-24 lg:py-32 relative overflow-hidden border-t border-slate-200 dark:border-white/5 transition-colors duration-300"
    >
      {/* Dynamic ambient stage glows */}
      <div className="absolute top-1/4 -left-40 w-[650px] h-[650px] bg-amber-500/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 -right-40 w-[600px] h-[600px] bg-purple-600/10 blur-[170px] pointer-events-none rounded-full" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-amber-500/5 blur-[200px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
            <Film className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />
            <span>{lang === 'am' ? 'ይፋዊ የሚዲያ ማህደር' : 'Official Media Showcase'}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight font-display">
            {heading}
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300/90 leading-relaxed max-w-2xl mx-auto">
            {subheading}
          </p>
        </div>

        {/* Filter Bar & View Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 bg-slate-100/80 dark:bg-slate-900/60 p-2 sm:p-2.5 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-xl">
          {/* Category Filter Chips */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'All Media', labelAm: 'ሁሉም ማህደር', count: MEDIA_GALLERY_ITEMS.length },
              { id: 'bts', label: 'Dubai & Behind The Scenes', labelAm: 'ዱባይ እና ከመጋረጃው ጀርባ', count: 5 },
              { id: 'comedy', label: 'Stand-Up Comedy', labelAm: 'የመድረክ ኮሜዲ', count: 13 },
              { id: 'video', label: 'Footage & Video Reels', labelAm: 'የቀጥታ ቪዲዮዎች', count: 4 },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id as any)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-white/60 dark:hover:bg-white/5'
                }`}
              >
                <span>{lang === 'am' ? tab.labelAm : tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono ${
                    activeFilter === tab.id
                      ? 'bg-slate-950/20 text-slate-950'
                      : 'bg-slate-200 dark:bg-white/10 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Layout Mode Toggle (Carousel vs Grid) */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-slate-950/60 p-1 rounded-xl border border-slate-200/80 dark:border-white/5 shadow-sm">
            <button
              type="button"
              onClick={() => setViewMode('carousel')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'carousel'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Cinematic Carousel View"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{lang === 'am' ? 'ተንሸራታች' : 'Slideshow'}</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 font-bold border border-amber-500/30'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Masonry Gallery Grid View"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{lang === 'am' ? 'ዝርዝር' : 'Grid'}</span>
            </button>
          </div>
        </div>

        {/* ================================================================ */}
        {/* CAROUSEL SLIDESHOW VIEW                                          */}
        {/* ================================================================ */}
        {viewMode === 'carousel' && currentItem && (
          <div
            ref={containerRef}
            className={`relative rounded-3xl overflow-hidden glass-panel-gold border border-amber-500/30 shadow-2xl transition-all duration-300 ${
              isFullscreen ? 'fixed inset-0 z-50 rounded-none bg-slate-950 p-6 flex flex-col justify-between' : ''
            }`}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Top Bar inside Slideshow */}
            <div className="absolute top-0 inset-x-0 z-20 p-4 sm:p-6 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-transparent flex items-center justify-between text-white pointer-events-auto">
              {/* Category & Badge */}
              <div className="flex items-center gap-2.5">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider backdrop-blur-md shadow-lg"
                  style={{
                    backgroundColor: `${currentItem.badgeColor || '#F59E0B'}25`,
                    color: currentItem.badgeColor || '#F59E0B',
                    border: `1px solid ${currentItem.badgeColor || '#F59E0B'}50`,
                  }}
                >
                  {lang === 'am' ? currentItem.badgeAm : currentItem.badge}
                </span>

                <span className="hidden sm:inline-flex items-center gap-1.5 text-xs text-slate-300 bg-slate-950/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>{lang === 'am' ? currentItem.locationAm : currentItem.location}</span>
                </span>
              </div>

              {/* Slide Counter & Playback Controls */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="font-mono text-xs font-bold text-amber-400 bg-slate-950/70 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30">
                  {String(currentIndex + 1).padStart(2, '0')} / {String(filteredItems.length).padStart(2, '0')}
                </div>

                {/* Autoplay Pause/Play button */}
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  className="p-2 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 border border-white/10 hover:border-amber-400 text-slate-200 transition-all cursor-pointer shadow-lg"
                  title={isPlaying ? 'Pause Slideshow' : 'Resume Slideshow'}
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>

                {/* Fullscreen button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="p-2 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 border border-white/10 hover:border-amber-400 text-slate-200 transition-all cursor-pointer shadow-lg"
                  title={isFullscreen ? 'Exit Fullscreen' : 'View Fullscreen'}
                >
                  {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Main Stage Viewport with Theater Ambient Fill (NO CROPPING) */}
            <div className="relative w-full h-[520px] sm:h-[620px] lg:h-[700px] bg-slate-950 flex items-center justify-center overflow-hidden group">
              {/* Image Loading Skeleton / Shimmer */}
              {!imageLoaded[currentItem.id] && (
                <div className="absolute inset-0 bg-slate-900 animate-pulse flex items-center justify-center z-20">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                </div>
              )}

              {/* Ambient Blurred Backdrop - Fills widescreen canvas with matching glowing tones */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                <img
                  src={currentItem.thumbnailUrl}
                  alt=""
                  aria-hidden="true"
                  className="w-full h-full object-cover blur-3xl opacity-35 dark:opacity-25 scale-125 select-none"
                />
                <div className="absolute inset-0 bg-slate-950/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
              </div>

              {/* Main Media Preview Image (100% visible, NEVER cropped or trimmed) */}
              <div className="relative z-10 w-full h-full flex items-center justify-center pt-16 sm:pt-20 pb-28 sm:pb-32 px-4 sm:px-16 pointer-events-none">
                <img
                  key={currentItem.id}
                  src={currentItem.thumbnailUrl}
                  alt={currentItem.title}
                  onLoad={() => setImageLoaded((prev) => ({ ...prev, [currentItem.id]: true }))}
                  className={`max-w-full max-h-full w-auto h-auto object-contain rounded-2xl shadow-2xl transition-all duration-500 pointer-events-auto select-none ${
                    imageLoaded[currentItem.id] ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                  }`}
                />
              </div>

              {/* Video Play Button Overlay for Footage */}
              {currentItem.type === 'video' ? (
                <button
                  type="button"
                  onClick={() => setActiveModalItem(currentItem)}
                  className="absolute z-20 inset-0 flex items-center justify-center group/btn cursor-pointer bg-slate-950/20 hover:bg-slate-950/40 transition-colors"
                >
                  <div className="relative">
                    {/* Pulsing Aura */}
                    <div className="absolute -inset-4 rounded-full bg-amber-500/30 blur-md group-hover/btn:scale-125 transition-transform duration-500 animate-pulse" />
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 flex items-center justify-center shadow-2xl group-hover/btn:scale-110 transition-transform duration-300">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 ml-1 fill-current" />
                    </div>
                  </div>
                  <span className="sr-only">Play Video Footage</span>
                </button>
              ) : (
                /* Click image to open Full HD zoom */
                <button
                  type="button"
                  onClick={() => setActiveModalItem(currentItem)}
                  className="absolute z-20 inset-0 flex items-end justify-center pb-28 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-zoom-in pointer-events-auto"
                >
                  <span className="px-4 py-2 rounded-full bg-slate-950/80 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xl flex items-center gap-1.5">
                    <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'am' ? 'ሙሉ ምስሉን ይመልከቱ' : 'Click to View Full HD'}</span>
                  </span>
                </button>
              )}

              {/* Large Ergonomic Navigation Buttons */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className="absolute left-3 sm:left-6 z-30 p-3 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 text-white border border-white/20 hover:border-amber-400 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                title="Previous Slide (Left Arrow)"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  nextSlide();
                }}
                className="absolute right-3 sm:right-6 z-30 p-3 sm:p-3.5 rounded-full bg-slate-950/70 hover:bg-amber-500 hover:text-slate-950 text-white border border-white/20 hover:border-amber-400 backdrop-blur-md shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
                title="Next Slide (Right Arrow)"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {/* Bottom Caption & Information Card (Overlay) */}
              <div className="absolute bottom-0 inset-x-0 z-20 p-5 sm:p-8 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-auto">
                <div className="max-w-2xl">
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-1">
                    {currentItem.type === 'video' ? (
                      <Film className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Camera className="w-3.5 h-3.5 text-amber-400" />
                    )}
                    <span>{lang === 'am' ? currentItem.subtitleAm : currentItem.subtitle}</span>
                  </div>

                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight leading-snug font-display">
                    {lang === 'am' ? currentItem.titleAm : currentItem.title}
                  </h3>

                  <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2">
                    {lang === 'am' ? currentItem.descriptionAm : currentItem.description}
                  </p>
                </div>

                {/* Primary CTA Buttons for Current Slide */}
                <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 md:pt-0">
                  {currentItem.type === 'video' ? (
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(currentItem)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{lang === 'am' ? 'ቪዲዮውን አጫውት' : 'Watch Footage'}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setActiveModalItem(currentItem)}
                      className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>{lang === 'am' ? 'ምስሉን አሳድግ' : 'View Full HD'}</span>
                    </button>
                  )}

                  {currentItem.driveLink && (
                    <a
                      href={currentItem.driveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white border border-white/10 font-semibold text-xs transition-all flex items-center gap-1.5 cursor-pointer backdrop-blur-md"
                      title="Open in Google Drive"
                    >
                      <span>{lang === 'am' ? 'በድራይቭ ክፈት' : 'Open in Drive'}</span>
                      <ExternalLink className="w-3 h-3 text-amber-400" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Continuous Autoplay Progress Bar */}
            <div className="w-full h-1 bg-slate-800/80 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-100 ease-linear"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Interactive Thumbnail Filmstrip Strip */}
            <div
              ref={filmstripRef}
              className="p-3 sm:p-4 bg-slate-950/90 border-t border-white/5 flex items-center gap-2.5 sm:gap-3 overflow-x-auto scrollbar-thin scrollbar-thumb-amber-500/30 scrollbar-track-transparent select-none"
            >
              {filteredItems.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goToSlide(idx)}
                    className={`relative rounded-xl overflow-hidden shrink-0 transition-all duration-300 cursor-pointer group/thumb ${
                      isActive
                        ? 'w-24 sm:w-28 h-14 sm:h-16 ring-2 ring-amber-400 ring-offset-2 ring-offset-slate-950 scale-105 opacity-100'
                        : 'w-16 sm:w-20 h-12 sm:h-14 opacity-50 hover:opacity-90 hover:scale-100'
                    }`}
                  >
                    <img
                      src={item.thumbnailUrl}
                      alt={item.title}
                      className="w-full h-full object-cover object-center group-hover/thumb:scale-110 transition-transform duration-300"
                    />
                    {item.type === 'video' && (
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                        <div className="w-5 h-5 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center">
                          <Play className="w-2.5 h-2.5 ml-0.5 fill-current" />
                        </div>
                      </div>
                    )}
                    {isActive && (
                      <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-400" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================ */}
        {/* GALLERY GRID VIEW (Alternative Masonry / 3-Column Display)        */}
        {/* ================================================================ */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            {filteredItems.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => setActiveModalItem(item)}
                className="group rounded-3xl overflow-hidden glass-panel hover:glass-panel-gold border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-all duration-300 shadow-xl hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                {/* Media Image / Video Thumbnail */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md"
                      style={{
                        backgroundColor: `${item.badgeColor || '#F59E0B'}25`,
                        color: item.badgeColor || '#F59E0B',
                        border: `1px solid ${item.badgeColor || '#F59E0B'}40`,
                      }}
                    >
                      {lang === 'am' ? item.badgeAm : item.badge}
                    </span>

                    {item.type === 'video' ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/20 border border-pink-500/40 text-pink-400 text-[10px] font-bold">
                        <Film className="w-3 h-3" />
                        <span>Reel</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/60 border border-white/10 text-slate-300 text-[10px]">
                        <Camera className="w-3 h-3 text-amber-400" />
                        <span>HD Still</span>
                      </span>
                    )}
                  </div>

                  {/* Centered Play Button for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Content & Metadata */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-[11px] text-amber-600 dark:text-amber-400 font-semibold mb-1">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span>{lang === 'am' ? item.locationAm : item.location}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                      {lang === 'am' ? item.titleAm : item.title}
                    </h4>

                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {lang === 'am' ? item.descriptionAm : item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <span>{item.date}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>{lang === 'am' ? 'ይመልከቱ' : 'View Media'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================================================================ */}
      {/* FULL-SCREEN LIGHTBOX & VIDEO MODAL                                */}
      {/* ================================================================ */}
      {activeModalItem && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-2xl flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setActiveModalItem(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-3xl overflow-hidden bg-slate-900 border border-amber-500/30 shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-950/80 border-b border-white/10 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${activeModalItem.badgeColor || '#F59E0B'}25`,
                    color: activeModalItem.badgeColor || '#F59E0B',
                    border: `1px solid ${activeModalItem.badgeColor || '#F59E0B'}40`,
                  }}
                >
                  {lang === 'am' ? activeModalItem.badgeAm : activeModalItem.badge}
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                  {lang === 'am' ? activeModalItem.titleAm : activeModalItem.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {activeModalItem.driveLink && (
                  <a
                    href={activeModalItem.driveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                    title="Open in Google Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModalItem(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-300 transition-all cursor-pointer"
                  title="Close Modal (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Media Body */}
            <div className="relative flex-1 bg-black flex items-center justify-center min-h-[300px] sm:min-h-[440px] max-h-[65vh]">
              {activeModalItem.type === 'video' && activeModalItem.embedUrl ? (
                /* Google Drive Video Player Iframe */
                <iframe
                  src={activeModalItem.embedUrl}
                  className="w-full h-full min-h-[360px] sm:min-h-[500px] border-0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : (
                /* High-Res Image Preview */
                <img
                  src={activeModalItem.highResUrl}
                  alt={activeModalItem.title}
                  className="max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />
              )}
            </div>

            {/* Modal Footer & Information */}
            <div className="p-4 sm:p-6 bg-slate-950/90 border-t border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
              <div className="space-y-1">
                <p className="text-slate-300 text-xs sm:text-sm">
                  {lang === 'am' ? activeModalItem.descriptionAm : activeModalItem.description}
                </p>
                <div className="flex items-center gap-4 text-slate-500">
                  <span className="flex items-center gap-1 text-amber-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{lang === 'am' ? activeModalItem.locationAm : activeModalItem.location}</span>
                  </span>
                  <span>&bull;</span>
                  <span>{activeModalItem.date}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={activeModalItem.driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'ኦሪጅናል ፋይሉን አውርድ' : 'Download Original File'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
