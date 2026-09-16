'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Palette, Check, Save, Sparkles, RefreshCw, Loader2 } from 'lucide-react';

const PRESET_PALETTES = [
  {
    name: 'Gold Luxury Default',
    colors: {
      primary: '#D4AF37',
      primaryHover: '#B89628',
      secondary: '#0F172A',
      accent: '#F59E0B',
      background: '#0B0F19',
      surface: '#111827',
      card: '#1E293B',
      textPrimary: '#F8FAFC',
      border: '#334155',
    },
  },
  {
    name: 'Emerald Royal Sovereign',
    colors: {
      primary: '#10B981',
      primaryHover: '#059669',
      secondary: '#064E3B',
      accent: '#34D399',
      background: '#022C22',
      surface: '#064E3B',
      card: '#065F46',
      textPrimary: '#F0FDF4',
      border: '#047857',
    },
  },
  {
    name: 'Midnight Velvet Purple',
    colors: {
      primary: '#A855F7',
      primaryHover: '#9333EA',
      secondary: '#3B0764',
      accent: '#C084FC',
      background: '#18022B',
      surface: '#2E0854',
      card: '#3B0764',
      textPrimary: '#FAF5FF',
      border: '#581C87',
    },
  },
  {
    name: 'Solar Flare Amber',
    colors: {
      primary: '#F97316',
      primaryHover: '#EA580C',
      secondary: '#431407',
      accent: '#FB923C',
      background: '#1C0A00',
      surface: '#2D1204',
      card: '#431407',
      textPrimary: '#FFF7ED',
      border: '#7C2D12',
    },
  },
];

export default function ThemeEditorPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTheme, setActiveTheme] = useState<any>(PRESET_PALETTES[0]);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }
      const authData = await authRes.json();
      setCurrentUser(authData.user);

      const themeRes = await fetch('/api/cms/themes?active=true');
      if (themeRes.ok) {
        const d = await themeRes.json();
        if (d.theme) {
          setActiveTheme(d.theme);
        }
      }
    }
    checkAuth();
  }, [router]);

  const handleSelectPreset = (preset: any) => {
    setActiveTheme({
      ...activeTheme,
      name: preset.name,
      configuration: {
        ...activeTheme.configuration,
        colors: preset.colors,
      },
    });
  };

  const handleColorChange = (key: string, value: string) => {
    setActiveTheme({
      ...activeTheme,
      configuration: {
        ...activeTheme.configuration,
        colors: {
          ...(activeTheme.configuration?.colors || activeTheme.colors),
          [key]: value,
        },
      },
    });
  };

  const handleSaveTheme = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch('/api/cms/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: activeTheme.name || 'Custom Theme',
          configuration: activeTheme.configuration || { colors: activeTheme.colors },
          isActive: true,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to activate theme');
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const colors = activeTheme.configuration?.colors || activeTheme.colors || PRESET_PALETTES[0].colors;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Theme & Appearance Customizer
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Customize portal color palettes, buttons, and tokens without writing any CSS.
            </p>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={handleSaveTheme}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Active Theme Saved!' : 'Publish Theme'}</span>
          </button>
        </div>

        {/* Theme Presets Grid */}
        <div className="mb-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4">
            Curated Theme Presets
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_PALETTES.map((preset) => {
              const isSelected = activeTheme.name === preset.name;
              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-amber-500 bg-amber-500/10 shadow-lg'
                      : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-xs text-slate-200">{preset.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
                    <span className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.colors.accent }} />
                    <span className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.colors.surface }} />
                    <span className="w-5 h-5 rounded-full" style={{ backgroundColor: preset.colors.background }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Color Token Controls */}
        <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl max-w-3xl">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-6">
            Granular Color Tokens
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {Object.entries(colors).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="font-semibold text-slate-300 block capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  <span className="font-mono text-slate-500 text-[11px]">{val as string}</span>
                </div>
                <input
                  type="color"
                  value={val as string}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  className="w-10 h-8 rounded-lg bg-transparent border border-slate-700 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
