'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Users,
  CreditCard,
  Layers,
  Palette,
  FileText,
  RefreshCw,
  LogOut,
  ShieldCheck,
  LayoutDashboard,
  ExternalLink,
  Sun,
  Moon,
  Languages,
  UserPlus,
  Settings,
} from 'lucide-react';
import { useAppSettings } from '@/context/AppSettingsContext';

interface SidebarProps {
  userRole?: 'ADMIN' | 'EDITOR' | 'VIEWER';
  userName?: string;
}

export function AdminSidebar({ userRole = 'ADMIN', userName = 'Administrator' }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { lang, setLang, colorMode, toggleColorMode, branding } = useAppSettings();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/me', { method: 'POST' });
    } catch {}
    localStorage.removeItem('eshetu_user');
    localStorage.removeItem('eshetu_token');
    router.push('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'General & Logo Settings', href: '/admin/settings', icon: Settings },
    { name: 'Members & Approvals', href: '/admin/members', icon: Users },
    { name: 'Membership Tiers & Pricing', href: '/admin/tiers', icon: CreditCard },
    { name: 'Card Editing Studio', href: '/admin/card-studio', icon: CreditCard },
    { name: 'Section Builder & Media', href: '/admin/sections', icon: Layers },
    { name: 'Theme & Styling', href: '/admin/theme', icon: Palette },
    { name: 'User & Role Manager', href: '/admin/users', icon: UserPlus },
    { name: 'Notion Sync & Backup', href: '/admin/notion-sync', icon: RefreshCw },
  ];

  const siteName = branding?.siteName || 'ESHETU';

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between shrink-0 min-h-screen transition-colors">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            {branding?.logoUrl ? (
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-amber-500/30 overflow-hidden flex items-center justify-center shadow-md shrink-0">
                <img src={branding.logoUrl} alt="Logo" className="w-full h-full object-contain p-0.5" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center font-black text-slate-950 shadow-md shrink-0">
                {siteName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-sm text-slate-100 block truncate">{siteName} CMS</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block">
                {userRole} MODE
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Controls Footer */}
      <div className="p-4 border-t border-slate-800/80 space-y-3">
        {/* Quick Language & Theme toggles for Admin */}
        <div className="flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setLang(lang === 'en' ? 'am' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold hover:text-amber-400"
            suppressHydrationWarning
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{mounted ? (lang === 'en' ? 'አማርኛ' : 'EN') : 'አማርኛ'}</span>
          </button>

          <button
            type="button"
            onClick={toggleColorMode}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-400"
            title="Toggle Light/Dark Theme"
            suppressHydrationWarning
          >
            {mounted && colorMode === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
        </div>

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
          <p className="text-xs font-bold text-slate-200 truncate">{userName}</p>
          <p className="text-[10px] text-slate-400 uppercase font-mono mt-0.5">Role: {userRole}</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/"
            target="_blank"
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-colors"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            title="Sign Out"
            className="p-2 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors"
            suppressHydrationWarning
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
