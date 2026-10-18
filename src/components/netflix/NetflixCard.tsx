'use client';

import React, { useState } from 'react';
import { Play } from 'lucide-react';
import { NetflixMediaItem, cleanMediaTitle } from './types';
import { NetflixHoverPopout } from './NetflixHoverPopout';

interface NetflixCardProps {
  item: NetflixMediaItem;
  onPlay: (item: NetflixMediaItem) => void;
  onMoreInfo?: (item: NetflixMediaItem) => void;
  lang?: 'en' | 'am';
  position?: 'left' | 'center' | 'right';
  isInMyList?: boolean;
  onToggleMyList?: (item: NetflixMediaItem) => void;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: () => void;
  isGrid?: boolean;
}

export function NetflixCard({
  item,
  onPlay,
  onMoreInfo,
  lang = 'en',
  position = 'center',
  isInMyList = false,
  onToggleMyList,
  onMouseEnter,
  onMouseLeave,
  isGrid = false,
}: NetflixCardProps) {
  const [isGridHovered, setIsGridHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackThumb = `https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80`;
  const thumbSrc = imgError || !item.thumbnailUrl ? fallbackThumb : item.thumbnailUrl;

  const rawTitle = lang === 'am' && item.titleAm ? item.titleAm : item.title;
  const titleToDisplay = cleanMediaTitle(rawTitle);

  return (
    <div
      className={`relative select-none ${
        isGrid ? 'w-full' : 'flex-none w-[220px] sm:w-[260px] md:w-[290px] lg:w-[320px]'
      }`}
      onMouseEnter={(e) => {
        if (isGrid) setIsGridHovered(true);
        onMouseEnter?.(e);
      }}
      onMouseLeave={() => {
        if (isGrid) setIsGridHovered(false);
        onMouseLeave?.();
      }}
    >
      {/* BASE INACTIVE CARD */}
      <div
        onClick={() => onPlay(item)}
        className="relative aspect-video w-full rounded-md overflow-hidden bg-slate-900 cursor-pointer transition-all duration-300 shadow-md group/card ring-1 ring-white/10 hover:ring-amber-500/40"
      >
        <img
          src={thumbSrc}
          alt={titleToDisplay}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover/card:scale-105 transition-all duration-300"
          loading="lazy"
        />

        {/* Dark subtle gradient at bottom for title legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent pointer-events-none" />

        {/* Donkey Tube Official Logo on top-left */}
        <div className="absolute top-2 left-2 flex items-center z-10 pointer-events-none">
          <img
            src="/images/donkey-tube-logo.png"
            alt="Donkey Tube"
            className="w-7 h-7 sm:w-8 sm:h-8 object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.85)] filter"
          />
        </div>

        {/* Red "TOP 10" vertical bookmark badge on top-right (as in user screenshot) */}
        {item.isTop10 && (
          <div className="absolute top-0 right-3 z-10 pointer-events-none">
            <div className="bg-[#E50914] text-white font-black text-[9px] px-1.5 py-1 text-center rounded-b-sm shadow-md uppercase tracking-tight flex flex-col items-center leading-none">
              <span>TOP</span>
              <span className="text-[11px] font-extrabold">10</span>
            </div>
          </div>
        )}

        {/* Title overlay in base card */}
        <div className="absolute bottom-2 left-2.5 right-2.5 z-10 pointer-events-none">
          <p className="text-white text-xs sm:text-sm font-semibold truncate drop-shadow-md">
            {titleToDisplay}
          </p>
        </div>
      </div>

      {/* Grid-Only Hover Popout (Visible overflow container, no clipping) */}
      {isGrid && isGridHovered && (
        <div className="absolute top-0 left-0 w-full z-50 transition-all duration-300 ease-out origin-center scale-105 sm:scale-108 -translate-y-2 shadow-[0_15px_45px_rgba(0,0,0,0.95)]">
          <NetflixHoverPopout
            item={item}
            lang={lang}
            isInMyList={isInMyList}
            onToggleMyList={onToggleMyList}
            onPlay={onPlay}
            onMoreInfo={onMoreInfo}
          />
        </div>
      )}
    </div>
  );
}
