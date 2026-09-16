'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { Users, Clock, CheckCircle2, XCircle, AlertTriangle, ArrowUpRight, Award, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [kpis, setKpis] = useState<any>({ total: 0, pending: 0, approved: 0, rejected: 0, suspended: 0 });
  const [recentMembers, setRecentMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

        // Fetch member stats
        const membersRes = await fetch('/api/admin/members?limit=5');
        if (membersRes.ok) {
          const mData = await membersRes.json();
          setKpis(mData.kpis || {});
          setRecentMembers(mData.members || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-800">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Community Overview & Analytics
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time member registrations, verification queues, and system status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/members?status=PENDING"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Review Pending ({kpis.pending})</span>
            </Link>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 my-8">
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Members</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-slate-100 font-mono">{kpis.total}</p>
            <span className="text-[11px] text-slate-500 mt-1 block">Across all tiers</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-amber-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Approvals</span>
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-400 font-mono">{kpis.pending}</p>
            <span className="text-[11px] text-amber-300/80 mt-1 block">Requires staff review</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-emerald-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Verified & Active</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400 font-mono">{kpis.approved}</p>
            <span className="text-[11px] text-emerald-400/80 mt-1 block">Badges generated</span>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/90 border border-rose-500/30 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">Rejected / Suspended</span>
              <div className="w-9 h-9 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                <XCircle className="w-5 h-5" />
              </div>
            </div>
            <p className="text-3xl font-black text-rose-400 font-mono">{kpis.rejected + kpis.suspended}</p>
            <span className="text-[11px] text-rose-400/80 mt-1 block">Invalid payments / flags</span>
          </div>
        </div>

        {/* Recent Registrations Queue */}
        <div className="rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-100">Recent Registrations</h2>
              <p className="text-xs text-slate-400">Latest applicants awaiting verification</p>
            </div>
            <Link
              href="/admin/members"
              className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-400 uppercase tracking-wider border-b border-slate-800/80">
                <tr>
                  <th className="pb-3 px-3">Member</th>
                  <th className="pb-3 px-3">Tier</th>
                  <th className="pb-3 px-3">Phone</th>
                  <th className="pb-3 px-3">Payment Method</th>
                  <th className="pb-3 px-3">Status</th>
                  <th className="pb-3 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {recentMembers.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="py-3 px-3">
                      <p className="font-bold text-slate-100">{m.fullName}</p>
                      <p className="font-mono text-[10px] text-slate-400">{m.membershipCode}</p>
                    </td>
                    <td className="py-3 px-3 font-semibold text-amber-300">{m.tier?.name}</td>
                    <td className="py-3 px-3 font-mono text-slate-300">{m.normalizedPhone}</td>
                    <td className="py-3 px-3 text-slate-300">{m.paymentMethod}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold uppercase text-[10px] ${
                          m.status === 'APPROVED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : m.status === 'PENDING'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href="/admin/members"
                        className="text-xs font-bold text-amber-400 hover:underline"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
                {recentMembers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-slate-500">
                      No registrations in queue.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
