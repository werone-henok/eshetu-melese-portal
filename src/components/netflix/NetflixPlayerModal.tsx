'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Plus,
  Check,
  Share2,
  ExternalLink,
  ThumbsUp,
  Sparkles,
  Film,
  Calendar,
  Eye,
  Award
} from 'lucide-react';
import { NetflixMediaItem } from './types';

interface NetflixPlayerModalProps {
  item: NetflixMediaItem | null;
  onClose: () => void;
  onSelectRelated?: (item: NetflixMediaItem) => void;
  relatedItems?: NetflixMediaItem[];
  lang?: 'en' | 'am';
  isInMyList?: boolean;
  onToggleMyList?: (item: NetflixMediaItem) => void;
}

export function NetflixPlayerModal({
  item,
  onClose,
  onSelectRelated,
  relatedItems = [],
  lang = 'en',
  isInMyList = false,
  onToggleMyList,
}: NetflixPlayerModalProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [item]);

  if (!item) return null;

  const handleCopyLink = () => {
    const link = item.url || window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  const title = lang === 'am' && item.titleAm ? item.titleAm : item.title;
  const description =
    lang === 'am' && item.descriptionAm ? item.descriptionAm : item.description;
  const genres = lang === 'am' && item.genresAm?.length ? item.genresAm : item.genres;

  // Build embed URL with autoplay
  let finalEmbedUrl = item.embedUrl;
  if (finalEmbedUrl && finalEmbedUrl.includes('youtube.com')) {
    finalEmbedUrl = finalEmbedUrl.includes('?')
      ? `${finalEmbedUrl}&autoplay=1&rel=0`
      : `${finalEmbedUrl}?autoplay=1&rel=0`;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-4xl bg-[#181818] rounded-xl overflow-hidden shadow-2xl border border-white/10 my-6 sm:my-10 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Floating Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-black/75 hover:bg-black text-white flex items-center justify-center border border-white/20 transition-all cursor-pointer shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top: 16:9 Video Embed Player or High-Res Image */}
        <div className="relative aspect-video w-full bg-black">
          {item.type === 'video' && finalEmbedUrl ? (
            <iframe
              src={finalEmbedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="relative w-full h-full">
              <img
                src={item.highResUrl || item.thumbnailUrl}
                alt={title}
                className="w-full h-full object-contain bg-black"
              />
            </div>
          )}
        </div>

        {/* Bottom Content Area */}
        <div className="p-5 sm:p-7 space-y-6">
          {/* Main Title & Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <img
                  src="/images/donkey-tube-logo.png"
                  alt="Donkey Tube"
                  className="w-7 h-7 object-contain drop-shadow"
                />
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
                  {lang === 'am' ? item.categoryLabelAm : item.categoryLabel}
                </span>
                {item.isTop10 && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E50914] text-white uppercase tracking-wider">
                    #TOP 10
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {title}
              </h2>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Add to My List */}
              <button
                type="button"
                onClick={() => onToggleMyList?.(item)}
                className={`px-4 py-2 rounded-lg font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                  isInMyList
                    ? 'bg-white text-black'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-white/20'
                }`}
              >
                {isInMyList ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                <span>
                  {isInMyList
                    ? lang === 'am' ? 'በዝርዝሬ ውስጥ' : 'In My List'
                    : lang === 'am' ? 'ወደ ዝርዝሬ አክል' : 'Add to List'}
                </span>
              </button>

              {/* Like Button */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  isLiked
                    ? 'bg-red-600/30 border-red-500 text-red-400'
                    : 'bg-zinc-800 hover:bg-zinc-700 border-white/20 text-white'
                }`}
                title="Like"
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
              </button>

              {/* Share */}
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white border border-white/20 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>
                  {isCopied
                    ? lang === 'am' ? 'ተቀድቷል!' : 'Copied!'
                    : lang === 'am' ? 'አጋራ' : 'Share'}
                </span>
              </button>

              {/* External Link */}
              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{lang === 'am' ? 'በዩቲዩብ ተመልከት' : 'YouTube'}</span>
                </a>
              )}
            </div>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-3 text-xs sm:text-sm text-zinc-300 flex-wrap pt-1 border-t border-white/10">
            <span className="text-[#46d369] font-bold text-sm">
              {item.matchScore}% Match
            </span>
            <span className="border border-white/40 text-xs px-2 py-0.5 rounded text-white/90 font-semibold">
              {item.ratingBadge}
            </span>
            <span className="text-zinc-300 font-medium">
              {item.duration}
            </span>
            <span className="border border-white/30 text-[10px] px-1.5 py-0.5 rounded text-zinc-300 font-bold uppercase tracking-wider">
              Ultra HD 4K
            </span>
            {item.date && (
              <span className="text-zinc-400 text-xs flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {item.date}
              </span>
            )}
          </div>

          {/* Description & Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="md:col-span-2 space-y-3">
              <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
                {description}
              </p>
            </div>

            <div className="space-y-3 text-xs text-zinc-400 border-l border-white/10 pl-0 md:pl-5">
              <div>
                <span className="text-zinc-500 block mb-0.5">
                  {lang === 'am' ? 'ፈጣሪ / አቅራቢ:' : 'Creator / Starring:'}
                </span>
                <span className="text-white font-medium">
                  {item.author || 'Comedian Eshetu Melese'}
                </span>
              </div>

              <div>
                <span className="text-zinc-500 block mb-0.5">
                  {lang === 'am' ? 'ዘውግ / ምድብ:' : 'Genres:'}
                </span>
                <div className="flex flex-wrap gap-1">
                  {genres.map((g, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-zinc-800 text-zinc-200 rounded text-[11px]"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {item.badge && (
                <div>
                  <span className="text-zinc-500 block mb-0.5">
                    {lang === 'am' ? 'ልዩ ደረጃ:' : 'Status:'}
                  </span>
                  <span className="text-amber-400 font-semibold">
                    {item.badge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* "More Like This" Recommendations Row */}
          {relatedItems.length > 0 && (
            <div className="pt-6 border-t border-white/10">
              <h3 className="text-base sm:text-lg font-bold text-white mb-3">
                {lang === 'am' ? 'ተመሳሳይ ዝግጅቶች' : 'More Like This'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {relatedItems.slice(0, 4).map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelated?.(rel)}
                    className="group bg-zinc-900 rounded-lg overflow-hidden cursor-pointer border border-white/5 hover:border-white/30 transition-all"
                  >
                    <div className="relative aspect-video">
                      <img
                        src={rel.thumbnailUrl}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <img
                        src="/images/donkey-tube-logo.png"
                        alt="Donkey Tube"
                        className="absolute top-1.5 left-1.5 w-5 h-5 object-contain drop-shadow"
                      />
                      <div className="absolute bottom-1.5 left-2 right-2">
                        <p className="text-white text-xs font-semibold truncate">
                          {lang === 'am' && rel.titleAm ? rel.titleAm : rel.title}
                        </p>
                      </div>
                    </div>
                    <div className="p-2 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="text-[#46d369] font-bold">
                        {rel.matchScore}% Match
                      </span>
                      <span>{rel.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
