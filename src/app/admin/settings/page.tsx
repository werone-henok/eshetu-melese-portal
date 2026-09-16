'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  Upload,
  Save,
  CheckCircle2,
  Loader2,
  Image as ImageIcon,
  Globe,
  Sparkles,
  RefreshCw,
  Trash2,
  Eye,
  ShieldCheck,
  Bookmark,
} from 'lucide-react';
import { useAppSettings, DEFAULT_BRANDING, SiteBranding } from '@/context/AppSettingsContext';

export default function GeneralSettingsPage() {
  const router = useRouter();
  const { branding, updateBranding } = useAppSettings();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const [form, setForm] = useState<SiteBranding>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFavicon, setUploadingFavicon] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function init() {
      try {
        const authRes = await fetch('/api/auth/me');
        if (!authRes.ok) {
          router.push('/admin/login');
          return;
        }
        const authData = await authRes.json();
        setCurrentUser(authData.user);

        // Fetch settings
        const settingsRes = await fetch('/api/cms/settings');
        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data.branding) {
            setForm(data.branding);
          }
        }
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handleFileUpload = async (file: File, type: 'logo' | 'favicon') => {
    setError(null);
    if (type === 'logo') setUploadingLogo(true);
    else setUploadingFavicon(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cms/settings/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      if (type === 'logo') {
        setForm((prev) => ({ ...prev, logoUrl: data.url }));
      } else {
        setForm((prev) => ({ ...prev, faviconUrl: data.url }));
      }
    } catch (err: any) {
      setError(err.message || `Failed to upload ${type} image`);
    } finally {
      if (type === 'logo') setUploadingLogo(false);
      else setUploadingFavicon(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/cms/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save settings');
      }

      // Update global client context immediately
      updateBranding(data.branding);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      setError(err.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset branding, logo, and favicon to default values?')) {
      setForm(DEFAULT_BRANDING);
    }
  };

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'EDITOR';

  const activeFavicon = form.faviconUrl || form.logoUrl;

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              General, Logo & Favicon Settings
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Configure the website logo, browser tab favicon, primary site name, and subtitles in English and Amharic.
            </p>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/25 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Saved & Synced!' : 'Save Branding Changes'}</span>
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Website logo, favicon, and brand name successfully updated and broadcasted across the portal!</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl">
          {/* Form Column */}
          <div className="lg:col-span-7 space-y-6">
            <form onSubmit={handleSave} className="space-y-6">
              {/* Logo Management Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>Website Brand Logo</span>
                  </div>
                  {form.logoUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, logoUrl: '' }))}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove Logo</span>
                    </button>
                  )}
                </div>

                {/* Upload or Drop Area */}
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Logo Preview Square */}
                  <div className="w-24 h-24 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center p-2 relative group overflow-hidden shrink-0 shadow-inner">
                    {form.logoUrl ? (
                      <img
                        src={form.logoUrl}
                        alt="Site Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-500">
                        <ShieldCheck className="w-8 h-8 mx-auto mb-1 text-amber-500/40" />
                        <span className="text-[10px] uppercase font-bold block">No Logo</span>
                      </div>
                    )}
                    {uploadingLogo && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2.5 w-full text-xs">
                    <p className="text-slate-300 font-medium">
                      Upload your high-resolution logo image (PNG, SVG, JPG, or WebP). Recommended size: square or landscape, transparent background.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        ref={logoInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'logo');
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingLogo}
                        onClick={() => logoInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                      </button>

                      <span className="text-slate-500 text-[11px]">or enter media URL below</span>
                    </div>

                    <input
                      type="text"
                      value={form.logoUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))}
                      placeholder="e.g. /uploads/branding/... or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Favicon Management Card */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-100">
                    <Bookmark className="w-4 h-4 text-amber-500" />
                    <span>Browser Tab Favicon</span>
                  </div>
                  {form.faviconUrl && (
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, faviconUrl: '' }))}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Use Logo as Favicon</span>
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Favicon Preview Square */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 flex items-center justify-center p-2 relative group overflow-hidden shrink-0 shadow-inner">
                    {activeFavicon ? (
                      <img
                        src={activeFavicon}
                        alt="Browser Favicon"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-center text-slate-500">
                        <Bookmark className="w-5 h-5 mx-auto text-amber-500/40" />
                      </div>
                    )}
                    {uploadingFavicon && (
                      <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                      </div>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div className="flex-1 space-y-2.5 w-full text-xs">
                    <p className="text-slate-300 font-medium">
                      Upload a small square icon (.ico, .png, .svg, .webp) for browser tabs and bookmarks. If empty, the main website logo is used automatically.
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="file"
                        ref={faviconInputRef}
                        accept="image/*,.ico"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'favicon');
                        }}
                        className="hidden"
                      />
                      <button
                        type="button"
                        disabled={uploadingFavicon}
                        onClick={() => faviconInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 transition-colors disabled:opacity-50"
                      >
                        <Upload className="w-3.5 h-3.5 text-amber-400" />
                        <span>{uploadingFavicon ? 'Uploading...' : 'Upload Favicon File'}</span>
                      </button>

                      <span className="text-slate-500 text-[11px]">or enter media URL below</span>
                    </div>

                    <input
                      type="text"
                      value={form.faviconUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, faviconUrl: e.target.value }))}
                      placeholder="e.g. /uploads/branding/favicon.png or https://..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>

              {/* Website Name & Taglines */}
              <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
                <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-slate-100">
                  <Globe className="w-4 h-4 text-amber-500" />
                  <span>Website Name & Brand Identity</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* English Name */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      Website Name (English)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.siteName}
                      onChange={(e) => setForm((prev) => ({ ...prev, siteName: e.target.value }))}
                      placeholder="ESHETU MELESE"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Amharic Name */}
                  <div>
                    <label className="block font-bold text-slate-300 mb-1">
                      የድረ-ገጽ ስም (Amharic Translation)
                    </label>
                    <input
                      type="text"
                      required
                      value={form.siteNameAm}
                      onChange={(e) => setForm((prev) => ({ ...prev, siteNameAm: e.target.value }))}
                      placeholder="እሸቱ መለሰ"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* English Tagline */}
                  <div>
                    <label className="block font-medium text-slate-400 mb-1">
                      Tagline / Subtitle (English)
                    </label>
                    <input
                      type="text"
                      value={form.tagline}
                      onChange={(e) => setForm((prev) => ({ ...prev, tagline: e.target.value }))}
                      placeholder="Official Member Portal"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Amharic Tagline */}
                  <div>
                    <label className="block font-medium text-slate-400 mb-1">
                      ንዑስ ርዕስ (Amharic Tagline)
                    </label>
                    <input
                      type="text"
                      value={form.taglineAm}
                      onChange={(e) => setForm((prev) => ({ ...prev, taglineAm: e.target.value }))}
                      placeholder="ይፋዊ የአባላት ፖርታል"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={handleResetDefaults}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  {canEdit && (
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                    >
                      {saving ? 'Saving...' : 'Apply Changes'}
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800 text-sm font-bold text-slate-100">
                <Eye className="w-4 h-4 text-amber-500" />
                <span>Live Previews</span>
              </div>

              <div className="space-y-5">
                {/* Browser Tab Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Browser Tab Preview
                  </span>
                  <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-2.5">
                    <div className="w-5 h-5 rounded overflow-hidden flex items-center justify-center shrink-0 bg-slate-900 border border-slate-800">
                      {activeFavicon ? (
                        <img src={activeFavicon} alt="Favicon" className="w-4 h-4 object-contain" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5 text-amber-500" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 truncate">
                      {form.siteName || 'Eshetu Melese'} &bull; {form.tagline || 'Official Member Portal'}
                    </div>
                  </div>
                </div>

                {/* English Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    English Navbar Preview
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    {form.logoUrl ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 flex items-center justify-center p-0.5 shrink-0">
                        <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shrink-0">
                        <ShieldCheck className="w-6 h-6 text-slate-950" />
                      </div>
                    )}
                    <div>
                      <span className="font-extrabold text-base tracking-tight text-slate-100 block">
                        {form.siteName || 'ESHETU MELESE'}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-amber-500/90 font-semibold block">
                        {form.tagline || 'Official Member Portal'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amharic Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Amharic (አማርኛ) Navbar Preview
                  </span>
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    {form.logoUrl ? (
                      <div className="w-11 h-11 rounded-xl overflow-hidden border border-amber-500/30 bg-slate-900 flex items-center justify-center p-0.5 shrink-0">
                        <img src={form.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 flex items-center justify-center shadow-md shrink-0">
                        <ShieldCheck className="w-6 h-6 text-slate-950" />
                      </div>
                    )}
                    <div>
                      <span className="font-extrabold text-base tracking-tight text-slate-100 block">
                        {form.siteNameAm || 'እሸቱ መለሰ'}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-amber-500/90 font-semibold block">
                        {form.taglineAm || 'ይፋዊ የአባላት ፖርታል'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Copyright Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 block">
                    Footer Branding Preview
                  </span>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
                    {form.logoUrl ? (
                      <img src={form.logoUrl} alt="Logo" className="w-4 h-4 object-contain" />
                    ) : (
                      <ShieldCheck className="w-4 h-4 text-amber-500" />
                    )}
                    <span className="truncate">
                      Official {form.siteName || 'Eshetu Melese'} Member Portal • All Rights Reserved © 2026
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
