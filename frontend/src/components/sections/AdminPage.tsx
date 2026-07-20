import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk, useAuth, UserButton } from '@clerk/clerk-react';
import { SignInProviderModal } from '../auth/SignInProviderModal';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, BLOGS, EXPERIENCE } from '../../config/constants.tsx';
import {
  Trash2, MessageCircle, Lock, RefreshCw, ExternalLink,
  LogIn, ShieldX, Activity, Eye, MousePointer, BookOpen,
  Users, Server, Zap, FileText, BarChart2, LogOut,
  Download, Globe, Smartphone, Monitor, Tablet, MapPin,
  Clock, TrendingUp, ChevronRight, Link2,
} from 'lucide-react';

const ADMIN_CLERK_ID = 'user_3FlAhDnbr2HQ7H9yL7jlUuxiSu4';
import { API_BASE as API } from '../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Comment { id: string; author: string; text: string; timestamp: string; clerkUserId: string; replies?: Comment[]; }
interface ResumeSummary {
  totalViews: number;
  totalDownloads: number;
  mobileViews: number;
  desktopViews: number;
  recentLogs: Array<{ timestamp: string; type: string; deviceType: string; country?: string }>;
  countryBreakdown: Record<string, number>;
}
interface AnalyticsData {
  totalPageViews: number;
  pageViews: Record<string, number>;
  eventCounts: Record<string, number>;
  blogViews: Record<string, number>;
  projectClicks: Record<string, number>;
  deviceBreakdown: { mobile: number; tablet: number; desktop: number };
  osBreakdown: Record<string, number>;
  avgDuration: Record<string, { total: number; count: number }>;
  scrollDepth: Record<string, Record<string, number>>;
  externalClicks: Record<string, number>;
  utmSources: Record<string, number>;
  recentEvents: Array<{ type: string; path?: string; slug?: string; projectId?: string; timestamp: string; ua?: string; device?: string; os?: string; osVersion?: string; sessionId?: string; url?: string; domain?: string; duration?: number; depth?: number; source?: string }>;
  totalEvents: number;
  uniqueSessionsToday: number;
  topLocations: Array<{ _id: string; count: number }>;
  resumeSummary: ResumeSummary;
}
interface HealthData { status: string; uptime: number; memory: number; commentsCount: number; analyticsSize: number; errorCount24h?: number; recentErrors?: Array<{ endpoint: string; error: string; timestamp: string }>; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtUptime = (s: number) => { const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60); return h > 0 ? `${h}h ${m}m` : `${m}m`; };
const fmtBytes = (b: number) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b / 1024).toFixed(1)}KB` : `${(b / 1048576).toFixed(1)}MB`;
const fmtTime = (iso: string) => new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
const fmtDuration = (sec: number) => { const m = Math.floor(sec / 60), s = sec % 60; return m > 0 ? `${m}m ${s}s` : `${s}s`; };
const fmtAvgDuration = (d: { total: number; count: number }) => d.count > 0 ? fmtDuration(Math.round(d.total / d.count)) : '—';

const EVENT_LABELS: Record<string, string> = {
  page_view: 'Page view', blog_open: 'Blog read', project_click: 'Project view',
  askme_open: 'Ask Me', resume_view: 'Resume viewed', contact_open: 'Contact', share: 'Share',
  page_leave: 'Page leave', scroll_depth: 'Scroll depth', external_click: 'External link',
  utm_source: 'UTM source',
};

const EVENT_COLORS: Record<string, string> = {
  page_view: 'bg-blue-500', blog_open: 'bg-violet-500', project_click: 'bg-emerald-500',
  askme_open: 'bg-amber-500', resume_view: 'bg-rose-500', contact_open: 'bg-sky-500',
  share: 'bg-pink-500', page_leave: 'bg-neutral-500', scroll_depth: 'bg-teal-500',
  external_click: 'bg-orange-500',
};

const OS_COLORS: Record<string, string> = {
  macOS: 'bg-blue-500',
  Windows: 'bg-sky-400',
  Android: 'bg-emerald-500',
  iOS: 'bg-violet-500',
  Linux: 'bg-amber-500',
  ChromeOS: 'bg-teal-500',
  unknown: 'bg-neutral-400',
};

const OS_ICONS: Record<string, string> = {
  macOS: '🍎',
  Windows: '🪟',
  Android: '🤖',
  iOS: '📱',
  Linux: '🐧',
  ChromeOS: '🌐',
  unknown: '❓',
};

const countryFlag = (loc: string) => {
  const code = loc.split(', ').pop()?.trim();
  if (!code || code.length !== 2) return '🌍';
  try {
    return code.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0)));
  } catch { return '🌍'; }
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const GlassCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-2xl border border-border-light dark:border-border-dark bg-neutral-50/60 dark:bg-white/[0.03] backdrop-blur-sm ${className}`}>
    {children}
  </div>
);

