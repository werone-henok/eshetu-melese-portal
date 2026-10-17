'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, MapPin, Ticket, ArrowRight, Sparkles } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface EventItem {
  title: string;
  titleAm?: string;
  date: string;
  location: string;
  description: string;
  ticketUrl?: string;
  badge?: string;
}

interface EventsSectionProps {
  config: {
    heading?: string;
    subheading?: string;
    headingAm?: string;
    subheadingAm?: string;
    events?: EventItem[];
  };
}

export function EventsSection({ config }: EventsSectionProps) {
  const { lang } = useAppSettings();

  const heading =
    lang === 'am'
      ? config?.headingAm || 'መጪ የቀጥታ ዝግጅቶች እና ስታንድ-አፕ ኮሜዲ'
      : config?.heading || 'Upcoming Live Events & Stand-Up Shows';

  const subheading =
    lang === 'am'
      ? config?.subheadingAm || 'በአዲስ አበባ፣ በሰሜን አሜሪካ፣ በአውሮፓ እና በመካከለኛው ምስራቅ የሚካሄዱ ይፋዊ ዝግጅቶች።'
      : config?.subheading ||
        'Catch Comedian Eshetu Melese live on stage across Addis Ababa, North America, Europe, and UAE.';

  const defaultEvents: EventItem[] = [
    {
      title: 'Eshetu Melese Stand-Up World Tour 2026',
      titleAm: 'የእሸቱ መለሰ አለም አቀፍ የስታንድ-አፕ ኮሜዲ ጉዞ 2026',
      date: 'Oct 24, 2026 &bull; 6:00 PM',
      location: 'Millennium Hall, Addis Ababa',
      description: 'Exclusive live special with VIP lounge access for verified Gold, Diamond & Platinum members.',
      badge: 'Selling Fast',
    },
    {
      title: 'North America Diaspora Tour - Washington D.C.',
      titleAm: 'የሰሜን አሜሪካ ዲያስፖራ የኮሜዲ ምሽት - ዋሽንግተን ዲሲ',
      date: 'Nov 15, 2026 &bull; 7:30 PM',
      location: 'Warner Theatre, Washington D.C.',
      description: 'An unforgettable evening of comedy and community connection for our diaspora family.',
      badge: 'VIP Presale',
    },
    {
      title: 'Dubai Global Members Gala & Live Show',
      titleAm: 'የዱባይ አለምአቀፍ አባላት ጋላ እና የኮሜዲ ድግስ',
      date: 'Dec 05, 2026 &bull; 8:00 PM',
      location: 'Dubai Opera House, UAE',
      description: 'Annual high-profile celebration and member meet-and-greet with Eshetu Melese.',
      badge: 'Limited Seats',
    },
  ];

  const events = config?.events || defaultEvents;

  return (
    <section id="events" className="py-24 lg:py-32 relative overflow-hidden border-t border-white/5">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-purple-600/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm backdrop-blur-md">
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'am' ? 'የቀጥታ መድረክ ዝግጅቶች' : 'Live Performances'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-display">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-7 sm:p-8 glass-panel hover:glass-panel-gold shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-2"
            >
              <div>
                <div className="flex items-center justify-between mb-5">
                  <span className="px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold tracking-wider">
                    {ev.badge || 'Upcoming'}
                  </span>
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                    <Ticket className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-white mb-3 font-display tracking-tight group-hover:text-amber-200 transition-colors">
                  {lang === 'am' && ev.titleAm ? ev.titleAm : ev.title}
                </h3>

                <p className="text-xs text-slate-300/80 mb-6 leading-relaxed font-sans min-h-[48px]">
                  {ev.description}
                </p>

                <div className="space-y-2.5 mb-7 text-xs text-slate-300 font-medium p-4 rounded-2xl bg-slate-950/40 border border-white/5">
                  <div className="flex items-center gap-2.5 text-amber-300">
                    <Calendar className="w-4 h-4 shrink-0 text-amber-400" />
                    <span dangerouslySetInnerHTML={{ __html: ev.date }} />
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-400">
                    <MapPin className="w-4 h-4 shrink-0 text-slate-400" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register"
                className="w-full btn-luxury-ghost flex items-center justify-center gap-2 py-3.5 px-4 text-xs font-bold"
              >
                <span>{lang === 'am' ? 'የአባልነት ቅድሚያ ማለፊያ' : 'Member Priority Access'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
