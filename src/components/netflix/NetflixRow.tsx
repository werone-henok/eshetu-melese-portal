'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { NetflixCard } from './NetflixCard';
import { NetflixHoverPopout } from './NetflixHoverPopout';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Floating hover popout state (rendered outside scrollable track to eliminate clipping)
  const [hoveredCard, setHoveredCard] = useState<{
    item: NetflixMediaItem;
    left: number;
    top: number;
    width: number;
    originClass: string;
  } | null>(null);

  // Check scroll position to toggle navigation arrows
  const checkScroll = useCallback(() => {
    if (!scrollTrackRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollTrackRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [checkScroll, items]);

  const handleScroll = (direction: 'left' | 'right') => {
    setHoveredCard(null);
    if (!scrollTrackRef.current) return;
    const { clientWidth } = scrollTrackRef.current;
    const scrollAmount = clientWidth * 0.75;
    scrollTrackRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
    setTimeout(checkScroll, 400);
  };

  const handleTrackScroll = () => {
    checkScroll();
    if (hoveredCard) {
      setHoveredCard(null);
    }
  };

  // Card hover handling
  const handleCardMouseEnter = (item: NetflixMediaItem, cardElem: HTMLDivElement) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }

    if (!containerRef.current) return;
    const cardRect = cardElem.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();

    const left = cardRect.left - containerRect.left;
    const top = cardRect.top - containerRect.top;
    const width = cardRect.width;

    // Detect if card is near screen edges to set transform origin
    let originClass = 'origin-center';
    if (cardRect.left < 80) {
      originClass = 'origin-left';
    } else if (window.innerWidth - cardRect.right < 80) {
      originClass = 'origin-right';
    }

    setHoveredCard({
      item,
      left,
      top,
      width,
      originClass,
    });
  };

  const handleCardMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCard(null);
    }, 250);
  };

  const handlePopoutMouseEnter = () => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
  };

  const handlePopoutMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCard(null);
    }, 200);
  };

  if (!items || items.length === 0) return null;

  const displayTitle = lang === 'am' ? titleAm || titleEn : titleEn;
  const displaySubtitle = lang === 'am' ? subtitleAm || subtitleEn : subtitleEn;

  return (
    <div id={id} ref={containerRef} className="relative mb-10 sm:mb-12 group/row">
      {/* Row Header */}
      <div className="px-4 sm:px-12 mb-2 flex items-baseline justify-between">
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

      {/* Track Wrapper */}
      <div className="relative">
        {/* Left Chevron Button */}
        {canScrollLeft && (
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => handleScroll('left')}
            className="absolute left-0 top-0 bottom-0 w-10 sm:w-12 z-40 bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 backdrop-blur-xs cursor-pointer shadow-2xl"
          >
            <ChevronLeft className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-125 transition-transform text-amber-400" />
          </button>
        )}

        {/* The Horizontal Slider Track */}
        <div
          ref={scrollTrackRef}
          onScroll={handleTrackScroll}
          className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-3 px-4 sm:px-12"
        >
          {items.map((item, index) => {
            return (
              <NetflixCard
                key={item.uniqueId || item.id || index}
                item={item}
                lang={lang}
                isInMyList={myListIds.has(item.id)}
                onToggleMyList={onToggleMyList}
                onPlay={onPlay}
                onMoreInfo={onMoreInfo}
                onMouseEnter={(e) => handleCardMouseEnter(item, e.currentTarget)}
                onMouseLeave={handleCardMouseLeave}
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
            className="absolute right-0 top-0 bottom-0 w-10 sm:w-12 z-40 bg-black/65 hover:bg-black/90 text-white flex items-center justify-center transition-all opacity-0 group-hover/row:opacity-100 backdrop-blur-xs cursor-pointer shadow-2xl"
          >
            <ChevronRight className="w-7 h-7 sm:w-8 sm:h-8 hover:scale-125 transition-transform text-amber-400" />
          </button>
        )}
      </div>

      {/* =========================================================================
          UNCLIPPED FLOATING HOVER POPOUT CARD
          Rendered outside the scrollable track in the row container!
          Completely eliminates top and bottom cropping.
          ========================================================================= */}
      {hoveredCard && (
        <div
          onMouseEnter={handlePopoutMouseEnter}
          onMouseLeave={handlePopoutMouseLeave}
          style={{
            position: 'absolute',
            top: `${hoveredCard.top}px`,
            left: `${hoveredCard.left}px`,
            width: `${hoveredCard.width}px`,
            zIndex: 60,
          }}
          className={`transition-all duration-300 ease-out ${hoveredCard.originClass} scale-105 sm:scale-108 -translate-y-2 pointer-events-auto`}
        >
          <NetflixHoverPopout
            item={hoveredCard.item}
            lang={lang}
            isInMyList={myListIds.has(hoveredCard.item.id)}
            onToggleMyList={onToggleMyList}
            onPlay={(it) => {
              setHoveredCard(null);
              onPlay(it);
            }}
            onMoreInfo={(it) => {
              setHoveredCard(null);
              if (onMoreInfo) onMoreInfo(it);
              else onPlay(it);
            }}
          />
        </div>
      )}
    </div>
  );
}
