'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  Ban,
  Download,
  AlertCircle,
  Loader2,
  Filter,
  FileSpreadsheet,
  Edit,
  Trash2,
} from 'lucide-react';
import { DigitalCardCanvas } from '@/components/cards/DigitalCardCanvas';

function MembersManagementContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') || 'ALL';

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<any | null>(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [receiptZoomUrl, setReceiptZoomUrl] = useState<string | null>(null);

  const [tiers, setTiers] = useState<any[]>([]);
  const [editingMember, setEditingMember] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({
    fullName: '',
    phoneNumber: '',
    email: '',
    tierId: '',
    status: 'APPROVED',
    paymentMethod: 'Telebirr',
    paymentReference: '',
    photoUrl: '',
  });

  const fetchTiers = async () => {
    try {
      const res = await fetch('/api/tiers');
      if (res.ok) {
        const data = await res.json();
        setTiers(data.tiers || []);
      }
    } catch {}
  };

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const url = new URL('/api/admin/members', window.location.origin);
      if (statusFilter !== 'ALL') url.searchParams.set('status', statusFilter);
      if (searchQuery.trim()) url.searchParams.set('search', searchQuery.trim());

      const res = await fetch(url.toString());
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members || []);
      }
    } catch (err) {
      console.error('Failed to load members:', err);
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

  useEffect(() => {
    fetchMembers();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMembers();
  };

  const handleOpenEdit = (m: any) => {
    setEditingMember(m);
    setEditFormData({
      fullName: m.fullName || '',
      phoneNumber: m.phoneNumber || '',
      email: m.email || '',
      tierId: m.tierId || (tiers[0]?.id ?? ''),
      status: m.status || 'APPROVED',
      paymentMethod: m.paymentMethod || 'Telebirr',
      paymentReference: m.paymentReference || '',
      photoUrl: m.photoUrl || '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editFormData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update member');

      alert('Member updated successfully!');
      setEditingMember(null);
      fetchMembers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteMember = async (member: any) => {
    const confirmDelete = confirm(`Are you sure you want to delete member "${member.fullName}" (${member.membershipCode})? This action cannot be undone.`);
    if (!confirmDelete) return;

    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${member.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete member');

      alert('Member deleted successfully!');
      if (selectedMember?.id === member.id) setSelectedMember(null);
      fetchMembers();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // RBAC Operations
  const handleApprove = async (memberId: string) => {
    if (!confirm('Approve this member and automatically generate digital pass?')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/approve`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Approval failed');
      alert('Member approved and digital badge generated successfully!');
      fetchMembers();
      setSelectedMember(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedMember) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${selectedMember.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectionReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Rejection failed');
      setShowRejectModal(false);
      fetchMembers();
      setSelectedMember(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleSuspend = async (memberId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/suspend`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Action failed');
      fetchMembers();
      setSelectedMember(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRegenerateBadge = async (memberId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/members/${memberId}/regenerate-badge`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Regeneration failed');
      alert('Badge regenerated successfully!');
      fetchMembers();
      setSelectedMember(null);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    const headers = ['MembershipCode', 'FullName', 'Phone', 'NormalizedPhone', 'Country', 'Tier', 'Status', 'PaymentMethod', 'PaymentRef', 'ApprovedAt'];
    const rows = members.map((m) => [
      m.membershipCode,
      `"${m.fullName}"`,
      m.phoneNumber,
      m.normalizedPhone,
      m.country,
      m.tier?.name,
      m.status,
      m.paymentMethod,
      `"${m.paymentReference}"`,
      m.approvedAt ? new Date(m.approvedAt).toISOString() : '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Eshetu-Melese-Members-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const canApprove = currentUser?.role === 'ADMIN';

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Member Verification & Registry
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Review payment proofs, approve applications, and manage digital passes.
            </p>
          </div>

          <button
            type="button"
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all shadow-sm"
            suppressHydrationWarning
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Filters & Search Toolbar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 my-6">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto w-full md:w-auto">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                  statusFilter === st
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                suppressHydrationWarning
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, code..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              suppressHydrationWarning
            />
          </form>
        </div>

        {/* Members Table */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Member</th>
                  <th className="py-3.5 px-4">Tier</th>
                  <th className="py-3.5 px-4">International Phone</th>
                  <th className="py-3.5 px-4">Payment TxID</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {members.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0 shadow-inner">
                          {m.photoUrl ? (
                            <img
                              src={m.photoUrl}
                              alt={m.fullName}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.onerror = null;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.fallback-letter')) {
                                  const span = document.createElement('span');
                                  span.className = 'font-bold text-amber-400 fallback-letter';
                                  span.innerText = m.fullName ? m.fullName.charAt(0).toUpperCase() : '?';
                                  parent.appendChild(span);
                                }
                              }}
                            />
                          ) : (
                            <span className="font-bold text-amber-400 text-sm">
                              {m.fullName ? m.fullName.charAt(0).toUpperCase() : '?'}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-100">{m.fullName}</p>
                          <p className="font-mono text-[10px] text-slate-400">{m.membershipCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-semibold text-amber-300">
                      {m.tier?.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-300">
                      {m.normalizedPhone}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-mono text-slate-300 block">{m.paymentReference}</span>
                      <span className="text-[10px] text-slate-500">{m.paymentMethod}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : m.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : m.status === 'SUSPENDED'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedMember(m)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors border border-slate-700"
                          title="Inspect & Review Member"
                        >
                          Inspect
                        </button>

                        {(currentUser?.role === 'ADMIN' || currentUser?.role === 'EDITOR') && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(m)}
                              className="p-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition-colors"
                              title="Edit Member Details"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteMember(m)}
                              className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {members.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-slate-500">
                      No members found matching your filter criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Member Edit Modal (Admin & Editor) */}
        {editingMember && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-slate-100">Edit Member Details</h3>
                  <span className="font-mono text-xs text-amber-400">{editingMember.membershipCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
                >
                  &times;
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Phone Number</label>
                    <input
                      type="text"
                      required
                      value={editFormData.phoneNumber}
                      onChange={(e) => setEditFormData({ ...editFormData, phoneNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Email Address (Optional)</label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Membership Tier</label>
                    <select
                      value={editFormData.tierId}
                      onChange={(e) => setEditFormData({ ...editFormData, tierId: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      {tiers.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.name} (ETB {t.priceEtb})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Status</label>
                    <select
                      value={editFormData.status}
                      onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="PENDING">PENDING</option>
                      <option value="SUSPENDED">SUSPENDED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Payment Method</label>
                    <input
                      type="text"
                      value={editFormData.paymentMethod}
                      onChange={(e) => setEditFormData({ ...editFormData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Payment Reference / TxID</label>
                  <input
                    type="text"
                    value={editFormData.paymentReference}
                    onChange={(e) => setEditFormData({ ...editFormData, paymentReference: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Avatar / Photo URL</label>
                  <input
                    type="text"
                    value={editFormData.photoUrl}
                    onChange={(e) => setEditFormData({ ...editFormData, photoUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setEditingMember(null)}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md disabled:opacity-50"
                  >
                    {actionLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Member Inspection Modal Drawer */}
        {selectedMember && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div>
                  <h3 className="text-xl font-bold text-slate-100">{selectedMember.fullName}</h3>
                  <span className="font-mono text-xs text-amber-400 font-semibold">{selectedMember.membershipCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedMember(null)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400"
                >
                  &times;
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Tier</span>
                  <span className="font-bold text-amber-300 text-sm">{selectedMember.tier?.name}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Normalized Phone</span>
                  <span className="font-mono font-bold text-slate-200 text-sm">{selectedMember.normalizedPhone}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Payment Method</span>
                  <span className="font-bold text-slate-200">{selectedMember.paymentMethod}</span>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block">Payment Reference</span>
                  <span className="font-mono font-bold text-amber-400">{selectedMember.paymentReference}</span>
                </div>
              </div>

              {/* Receipt Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Uploaded Payment Receipt Proof
                </label>
                {selectedMember.paymentReceiptUrl ? (
                  <div
                    onClick={() => setReceiptZoomUrl(selectedMember.paymentReceiptUrl)}
                    className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 max-h-48 cursor-pointer group flex items-center justify-center p-2"
                  >
                    <img
                      src={selectedMember.paymentReceiptUrl}
                      alt="Receipt"
                      className="max-h-44 object-contain rounded-lg group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-bold text-xs">
                      <Eye className="w-4 h-4" />
                      <span>Click to Zoom Receipt</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No receipt file uploaded.</p>
                )}
              </div>

              {/* Live Digital Pass Preview */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Official Digital Membership Card
                </label>
                <div className="max-w-md mx-auto">
                  <DigitalCardCanvas
                    member={{
                      fullName: selectedMember.fullName,
                      membershipCode: selectedMember.membershipCode,
                      photoUrl: selectedMember.photoUrl,
                      tierName: selectedMember.tier?.name,
                      badgeColor: selectedMember.tier?.badgeColor,
                      approvedAt: selectedMember.approvedAt,
                      createdAt: selectedMember.createdAt,
                    }}
                    template={selectedMember.tier?.cardTemplates?.[0] || null}
                    fallbackImageUrl={selectedMember.generatedBadgeUrl}
                  />
                </div>
              </div>

              {/* Admin Action Buttons with Strict RBAC */}
              <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-3 justify-end">
                {canApprove ? (
                  <>
                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleApprove(selectedMember.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Approve & Generate Pass</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => setShowRejectModal(true)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>

                    <button
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleToggleSuspend(selectedMember.id)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-all border border-slate-700"
                    >
                      <Ban className="w-4 h-4 text-purple-400" />
                      <span>{selectedMember.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}</span>
                    </button>
                  </>
                ) : (
                  <div className="text-xs text-slate-500 italic">
                    Editor/Viewer role cannot approve/reject members (Strict Backend RBAC).
                  </div>
                )}

                {currentUser?.role !== 'VIEWER' && selectedMember.status === 'APPROVED' && (
                  <button
                    type="button"
                    disabled={actionLoading}
                    onClick={() => handleRegenerateBadge(selectedMember.id)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Regenerate Badge</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Rejection Reason Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-bold text-slate-100">Reject Application</h3>
              <p className="text-xs text-slate-400">
                Provide a reason for the applicant so they can fix and re-submit:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Payment transaction could not be found with Telebirr reference..."
                className="w-full h-28 p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-rose-400"
              />
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleReject}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Receipt Full Zoom Modal */}
        {receiptZoomUrl && (
          <div
            onClick={() => setReceiptZoomUrl(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-6 cursor-zoom-out"
          >
            <img src={receiptZoomUrl} alt="Zoomed Receipt" className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" />
          </div>
        )}
      </main>
    </div>
  );
}

export default function MembersManagementPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-slate-400">Loading members...</div>}>
      <MembersManagementContent />
    </Suspense>
  );
}
