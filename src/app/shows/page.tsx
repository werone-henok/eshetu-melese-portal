'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  NetflixHeader,
  NetflixBillboard,
  NetflixRow,
  NetflixCard,
  NetflixPlayerModal,
  NetflixMediaItem,
  convertShowToNetflixItem,
} from '@/components/netflix';
import { useAppSettings } from '@/context/AppSettingsContext';
import { ALL_SHOWS, SHOW_CATEGORIES, ShowCategory } from '@/data/showsData';
import { Sparkles, Film, Heart, Search, ArrowRight } from 'lucide-react';

export default function ShowsPage() {
  const { lang } = useAppSettings();

  // Search & Navigation Tabs
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'mylist'>('all');

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
    <div className="min-h-screen bg-[#141414] text-white font-sans selection:bg-[#E50914] selection:text-white pb-20">
      {/* 1. Authentic Netflix Header */}
      <NetflixHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        myListCount={myListIds.size}
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab as 'all' | 'mylist');
          setSearchQuery('');
        }}
        totalShowsCount={allNetflixItems.length}
      />

      <main className="relative z-10 pt-16 sm:pt-20">
        {/* ========================================================
            CASE A: SEARCH ACTIVE
            ======================================================== */}
        {searchQuery.trim() ? (
          <section className="max-w-7xl mx-auto px-4 sm:px-12 pt-8 pb-16">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Search className="w-5 h-5 text-red-500" />
                <span>
                  {lang === 'am'
                    ? `ለ"${searchQuery}" የተገኙ ውጤቶች`
                    : `Search Results for "${searchQuery}"`}
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-400 font-semibold border border-red-500/30">
                  {searchedItems.length}
                </span>
              </h2>

              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-xs text-zinc-400 hover:text-white"
              >
                {lang === 'am' ? 'ፍለጋ አጽዳ' : 'Clear search'}
              </button>
            </div>

            {searchedItems.length === 0 ? (
              <div className="text-center py-20 text-zinc-400">
                <Film className="w-12 h-12 mx-auto mb-3 text-zinc-600" />
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
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                  <span>{lang === 'am' ? 'የኔ የተመረጡ ዝግጅቶች' : 'My List'}</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-600/30 text-red-400 font-semibold border border-red-500/30">
                    {myListItems.length}
                  </span>
                </h2>
                <p className="text-zinc-400 text-xs mt-1">
                  {lang === 'am'
                    ? 'በዝርዝርዎ ውስጥ ያስቀመጧቸው ተወዳጅ ቪዲዮዎች'
                    : 'Shows and episodes you have saved to watch later.'}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>{lang === 'am' ? 'ወደ ሁሉም ዝግጅቶች ተመለስ' : 'Back to All Shows'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myListItems.length === 0 ? (
              <div className="text-center py-20 text-zinc-400">
                <Heart className="w-12 h-12 mx-auto mb-3 text-zinc-700" />
                <p className="text-base font-semibold text-white mb-2">
                  {lang === 'am' ? 'ዝርዝርዎ ባዶ ነው' : 'Your List is Empty'}
                </p>
                <p className="text-xs text-zinc-400 max-w-md mx-auto mb-6">
                  {lang === 'am'
                    ? 'ከዝግጅቶች ካርድ ላይ የ(+) ምልክቱን በመጫን ወደዚህ ማከል ይችላሉ።'
                    : 'Explore shows and click the (+) button on any card to save it to your personal watchlist.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('all')}
                  className="px-5 py-2 rounded-md bg-white text-black font-bold text-xs hover:bg-white/90"
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
             CASE C: FULL NETFLIX BROWSE INTERFACE
             Hero Billboard + Categorized Horizontal Rows
             ======================================================== */
          <>
            {/* Cinematic Billboard */}
            <NetflixBillboard
              items={billboardItems}
              onPlay={(item) => setSelectedItem(item)}
              onMoreInfo={(item) => setSelectedItem(item)}
              lang={lang as 'en' | 'am'}
              myListIds={myListIds}
              onToggleMyList={toggleMyList}
            />

            {/* Categorized Netflix Rows with Negative Top Margin for Layering */}
            <div className="relative z-20 -mt-10 sm:-mt-16 md:-mt-20 space-y-2 sm:space-y-4">
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

      {/* 3. Full Cinema Player Modal */}
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
