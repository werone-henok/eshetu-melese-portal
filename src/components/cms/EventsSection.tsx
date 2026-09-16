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
    <section id="events" className="py-20 lg:py-28 relative bg-slate-950/60 border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Calendar className="w-3.5 h-3.5" />
            <span>{lang === 'am' ? 'የቀጥታ መድረክ ዝግጅቶች' : 'Live Performances'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-100 tracking-tight">
            {heading}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-400">
            {subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((ev, idx) => (
            <div
              key={idx}
              className="rounded-3xl p-6 sm:p-8 bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 shadow-xl transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 font-mono text-xs font-bold">
                    {ev.badge || 'Upcoming'}
                  </span>
                  <Ticket className="w-5 h-5 text-amber-500" />
                </div>

                <h3 className="text-xl font-bold text-slate-100 mb-3">
                  {lang === 'am' && ev.titleAm ? ev.titleAm : ev.title}
                </h3>

                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {ev.description}
                </p>

                <div className="space-y-2 mb-6 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-2 text-amber-300">
                    <Calendar className="w-4 h-4 shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: ev.date }} />
                  </div>
                  <div className="flex items-center gap-2 text-slate-400">
                    <MapPin className="w-4 h-4 shrink-0 text-slate-500" />
                    <span>{ev.location}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/register"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 text-xs font-bold border border-slate-700 transition-all shadow-md"
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