const KpiCard: React.FC<{ label: string; value: string | number; sub?: string; icon: React.ReactNode; color: string; trend?: string }> = ({ label, value, sub, icon, color, trend }) => (
  <GlassCard className="p-5 flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-60">{label}</p>
      <span className={`${color} opacity-70`}>{icon}</span>
    </div>
    <div>
      <p className={`font-sans font-black text-3xl ${color} tabular-nums leading-none`}>{value}</p>
      {sub && <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-1 opacity-50">{sub}</p>}
    </div>
    {trend && <p className="text-[10px] font-mono text-emerald-500">{trend}</p>}
  </GlassCard>
);

const SectionHead: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-4">
    <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-50">{title}</p>
    {action}
  </div>
);

const AnimBar: React.FC<{ label: string; value: number; max: number; color?: string; suffix?: string; sub?: string }> = ({ label, value, max, color = 'bg-neutral-800 dark:bg-neutral-200', suffix = '', sub }) => (
  <div className="flex items-center gap-3">
    <div className="w-36 shrink-0">
      <p className="text-[11px] font-mono text-text-light dark:text-text-dark truncate">{label}</p>
      {sub && <p className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-50 truncate">{sub}</p>}
    </div>
    <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${Math.max(2, (value / max) * 100)}%` }} transition={{ duration: 0.7, ease: 'easeOut' }} />
    </div>
    <p className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark w-12 text-right shrink-0 tabular-nums">{value.toLocaleString()}{suffix}</p>
  </div>
);

const DeviceRing: React.FC<{ label: string; count: number; total: number; color: string; icon: React.ReactNode }> = ({ label, count, total, color, icon }) => {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const r = 20, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-14 h-14">
        <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
          <circle cx="28" cy="28" r={r} fill="none" stroke="currentColor" strokeWidth="5" className="text-neutral-100 dark:text-neutral-800" />
          <motion.circle cx="28" cy="28" r={r} fill="none" strokeWidth="5" className={color}
            strokeDasharray={circ} initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - dash }} transition={{ duration: 0.9, ease: 'easeOut' }}
            strokeLinecap="round" stroke="currentColor" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center text-text-muted-light dark:text-text-muted-dark">
          {icon}
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-bold text-text-light dark:text-text-dark tabular-nums">{pct}%</p>
        <p className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-60 capitalize">{label}</p>
        <p className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40">{count.toLocaleString()}</p>
      </div>
    </div>
  );
};

const EventDot: React.FC<{ type: string }> = ({ type }) => (
  <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-[5px] ${EVENT_COLORS[type] || 'bg-neutral-400'}`} />
);

// ─── TABS ─────────────────────────────────────────────────────────────────────
const TABS = ['overview', 'analytics', 'resume', 'comments', 'system'] as const;
type Tab = typeof TABS[number];

