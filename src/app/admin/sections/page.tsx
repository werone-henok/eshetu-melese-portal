'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  GripVertical,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Save,
  Layers,
  Edit,
  Loader2,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export default function SectionBuilderPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const [editingSection, setEditingSection] = useState<any | null>(null);

  const fetchSections = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cms/sections?all=true');
      if (res.ok) {
        const data = await res.json();
        setSections(data.sections || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function checkAuth() {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }
      const authData = await authRes.json();
      setCurrentUser(authData.user);
    }
    checkAuth();
    fetchSections();
  }, [router]);

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...sections];
    const temp = next[index - 1];
    next[index - 1] = next[index];
    next[index] = temp;
    setSections(next);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    const temp = next[index + 1];
    next[index + 1] = next[index];
    next[index] = temp;
    setSections(next);
  };

  const toggleVisibility = (index: number) => {
    const next = [...sections];
    next[index].isVisible = !next[index].isVisible;
    setSections(next);
  };

  const handleSaveOrder = async () => {
    setSaving(true);
    setSavedSuccess(false);

    try {
      const orderedIds = sections.map((s, idx) => ({
        id: s.id,
        displayOrder: idx + 1,
        isVisible: s.isVisible,
      }));

      const res = await fetch('/api/cms/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderedIds }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save order');

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSection) return;

    try {
      const res = await fetch(`/api/cms/sections/${editingSection.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingSection.title,
          configuration: editingSection.configuration,
        }),
      });

      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to update section content');
      }

      setEditingSection(null);
      await fetchSections();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteSection = async (section: any) => {
    if (!confirm(`Are you sure you want to delete the "${section.title}" section from the website?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/cms/sections/${section.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete section');
      }
      await fetchSections();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const canEdit = currentUser?.role === 'ADMIN' || currentUser?.role === 'EDITOR';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              CMS Section Builder & Rearranger
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Move sections up or down (e.g. place FAQ above Benefits), toggle visibility, and edit content without modifying code.
            </p>
          </div>

          {canEdit && (
            <button
              type="button"
              disabled={saving}
              onClick={handleSaveOrder}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{savedSuccess ? 'Published to Public Site!' : 'Save & Publish Order'}</span>
            </button>
          )}
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Website sections re-ordered! Check your public landing page to verify immediate reflection.</span>
          </div>
        )}

        {/* Re-orderable Section List */}
        <div className="max-w-3xl space-y-3">
          {sections.map((section, idx) => (
            <div
              key={section.id}
              className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                section.isVisible
                  ? 'bg-slate-900/90 border-slate-800 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg">
                  #{idx + 1}
                </span>

                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <span>{section.title}</span>
                    <span className="text-[10px] font-mono uppercase text-slate-500">
                      ({section.sectionType})
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 truncate max-w-md">
                    {section.configuration?.headline ||
                      section.configuration?.heading ||
                      'Standard layout configuration'}
                  </p>
                </div>
              </div>

              {/* Actions & Reordering Controls */}
              {canEdit && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={idx === 0}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                    title="Move Up"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={idx === sections.length - 1}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 transition-colors"
                    title="Move Down"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => toggleVisibility(idx)}
                    className={`p-2 rounded-lg transition-colors ${
                      section.isVisible
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                    title={section.isVisible ? 'Hide Section' : 'Show Section'}
                  >
                    {section.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSection(JSON.parse(JSON.stringify(section)))}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 transition-colors"
                    title="Edit Content"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteSection(section)}
                    className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 transition-colors"
                    title={`Delete Section: ${section.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>


        {/* Section Content Editing Modal */}
        {editingSection && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-slate-100">
                  Edit Content: {editingSection.title}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditingSection(null)}
                  className="text-slate-400 hover:text-slate-100 text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveContent} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Section Display Title</label>
                  <input
                    type="text"
                    value={editingSection.title}
                    onChange={(e) => setEditingSection({ ...editingSection, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Media Uploader for Section */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <label className="block font-medium text-slate-300">
                    Section Artwork / Media Image (Upload or URL)
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      value={editingSection.configuration?.mediaUrl || ''}
                      onChange={(e) =>
                        setEditingSection({
                          ...editingSection,
                          configuration: { ...editingSection.configuration, mediaUrl: e.target.value },
                        })
                      }
                      placeholder="/uploads/... or https://..."
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                    />
                    <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer border border-slate-700 shrink-0">
                      Upload File
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const formData = new FormData();
                          formData.append('file', file);
                          try {
                            const res = await fetch('/api/cms/settings/upload', {
                              method: 'POST',
                              body: formData,
                            });
                            const data = await res.json();
                            if (res.ok && data.url) {
                              setEditingSection({
                                ...editingSection,
                                configuration: { ...editingSection.configuration, mediaUrl: data.url },
                              });
                              return;
                            }
                          } catch (err) {
                            console.error('Upload error:', err);
                          }

                          // Fallback to local data url
                          const reader = new FileReader();
                          reader.onload = () => {
                            setEditingSection({
                              ...editingSection,
                              configuration: { ...editingSection.configuration, mediaUrl: reader.result as string },
                            });
                          };
                          reader.readAsDataURL(file);
                        }}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {editingSection.configuration?.mediaUrl && (
                    <div className="mt-2 flex items-center gap-3 p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <img
                        src={editingSection.configuration.mediaUrl}
                        alt="Preview"
                        className="w-12 h-12 rounded object-cover border border-slate-700"
                      />
                      <span className="text-[10px] text-emerald-400 font-medium truncate">
                        Media attached and ready to display
                      </span>
                    </div>
                  )}
                </div>


                {/* Socials / Social Channels Section Custom Editor */}
                {editingSection.sectionType === 'socials' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                        Social Media Channels & Follower Counts
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentSocials = editingSection.configuration?.socials || [];
                          setEditingSection({
                            ...editingSection,
                            configuration: {
                              ...editingSection.configuration,
                              socials: [
                                ...currentSocials,
                                {
                                  platform: 'youtube',
                                  name: 'New Platform',
                                  nameAm: '',
                                  handle: '@handle',
                                  count: '100K+',
                                  countLabel: 'Subscribers / Followers',
                                  countLabelAm: '',
                                  url: 'https://',
                                },
                              ],
                            },
                          });
                        }}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300"
                      >
                        + Add Social Platform
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingSection.configuration?.socials || [
                        { platform: 'youtube', name: 'YouTube', handle: '@eshetumelese', count: '3.2M+', countLabel: 'Subscribers', url: 'https://youtube.com/@eshetumelese' },
                        { platform: 'telegram', name: 'Telegram', handle: 't.me/eshetumelese', count: '480K+', countLabel: 'Channel Members', url: 'https://t.me/eshetumelese' },
                        { platform: 'tiktok', name: 'TikTok', handle: '@eshetumelese', count: '1.8M+', countLabel: 'Followers', url: 'https://tiktok.com/@eshetumelese' },
                        { platform: 'facebook', name: 'Facebook', handle: 'facebook.com/eshetumelese', count: '1.2M+', countLabel: 'Followers', url: 'https://facebook.com/eshetumelese' },
                      ]).map((soc: any, sIdx: number) => (
                        <div key={sIdx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                          <div className="flex items-center justify-between gap-2">
                            <select
                              value={soc.platform || 'youtube'}
                              onChange={(e) => {
                                const newSocials = [...(editingSection.configuration?.socials || [])];
                                newSocials[sIdx] = { ...newSocials[sIdx], platform: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, socials: newSocials },
                                });
                              }}
                              className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-bold"
                            >
                              <option value="youtube">YouTube</option>
                              <option value="telegram">Telegram</option>
                              <option value="tiktok">TikTok</option>
                              <option value="facebook">Facebook</option>
                              <option value="instagram">Instagram</option>
                              <option value="x">X / Twitter</option>
                              <option value="other">Other Network</option>
                            </select>

                            <input
                              type="text"
                              placeholder="Display Name (e.g. YouTube)"
                              value={soc.name}
                              onChange={(e) => {
                                const newSocials = [...(editingSection.configuration?.socials || [])];
                                newSocials[sIdx] = { ...newSocials[sIdx], name: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, socials: newSocials },
                                });
                              }}
                              className="flex-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs font-semibold"
                            />

                            <button
                              type="button"
                              onClick={() => {
                                const newSocials = [...(editingSection.configuration?.socials || [])];
                                newSocials.splice(sIdx, 1);
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, socials: newSocials },
                                });
                              }}
                              className="p-1 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              title="Delete Social Channel"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">Followers / Count</label>
                              <input
                                type="text"
                                placeholder="e.g. 3.2M+"
                                value={soc.count}
                                onChange={(e) => {
                                  const newSocials = [...(editingSection.configuration?.socials || [])];
                                  newSocials[sIdx] = { ...newSocials[sIdx], count: e.target.value };
                                  setEditingSection({
                                    ...editingSection,
                                    configuration: { ...editingSection.configuration, socials: newSocials },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-amber-400 font-mono text-xs font-bold"
                              />
                            </div>

                            <div>
                              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">Metric Label</label>
                              <input
                                type="text"
                                placeholder="e.g. Subscribers"
                                value={soc.countLabel}
                                onChange={(e) => {
                                  const newSocials = [...(editingSection.configuration?.socials || [])];
                                  newSocials[sIdx] = { ...newSocials[sIdx], countLabel: e.target.value };
                                  setEditingSection({
                                    ...editingSection,
                                    configuration: { ...editingSection.configuration, socials: newSocials },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                              />
                            </div>

                            <div className="col-span-2 sm:col-span-1">
                              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">Handle / Username</label>
                              <input
                                type="text"
                                placeholder="@handle"
                                value={soc.handle}
                                onChange={(e) => {
                                  const newSocials = [...(editingSection.configuration?.socials || [])];
                                  newSocials[sIdx] = { ...newSocials[sIdx], handle: e.target.value };
                                  setEditingSection({
                                    ...editingSection,
                                    configuration: { ...editingSection.configuration, socials: newSocials },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-0.5">Profile URL</label>
                            <input
                              type="text"
                              placeholder="https://youtube.com/@..."
                              value={soc.url}
                              onChange={(e) => {
                                const newSocials = [...(editingSection.configuration?.socials || [])];
                                newSocials[sIdx] = { ...newSocials[sIdx], url: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, socials: newSocials },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-mono text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stats Section Custom Editor */}
                {editingSection.sectionType === 'stats' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                        Community Impact & Statistics Items
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const currentStats = editingSection.configuration?.stats || [];
                          setEditingSection({
                            ...editingSection,
                            configuration: {
                              ...editingSection.configuration,
                              stats: [...currentStats, { value: '100+', label: 'New Metric' }],
                            },
                          });
                        }}
                        className="text-[11px] font-bold text-amber-400 hover:text-amber-300"
                      >
                        + Add Metric
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(editingSection.configuration?.stats || [
                        { label: 'Subscribers & Followers', value: '3.2M+' },
                        { label: 'Active Verified Members', value: '145K+' },
                        { label: 'Countries Represented', value: '68+' },
                        { label: 'Community Initiatives', value: '500+' },
                      ]).map((st: any, sIdx: number) => (
                        <div key={sIdx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                          <div className="w-1/3">
                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Value / Number</label>
                            <input
                              type="text"
                              value={st.value}
                              onChange={(e) => {
                                const newStats = [...(editingSection.configuration?.stats || [
                                  { label: 'Subscribers & Followers', value: '3.2M+' },
                                  { label: 'Active Verified Members', value: '145K+' },
                                  { label: 'Countries Represented', value: '68+' },
                                  { label: 'Community Initiatives', value: '500+' },
                                ])];
                                newStats[sIdx] = { ...newStats[sIdx], value: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, stats: newStats },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs font-bold"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">Label / Description</label>
                            <input
                              type="text"
                              value={st.label}
                              onChange={(e) => {
                                const newStats = [...(editingSection.configuration?.stats || [
                                  { label: 'Subscribers & Followers', value: '3.2M+' },
                                  { label: 'Active Verified Members', value: '145K+' },
                                  { label: 'Countries Represented', value: '68+' },
                                  { label: 'Community Initiatives', value: '500+' },
                                ])];
                                newStats[sIdx] = { ...newStats[sIdx], label: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, stats: newStats },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                            />
                          </div>
                          {sIdx > 3 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newStats = [...(editingSection.configuration?.stats || [])];
                                newStats.splice(sIdx, 1);
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, stats: newStats },
                                });
                              }}
                              className="text-red-400 hover:text-red-300 self-end mb-1 text-xs"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Benefits Section Custom Editor */}
                {editingSection.sectionType === 'benefits' && (
                  <div className="space-y-4 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                      Why Become a Verified Member (Benefits Cards)
                    </span>

                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Section Main Heading</label>
                      <input
                        type="text"
                        value={editingSection.configuration?.heading || 'Why Become a Verified Member?'}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            configuration: { ...editingSection.configuration, heading: e.target.value },
                          })
                        }
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Subheading / Description</label>
                      <textarea
                        rows={2}
                        value={editingSection.configuration?.subheading || 'Enjoy distinctive recognition, direct engagement, and tangible community privileges.'}
                        onChange={(e) =>
                          setEditingSection({
                            ...editingSection,
                            configuration: { ...editingSection.configuration, subheading: e.target.value },
                          })
                        }
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="space-y-3 pt-2">
                      <label className="block text-[11px] uppercase tracking-wider text-amber-400/90 font-bold">
                        Benefit Feature Cards (4 Cards)
                      </label>
                      {(editingSection.configuration?.items || [
                        {
                          title: 'Official Digital Pass',
                          desc: 'Tamper-proof digital badge with verifiable cryptographic QR code.',
                          icon: 'ShieldCheck',
                        },
                        {
                          title: 'Global Recognition',
                          desc: 'Instant verification by phone number, ID or name anywhere across the world.',
                          icon: 'Globe',
                        },
                        {
                          title: 'Direct Live Access',
                          desc: 'Exclusive member-only Q&As, roundtables, and VIP broadcast invites.',
                          icon: 'Radio',
                        },
                        {
                          title: 'Community Impact',
                          desc: 'Directly fuel charitable, media, and transformational community projects.',
                          icon: 'HeartHandshake',
                        },
                      ]).map((bItem: any, bIdx: number) => (
                        <div key={bIdx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">
                                Card #{bIdx + 1} Title
                              </label>
                              <input
                                type="text"
                                value={bItem.title}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.configuration?.items || [
                                    { title: 'Official Digital Pass', desc: 'Tamper-proof digital badge with verifiable cryptographic QR code.', icon: 'ShieldCheck' },
                                    { title: 'Global Recognition', desc: 'Instant verification by phone number, ID or name anywhere across the world.', icon: 'Globe' },
                                    { title: 'Direct Live Access', desc: 'Exclusive member-only Q&As, roundtables, and VIP broadcast invites.', icon: 'Radio' },
                                    { title: 'Community Impact', desc: 'Directly fuel charitable, media, and transformational community projects.', icon: 'HeartHandshake' },
                                  ])];
                                  newItems[bIdx] = { ...newItems[bIdx], title: e.target.value };
                                  setEditingSection({
                                    ...editingSection,
                                    configuration: { ...editingSection.configuration, items: newItems },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 font-bold text-xs"
                              />
                            </div>
                            <div className="w-36">
                              <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">
                                Icon
                              </label>
                              <select
                                value={bItem.icon || 'ShieldCheck'}
                                onChange={(e) => {
                                  const newItems = [...(editingSection.configuration?.items || [])];
                                  newItems[bIdx] = { ...newItems[bIdx], icon: e.target.value };
                                  setEditingSection({
                                    ...editingSection,
                                    configuration: { ...editingSection.configuration, items: newItems },
                                  });
                                }}
                                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                              >
                                <option value="ShieldCheck">Shield (Pass)</option>
                                <option value="Globe">Globe (Global)</option>
                                <option value="Radio">Radio (Live)</option>
                                <option value="HeartHandshake">Heart (Impact)</option>
                              </select>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] uppercase text-slate-500 font-bold mb-1">
                              Card Description
                            </label>
                            <textarea
                              rows={2}
                              value={bItem.desc}
                              onChange={(e) => {
                                const newItems = [...(editingSection.configuration?.items || [])];
                                newItems[bIdx] = { ...newItems[bIdx], desc: e.target.value };
                                setEditingSection({
                                  ...editingSection,
                                  configuration: { ...editingSection.configuration, items: newItems },
                                });
                              }}
                              className="w-full px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-100 text-xs"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* English Texts (for other section types) */}
                {editingSection.sectionType !== 'stats' && editingSection.sectionType !== 'benefits' && (
                  <div className="space-y-3 pt-2 border-t border-slate-800">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                      English Text Content
                    </span>
                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Headline / Heading (English)</label>
                      <input
                        type="text"
                        value={editingSection.configuration?.headline ?? editingSection.configuration?.heading ?? ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingSection({
                            ...editingSection,
                            configuration: {
                              ...editingSection.configuration,
                              headline: val,
                              heading: val,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block font-medium text-slate-400 mb-1">Subheadline / Paragraph (English)</label>
                      <textarea
                        rows={3}
                        value={
                          editingSection.configuration?.subheadline ??
                          editingSection.configuration?.subheading ??
                          editingSection.configuration?.bio ??
                          editingSection.configuration?.description ??
                          ''
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setEditingSection({
                            ...editingSection,
                            configuration: {
                              ...editingSection.configuration,
                              subheadline: val,
                              subheading: val,
                              bio: val,
                              description: val,
                            },
                          });
                        }}
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>
                )}

                {/* Amharic Texts */}
                <div className="space-y-3 pt-3 border-t border-slate-800">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block">
                    የአማርኛ ጽሁፍ (Amharic Translation)
                  </span>
                  <div>
                    <label className="block font-medium text-slate-400 mb-1">ርዕስ (Amharic Heading)</label>
                    <input
                      type="text"
                      value={editingSection.configuration?.headingAm ?? editingSection.configuration?.headlineAm ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingSection({
                          ...editingSection,
                          configuration: {
                            ...editingSection.configuration,
                            headingAm: val,
                            headlineAm: val,
                          },
                        });
                      }}
                      placeholder="የክፍሉ አማርኛ ርዕስ..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-400 mb-1">ዝርዝር መግለጫ (Amharic Paragraph / Bio)</label>
                    <textarea
                      rows={3}
                      value={
                        editingSection.configuration?.subheadingAm ??
                        editingSection.configuration?.subheadlineAm ??
                        editingSection.configuration?.bioAm ??
                        editingSection.configuration?.descriptionAm ??
                        ''
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingSection({
                          ...editingSection,
                          configuration: {
                            ...editingSection.configuration,
                            subheadingAm: val,
                            subheadlineAm: val,
                            bioAm: val,
                            descriptionAm: val,
                          },
                        });
                      }}
                      placeholder="የክፍሉ አማርኛ ዝርዝር ማብራሪያ..."
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400 font-sans"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    Save Bilingual Content & Media
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
