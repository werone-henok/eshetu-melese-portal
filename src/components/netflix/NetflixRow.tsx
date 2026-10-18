'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NetflixCard } from './NetflixCard';
import { NetflixMediaItem } from './types';

interface NetflixRowProps {
  id?: string;
  titleEn: string;
  titleAm: string;
  subtitleEn?: string;
  subtitleAm?: string;
  badge?: string;
  items: NetflixMediaItem[];
  onPlay: (item: NetflixMediaItem) => void;
  onMoreInfo?: (item: NetflixMediaItem) => void;
  lang?: 'en' | 'am';
  myListIds?: Set<string>;
  onToggleMyList?: (item: NetflixMediaItem) => void;
}

export function NetflixRow({
  id,
  titleEn,
  titleAm,
  subtitleEn,
  subtitleAm,
  badge,
  items,
  onPlay,
  onMoreInfo,
  lang = 'en',
  myListIds = new Set(),
  onToggleMyList,
}: NetflixRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to toggle navigation arrows
  const checkScroll = useCallback(() => {
    if (!rowRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, items]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!rowRef.current) return;
    const { clientWidth } = rowRef.current;
    const scrollAmount = clientWidth * 0.75;
    rowRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 400);
  };

  if (!items || items.length === 0) return null;

  const displayTitle = lang === 'am' ? titleAm || titleEn : titleEn;
  const displaySubtitle = lang === 'am' ? subtitleAm || subtitleEn : subtitleEn;

  return (
    <div id={id} className="relative mb-6 sm:mb-8 group/row">
      {/* Row Header */}
      <div className="px-4 sm:px-12 mb-1 flex items-baseline justify-between">
        <div className="flex items-baseline gap-2.5 sm:gap-3 flex-wrap">
          <h3 className="text-base sm:text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2 group-hover/row:text-amber-500 dark:group-hover/row:text-amber-400 transition-colors">
            <span>{displayTitle}</span>
            {badge && (
              <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 uppercase">
                {badge}
              </span>
            )}
          </h3>
          {displaySubtitle && (
            <span className="text-slate-500 dark:text-zinc-400 text-xs sm:text-sm font-normal hidden md:inline">
              {displaySubtitle}
            </span>
          )}
        </div>

        <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1 select-none">
          <span>{lang === 'am' ? 'ሁሉንም ይመልከቱ' : 'Explore All'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Row Carousel Track with Generous Vertical Clearance for Hover Scale */}
      <div className="relative">
        {/* Left Chevron Button */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 z-40 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 backdrop-blur-xs cursor-pointer shadow-2xl"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-125 transition-transform text-amber-400" />
          </button>
        )}

        {/* The Horizontal Slider */}
        <div
          ref={rowRef}
          onScroll={checkScroll}
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-8 px-4 sm:px-12 -my-5"
        >
          {items.map((item, index) => {
            // Determine position origin: left edge, right edge, or center
            let pos: 'left' | 'center' | 'right' = 'center';
            if (index === 0) pos = 'left';
            else if (index === items.length - 1) pos = 'right';

            return (
              <NetflixCard
                key={item.uniqueId || item.id || index}
                item={item}
                position={pos}
                lang={lang}
                isInMyList={myListIds.has(item.id)}
                onToggleMyList={onToggleMyList}
                onPlay={onPlay}
                onMoreInfo={onMoreInfo}
              />
            );
          })}
        </div>

        {/* Right Chevron Button */}
        {canScrollRight && (
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => handleScroll('right')}
            className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 z-40 bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 backdrop-blur-xs cursor-pointer shadow-2xl"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-125 transition-transform text-amber-400" />
          </button>
        )}
      </div>
    </div>
  );
}
