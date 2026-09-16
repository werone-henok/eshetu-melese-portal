'use client';

import React, { useState } from 'react';
import { COUNTRIES, CountryItem } from '@/lib/countries';
import { ChevronDown, Search } from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface PhoneSelectorProps {
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (country: CountryItem) => void;
  onPhoneChange: (phone: string) => void;
  error?: string;
}

export function InternationalPhoneSelector({
  countryCode,
  phoneNumber,
  onCountryChange,
  onPhoneChange,
  error,
}: PhoneSelectorProps) {
  const { lang } = useAppSettings();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const selectedCountry =
    COUNTRIES.find((c) => c.dial_code === countryCode) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.dial_code.includes(search) ||
      c.code.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {lang === 'am' ? 'ስልክ ቁጥር (አለምአቀፍ)' : 'Phone Number (International)'} <span className="text-amber-400">*</span>
      </label>
      <div className="flex rounded-xl border border-slate-700 bg-slate-900/90 shadow-inner focus-within:border-amber-400 focus-within:ring-1 focus-within:ring-amber-400 transition-all">
        {/* Country Code Dropdown Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3.5 py-3 border-r border-slate-700 bg-slate-800/80 hover:bg-slate-800 rounded-l-xl text-slate-200 font-medium transition-colors"
          suppressHydrationWarning
        >
          <span className="text-lg leading-none">{selectedCountry.flag}</span>
          <span className="text-sm font-semibold">{selectedCountry.dial_code}</span>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Local Number Input */}
        <input
          type="tel"
          id="member-phone-input"
          value={phoneNumber}
          onChange={(e) => onPhoneChange(e.target.value)}
          placeholder="911 234 567"
          className="flex-1 bg-transparent px-4 py-3 text-slate-100 placeholder-slate-500 text-base focus:outline-none"
          required
          suppressHydrationWarning
        />
      </div>

      {/* Floating Dropdown */}
      {isOpen && (
        <div className="absolute z-50 left-0 mt-2 w-80 max-h-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="p-2.5 border-b border-slate-800 bg-slate-950/60">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={lang === 'am' ? 'ሀገር ወይም መለያ ይፈልጉ...' : 'Search country or code...'}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-800/90 text-sm text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:border-amber-400"
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto divide-y divide-slate-800/50">
            {filteredCountries.map((c) => (
              <button
                key={`${c.code}-${c.dial_code}`}
                type="button"
                onClick={() => {
                  onCountryChange(c);
                  setIsOpen(false);
                  setSearch('');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 hover:bg-amber-500/10 transition-colors text-left ${
                  c.dial_code === countryCode ? 'bg-amber-500/15 font-semibold text-amber-300' : 'text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl leading-none">{c.flag}</span>
                  <span className="text-sm">{c.name}</span>
                </div>
                <span className="text-xs font-mono text-slate-400">{c.dial_code}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {error && <p className="mt-1.5 text-xs text-rose-400 font-medium">{error}</p>}
      <p className="mt-1 text-xs text-slate-400">
        Default is Ethiopia (+251). Select other countries if registering from abroad.
      </p>
    </div>
  );
}
