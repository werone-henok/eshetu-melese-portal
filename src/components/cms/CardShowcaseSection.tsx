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
    <section id="cards" className="py-20 lg:py-28 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-600/5 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Award className="w-3.5 h-3.5" />
            <span>{t('cards.badge', 'Digital Pass Architecture', 'የዲጂታል ካርድ አሰራር')}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {subheading}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/membersgallary"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Users className="w-4 h-4" />
              <span>{t('cards.openGallery', 'Explore All Members Gallery', 'የአባላት ጋለሪን ይመልከቱ')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Dynamic Card Display - Preview Pass */}
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <div className="w-full max-w-[750px]">
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

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs sm:text-sm">
            <Link
              href="/membersgallary"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all hover:scale-105"
            >
              <Users className="w-4 h-4" />
              <span>{t('cards.viewAllMembers', 'Browse Members Directory', 'ሙሉ የአባላት ዝርዝር')}</span>
            </Link>

            <Link
              href={`/card/${displayMember.membershipCode}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4 text-amber-400" />
              <span>{t('cards.viewFullPass', 'View Full Digital Pass', 'ሙሉ የዲጂታል ካርድ ይመልከቱ')}</span>
            </Link>

            <Link
              href="/membersgallary"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-colors"
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
