'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import {
  NetflixBillboard,
  NetflixRow,
  NetflixCard,
  NetflixPlayerModal,
  NetflixMediaItem,
  convertGalleryToNetflixItem,
  convertShowToNetflixItem,
} from '@/components/netflix';
import { useAppSettings } from '@/context/AppSettingsContext';
import { MEDIA_GALLERY_ITEMS } from '@/data/mediaGalleryData';
import { ALL_SHOWS } from '@/data/showsData';
import { Film, Camera, Heart, Search, X, Users, ArrowRight, Sparkles } from 'lucide-react';

export default function GalleryPage() {
  const { lang, t } = useAppSettings();

  // Search & Navigation Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mylist'>('all');

  // Modal State
  const [selectedItem, setSelectedItem] = useState<NetflixMediaItem | null>(null);

  // My List State (persisted to localStorage)
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('netflix_my_list_gallery');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setMyListIds(new Set(parsed));
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleMyList = (item: NetflixMediaItem) => {
    setMyListIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) {
        next.delete(item.id);
      } else {
        next.add(item.id);
      }
      try {
        localStorage.setItem('netflix_my_list_gallery', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Convert all gallery items into Netflix items
  const allGalleryNetflixItems: NetflixMediaItem[] = useMemo(() => {
    return MEDIA_GALLERY_ITEMS.map((item, index) =>
      convertGalleryToNetflixItem(item, index)
    );
  }, []);

  // Top featured billboard items for gallery
  const billboardItems = useMemo(() => {
    return [
      allGalleryNetflixItems[0], // Dubai studio still
      allGalleryNetflixItems[1], // Dubai Reel I
      allGalleryNetflixItems[5], // Live tour countdown
      allGalleryNetflixItems[2], // Dubai Reel II
    ].filter(Boolean);
  }, [allGalleryNetflixItems]);

  // Group into curated rows:
  const curatedRows = useMemo(() => {
    const btsItems = allGalleryNetflixItems.filter((i) => i.categorySlug === 'bts');
    const comedyItems = allGalleryNetflixItems.filter((i) => i.categorySlug === 'comedy');
    const videoReels = allGalleryNetflixItems.filter((i) => i.type === 'video');
    const blockbusterShows = ALL_SHOWS.slice(0, 10).map((s, idx) =>
      convertShowToNetflixItem(s, idx)
    );

    return [
      {
        id: 'bts-dubai',
        titleEn: 'Behind The Scenes & Dubai Production',
        titleAm: 'ከመጋረጃው ጀርባ እና የዱባይ ቀረጻ',
        subtitleEn: 'Exclusive multi-camera studio sessions and intimate interviews',
        subtitleAm: 'በዱባይ ስቱዲዮ የተዘጋጁ ልዩ የቀጥታ ቀረጻዎችና ውይይቶች',
        badge: 'DUBAI EXCLUSIVE',
        items: btsItems,
      },
      {
        id: 'live-comedy-stills',
        titleEn: 'Stand-Up Comedy & Tour Stills',
        titleAm: 'የመድረክ ስታንድ-አፕ ኮሜዲ እና የጉብኝት ፎቶዎች',
        subtitleEn: 'Arena concerts, stage promos, and world tour announcements',
        subtitleAm: 'የአለም አቀፍ መድረኮች፣ የኮሜዲ ኮንሰርቶች እና ማስታወቂያዎች',
        badge: 'STAGE CONCERTS',
        items: comedyItems,
      },
      {
        id: 'motion-video-reels',
        titleEn: 'Motion Reels & Behind The Lens Footage',
        titleAm: 'የቀጥታ ቪዲዮዎች እና የካሜራ ቀረጻዎች',
        subtitleEn: 'Master high-definition clips direct from production set',
        subtitleAm: 'ከቀረጻው ስቱዲዮ የተወሰዱ ከፍተኛ ጥራት ያላቸው ቪዲዮዎች',
        badge: 'MASTER REELS',
        items: videoReels,
      },
      {
        id: 'blockbuster-crossover',
        titleEn: 'Trending Video Specials & Blockbusters',
        titleAm: 'ተወዳጅ ልዩ ዝግጅቶች እና ቪዲዮዎች',
        subtitleEn: 'Award-winning Amazing Kids, Gash Eshetu, and comedy shows',
        subtitleAm: 'የድንቅ ልጆች፣ ጋሽ እሸቱ እና ሌሎች ተወዳጅ ፕሮግራሞች',
        badge: 'TOP 10 CROSSOVER',
        items: blockbusterShows,
      },
    ];
  }, [allGalleryNetflixItems]);

  // Search results
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allGalleryNetflixItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.titleAm && item.titleAm.includes(q)) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.categoryLabelAm && item.categoryLabelAm.includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        item.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [allGalleryNetflixItems, searchQuery]);

  // My List items
  const myListItems = useMemo(() => {
    return allGalleryNetflixItems.filter((item) => myListIds.has(item.id));
  }, [allGalleryNetflixItems, myListIds]);

  // Related items for active modal
  const modalRelatedItems = useMemo(() => {
    if (!selectedItem) return [];
    return allGalleryNetflixItems
      .filter((it) => it.id !== selectedItem.id)
      .slice(0, 4);
  }, [allGalleryNetflixItems, selectedItem]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans transition-colors duration-300 pb-20">
      {/* 1. Original Website Top Bar / Menu Bar */}
      <NavigationHeader />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* ========================================================
            CASE A: SEARCH ACTIVE
            ======================================================== */}
        {searchQuery.trim() ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-8 pb-16">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-amber-500" />
                <span>
                  {lang === 'am'
                    ? `ለ"${searchQuery}" የተገኙ ውጤቶች`
                    : `Search Results for "${searchQuery}"`}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20">
                  {searchedItems.length}
                </span>
              </h2>

              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs font-semibold text-slate-500 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white"
              >
                {lang === 'am' ? 'ፍለጋ አጽዳ' : 'Clear search'}
              </button>
            </div>

            {searchedItems.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-zinc-400">
                <Camera className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-base font-medium">
                  {lang === 'am'
                    ? 'ምንም የተዛመደ የሚዲያ ፋይል አልተገኘም።'
                    : 'No media items found. Try different keywords.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {searchedItems.map((item) => (
                  <NetflixCard
                    key={item.id}
                    item={item}
                    isGrid={true}
                    lang={lang as 'en' | 'am'}
                    isInMyList={myListIds.has(item.id)}
                    onToggleMyList={toggleMyList}
                    onPlay={(it) => setSelectedItem(it)}
                    onMoreInfo={(it) => setSelectedItem(it)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : activeTab === 'mylist' ? (
          /* ========================================================
             CASE B: MY LIST ACTIVE
             ======================================================== */
          <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-8 pb-16">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>{lang === 'am' ? 'የኔ የተመረጡ የሚዲያ ፋይሎች' : 'My Saved Media'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 font-semibold border border-red-500/20">
                    {myListItems.length}
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 text-xs mt-1">
                  {lang === 'am'
                    ? 'በዝርዝርዎ ውስጥ ያስቀመጧቸው ፎቶዎችና ቪዲዮዎች'
                    : 'Footage, reels, and stills you have bookmarked.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-amber-500 flex items-center gap-1"
              >
                <span>{lang === 'am' ? 'ወደ ሙሉ ጋለሪ ተመለስ' : 'Back to Gallery'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myListItems.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-zinc-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {lang === 'am' ? 'ዝርዝርዎ ባዶ ነው' : 'Your Media List is Empty'}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                  {lang === 'am'
                    ? 'በማንኛውም ፎቶ ወይም ቪዲዮ ላይ የ(+) ምልክት በመጫን ወደዚህ ማከል ይችላሉ።'
                    : 'Click the (+) button on any media card to bookmark footage to your personal list.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  {lang === 'am' ? 'ጋለሪን ያስሱ' : 'Browse Gallery'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {myListItems.map((item) => (
                  <NetflixCard
                    key={item.id}
                    item={item}
                    isGrid={true}
                    lang={lang as 'en' | 'am'}
                    isInMyList={true}
                    onToggleMyList={toggleMyList}
                    onPlay={(it) => setSelectedItem(it)}
                    onMoreInfo={(it) => setSelectedItem(it)}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          /* ========================================================
             CASE C: NETFLIX STYLE STRUCTURE WITH WEBSITE THEME
             Billboard Hero Banner + Categorized Horizontal Rows
             ======================================================== */
          <>
            {/* 1. Cinematic Billboard */}
            <NetflixBillboard
              items={billboardItems}
              onPlay={(item) => setSelectedItem(item)}
              onMoreInfo={(item) => setSelectedItem(item)}
              lang={lang as 'en' | 'am'}
              myListIds={myListIds}
              onToggleMyList={toggleMyList}
            />

            {/* 2. Interactive Discovery Toolbar & Pass Link */}
            <div className="max-w-7xl mx-auto px-4 sm:px-12 pt-6 pb-2 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    activeTab === 'all'
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-white/15'
                  }`}
                >
                  {lang === 'am' ? 'ሁሉም ሚዲያ' : 'All Media'}
                  <span className="ml-1.5 opacity-80">({allGalleryNetflixItems.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('mylist')}
                  className="px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer bg-slate-200/80 dark:bg-white/10 text-slate-700 dark:text-zinc-300 hover:bg-slate-300 dark:hover:bg-white/15"
                >
                  <Heart className="w-3.5 h-3.5 fill-current text-red-500" />
                  <span>{lang === 'am' ? 'የኔ ዝርዝር' : 'My List'}</span>
                  {myListIds.size > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-bold">
                      {myListIds.size}
                    </span>
                  )}
                </button>

                <Link
                  href="/membersgallary"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-200/60 dark:bg-white/5 hover:bg-slate-300/80 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 text-xs font-semibold border border-slate-300/50 dark:border-white/10 transition-colors"
                >
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  <span>{lang === 'am' ? 'የአባላት ካርዶች' : 'Member Passes'}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </Link>
              </div>

              {/* Search Pill Input */}
              <div className="relative flex items-center">
                <div className="flex items-center bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 rounded-full px-3 py-1.5 text-slate-900 dark:text-white shadow-sm">
                  <Search className="w-4 h-4 text-slate-400 mr-2 flex-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'am' ? 'ሚዲያ ፈልግ...' : 'Search media...'}
                    className="bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none w-36 sm:w-56"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Categorized Horizontal Rows with Smooth Chevrons */}
            <div className="relative z-20 pt-2 space-y-2 sm:space-y-4">
              {curatedRows.map((row) => (
                <NetflixRow
                  key={row.id}
                  id={row.id}
                  titleEn={row.titleEn}
                  titleAm={row.titleAm}
                  subtitleEn={row.subtitleEn}
                  subtitleAm={row.subtitleAm}
                  badge={row.badge}
                  items={row.items}
                  onPlay={(item) => setSelectedItem(item)}
                  onMoreInfo={(item) => setSelectedItem(item)}
                  lang={lang as 'en' | 'am'}
                  myListIds={myListIds}
                  onToggleMyList={toggleMyList}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* 4. Full Cinema Player Modal */}
      <NetflixPlayerModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSelectRelated={(rel) => setSelectedItem(rel)}
        relatedItems={modalRelatedItems}
        lang={lang as 'en' | 'am'}
        isInMyList={selectedItem ? myListIds.has(selectedItem.id) : false}
        onToggleMyList={toggleMyList}
      />
    </div>
  );
}
