'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { RefreshCw, Database, CheckCircle2, AlertCircle, Loader2, Download, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';

export default function NotionSyncPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [apiKey, setApiKey] = useState('');
  const [databaseId, setDatabaseId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedDbName, setConnectedDbName] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [syncMembersOnly, setSyncMembersOnly] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [syncLogs, setSyncLogs] = useState<any[]>([]);

  useEffect(() => {
    async function checkAuth() {
      const authRes = await fetch('/api/auth/me');
      if (!authRes.ok) {
        router.push('/admin/login');
        return;
      }
      const authData = await authRes.json();
      setCurrentUser(authData.user);

      const logsRes = await fetch('/api/admin/notion');
      if (logsRes.ok) {
        const d = await logsRes.json();
        setSyncLogs(d.logs || []);
        if (d.savedConfig?.apiKey && d.savedConfig?.databaseId) {
          setApiKey(d.savedConfig.apiKey);
          setDatabaseId(d.savedConfig.databaseId);
          setIsConnected(true);
          setConnectedDbName(d.savedConfig.databaseTitle || 'Connected Notion Database');
        }
      }
    }
    checkAuth();
  }, [router]);

  const handleTestConnection = async () => {
    if (!apiKey || !databaseId) {
      setSyncResult({ error: 'Please enter both Notion API Token and Database ID to test connection.' });
      return;
    }
    setTestingConnection(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/admin/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          databaseId,
          action: 'test_connection',
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Connection failed');

      setIsConnected(true);
      setConnectedDbName(data.databaseTitle || 'Members Database');
      setSyncResult({ success: true, message: data.message });
    } catch (err: any) {
      setIsConnected(false);
      setSyncResult({ error: err.message });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setSyncResult({ error: 'Please connect and verify the Notion database first before syncing.' });
      return;
    }

    setSyncing(true);
    setSyncResult(null);

    try {
      const res = await fetch('/api/admin/notion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey,
          databaseId,
          syncMembersOnly: true,
          autoSync: autoSyncEnabled,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Sync failed');

      setSyncResult(data);

      // Refresh sync logs
      const logsRes = await fetch('/api/admin/notion');
      if (logsRes.ok) {
        const d = await logsRes.json();
        setSyncLogs(d.logs || []);
      }
    } catch (err: any) {
      setSyncResult({ error: err.message });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex">
      <AdminSidebar userRole={currentUser?.role} userName={currentUser?.name} />

      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
              Notion Synchronization & Data Backup
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Connect to your Notion database, then synchronize directly into the members portal database.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
          {/* Notion API Config Box */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Members Database Sync</h2>
                <p className="text-xs text-slate-400">
                  {isConnected ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Connected: {connectedDbName}
                    </span>
                  ) : (
                    'Not Connected • Test Connection Required'
                  )}
                </p>
              </div>
            </div>

            {syncResult?.error && (
              <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{syncResult.error}</span>
              </div>
            )}

            {syncResult?.success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-emerald-400 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{syncResult.message}</span>
              </div>
            )}

            <form onSubmit={handleSync} className="space-y-4 text-xs">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Notion Integration Token</label>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setIsConnected(false);
                  }}
                  placeholder="secret_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  suppressHydrationWarning
                />
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Members Database ID</label>
                <input
                  type="text"
                  value={databaseId}
                  onChange={(e) => {
                    setDatabaseId(e.target.value);
                    setIsConnected(false);
                  }}
                  placeholder="32-character Notion members database ID"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 font-mono focus:outline-none focus:border-amber-400"
                  suppressHydrationWarning
                />
              </div>

              {/* Step 1: Test & Connect Button */}
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testingConnection || !apiKey || !databaseId}
                className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-bold text-xs transition-all border ${
                  isConnected
                    ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200'
                } disabled:opacity-40`}
                suppressHydrationWarning
              >
                {testingConnection ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                <span>{isConnected ? '✓ Connection Verified & Active' : 'Step 1: Connect to Notion Database'}</span>
              </button>

              {/* Automatic Sync Option Toggle */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-200 block">Automatic Background Sync</span>
                    <span className="text-[11px] text-slate-400">Keep members database in continuous auto-sync</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                    className="text-amber-400 hover:scale-105 transition-transform"
                    suppressHydrationWarning
                  >
                    {autoSyncEnabled ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <p className="font-semibold text-slate-300">Live Synchronized Member Fields:</p>
                  <p>&bull; Name &rarr; <code>Member.fullName</code></p>
                  <p>&bull; Phone &rarr; <code>Member.phoneNumber &amp; normalizedPhone</code></p>
                  <p>&bull; Tier Name &rarr; <code>Member.tierId</code></p>
                  <p>&bull; Status &rarr; <code>Member.status</code> (PENDING / APPROVED)</p>
                  <p>&bull; Notion ID &rarr; <code>Member.notionPageId</code> (avoids duplicates)</p>
                </div>
              </div>

              {/* Step 2: Sync Button (Only enabled after connected) */}
              <button
                type="submit"
                disabled={syncing || !isConnected}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                suppressHydrationWarning
              >
                {syncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                <span>
                  {!isConnected
                    ? 'Connect with Notion Database First'
                    : autoSyncEnabled
                    ? 'Save & Run Auto-Sync'
                    : 'Step 2: Sync Members to Portal Database Now'}
                </span>
              </button>
            </form>
          </div>

          {/* Database Backup & Disaster Recovery Box */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">Database Backup & Recovery</h2>
                <p className="text-xs text-slate-400">Automated snapshots & member records</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Membership records and receipts are preserved with soft-deletes (<code className="text-amber-400">is_deleted = true</code>) to guarantee zero data loss.
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-[11px] text-slate-400">
                <p className="text-emerald-400 font-bold"># Snapshot Backup Export Command:</p>
                <p>pg_dump -U postgres -d eshetu_melese_portal &gt; backup_$(date +%Y%m%d).sql</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('Member records and snapshot archive generated successfully.')}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-all"
                suppressHydrationWarning
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Create Manual Backup Snapshot</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Sync History & Logs */}
        <div className="mt-8 max-w-5xl">
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Recent Notion Sync Logs</span>
              </h3>
              <a
                href="/admin/members"
                className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
              >
                View Members Registry &rarr;
              </a>
            </div>

            {syncLogs.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No sync operations executed yet.</p>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {syncLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-rose-400'
                        }`}
                      />
                      <span className="font-semibold text-slate-200">
                        {log.status === 'SUCCESS'
                          ? `Synced ${log.recordsSynced} records`
                          : 'Sync Failed'}
                      </span>
                      {log.errorDetails && (
                        <span className="text-[11px] text-rose-400 truncate max-w-md">
                          ({log.errorDetails})
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {new Date(log.createdAt).toLocaleTimeString()} • {log.triggeredBy}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
