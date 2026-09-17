'use client';

import React from 'react';
import {
  Send,
  ExternalLink,
  Users2,
  Share2,
} from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

export interface SocialItem {
  platform: 'youtube' | 'telegram' | 'tiktok' | 'facebook' | 'instagram' | 'x' | 'other';
  name: string;
  nameAm?: string;
  handle: string;
  count: string;
  countLabel: string;
  countLabelAm?: string;
  url: string;
  color?: string;
}

interface SocialsSectionProps {
  config: {
    heading?: string;
    headingAm?: string;
    subheading?: string;
    subheadingAm?: string;
    socials?: SocialItem[];
  };
}

export function SocialsSection({ config }: SocialsSectionProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'ይፋዊ የማህበራዊ ሚዲያ ገጾች እና ተከታዮች'
      : config?.heading || 'Official Social Communities & Follower Reach';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm || 'በመላው ዓለም ከ 3.2M+ በላይ ተከታዮች ጋር በቀጥታ ይገናኙ፤ በሁሉም ማህበራዊ አውታሮች ቤተሰብ ይሁኑ።'
      : config?.subheading || 'Join over 3.2M+ supporters across official YouTube, Telegram, TikTok, and Facebook communities.';

  const defaultSocials: SocialItem[] = [
    {
      platform: 'youtube',
      name: 'YouTube',
      nameAm: 'ዩቲዩብ',
      handle: '@eshetumelese',
      count: '3.2M+',
      countLabel: 'Subscribers',
      countLabelAm: 'ተመዝጋቢዎች',
      url: 'https://youtube.com/@eshetumelese',
      color: '#FF0000',
    },
    {
      platform: 'telegram',
      name: 'Telegram',
      nameAm: 'ቴሌግራም',
      handle: 't.me/eshetumelese',
      count: '480K+',
      countLabel: 'Community Members',
      countLabelAm: 'የቻናል አባላት',
      url: 'https://t.me/eshetumelese',
      color: '#229ED9',
    },
    {
      platform: 'tiktok',
      name: 'TikTok',
      nameAm: 'ቲክቶክ',
      handle: '@eshetumelese',
      count: '1.8M+',
      countLabel: 'Followers',
      countLabelAm: 'ተከታዮች',
      url: 'https://tiktok.com/@eshetumelese',
      color: '#FE2C55',
    },
    {
      platform: 'facebook',
      name: 'Facebook',
      nameAm: 'ፌስቡክ',
      handle: 'facebook.com/eshetumelese',
      count: '1.2M+',
      countLabel: 'Followers',
      countLabelAm: 'ተከታዮች',
      url: 'https://facebook.com/eshetumelese',
      color: '#1877F2',
    },
  ];

  const socials = config?.socials && config.socials.length > 0 ? config.socials : defaultSocials;

  const getPlatformIcon = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return (
          <svg className="w-6 h-6 text-red-500 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case 'telegram':
        return <Send className="w-6 h-6 text-sky-400" />;
      case 'tiktok':
        return (
          <svg className="w-6 h-6 text-pink-400 fill-current" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-1.01-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 2.89 3.5 2.73 1.34-.07 2.54-.92 2.98-2.16.21-.57.26-1.19.26-1.8V.02h.67z"/>
          </svg>
        );
      case 'facebook':
        return (
          <svg className="w-6 h-6 text-blue-500 fill-current" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6 text-pink-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case 'x':
      case 'twitter':
        return (
          <svg className="w-6 h-6 text-slate-200 fill-current" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      default:
        return <Share2 className="w-6 h-6 text-amber-400" />;
    }
  };

  const getPlatformAmharicName = (platform: string, fallback?: string) => {
    switch (platform?.toLowerCase()) {
      case 'youtube':
        return 'ዩቲዩብ';
      case 'telegram':
        return 'ቴሌግራም';
      case 'tiktok':
        return 'ቲክቶክ';
      case 'facebook':
        return 'ፌስቡክ';
      case 'instagram':
        return 'ኢንስታግራም';
      case 'x':
      case 'twitter':
        return 'ኤክስ (ትዊተር)';
      default:
        return fallback || 'ማህበራዊ ገጽ';
    }
  };

  const getPlatformAmharicLabel = (label?: string, fallback?: string) => {
    const l = (label || '').toLowerCase();
    if (l.includes('sub')) return 'ተመዝጋቢዎች';
    if (l.includes('member')) return 'የቻናል አባላት';
    if (l.includes('follow')) return 'ተከታዮች';
    return fallback || label || 'ተከታዮች';
  };

  return (
    <section id="socials" className="py-16 lg:py-24 relative border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
            <Users2 className="w-4 h-4" />
            <span>{lang === 'am' ? 'የማህበራዊ ትስስር ገጾች' : 'Social Channels & Community'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {subheading}
          </p>
        </div>

        {/* Social Cards Grid */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 ${socials.length >= 4 ? 'lg:grid-cols-4' : socials.length === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-5 sm:gap-6`}>
          {socials.map((social, idx) => {
            const displayName =
              lang === 'am'
                ? (social.nameAm && social.nameAm !== 'ቴሌግራም' ? social.nameAm : getPlatformAmharicName(social.platform, social.nameAm || social.name))
                : social.name;
            const displayLabel =
              lang === 'am'
                ? (social.countLabelAm || getPlatformAmharicLabel(social.countLabel))
                : social.countLabel;

            return (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative p-6 rounded-3xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {getPlatformIcon(social.platform)}
                    </div>
                    <span className="p-2 rounded-xl bg-slate-950/60 text-slate-500 group-hover:text-amber-400 transition-colors">
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>

                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-100 font-mono tracking-tight block">
                    {social.count}
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-amber-400 block mt-1 uppercase tracking-wider">
                    {displayLabel}
                  </span>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-200">{displayName}</span>
                  <span className="font-mono text-slate-500 truncate max-w-[120px]">{social.handle}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