// ─── AdminPage ────────────────────────────────────────────────────────────────
const AdminPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [healthLatency, setHealthLatency] = useState<number | null>(null);
  const [selectedUtmBlog, setSelectedUtmBlog] = useState(BLOGS[0]?.slug || '');
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  const isAdmin = user?.id === ADMIN_CLERK_ID;

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    const store: Record<string, Comment[]> = {};
    await Promise.all(BLOGS.map(async b => {
      try {
        const res = await fetch(`${API}/api/comments?slug=${encodeURIComponent(b.slug)}`);
        if (res.ok) { const d = await res.json(); if (d.length) store[b.slug] = d; }
      } catch {}
    }));
    setComments(store);
    setLoadingComments(false);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) setAnalytics(await res.json());
    } catch {}
    setLoadingAnalytics(false);
  }, [getToken]);

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true);
    const start = Date.now();
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/health`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHealthLatency(Date.now() - start);
      if (res.ok) setHealth(await res.json());
    } catch { setHealthLatency(null); }
    setLoadingHealth(false);
  }, [getToken]);

  useEffect(() => {
    if (!isAdmin) return;
    fetchComments();
    fetchAnalytics();
    fetchHealth();
  }, [isAdmin]);

  const deleteComment = async (slug: string, commentId: string, parentId?: string) => {
    if (!user) return;
    setDeleting(commentId);
    try {
      const token = await getToken();
      await fetch(`${API}/api/comments/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, commentId, parentId }),
      });
      await fetchComments();
    } catch {}
    setDeleting(null);
  };

  const commentEntries = Object.entries(comments) as [string, Comment[]][];
  const totalComments = commentEntries.reduce((acc, [, arr]) => acc + arr.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0), 0);

  // ── Auth gates ──────────────────────────────────────────────────────────────
  if (!isLoaded) return (
    <div className="pt-24 flex justify-center">
      <div className="w-5 h-5 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" />
    </div>
  );

  if (!isSignedIn) return (
    <div className="pt-24 pb-24 flex flex-col items-center justify-center gap-5 text-center max-w-xs mx-auto">
      <div className="w-12 h-12 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-center">
        <Lock size={20} className="text-text-muted-light dark:text-text-muted-dark" />
      </div>
      <div>
        <h1 className="font-sans font-bold text-lg text-text-light dark:text-text-dark mb-1">Admin access</h1>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Sign in with your admin account to continue.</p>
      </div>
      <button onClick={() => setSignInModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-85 transition-opacity">
        <LogIn size={14} /> Sign in
      </button>
      <AnimatePresence>
        {signInModalOpen && <SignInProviderModal onClose={() => setSignInModalOpen(false)} label="Sign in as admin" />}
      </AnimatePresence>
    </div>
  );

  if (!isAdmin) return (
    <div className="pt-24 pb-24 flex flex-col items-center justify-center gap-4 text-center max-w-xs mx-auto">
      <div className="w-12 h-12 rounded-2xl border border-border-light dark:border-border-dark flex items-center justify-center">
        <ShieldX size={20} className="text-red-400" />
      </div>
      <div>
        <h1 className="font-sans font-bold text-lg text-text-light dark:text-text-dark mb-1">Access denied</h1>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">This page is restricted to the site admin.</p>
      </div>
      <button onClick={() => signOut()} className="text-xs text-red-400 hover:text-red-500 transition-colors">Sign out</button>
    </div>
  );

  // ── Derived data ────────────────────────────────────────────────────────────
  const topPages     = (Object.entries(analytics?.pageViews || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topBlogs     = (Object.entries(analytics?.blogViews || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topProjects  = (Object.entries(analytics?.projectClicks || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topExternal  = (Object.entries(analytics?.externalClicks || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topUtm       = (Object.entries(analytics?.utmSources || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topDuration  = Object.entries(analytics?.avgDuration || {})
    .filter(([, d]) => (d as { total: number; count: number }).count > 0)
    .map(([path, d]) => ({ path, avg: Math.round((d as { total: number; count: number }).total / (d as { total: number; count: number }).count) }))
    .sort((a, b) => b.avg - a.avg).slice(0, 6);
  const deviceTotal  = Object.values(analytics?.deviceBreakdown || { mobile: 0, tablet: 0, desktop: 0 }).reduce((a, b) => a + b, 0);
  const maxPage      = topPages[0]?.[1] || 1;
  const maxBlog      = topBlogs[0]?.[1] || 1;
  const maxProject   = topProjects[0]?.[1] || 1;
  const maxExternal  = topExternal[0]?.[1] || 1;
  const maxUtm       = topUtm[0]?.[1] || 1;
  const maxDuration  = topDuration[0]?.avg || 1;

  // Resume
  const rs = analytics?.resumeSummary;
  const resumeTopCountries = rs ? Object.entries(rs.countryBreakdown).sort((a, b) => b[1] - a[1]).slice(0, 6) : [];
  const resumeMaxCountry   = resumeTopCountries[0]?.[1] || 1;

  // Blog scroll funnels
  const blogFunnels = topBlogs.map(([slug]) => {
    const depths = analytics?.scrollDepth?.[slug] || {};
    const opens = analytics?.blogViews?.[slug] || 0;
    const post = BLOGS.find(b => b.slug === slug);
    return { slug, title: post?.title || slug, opens, d25: depths['25'] || 0, d50: depths['50'] || 0, d75: depths['75'] || 0, d100: depths['100'] || 0 };
  }).filter(f => f.opens > 0);

  const RefreshBtn: React.FC<{ onClick: () => void; loading: boolean }> = ({ onClick, loading }) => (
    <button onClick={onClick} disabled={loading}
      className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-all disabled:opacity-40">
      <RefreshCw size={10} className={loading ? 'animate-spin' : ''} /> Refresh
    </button>
  );

  return (
    <div className="pt-8 pb-28">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="font-sans font-bold text-2xl text-text-light dark:text-text-dark tracking-tight">Dashboard</h1>
            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">admin</span>
          </div>
          <div className="flex items-center gap-3">
            <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-8 h-8 ring-2 ring-border-light dark:ring-border-dark" } }} />
          </div>
        </div>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-0.5">pranavx.in · portfolio analytics</p>
      </motion.div>

      {/* ── Tabs ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-0 mb-8 border-b border-border-light dark:border-border-dark overflow-x-auto scrollbar-none">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium capitalize whitespace-nowrap transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-text-light dark:border-text-dark text-text-light dark:text-text-dark'
                : 'border-transparent text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'
            }`}
          >{t}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {/* ════════════════════════════════════════════ OVERVIEW ══ */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* KPI grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard label="Page views"      value={(analytics?.totalPageViews ?? 0).toLocaleString()} sub="all time" icon={<Eye size={16} />}          color="text-blue-500" />
                <KpiCard label="Sessions today"  value={analytics?.uniqueSessionsToday ?? 0}               sub="unique visitors" icon={<Users size={16} />}       color="text-violet-500" />
                <KpiCard label="Resume views"    value={rs?.totalViews ?? 0}                                sub="all time" icon={<FileText size={16} />}        color="text-rose-500" />
                <KpiCard label="Resume DLs"      value={rs?.totalDownloads ?? 0}                            sub="all time" icon={<Download size={16} />}        color="text-emerald-500" />
              </div>

              {/* Secondary KPI */}
              <div className="grid grid-cols-3 gap-3">
                <KpiCard label="Events tracked" value={(analytics?.totalEvents ?? 0).toLocaleString()} icon={<Activity size={16} />} color="text-amber-500" />
                <KpiCard label="Comments"       value={totalComments}                                   icon={<MessageCircle size={16} />} color="text-sky-500" />
                <KpiCard label="AskMe opens"    value={analytics?.eventCounts?.askme_open ?? 0}         icon={<Zap size={16} />} color="text-pink-500" />
              </div>

              {/* Admin Controls */}
              <GlassCard className="p-5">
                <SectionHead title="Admin controls" />
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <p className="text-sm font-medium text-text-light dark:text-text-dark">Opt out of tracking</p>
                    <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark mt-0.5">Disable analytics tracking for this device/browser.</p>
                  </div>
                  <button
                    onClick={() => {
                      const isOptedOut = localStorage.getItem('admin_opt_out') === 'true';
                      if (isOptedOut) localStorage.removeItem('admin_opt_out');
                      else localStorage.setItem('admin_opt_out', 'true');
                      // trigger a re-render
                      setTab('system'); setTimeout(() => setTab('overview'), 0);
                    }}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors ${
                      localStorage.getItem('admin_opt_out') === 'true' ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-800'
                    }`}
                  >
                    <span className="sr-only">Toggle tracking</span>
                    <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      localStorage.getItem('admin_opt_out') === 'true' ? 'translate-x-2' : '-translate-x-2'
                    }`} />
                  </button>
                </div>
              </GlassCard>

              {/* Device breakdown */}
              {analytics && deviceTotal > 0 && (
                <GlassCard className="p-5">
                  <SectionHead title="Device type" />
                  <div className="flex justify-around py-2">
                    <DeviceRing label="Desktop" count={analytics.deviceBreakdown.desktop} total={deviceTotal} color="text-blue-500" icon={<Monitor size={14} />} />
                    <DeviceRing label="Mobile"  count={analytics.deviceBreakdown.mobile}  total={deviceTotal} color="text-violet-500" icon={<Smartphone size={14} />} />
                    <DeviceRing label="Tablet"  count={analytics.deviceBreakdown.tablet}  total={deviceTotal} color="text-amber-500" icon={<Tablet size={14} />} />
                  </div>
                </GlassCard>
              )}

              {/* OS breakdown */}
              {analytics && Object.keys(analytics.osBreakdown || {}).length > 0 && (() => {
                const entries = (Object.entries(analytics.osBreakdown) as [string, number][])
                  .sort((a, b) => b[1] - a[1]);
                const maxOs = entries[0]?.[1] || 1;
                return (
                  <GlassCard className="p-5">
                    <SectionHead title="Operating system" />
                    <div className="space-y-2.5">
                      {entries.map(([label, count]) => {
                        const osName = label.split(' ')[0];
                        const color = OS_COLORS[osName] || 'bg-neutral-400';
                        const icon = OS_ICONS[osName] || '💻';
                        return (
                          <div key={label} className="flex items-center gap-3">
                            <span className="text-base leading-none w-5 text-center">{icon}</span>
                            <p className="text-[11px] font-mono text-text-light dark:text-text-dark w-28 shrink-0 truncate">{label}</p>
                            <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                              <motion.div className={`h-full rounded-full ${color}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${(count / maxOs) * 100}%` }}
                                transition={{ duration: 0.7, ease: 'easeOut' }} />
                            </div>
                            <p className="text-[11px] font-mono font-bold text-text-light dark:text-text-dark w-8 text-right tabular-nums">{count}</p>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>
                );
              })()}

              {/* Geo + Avg time — two columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Top locations */}
                {(analytics?.topLocations?.length ?? 0) > 0 && (
                  <GlassCard className="p-5">
                    <SectionHead title="Top locations" />
                    <div className="space-y-2.5">
                      {analytics!.topLocations.map(({ _id, count }) => (
                        <div key={_id} className="flex items-center gap-2">
                          <span className="text-base leading-none">{countryFlag(_id)}</span>
                          <p className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark truncate flex-1">{_id}</p>
                          <p className="text-[11px] font-mono font-bold text-text-light dark:text-text-dark tabular-nums">{count}</p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                )}

                {/* Avg time on page */}
                {topDuration.length > 0 && (
                  <GlassCard className="p-5">
                    <SectionHead title="Avg time on page" />
                    <div className="space-y-2.5">
                      {topDuration.map(({ path, avg }) => (
                        <AnimBar key={path} label={path || '/'} value={avg} max={maxDuration} color="bg-teal-500" suffix="s" />
                      ))}
                    </div>
                    <p className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40 mt-3">* value shown in seconds</p>
                  </GlassCard>
                )}
              </div>

              {/* Event counts */}
              {analytics && (
                <GlassCard className="p-5">
                  <SectionHead title="Event breakdown" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(EVENT_LABELS).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between px-3 py-2.5 rounded-xl border border-border-light dark:border-border-dark">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${EVENT_COLORS[key] || 'bg-neutral-400'}`} />
                          <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">{label}</p>
                        </div>
                        <p className="font-mono text-xs font-bold text-text-light dark:text-text-dark">{analytics.eventCounts[key] ?? 0}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* External links */}
              {topExternal.length > 0 && (
                <GlassCard className="p-5">
                  <SectionHead title="External link clicks" />
                  <div className="space-y-2">
                    {topExternal.map(([domain, count]) => (
                      <AnimBar key={domain} label={domain} value={count} max={maxExternal} color="bg-orange-500" />
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════ ANALYTICS ══ */}
          {tab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-sans text-text-light dark:text-text-dark tracking-tight">Campaign & Link Builder</h2>
                <RefreshBtn onClick={fetchAnalytics} loading={loadingAnalytics} />
              </div>
              
              <GlassCard className="p-5">
                <SectionHead title="Share Trackable Link" />
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark mb-4">
                  Select a blog post and platform below to automatically generate and copy a trackable link.
                </p>
                <div className="mb-4">
                  <select
                    value={selectedUtmBlog}
                    onChange={(e) => setSelectedUtmBlog(e.target.value)}
                    className="w-full max-w-sm px-3 py-2 text-xs font-mono bg-neutral-100 dark:bg-neutral-800 text-text-light dark:text-text-dark rounded-lg border border-border-light dark:border-border-dark focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600"
                  >
                    {BLOGS.map(b => (
                      <option key={b.slug} value={b.slug}>{b.title}</option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Twitter', val: 'twitter', icon: '🐦' },
                    { label: 'LinkedIn', val: 'linkedin', icon: '💼' },
                    { label: 'Reddit', val: 'reddit', icon: '🤖' },
                    { label: 'Discord', val: 'discord', icon: '🎮' }
                  ].map(platform => (
                    <button
                      key={platform.val}
                      onClick={() => {
                        const url = `https://www.pranavx.in/blog/${selectedUtmBlog}?v=1&utm_source=${platform.val}`;
                        navigator.clipboard.writeText(url);
                        alert(`Copied ${platform.label} link: \n${url}`);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-text-light dark:text-text-dark rounded-lg transition-colors border border-border-light dark:border-border-dark"
                    >
                      <span>{platform.icon}</span>
                      {platform.label}
                    </button>
                  ))}
                </div>
              </GlassCard>

              {!analytics ? (
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-40 italic">No analytics data yet.</p>
              ) : (
                <>
                  {/* Top pages */}
                  {topPages.length > 0 && (
                    <GlassCard className="p-5">
                      <SectionHead title="Top pages" />
                      <div className="space-y-2.5">
                        {topPages.map(([path, count]) => <AnimBar key={path} label={path || '/'} value={count} max={maxPage} />)}
                      </div>
                    </GlassCard>
                  )}

                  {/* Blog reads + scroll funnels */}
                  {topBlogs.length > 0 && (
                    <GlassCard className="p-5">
                      <SectionHead title="Blog reads + completion" />
                      <div className="space-y-5">
                        {blogFunnels.map(f => (
                          <div key={f.slug}>
                            <p className="text-[11px] font-mono font-semibold text-text-light dark:text-text-dark mb-2 truncate">{f.title}</p>
                            <div className="grid grid-cols-5 gap-1.5 text-center">
                              {[
                                { label: 'Opens', val: f.opens, color: 'bg-violet-500' },
                                { label: '25%',   val: f.d25,   color: 'bg-violet-400' },
                                { label: '50%',   val: f.d50,   color: 'bg-violet-400' },
                                { label: '75%',   val: f.d75,   color: 'bg-violet-300' },
                                { label: '100%',  val: f.d100,  color: 'bg-violet-300' },
                              ].map(({ label, val, color }) => (
                                <div key={label} className="flex flex-col gap-1 items-center">
                                  <div className="w-full h-1 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                                    <motion.div className={`h-full ${color}`} initial={{ width: 0 }}
                                      animate={{ width: `${f.opens > 0 ? Math.min(100, (val / f.opens) * 100) : 0}%` }}
                                      transition={{ duration: 0.8, ease: 'easeOut' }} />
                                  </div>
                                  <p className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-60">{label}</p>
                                  <p className="text-[11px] font-mono font-bold text-text-light dark:text-text-dark">{val}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}

                  {/* Project clicks */}
                  {topProjects.length > 0 && (
                    <GlassCard className="p-5">
                      <SectionHead title="Project clicks" />
                      <div className="space-y-2.5">
                        {topProjects.map(([id, count]) => {
                          const proj = PROJECTS.find(p => p.id === id);
                          return <AnimBar key={id} label={proj?.title || id} value={count} max={maxProject} color="bg-emerald-500" />;
                        })}
                      </div>
                    </GlassCard>
                  )}

                  {/* External clicks */}
                  {topExternal.length > 0 && (
                    <GlassCard className="p-5">
                      <SectionHead title="External link clicks" />
                      <div className="space-y-2.5">
                        {topExternal.map(([domain, count]) => <AnimBar key={domain} label={domain} value={count} max={maxExternal} color="bg-orange-500" />)}
                      </div>
                    </GlassCard>
                  )}

                  {/* UTM Sources */}
                  {topUtm.length > 0 && (
                    <GlassCard className="p-5">
                      <SectionHead title="Traffic Sources (UTM)" />
                      <div className="space-y-2.5">
                        {topUtm.map(([src, count]) => <AnimBar key={src} label={src} value={count} max={maxUtm} color="bg-sky-500" />)}
                      </div>
                    </GlassCard>
                  )}

                  {/* Avg time */}
                  {topDuration.length > 0 && (
                    <GlassCard className="p-5">
                      <SectionHead title="Avg time on page" />
                      <div className="space-y-2.5">
                        {topDuration.map(({ path, avg }) => (
                          <div key={path} className="flex items-center gap-3">
                            <p className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark w-36 shrink-0 truncate">{path || '/'}</p>
                            <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                              <motion.div className="h-full rounded-full bg-teal-500" initial={{ width: 0 }} animate={{ width: `${(avg / maxDuration) * 100}%` }} transition={{ duration: 0.7 }} />
                            </div>
                            <p className="text-[11px] font-mono font-bold text-text-light dark:text-text-dark w-16 text-right shrink-0">{fmtDuration(avg)}</p>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  )}

                  {/* Recent event feed */}
                  <GlassCard className="p-5">
                    <SectionHead title={`Live event feed (${analytics.recentEvents.length})`} />
                    <div className="space-y-0 divide-y divide-border-light dark:divide-border-dark max-h-96 overflow-y-auto">
                      {analytics.recentEvents.map((e, i) => (
                        <div key={i} className="flex items-start gap-3 py-2.5">
                          <EventDot type={e.type} />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-[11px] font-mono text-text-light dark:text-text-dark">{EVENT_LABELS[e.type] || e.type}</span>
                              <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-60 truncate max-w-[180px]">
                                {e.path || e.slug || e.domain || e.projectId || e.source}
                                {e.duration ? ` · ${fmtDuration(e.duration)}` : ''}
                                {e.depth ? ` · ${e.depth}%` : ''}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              {e.device && (
                                <span className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40 capitalize">{e.device}</span>
                              )}
                            </div>
                          </div>
                          <span className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40 shrink-0">{fmtTime(e.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════ RESUME ══ */}
          {tab === 'resume' && (
            <div className="space-y-8">
              {/* KPI row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <KpiCard label="Total views"     value={rs?.totalViews ?? 0}     icon={<Eye size={16} />}         color="text-rose-500" />
                <KpiCard label="Downloads"       value={rs?.totalDownloads ?? 0} icon={<Download size={16} />}    color="text-emerald-500" />
                <KpiCard label="Mobile viewers"  value={rs?.mobileViews ?? 0}    icon={<Smartphone size={16} />}  color="text-violet-500" />
                <KpiCard label="Desktop viewers" value={rs?.desktopViews ?? 0}   icon={<Monitor size={16} />}     color="text-blue-500" />
              </div>

              {/* View vs Download ratio */}
              {rs && (rs.totalViews + rs.totalDownloads) > 0 && (
                <GlassCard className="p-5">
                  <SectionHead title="View vs Download" />
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex">
                      <motion.div className="h-full bg-rose-500" initial={{ width: 0 }}
                        animate={{ width: `${(rs.totalViews / (rs.totalViews + rs.totalDownloads)) * 100}%` }}
                        transition={{ duration: 0.9 }} />
                      <motion.div className="h-full bg-emerald-500" initial={{ width: 0 }}
                        animate={{ width: `${(rs.totalDownloads / (rs.totalViews + rs.totalDownloads)) * 100}%` }}
                        transition={{ duration: 0.9, delay: 0.1 }} />
                    </div>
                  </div>
                  <div className="flex gap-4 mt-2">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500" /><p className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">Views ({rs.totalViews})</p></div>
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /><p className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark">Downloads ({rs.totalDownloads})</p></div>
                  </div>
                </GlassCard>
              )}

              {/* Country breakdown */}
              {resumeTopCountries.length > 0 && (
                <GlassCard className="p-5">
                  <SectionHead title="Top countries (resume)" />
                  <div className="space-y-2.5">
                    {resumeTopCountries.map(([country, count]) => (
                      <div key={country} className="flex items-center gap-2">
                        <span className="text-base leading-none">{countryFlag(country)}</span>
                        <p className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark flex-1 truncate">{country}</p>
                        <div className="w-24 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                          <motion.div className="h-full rounded-full bg-rose-500" initial={{ width: 0 }}
                            animate={{ width: `${(count / resumeMaxCountry) * 100}%` }} transition={{ duration: 0.7 }} />
                        </div>
                        <p className="text-[11px] font-mono font-bold text-text-light dark:text-text-dark w-8 text-right tabular-nums">{count}</p>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Recent resume log */}
              {(rs?.recentLogs?.length ?? 0) > 0 && (
                <GlassCard className="p-5">
                  <SectionHead title="Recent resume activity" />
                  <div className="space-y-0 divide-y divide-border-light dark:divide-border-dark max-h-80 overflow-y-auto">
                    {rs!.recentLogs.map((log, i) => (
                      <div key={i} className="flex items-center gap-3 py-2.5">
                        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${log.type === 'download' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-[11px] font-mono font-semibold text-text-light dark:text-text-dark capitalize">{log.type}</span>
                          <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-60">{log.deviceType}</span>
                          {log.country && <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-50 truncate">{countryFlag(log.country)} {log.country}</span>}
                        </div>
                        <span className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40 shrink-0">{fmtTime(log.timestamp)}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}

              {/* Direct link */}
              <GlassCard className="p-5">
                <SectionHead title="Resume links" />
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Preview on Drive', href: `https://drive.google.com/file/d/1boNL4UPwe1n71af10VWWRU4Vw1L7rTT-/view` },
                    { label: 'Download PDF',     href: `/api/track-resume?type=download` },
                  ].map(({ label, href }) => (
                    <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-all">
                      {label} <ExternalLink size={9} />
                    </a>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {/* ════════════════════════════════════════════ COMMENTS ══ */}
          {tab === 'comments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-text-muted-light dark:text-text-muted-dark" />
                  <span className="text-sm font-medium text-text-light dark:text-text-dark">{totalComments} comments across {commentEntries.length} posts</span>
                </div>
                <RefreshBtn onClick={fetchComments} loading={loadingComments} />
              </div>

              {loadingComments ? (
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-40">Loading...</p>
              ) : totalComments === 0 ? (
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-40 italic">No comments yet.</p>
              ) : (
                <div className="space-y-8">
                  {commentEntries.map(([slug, arr]) => {
                    const post = BLOGS.find(b => b.slug === slug);
                    const count = arr.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0);
                    return (
                      <GlassCard key={slug} className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-xs font-mono font-semibold text-text-light dark:text-text-dark">{post?.title || slug}</span>
                          <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40">{count} comment{count !== 1 ? 's' : ''}</span>
                        </div>
                        <div className="space-y-3 pl-3 border-l-2 border-border-light dark:border-border-dark">
                          {arr.map(c => (
                            <div key={c.id}>
                              <div className="flex items-start gap-3 py-2">
                                <div className="w-6 h-6 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold shrink-0">{c.author[0]}</div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-baseline gap-2 mb-1">
                                    <span className="text-xs font-semibold text-text-light dark:text-text-dark">{c.author}</span>
                                    <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-40">{new Date(c.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                  </div>
                                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed">{c.text}</p>
                                </div>
                                <button onClick={() => deleteComment(slug, c.id)} disabled={deleting === c.id}
                                  className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-500 transition-colors disabled:opacity-40">
                                  <Trash2 size={10} /> {deleting === c.id ? '...' : 'del'}
                                </button>
                              </div>
                              {c.replies && c.replies.length > 0 && (
                                <div className="ml-9 space-y-2 border-l border-border-light dark:border-border-dark pl-3">
                                  {c.replies.map(r => (
                                    <div key={r.id} className="flex items-start gap-3 py-1.5">
                                      <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[9px] font-bold shrink-0">{r.author[0]}</div>
                                      <div className="flex-1 min-w-0">
                                        <span className="text-[11px] font-semibold text-text-light dark:text-text-dark mr-2">{r.author}</span>
                                        <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark mt-0.5">{r.text}</p>
                                      </div>
                                      <button onClick={() => deleteComment(slug, r.id, c.id)} disabled={deleting === r.id}
                                        className="shrink-0 flex items-center gap-1 text-[10px] font-mono text-red-400 hover:text-red-500 transition-colors disabled:opacity-40">
                                        <Trash2 size={10} /> {deleting === r.id ? '...' : 'del'}
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </GlassCard>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════════ SYSTEM ══ */}
          {tab === 'system' && (
            <div className="space-y-8">
              <div className="flex justify-end"><RefreshBtn onClick={fetchHealth} loading={loadingHealth} /></div>

              {/* Backend health */}
              <GlassCard className="p-5">
                <SectionHead title="Backend status" />
                {!health && !loadingHealth ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Backend offline</p>
                  </div>
                ) : health ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-sm font-medium text-text-light dark:text-text-dark">Online</p>
                      {healthLatency !== null && <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-50">{healthLatency}ms</span>}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { key: 'Uptime',    val: fmtUptime(health.uptime) },
                        { key: 'Heap',      val: fmtBytes(health.memory) },
                        { key: 'Comments',  val: String(health.commentsCount) },
                        { key: 'Errors 24h',val: String(health.errorCount24h ?? 0) },
                      ].map(({ key, val }) => (
                        <div key={key} className="text-center rounded-xl border border-border-light dark:border-border-dark p-3">
                          <p className="font-mono text-sm font-bold text-text-light dark:text-text-dark">{val}</p>
                          <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-50 mt-0.5">{key}</p>
                        </div>
                      ))}
                    </div>
                    {(health.recentErrors?.length ?? 0) > 0 && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-50 mb-2">Recent errors</p>
                        <div className="space-y-1">
                          {health.recentErrors!.slice(0, 5).map((e, i) => (
                            <div key={i} className="flex items-start gap-2 text-[10px] font-mono text-red-400">
                              <span className="opacity-40 shrink-0">{fmtTime(e.timestamp)}</span>
                              <span className="truncate">[{e.endpoint}] {e.error}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-12 flex items-center"><div className="w-4 h-4 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" /></div>
                )}
              </GlassCard>


              {/* Environment */}
              <GlassCard className="overflow-hidden">
                <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-50 px-5 py-3 border-b border-border-light dark:border-border-dark">Environment</p>
                {[
                  { key: 'API URL',    val: API || '(same origin)' },
                  { key: 'CLERK_KEY', val: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? `pk_...${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.slice(-6)}` : '⚠ not set' },
                  { key: 'GA',        val: 'G-TCPSH2L9N2' },
                  { key: 'Sitemap',   val: 'https://pranavx.in/sitemap.xml' },
                ].map(({ key, val }, i) => (
                  <div key={key} className={`flex items-center gap-4 px-5 py-2.5 ${i > 0 ? 'border-t border-border-light dark:border-border-dark' : ''}`}>
                    <p className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest w-24 shrink-0">{key}</p>
                    <p className="text-[11px] font-mono text-text-light dark:text-text-dark truncate">{val}</p>
                  </div>
                ))}
              </GlassCard>

              {/* External dashboards */}
              <GlassCard className="p-5">
                <SectionHead title="External dashboards" />
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Google Analytics', url: 'https://analytics.google.com' },
                    { label: 'Clerk',            url: 'https://dashboard.clerk.com' },
                    { label: 'MongoDB Atlas',    url: 'https://cloud.mongodb.com' },
                    { label: 'Vercel',           url: 'https://vercel.com/dashboard' },
                    { label: 'GitHub',           url: 'https://github.com/pranavgawaii' },
                    { label: 'pranavx.in',       url: 'https://pranavx.in' },
                  ].map(({ label, url }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-neutral-400 dark:hover:border-neutral-500 transition-all">
                      {label} <ExternalLink size={9} />
                    </a>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
