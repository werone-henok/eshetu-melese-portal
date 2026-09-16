'use client';

import React from 'react';
import { Users, ShieldCheck, Globe2, Award } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface StatsSectionProps {
  config: {
    stats?: { label: string; labelAm?: string; value: string }[];
  };
}

export function StatsSection({ config }: StatsSectionProps) {
  const { lang } = useAppSettings();

  const defaultStats = [
    { label: 'Subscribers & Followers', labelAm: 'ተከታዮችና ተመልካቾች', value: '3.2M+' },
    { label: 'Active Verified Members', labelAm: 'ተረጋገጡ ንቁ አባላት', value: '145K+' },
    { label: 'Countries Represented', labelAm: 'የተወከሉ አገራት', value: '68+' },
    { label: 'Community Initiatives', labelAm: 'የማህበረሰብ በጎ አድራጎቶች', value: '500+' },
  ];

  const stats = config?.stats || defaultStats;

  const icons = [Users, ShieldCheck, Globe2, Award];

  return (
    <section className="py-12 border-y border-slate-800/80 bg-slate-950/40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => {
            const Icon = icons[i % icons.length];
            const label = lang === 'am' ? (stat.labelAm || stat.label) : stat.label;
            return (
              <div
                key={i}
                className="flex items-center gap-4 p-5 rounded-2xl bg-slate-900/40 border border-slate-800/60"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Icon className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono block">
                    {stat.value}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 font-medium block">
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
