'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { NetflixMediaItem } from './types';

interface NetflixBillboardProps {
  items: NetflixMediaItem[];
  onPlay: (item: NetflixMediaItem) => void;
  onMoreInfo?: (item: NetflixMediaItem) => void;
  lang?: 'en' | 'am';
  myListIds?: Set<string>;
  onToggleMyList?: (item: NetflixMediaItem) => void;
}

export function NetflixBillboard({
  items,
  onPlay,
  onMoreInfo,
  lang = 'en',
  myListIds = new Set(),
  onToggleMyList,
}: NetflixBillboardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate featured billboard every 12 seconds
  useEffect(() => {
    if (!items || items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 12000);
    return () => clearInterval(interval);
  }, [items]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex] || items[0];
  const isInMyList = myListIds.has(current.id);
  const title = lang === 'am' && current.titleAm ? current.titleAm : current.title;
  const description =
    lang === 'am' && current.descriptionAm ? current.descriptionAm : current.description;

  return (
    <div className="relative w-full h-[52vh] sm:h-[65vh] md:h-[75vh] lg:h-[82vh] overflow-hidden select-none bg-black">
      {/* Background Hero Image with Zoom Effect */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={current.highResUrl || current.thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover object-center sm:object-top transition-all duration-1000 transform scale-100 animate-in fade-in"
        />
        {/* Cinematic Vignettes: Dark gradient on bottom, left, and subtle top */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/70 to-transparent w-full md:w-2/3 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[#141414]/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-black/25 z-10" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-12 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Top Series Ribbon */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-6 bg-[#E50914] text-white font-black text-xs flex items-center justify-center rounded-xs shadow font-sans">
              N
            </div>
            <span className="text-xs font-black tracking-widest uppercase text-white/90 drop-shadow">
              {current.categoryLabel.toUpperCase()} • ORIGINAL
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-xl font-display">
            {title}
          </h1>

          {/* Top 10 in Ethiopia Badge */}
          <div className="flex items-center gap-2.5">
            <div className="bg-[#E50914] text-white text-[10px] font-black px-1.5 py-0.5 rounded-xs tracking-wider">
              TOP 10
            </div>
            <span className="text-white font-bold text-xs sm:text-sm drop-shadow">
              {lang === 'am' ? '#1 በኢትዮጵያ ዛሬ በመታየት ላይ' : '#1 in Ethiopia Today'}
            </span>
          </div>

          {/* Description */}
          <p className="text-zinc-200 text-xs sm:text-sm md:text-base line-clamp-2 sm:line-clamp-3 leading-relaxed drop-shadow-md">
            {description}
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 pt-2">
            {/* Play Button */}
            <button
              type="button"
              onClick={() => onPlay(current)}
              className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-md bg-white hover:bg-white/90 text-black font-bold text-sm sm:text-base flex items-center gap-2.5 transition-transform active:scale-95 shadow-xl cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>{lang === 'am' ? 'አጫውት' : 'Play'}</span>
            </button>

            {/* More Info */}
            <button
              type="button"
              onClick={() => (onMoreInfo ? onMoreInfo(current) : onPlay(current))}
              className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-md bg-zinc-600/70 hover:bg-zinc-600/90 text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors backdrop-blur-md shadow-xl cursor-pointer"
            >
              <Info className="w-5 h-5" />
              <span>{lang === 'am' ? 'ተጨማሪ መረጃ' : 'More Info'}</span>
            </button>

            {/* My List Toggle */}
            <button
              type="button"
              onClick={() => onToggleMyList?.(current)}
              title={isInMyList ? 'In My List' : 'Add to My List'}
              className={`w-10 h-10 rounded-full border border-white/40 flex items-center justify-center transition-colors cursor-pointer ${
                isInMyList
                  ? 'bg-white text-black border-white'
                  : 'bg-zinc-800/80 hover:border-white text-white'
              }`}
            >
              {isInMyList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge: Age Rating Badge & Carousel dots */}
      <div className="absolute right-0 bottom-16 sm:bottom-20 z-20 flex items-center gap-3 pr-4 sm:pr-12">
        <div className="flex items-center gap-1.5 mr-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to hero slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all rounded-full cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-red-600' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <div className="border-l-3 border-zinc-300 bg-black/60 backdrop-blur-xs px-3 py-1 text-white font-bold text-xs tracking-wider">
          {current.ratingBadge || '13+'}
        </div>
      </div>
    </div>
  );
}
