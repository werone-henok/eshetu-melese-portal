'use client';

import React, { useState, useEffect } from 'react';
import { Play, Info, Plus, Check, Sparkles, Flame } from 'lucide-react';
import { NetflixMediaItem, cleanMediaTitle } from './types';

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
  const rawTitle = lang === 'am' && current.titleAm ? current.titleAm : current.title;
  const title = cleanMediaTitle(rawTitle);
  const rawDescription =
    lang === 'am' && current.descriptionAm ? current.descriptionAm : current.description;
  const description = cleanMediaTitle(rawDescription);

  return (
    <div className="relative w-full h-[62vh] sm:h-[72vh] md:h-[82vh] lg:h-[88vh] overflow-hidden select-none bg-slate-950">
      {/* Background Hero Image with Zoom Effect */}
      <div className="absolute inset-0">
        <img
          key={current.id}
          src={current.highResUrl || current.thumbnailUrl}
          alt={title}
          className="w-full h-full object-cover object-center sm:object-top transition-all duration-1000 transform scale-100 animate-in fade-in"
        />
        {/* Cinematic Vignettes: Dark gradient on bottom, left, and seamless top blend */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/60 to-transparent w-full md:w-2/3 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-slate-950/40 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/25 to-transparent h-48 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-black/20 z-10" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 sm:px-12 flex flex-col justify-end pt-24 sm:pt-32 pb-10 sm:pb-14 md:pb-18">
        <div className="max-w-2xl space-y-3 sm:space-y-4">
          {/* Top Series Ribbon */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-amber-500/30 text-white shadow-lg">
              <img
                src="/images/donkey-tube-logo.png"
                alt="Donkey Tube"
                className="w-6 h-6 object-contain"
              />
              <span className="text-xs font-black tracking-widest uppercase text-amber-400">
                DONKEY TUBE ORIGINAL
              </span>
            </span>
            <span className="px-2.5 py-0.5 rounded-md bg-white/10 backdrop-blur-md text-slate-200 font-bold text-xs border border-white/10">
              {current.categoryLabel.toUpperCase()}
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
              className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm sm:text-base flex items-center gap-2.5 transition-transform active:scale-95 shadow-xl shadow-amber-500/25 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-slate-950" />
              <span>{lang === 'am' ? 'አጫውት' : 'Play'}</span>
            </button>

            {/* More Info */}
            <button
              type="button"
              onClick={() => (onMoreInfo ? onMoreInfo(current) : onPlay(current))}
              className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors backdrop-blur-md border border-white/20 shadow-xl cursor-pointer"
            >
              <Info className="w-5 h-5" />
              <span>{lang === 'am' ? 'ተጨማሪ መረጃ' : 'More Info'}</span>
            </button>

            {/* My List Toggle */}
            <button
              type="button"
              onClick={() => onToggleMyList?.(current)}
              title={isInMyList ? 'In My List' : 'Add to My List'}
              className={`w-11 h-11 rounded-full border border-white/40 flex items-center justify-center transition-colors cursor-pointer ${
                isInMyList
                  ? 'bg-white text-slate-950 border-white'
                  : 'bg-slate-900/80 hover:border-white text-white'
              }`}
            >
              {isInMyList ? <Check className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Right Edge: Age Rating Badge & Carousel dots */}
      <div className="absolute right-0 bottom-12 sm:bottom-16 z-20 flex items-center gap-3 pr-4 sm:pr-12">
        <div className="flex items-center gap-1.5 mr-2">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to hero slide ${idx + 1}`}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 transition-all rounded-full cursor-pointer ${
                idx === currentIndex ? 'w-6 bg-amber-500' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>

        <div className="border-l-3 border-amber-500 bg-black/60 backdrop-blur-xs px-3 py-1 text-white font-bold text-xs tracking-wider">
          {current.ratingBadge || '13+'}
        </div>
      </div>
    </div>
  );
}
