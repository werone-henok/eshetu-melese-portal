'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Plus, Check, ThumbsUp, ChevronDown, Sparkles } from 'lucide-react';
import { NetflixMediaItem } from './types';

interface NetflixCardProps {
  item: NetflixMediaItem;
  onPlay: (item: NetflixMediaItem) => void;
  onMoreInfo?: (item: NetflixMediaItem) => void;
  lang?: 'en' | 'am';
  position?: 'left' | 'center' | 'right';
  isInMyList?: boolean;
  onToggleMyList?: (item: NetflixMediaItem) => void;
}

export function NetflixCard({
  item,
  onPlay,
  onMoreInfo,
  lang = 'en',
  position = 'center',
  isInMyList = false,
  onToggleMyList,
}: NetflixCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Position origin so hover popout doesn't get clipped on left or right boundaries
  const originClass =
    position === 'left'
      ? 'origin-left'
      : position === 'right'
      ? 'origin-right'
      : 'origin-center';

  // Fallback thumbnail if error occurs
  const fallbackThumb = `https://images.unsplash.com/photo-1518173946687-a4c8a383392e?w=800&auto=format&fit=crop&q=80`;
  const thumbSrc = imgError || !item.thumbnailUrl ? fallbackThumb : item.thumbnailUrl;

  const genresToDisplay = lang === 'am' && item.genresAm?.length ? item.genresAm : item.genres;
  const titleToDisplay = lang === 'am' && item.titleAm ? item.titleAm : item.title;

  return (
    <div
      className="relative flex-none w-[220px] sm:w-[260px] md:w-[290px] lg:w-[320px] select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* BASE INACTIVE CARD */}
      <div
        onClick={() => onPlay(item)}
        className="relative aspect-video w-full rounded-md overflow-hidden bg-zinc-900 cursor-pointer transition-shadow duration-300 shadow-md group/card"
      >
        <img
          src={thumbSrc}
          alt={titleToDisplay}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center group-hover/card:brightness-105 transition-all duration-300"
          loading="lazy"
        />

        {/* Dark subtle gradient at bottom for title legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

        {/* Netflix Red "N" Ribbon on top-left (Authentic Netflix style) */}
        <div className="absolute top-2 left-2 flex items-center gap-1 z-10 pointer-events-none">
          <div className="w-5 h-6 bg-[#E50914] text-white font-black text-xs flex items-center justify-center rounded-sm shadow-md font-sans tracking-tighter">
            N
          </div>
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

      {/* =========================================================================
          THE SIGNATURE NETFLIX HOVER POPOUT CARD
          Enlarges significantly, pops upward, and reveals the interactive control tray
          ========================================================================= */}
      <div
        className={`absolute top-0 left-0 w-full z-50 transition-all duration-300 ease-out ${originClass} pointer-events-none ${
          isHovered
            ? 'opacity-100 scale-125 sm:scale-130 -translate-y-4 shadow-[0_15px_45px_rgba(0,0,0,0.95)] pointer-events-auto'
            : 'opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-[#181818] rounded-md overflow-hidden ring-1 ring-white/10 shadow-2xl">
          {/* Top: 16:9 Thumbnail Header */}
          <div
            onClick={() => onPlay(item)}
            className="relative aspect-video w-full bg-zinc-950 cursor-pointer overflow-hidden group/thumb"
          >
            <img
              src={thumbSrc}
              alt={titleToDisplay}
              className="w-full h-full object-cover object-center group-hover/thumb:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-black/40" />

            {/* Red "N" ribbon top left */}
            <div className="absolute top-2 left-2 z-10 pointer-events-none flex items-center gap-1.5">
              <div className="w-5 h-6 bg-[#E50914] text-white font-black text-xs flex items-center justify-center rounded-sm shadow-md font-sans tracking-tighter">
                N
              </div>
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider drop-shadow">
                ORIGINAL
              </span>
            </div>

            {/* Top 10 badge */}
            {item.isTop10 && (
              <div className="absolute top-0 right-3 z-10 pointer-events-none">
                <div className="bg-[#E50914] text-white font-black text-[9px] px-1.5 py-1 text-center rounded-b-sm shadow-md uppercase tracking-tight flex flex-col items-center leading-none">
                  <span>TOP</span>
                  <span className="text-[11px] font-extrabold">10</span>
                </div>
              </div>
            )}

            {/* Quick Play Overlay Button */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
              <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white shadow-lg">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Title banner */}
            <div className="absolute bottom-2 left-2.5 right-2.5 pointer-events-none">
              <h4 className="text-white text-xs sm:text-sm font-bold line-clamp-1 drop-shadow-md">
                {titleToDisplay}
              </h4>
            </div>
          </div>

          {/* Bottom: The Dark Control Tray */}
          <div className="p-3 bg-[#181818] space-y-2.5">
            {/* ROW 1: Circular Action Buttons */}
            <div className="flex items-center gap-2">
              {/* White circular play button */}
              <button
                type="button"
                onClick={() => onPlay(item)}
                title="Play"
                className="w-8 h-8 rounded-full bg-white hover:bg-white/90 text-black flex items-center justify-center transition-transform active:scale-95 shadow-md flex-none cursor-pointer"
              >
                <Play className="w-4 h-4 fill-black ml-0.5" />
              </button>

              {/* Plus (+) / Checkmark Add to My List */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleMyList?.(item);
                }}
                title={isInMyList ? 'Remove from My List' : 'Add to My List'}
                className={`w-8 h-8 rounded-full border border-white/40 flex items-center justify-center transition-colors cursor-pointer flex-none ${
                  isInMyList
                    ? 'bg-white text-black border-white'
                    : 'bg-zinc-800/80 hover:border-white text-white'
                }`}
              >
                {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              </button>

              {/* Thumbs Up Like Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLiked((prev) => !prev);
                }}
                title="I like this"
                className={`w-8 h-8 rounded-full border border-white/40 flex items-center justify-center transition-colors cursor-pointer flex-none ${
                  isLiked
                    ? 'bg-red-600 text-white border-red-500'
                    : 'bg-zinc-800/80 hover:border-white text-white'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-white' : ''}`} />
              </button>

              {/* Chevron Down for More Info (Right-aligned) */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onMoreInfo) onMoreInfo(item);
                  else onPlay(item);
                }}
                title="More details"
                className="ml-auto w-8 h-8 rounded-full border border-white/40 bg-zinc-800/80 hover:border-white text-white flex items-center justify-center transition-colors cursor-pointer flex-none"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* ROW 2: Metadata Badges */}
            <div className="flex items-center gap-2 text-xs flex-wrap">
              <span className="text-[#46d369] font-bold tracking-tight">
                {item.matchScore}% Match
              </span>
              <span className="border border-white/40 text-[10px] px-1.5 py-0.5 rounded text-white/90 font-semibold leading-none">
                {item.ratingBadge}
              </span>
              <span className="text-zinc-300 text-[11px] font-medium">
                {item.duration}
              </span>
              <span className="border border-white/30 text-[9px] px-1 py-0.5 rounded text-zinc-300 font-bold uppercase tracking-wider leading-none">
                HD
              </span>
            </div>

            {/* ROW 3: Dot-separated Genre Badges (as in screenshot) */}
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-300 overflow-hidden text-ellipsis whitespace-nowrap">
              {genresToDisplay.map((genre, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-zinc-500 text-xs">•</span>}
                  <span className="hover:text-white transition-colors">{genre}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
