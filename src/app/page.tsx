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
    async function loadData() {
      try {
        const [secRes, tierRes] = await Promise.all([
          fetch('/api/cms/sections'),
          fetch('/api/tiers'),
        ]);

        if (secRes.ok) {
          const secData = await secRes.json();
          setSections(secData.sections || []);
        }

        if (tierRes.ok) {
          const tierData = await tierRes.json();
          setTiers(tierData.tiers || []);
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
        return <StatsSection key={section.id} config={section.configuration} />;
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
        ) : (
          // Instant-load layout (Zero waiting, zero spinner block)
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
