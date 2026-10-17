'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Download,
  Award,
  Users,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { CardElementConfig, DEFAULT_CARD_TEMPLATE } from '@/lib/card-types';
import { useAppSettings } from '@/context/AppSettingsContext';
import { DigitalCardCanvas } from '@/components/cards/DigitalCardCanvas';

interface ShowcaseProps {
  config: {
    heading?: string;
    subheading?: string;
  };
}

export function CardShowcaseSection({ config }: ShowcaseProps) {
  const { lang, t } = useAppSettings();
  const [sampleMember, setSampleMember] = useState<any | null>(null);
  const [activeTemplate, setActiveTemplate] = useState<any | null>(null);

  useEffect(() => {
    async function fetchShowcaseData() {
      try {
        const res = await fetch('/api/cards/showcase');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data.members) && data.members.length > 0) {
            setSampleMember(data.members[0]);
          }
          if (Array.isArray(data.templates) && data.templates.length > 0) {
            setActiveTemplate(data.templates[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch card showcase data:', err);
      }
    }
    fetchShowcaseData();
  }, []);

  const heading =
    config?.heading ||
    t(
      'cards.heading',
      'World-Class Digital Membership Cards',
      'ዓለም አቀፍ ደረጃቸውን የጠበቁ ዲጂታል የአባልነት ካርዶች'
    );
  const subheading =
    config?.subheading ||
    t(
      'cards.subheading',
      'Engineered with crisp typography, scannable QR verification, and custom luxury tier badges.',
      'በካርድ ስቱዲዮ የተነደፉ፣ የተረጋገጡ የአባላት ፎቶዎች እና የሚቃኙ የQR ኮዶች ያሏቸው።'
    );

  const displayMember = sampleMember || {
    fullName: 'ABEBE KEBEDE',
    membershipCode: 'EM-2026-0042',
    tierName: 'Gold',
    badgeColor: '#F59E0B',
    photoUrl: null,
  };

  return (
    <section id="cards" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{t('cards.badge', 'Digital Pass Architecture', 'የዲጂታል ካርድ አሰራር')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>

          <div className="mt-7 flex items-center justify-center gap-3">
            <Link
              href="/membersgallary"
              className="btn-luxury-gold inline-flex items-center gap-2 px-6 py-2.5 text-xs"
            >
              <Users className="w-4 h-4" />
              <span>{t('cards.openGallery', 'Explore All Members Gallery', 'የአባላት ጋለሪን ይመልከቱ')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Card Display - Preview Pass with 3D Sheen Frame */}
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-[750px] relative group">
            {/* Holographic Sheen Aura */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-amber-500/30 via-violet-500/25 to-amber-500/30 rounded-[28px] blur-xl opacity-60 group-hover:opacity-100 transition duration-500" />
            
            <div className="relative rounded-3xl p-2 sm:p-3 glass-panel-gold">
              <DigitalCardCanvas
                member={{
                  fullName: displayMember.fullName,
                  membershipCode: displayMember.membershipCode,
                  photoUrl: displayMember.photoUrl,
                  tierName: displayMember.tier?.name || displayMember.tierName,
                  badgeColor: displayMember.tier?.badgeColor || displayMember.badgeColor,
                  approvedAt: displayMember.approvedAt,
                  createdAt: displayMember.createdAt,
                }}
                template={activeTemplate}
                fallbackImageUrl={displayMember.generatedBadgeUrl}
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <Link
              href="/membersgallary"
              className="btn-luxury-gold flex items-center gap-2 px-6 py-3 text-xs sm:text-sm"
            >
              <Users className="w-4 h-4" />
              <span>{t('cards.viewAllMembers', 'Browse Members Directory', 'ሙሉ የአባላት ዝርዝር')}</span>
            </Link>

            <Link
              href={`/card/${displayMember.membershipCode}`}
              className="btn-luxury-ghost flex items-center gap-2 px-5 py-3 text-xs sm:text-sm"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>{t('cards.viewFullPass', 'View Full Digital Pass', 'ሙሉ የዲጂታል ካርድ ይመልከቱ')}</span>
            </Link>

            <Link
              href="/membersgallary"
              className="px-5 py-3 rounded-2xl glass-panel text-slate-300 hover:text-white flex items-center gap-2 text-xs sm:text-sm transition-all hover:border-emerald-500/40"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{t('cards.verifySearch', 'Search Cards by Name/Phone/Email', 'በስም/ስልክ/ኢሜይል ፈልግ')}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
