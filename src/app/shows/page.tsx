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
  convertShowToNetflixItem,
} from '@/components/netflix';
import { useAppSettings } from '@/context/AppSettingsContext';
import { ALL_SHOWS, SHOW_CATEGORIES, ShowCategory } from '@/data/showsData';
import { Sparkles, Film, Heart, Search, X, Layers, ArrowRight } from 'lucide-react';

export default function ShowsPage() {
  const { lang, t } = useAppSettings();

  // Search & Navigation Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mylist'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Video Modal State
  const [selectedItem, setSelectedItem] = useState<NetflixMediaItem | null>(null);

  // My List State (persisted to localStorage)
  const [myListIds, setMyListIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('netflix_my_list_shows');
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
        localStorage.setItem('netflix_my_list_shows', JSON.stringify(Array.from(next)));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Convert all 64 shows into unified Netflix items
  const allNetflixItems: NetflixMediaItem[] = useMemo(() => {
    return ALL_SHOWS.map((show, index) => convertShowToNetflixItem(show, index));
  }, []);

  // Top featured billboard items
  const billboardItems = useMemo(() => {
    return [
      allNetflixItems[0],  // Amazing kids - Mesud
      allNetflixItems[5],  // Gash Eshetu
      allNetflixItems[11], // Corporate storytelling
      allNetflixItems[27], // Standup comedy
      allNetflixItems[44], // Best productions
      allNetflixItems[55], // Documentaries
    ].filter(Boolean);
  }, [allNetflixItems]);

  // Group shows by category for horizontal slider rows
  const rowsByCategory = useMemo(() => {
    return SHOW_CATEGORIES.map((cat: ShowCategory) => {
      const items = allNetflixItems.filter((item) => item.categorySlug === cat.slug);
      return {
        slug: cat.slug,
        titleEn: cat.labelEn,
        titleAm: cat.labelAm,
        subtitleEn: cat.taglineEn,
        subtitleAm: cat.taglineAm,
        badge: cat.badge,
        items,
      };
    }).filter((r) => r.items.length > 0);
  }, [allNetflixItems]);

  // Filtered items when searching
  const searchedItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    return allNetflixItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        (item.titleAm && item.titleAm.includes(q)) ||
        item.categoryLabel.toLowerCase().includes(q) ||
        (item.categoryLabelAm && item.categoryLabelAm.includes(q)) ||
        item.genres.some((g) => g.toLowerCase().includes(q))
    );
  }, [allNetflixItems, searchQuery]);

  // Items in My List
  const myListItems = useMemo(() => {
    return allNetflixItems.filter((item) => myListIds.has(item.id));
  }, [allNetflixItems, myListIds]);

  // Related shows for active modal
  const modalRelatedItems = useMemo(() => {
    if (!selectedItem) return [];
    return allNetflixItems
      .filter((it) => it.id !== selectedItem.id && it.categorySlug === selectedItem.categorySlug)
      .slice(0, 6);
  }, [allNetflixItems, selectedItem]);

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
                <Film className="w-12 h-12 mx-auto mb-3 opacity-40" />
                <p className="text-base font-medium">
                  {lang === 'am'
                    ? 'ምንም የተዛመደ ዝግጅት አልተገኘም። ሌላ ቃል ይሞክሩ።'
                    : 'No shows found matching your search. Try different keywords.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {searchedItems.map((item) => (
                  <NetflixCard
                    key={item.id}
                    item={item}
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
             CASE B: MY LIST TAB ACTIVE
             ======================================================== */
          <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-8 pb-16">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 dark:border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>{lang === 'am' ? 'የኔ የተመረጡ ዝግጅቶች' : 'My List'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 dark:text-red-400 font-semibold border border-red-500/20">
                    {myListItems.length}
                  </span>
                </h2>
                <p className="text-slate-500 dark:text-zinc-400 text-xs mt-1">
                  {lang === 'am'
                    ? 'በዝርዝርዎ ውስጥ ያስቀመጧቸው ተወዳጅ ቪዲዮዎች'
                    : 'Shows and episodes you have saved to watch later.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-amber-500 flex items-center gap-1"
              >
                <span>{lang === 'am' ? 'ወደ ሁሉም ዝግጅቶች ተመለስ' : 'Back to All Shows'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myListItems.length === 0 ? (
              <div className="text-center py-20 text-slate-500 dark:text-zinc-400">
                <Heart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {lang === 'am' ? 'ዝርዝርዎ ባዶ ነው' : 'Your List is Empty'}
                </p>
                <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-md mx-auto mb-6">
                  {lang === 'am'
                    ? 'ከዝግጅቶች ካርድ ላይ የ(+) ምልክቱን በመጫን ወደዚህ ማከል ይችላሉ።'
                    : 'Explore shows and click the (+) button on any card to save it to your personal watchlist.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  {lang === 'am' ? 'ዝግጅቶችን ያስሱ' : 'Browse Shows'}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {myListItems.map((item) => (
                  <NetflixCard
                    key={item.id}
                    item={item}
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

            {/* 2. Interactive Discovery Toolbar Styled with Website Theme */}
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
                  {lang === 'am' ? 'ሁሉም ዝግጅቶች' : 'All Shows'}
                  <span className="ml-1.5 opacity-80">({allNetflixItems.length})</span>
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
              </div>

              {/* Search Pill Input */}
              <div className="relative flex items-center">
                <div className="flex items-center bg-white dark:bg-slate-900/90 border border-slate-300 dark:border-white/10 rounded-full px-3 py-1.5 text-slate-900 dark:text-white shadow-sm">
                  <Search className="w-4 h-4 text-slate-400 mr-2 flex-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={lang === 'am' ? 'ዝግጅት ፈልግ...' : 'Search episodes...'}
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
              {rowsByCategory.map((category) => (
                <NetflixRow
                  key={category.slug}
                  id={category.slug}
                  titleEn={category.titleEn}
                  titleAm={category.titleAm}
                  subtitleEn={category.subtitleEn}
                  subtitleAm={category.subtitleAm}
                  badge={category.badge}
                  items={category.items}
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
