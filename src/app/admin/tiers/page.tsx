'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Plus, Edit2, Trash2, Check, Sparkles, Loader2, DollarSign } from 'lucide-react';

export default function TiersPricingManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tiers, setTiers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingTier, setEditingTier] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fetchTiers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tiers');
      if (res.ok) {
        const data = await res.json();
        setTiers(data.tiers || []);
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
    fetchTiers();
  }, [router]);

  const handleOpenEdit = (tier: any) => {
    setEditingTier({
      ...tier,
      perksString: Array.isArray(tier.perks) ? tier.perks.join('\n') : '',
    });
    setShowModal(true);
  };

  const handleOpenNew = () => {
    setEditingTier({
      name: '',
      priceEtb: 1000,
      priceUsd: 30,
      description: '',
      perksString: 'Verified Digital Card\nPriority Access',
      badgeColor: '#D4AF37',
      displayOrder: tiers.length + 1,
      isFeatured: false,
      ctaText: 'Register for Tier',
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const perks = editingTier.perksString
        .split('\n')
        .map((s: string) => s.trim())
        .filter(Boolean);

      const payload = {
        name: editingTier.name,
        priceEtb: parseFloat(editingTier.priceEtb),
        priceUsd: parseFloat(editingTier.priceUsd || 0),
        description: editingTier.description,
        perks,
        badgeColor: editingTier.badgeColor,
        displayOrder: parseInt(editingTier.displayOrder),
        isFeatured: Boolean(editingTier.isFeatured),
        ctaText: editingTier.ctaText,
      };

      const url = editingTier.id ? `/api/tiers/${editingTier.id}` : '/api/tiers';
      const method = editingTier.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save tier');

      setShowModal(false);
      fetchTiers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this membership tier?')) return;
    try {
      const res = await fetch(`/api/tiers/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || 'Failed to delete');
      }
      fetchTiers();
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
              Membership Tiers & Dynamic Pricing
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Any price change saved here immediately updates across all public pages, badges, and registration dropdowns.
            </p>
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={handleOpenNew}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Tier</span>
            </button>
          )}
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="rounded-3xl p-6 bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-3.5 h-3.5 rounded-full shadow-md"
                      style={{ backgroundColor: tier.badgeColor || '#E5A93C' }}
                    />
                    <h3 className="text-xl font-bold text-slate-100">{tier.name}</h3>
                  </div>
                  {tier.isFeatured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                      Featured
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 mb-4 min-h-[32px]">{tier.description}</p>

                {/* Price Display */}
                <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black font-mono text-slate-100">
                      {tier.priceEtb.toLocaleString()}
                    </span>
                    <span className="text-amber-400 font-bold text-xs uppercase">ETB</span>
                    {tier.priceUsd > 0 && (
                      <span className="text-slate-500 text-xs ml-auto font-mono">
                        ${tier.priceUsd} USD
                      </span>
                    )}
                  </div>
                </div>

                {/* Perks Preview */}
                <div className="space-y-1.5 mb-6">
                  {Array.isArray(tier.perks) &&
                    tier.perks.map((p: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{p}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Actions */}
              {canEdit && (
                <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Order: #{tier.displayOrder}</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(tier)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors"
                      title="Edit Tier & Pricing"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tier.id)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs transition-colors"
                      title="Delete Tier"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Edit / Create Tier Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-xl font-bold text-slate-100">
                  {editingTier.id ? `Edit ${editingTier.name} Tier` : 'Create New Membership Tier'}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-slate-100 text-lg"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Tier Name</label>
                  <input
                    type="text"
                    required
                    value={editingTier.name}
                    onChange={(e) => setEditingTier({ ...editingTier, name: e.target.value })}
                    placeholder="e.g. Gold, Platinum, VIP"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Price (ETB) *</label>
                    <input
                      type="number"
                      required
                      value={editingTier.priceEtb}
                      onChange={(e) => setEditingTier({ ...editingTier, priceEtb: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      value={editingTier.priceUsd}
                      onChange={(e) => setEditingTier({ ...editingTier, priceUsd: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={editingTier.description}
                    onChange={(e) => setEditingTier({ ...editingTier, description: e.target.value })}
                    placeholder="Short summary of this tier's privileges"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-300 mb-1">Perks (1 per line)</label>
                  <textarea
                    rows={4}
                    value={editingTier.perksString}
                    onChange={(e) => setEditingTier({ ...editingTier, perksString: e.target.value })}
                    placeholder="Verified Digital Card&#10;Direct Live Access&#10;15% Merch Discount"
                    className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Badge Color</label>
                    <input
                      type="color"
                      value={editingTier.badgeColor || '#D4AF37'}
                      onChange={(e) => setEditingTier({ ...editingTier, badgeColor: e.target.value })}
                      className="w-full h-10 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-300 mb-1">Display Order</label>
                    <input
                      type="number"
                      value={editingTier.displayOrder}
                      onChange={(e) => setEditingTier({ ...editingTier, displayOrder: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingTier.isFeatured}
                        onChange={(e) => setEditingTier({ ...editingTier, isFeatured: e.target.checked })}
                        className="rounded text-amber-500 focus:ring-amber-400"
                      />
                      <span className="text-xs text-slate-300 font-medium">Featured</span>
                    </label>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md"
                  >
                    {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save & Publish Price'}
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
