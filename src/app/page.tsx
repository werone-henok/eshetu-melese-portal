'use client';

import React, { useEffect, useState } from 'react';
import { NavigationHeader } from '@/components/common/NavigationHeader';
import { AboutSection } from '@/components/cms/AboutSection';
import { CharitySection } from '@/components/cms/CharitySection';
import { EventsSection } from '@/components/cms/EventsSection';
import { HeroSection } from '@/components/cms/HeroSection';
import { StatsSection } from '@/components/cms/StatsSection';
import { BenefitsSection } from '@/components/cms/BenefitsSection';
import { TiersSection } from '@/components/cms/TiersSection';
import { HowItWorksSection } from '@/components/cms/HowItWorksSection';
import { CardShowcaseSection } from '@/components/cms/CardShowcaseSection';
import { FaqSection } from '@/components/cms/FaqSection';
import { SocialFooterSection } from '@/components/cms/SocialFooterSection';
import { SocialsSection } from '@/components/cms/SocialsSection';

export default function HomePage() {
  const [sections, setSections] = useState<any[]>([]);
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if we have freshly cached sections in sessionStorage to render instantly without old version flash
    try {
      const cached = sessionStorage.getItem('eshetu_home_sections');
      const cachedTiers = sessionStorage.getItem('eshetu_home_tiers');
      if (cached) {
        setSections(JSON.parse(cached));
        setLoading(false);
      }
      if (cachedTiers) {
        setTiers(JSON.parse(cachedTiers));
      }
    } catch {}

    async function loadData() {
      try {
        const [secRes, tierRes] = await Promise.all([
          fetch('/api/cms/sections'),
          fetch('/api/tiers'),
        ]);

        if (secRes.ok) {
          const secData = await secRes.json();
          const cleanSections = (secData.sections || []).map((s: any) => {
            if (s.sectionType === 'stats') {
              return { ...s, sectionType: 'socials' };
            }
            return s;
          });
          setSections(cleanSections);
          try {
            sessionStorage.setItem('eshetu_home_sections', JSON.stringify(cleanSections));
          } catch {}
        }

        if (tierRes.ok) {
          const tierData = await tierRes.json();
          setTiers(tierData.tiers || []);
          try {
            sessionStorage.setItem('eshetu_home_tiers', JSON.stringify(tierData.tiers || []));
          } catch {}
        }
      } catch (err) {
        console.error('Failed to load portal data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const renderSection = (section: any) => {
    if (!section.isVisible) return null;

    switch (section.sectionType) {
      case 'hero':
        return <HeroSection key={section.id} config={section.configuration} />;
      case 'about':
        return <AboutSection key={section.id} config={section.configuration} />;
      case 'charity':
        return <CharitySection key={section.id} config={section.configuration} />;
      case 'events':
        return <EventsSection key={section.id} config={section.configuration} />;
      case 'stats':
      case 'socials':
        return <SocialsSection key={section.id} config={section.configuration} />;
      case 'benefits':
        return <BenefitsSection key={section.id} config={section.configuration} />;
      case 'tiers':
        return <TiersSection key={section.id} config={section.configuration} tiers={tiers} />;
      case 'how_it_works':
        return <HowItWorksSection key={section.id} config={section.configuration} />;
      case 'card_showcase':
        return <CardShowcaseSection key={section.id} config={section.configuration} />;
      case 'faq':
        return <FaqSection key={section.id} config={section.configuration} />;
      case 'social_footer':
        return <SocialFooterSection key={section.id} config={section.configuration} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-amber-500 selection:text-slate-950 font-sans">
      <NavigationHeader />

      <main>
        {sections.length > 0 ? (
          sections.map(renderSection)
        ) : loading ? (
          // Elegant animated placeholder shell while loading real sections
          <div className="min-h-[85vh] flex flex-col items-center justify-center p-6 text-center animate-pulse">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-6">
              <span className="w-8 h-8 rounded-full border-2 border-amber-500 border-t-transparent animate-spin block" />
            </div>
            <div className="h-8 w-64 bg-slate-800/60 rounded-xl mb-3 max-w-[80vw]" />
            <div className="h-4 w-96 bg-slate-800/40 rounded-lg max-w-[90vw]" />
          </div>
        ) : (
          // Standard modern default layout (Never shows old stats)
          <>
            <HeroSection config={{}} />
            <SocialsSection config={{}} />
            <BenefitsSection config={{}} />
            <TiersSection config={{}} tiers={tiers} />
            <HowItWorksSection config={{}} />
            <CardShowcaseSection config={{}} />
            <FaqSection config={{}} />
            <SocialFooterSection config={{}} />
          </>
        )}
      </main>
    </div>
  );
}
