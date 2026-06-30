import React, { useState, useEffect, useCallback } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { motion, AnimatePresence } from 'motion/react';
import { PROJECTS, BLOGS, EXPERIENCE } from '../../config/constants.tsx';
import {
  Trash2, MessageCircle, Lock, RefreshCw, ExternalLink,
  LogIn, ShieldX, Activity, Eye, MousePointer, BookOpen,
  Users, Server, Zap, TrendingUp, Clock, FileText,
  BarChart2, LogOut, ChevronRight,
} from 'lucide-react';

const ADMIN_EMAIL = 'pranvgg@gmail.com';
import { API_BASE as API } from '../../lib/api';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Comment { id: string; author: string; text: string; timestamp: string; clerkUserId: string; replies?: Comment[]; }
interface AnalyticsData {
  totalPageViews: number;
  pageViews: Record<string, number>;
  eventCounts: Record<string, number>;
  blogViews: Record<string, number>;
  projectClicks: Record<string, number>;
  recentEvents: Array<{ type: string; path?: string; slug?: string; projectId?: string; timestamp: string; ua?: string }>;
  totalEvents: number;
}
interface HealthData { status: string; uptime: number; memory: number; commentsCount: number; analyticsSize: number; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmtUptime = (s: number) => {
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};
const fmtBytes = (b: number) => b < 1024 ? `${b}B` : `${(b / 1024).toFixed(1)}KB`;
const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
};
const EVENT_LABELS: Record<string, string> = {
  page_view: 'Page view', blog_open: 'Blog read', project_click: 'Project view',
  askme_open: 'Ask me', resume_view: 'Resume', contact_open: 'Contact', share: 'Share',
};

// ─── Stat Card ────────────────────────────────────────────────────────────────
const Stat: React.FC<{ label: string; value: string | number; sub?: string; color?: string; icon: React.ReactNode }> = ({ label, value, sub, color = 'text-text-light dark:text-text-dark', icon }) => (
  <div className="rounded-xl border border-border-light dark:border-border-dark p-4 bg-neutral-50/40 dark:bg-white/[0.02] flex flex-col gap-3">
    <div className="flex items-center justify-between">
      <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-60">{label}</p>
      <span className="text-text-muted-light dark:text-text-muted-dark opacity-40">{icon}</span>
    </div>
    <div>
      <p className={`font-sans font-black text-2xl ${color} tabular-nums`}>{value}</p>
      {sub && <p className="text-[10px] text-text-muted-light dark:text-text-muted-dark mt-0.5 opacity-50">{sub}</p>}
    </div>
  </div>
);

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHead: React.FC<{ title: string; action?: React.ReactNode }> = ({ title, action }) => (
  <div className="flex items-center justify-between mb-3">
    <p className="text-[10px] font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark opacity-50">{title}</p>
    {action}
  </div>
);

// ─── Bar ─────────────────────────────────────────────────────────────────────
const Bar: React.FC<{ label: string; value: number; max: number; color?: string }> = ({ label, value, max, color = 'bg-neutral-800 dark:bg-neutral-200' }) => (
  <div className="flex items-center gap-3">
    <p className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark truncate w-32 shrink-0">{label}</p>
    <div className="flex-1 h-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
      <motion.div className={`h-full rounded-full ${color}`} initial={{ width: 0 }} animate={{ width: `${(value / max) * 100}%` }} transition={{ duration: 0.6, ease: 'easeOut' }} />
    </div>
    <p className="text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark w-6 text-right shrink-0">{value}</p>
  </div>
);

// ─── AdminPage ────────────────────────────────────────────────────────────────
const TABS = ['overview', 'analytics', 'comments', 'system'] as const;
type Tab = typeof TABS[number];

const AdminPage: React.FC = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn, signOut } = useClerk();
  const [tab, setTab] = useState<Tab>('overview');
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [health, setHealth] = useState<HealthData | null>(null);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [healthLatency, setHealthLatency] = useState<number | null>(null);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const fetchComments = useCallback(async () => {
    setLoadingComments(true);
    const store: Record<string, Comment[]> = {};
    await Promise.all(BLOGS.map(async b => {
      try {
        const res = await fetch(`${API}/api/comments/${b.slug}`);
        if (res.ok) { const d = await res.json(); if (d.length) store[b.slug] = d; }
      } catch {}
    }));
    setComments(store);
    setLoadingComments(false);
  }, []);

  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const res = await fetch(`${API}/api/analytics`);
      if (res.ok) setAnalytics(await res.json());
    } catch {}
    setLoadingAnalytics(false);
  }, []);

  const fetchHealth = useCallback(async () => {
    setLoadingHealth(true);
    const start = Date.now();
    try {
      const res = await fetch(`${API}/api/health`);
      setHealthLatency(Date.now() - start);
      if (res.ok) setHealth(await res.json());
    } catch { setHealthLatency(null); }
    setLoadingHealth(false);
  }, []);

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
      await fetch(`${API}/api/comments/${slug}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, parentId, clerkUserId: user.id, isAdmin: true }),
      });
      await fetchComments();
    } catch {}
    setDeleting(null);
  };

  const commentEntries = Object.entries(comments) as [string, Comment[]][];
  const totalComments = commentEntries.reduce((acc, [, arr]) => acc + arr.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0), 0);

  // ── Auth gates ────────────────────────────────────────────────────────────
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
      <button onClick={() => openSignIn()} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-medium hover:opacity-85 transition-opacity">
        <LogIn size={14} /> Sign in
      </button>
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

  // ── Admin dashboard ───────────────────────────────────────────────────────
  const topPages = (Object.entries(analytics?.pageViews || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 6);
  const topBlogs = (Object.entries(analytics?.blogViews || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const topProjects = (Object.entries(analytics?.projectClicks || {}) as [string, number][]).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const maxPageView = topPages[0]?.[1] || 1;
  const maxBlog = topBlogs[0]?.[1] || 1;
  const maxProject = topProjects[0]?.[1] || 1;

  return (
    <div className="pt-8 pb-28">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-sans font-bold text-2xl text-text-light dark:text-text-dark tracking-tight">Dashboard</h1>
            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">admin</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {user?.imageUrl && <img src={user.imageUrl} className="w-6 h-6 rounded-full" />}
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark hidden sm:block">{user?.firstName}</p>
            </div>
            <button onClick={() => signOut()} className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark hover:text-red-400 transition-colors">
              <LogOut size={11} /> Sign out
            </button>
          </div>
        </div>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-0.5">pranavx.in · portfolio analytics</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-0 mb-8 border-b border-border-light dark:border-border-dark">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t ? 'border-text-light dark:border-text-dark text-text-light dark:text-text-dark'
                : 'border-transparent text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark'
            }`}
          >{t}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>

          {/* ── OVERVIEW ────────────────────────────────────────────────────── */}
          {tab === 'overview' && (
            <div className="space-y-8">
              {/* KPI grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Page views" value={analytics?.totalPageViews ?? '—'} sub="all time" icon={<Eye size={14} />} color="text-blue-500" />
                <Stat label="Events tracked" value={analytics?.totalEvents ?? '—'} sub="all time" icon={<Activity size={14} />} color="text-violet-500" />
                <Stat label="Comments" value={totalComments} sub={`across ${commentEntries.length} posts`} icon={<MessageCircle size={14} />} color="text-amber-500" />
                <Stat label="AskMe opens" value={analytics?.eventCounts?.askme_open ?? 0} sub="total" icon={<Zap size={14} />} color="text-emerald-500" />
              </div>

              {/* Portfolio content stats */}
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Projects" value={PROJECTS.length} icon={<MousePointer size={14} />} />
                <Stat label="Blog posts" value={BLOGS.length} icon={<BookOpen size={14} />} />
                <Stat label="Experience" value={EXPERIENCE.length} icon={<Users size={14} />} />
              </div>

              {/* Event breakdown */}
              {analytics && (
                <div>
                  <SectionHead title="Event breakdown" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Object.entries(EVENT_LABELS).map(([key, label]) => (
                      <div key={key} className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-neutral-50/30 dark:bg-white/[0.02]">
                        <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">{label}</p>
                        <p className="font-mono text-xs font-bold text-text-light dark:text-text-dark">{analytics.eventCounts[key] ?? 0}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick links */}
              <div>
                <SectionHead title="External dashboards" />
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Clerk', url: 'https://dashboard.clerk.com' },
                    { label: 'Google Analytics', url: 'https://analytics.google.com' },
                    { label: 'GitHub', url: 'https://github.com/pranavgawaii' },
                    { label: 'X / Twitter', url: 'https://x.com/pranavgawai_' },
                    { label: 'pranavx.in', url: 'https://pranavx.in' },
                  ].map(({ label, url }) => (
                    <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-neutral-400 dark:hover:border-neutral-500 transition-all">
                      {label} <ExternalLink size={9} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS ───────────────────────────────────────────────────── */}
          {tab === 'analytics' && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button onClick={fetchAnalytics} disabled={loadingAnalytics}
                  className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-all disabled:opacity-40">
                  <RefreshCw size={10} className={loadingAnalytics ? 'animate-spin' : ''} /> Refresh
                </button>
              </div>

              {!analytics ? (
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark opacity-40 italic">No analytics data yet. Start navigating the site to collect data.</p>
              ) : (
                <>
                  {/* Top pages */}
                  {topPages.length > 0 && (
                    <div>
                      <SectionHead title="Top pages" />
                      <div className="space-y-2.5">
                        {topPages.map(([path, count]) => (
                          <Bar key={path} label={path || '/'} value={count} max={maxPageView} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Top blog posts */}
                  {topBlogs.length > 0 && (
                    <div>
                      <SectionHead title="Blog post reads" />
                      <div className="space-y-2.5">
                        {topBlogs.map(([slug, count]) => {
                          const post = BLOGS.find(b => b.slug === slug);
                          return <Bar key={slug} label={post?.title || slug} value={count} max={maxBlog} color="bg-violet-500" />;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Top projects */}
                  {topProjects.length > 0 && (
                    <div>
                      <SectionHead title="Project clicks" />
                      <div className="space-y-2.5">
                        {topProjects.map(([id, count]) => {
                          const proj = PROJECTS.find(p => p.id === id);
                          return <Bar key={id} label={proj?.title || id} value={count} max={maxProject} color="bg-blue-500" />;
                        })}
                      </div>
                    </div>
                  )}

                  {/* Recent events feed */}
                  <div>
                    <SectionHead title={`Recent events (${analytics.recentEvents.length})`} />
                    <div className="space-y-0 divide-y divide-border-light dark:divide-border-dark">
                      {analytics.recentEvents.map((e, i) => (
                        <div key={i} className="flex items-start gap-3 py-2.5">
                          <div className="shrink-0 mt-0.5">
                            <span className={`inline-block w-1.5 h-1.5 rounded-full mt-1 ${
                              e.type === 'page_view' ? 'bg-blue-400' :
                              e.type === 'blog_open' ? 'bg-violet-400' :
                              e.type === 'project_click' ? 'bg-emerald-400' :
                              e.type === 'askme_open' ? 'bg-amber-400' :
                              'bg-neutral-400'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-baseline gap-2 flex-wrap">
                              <span className="text-[11px] font-mono text-text-light dark:text-text-dark">{EVENT_LABELS[e.type] || e.type}</span>
                              {(e.path || e.slug || e.projectId) && (
                                <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-60 truncate max-w-[160px]">
                                  {e.path || e.slug || e.projectId}
                                </span>
                              )}
                            </div>
                            {e.ua && <p className="text-[9px] text-text-muted-light dark:text-text-muted-dark opacity-30 truncate mt-0.5">{e.ua}</p>}
                          </div>
                          <span className="text-[9px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-40 shrink-0">{fmtTime(e.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── COMMENTS ────────────────────────────────────────────────────── */}
          {tab === 'comments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <MessageCircle size={14} className="text-text-muted-light dark:text-text-muted-dark" />
                  <span className="text-sm font-medium text-text-light dark:text-text-dark">{totalComments} comments across {commentEntries.length} posts</span>
                </div>
                <button onClick={fetchComments} disabled={loadingComments}
                  className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-all disabled:opacity-40">
                  <RefreshCw size={10} className={loadingComments ? 'animate-spin' : ''} /> Refresh
                </button>
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
                      <div key={slug}>
                        <div className="flex items-center gap-2 mb-3">
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
                                        <span className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-40">{new Date(r.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
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
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── SYSTEM ──────────────────────────────────────────────────────── */}
          {tab === 'system' && (
            <div className="space-y-8">
              <div className="flex justify-end">
                <button onClick={fetchHealth} disabled={loadingHealth}
                  className="flex items-center gap-1.5 text-[11px] font-mono px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-all disabled:opacity-40">
                  <RefreshCw size={10} className={loadingHealth ? 'animate-spin' : ''} /> Ping
                </button>
              </div>

              {/* Backend health */}
              <div>
                <SectionHead title="Backend status" />
                <div className="rounded-xl border border-border-light dark:border-border-dark p-4 bg-neutral-50/40 dark:bg-white/[0.02]">
                  {!health && !loadingHealth ? (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <p className="text-sm text-text-muted-light dark:text-text-muted-dark">Backend offline — <span className="font-mono text-[11px]">localhost:{API.split(':').pop()}</span></p>
                    </div>
                  ) : health ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <p className="text-sm font-medium text-text-light dark:text-text-dark">Online</p>
                        {healthLatency !== null && <span className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-50">{healthLatency}ms</span>}
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                        <div className="text-center"><p className="font-mono text-xs font-bold text-text-light dark:text-text-dark">{fmtUptime(health.uptime)}</p><p className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-50">uptime</p></div>
                        <div className="text-center"><p className="font-mono text-xs font-bold text-text-light dark:text-text-dark">{fmtBytes(health.memory)}</p><p className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-50">heap</p></div>
                        <div className="text-center"><p className="font-mono text-xs font-bold text-text-light dark:text-text-dark">{health.commentsCount}</p><p className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-50">comments</p></div>
                        <div className="text-center"><p className="font-mono text-xs font-bold text-text-light dark:text-text-dark">{fmtBytes(health.analyticsSize)}</p><p className="text-[10px] text-text-muted-light dark:text-text-muted-dark opacity-50">analytics</p></div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-12 flex items-center"><div className="w-4 h-4 border-2 border-neutral-300 dark:border-neutral-700 border-t-neutral-700 dark:border-t-neutral-300 rounded-full animate-spin" /></div>
                  )}
                </div>
              </div>

              {/* Environment */}
              <div>
                <SectionHead title="Environment" />
                <div className="rounded-xl border border-border-light dark:border-border-dark overflow-hidden">
                  {[
                    { key: 'API URL', val: API },
                    { key: 'CLERK_KEY', val: import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? `pk_...${import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.slice(-6)}` : '⚠ not set' },
                    { key: 'GA', val: 'G-TCPSH2L9N2' },
                    { key: 'Sitemap', val: 'https://pranavx.in/sitemap.xml' },
                    { key: 'robots.txt', val: 'https://pranavx.in/robots.txt' },
                  ].map(({ key, val }, i) => (
                    <div key={key} className={`flex items-center gap-4 px-4 py-2.5 ${i > 0 ? 'border-t border-border-light dark:border-border-dark' : ''}`}>
                      <p className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark uppercase tracking-widest w-28 shrink-0">{key}</p>
                      <p className="text-[11px] font-mono text-text-light dark:text-text-dark truncate">{val}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to track guide */}
              <div>
                <SectionHead title="What you're tracking" />
                <div className="space-y-2">
                  {[
                    { icon: <Eye size={12} />, label: 'Page views', desc: 'Every navigation fires a page_view event with the URL path' },
                    { icon: <BookOpen size={12} />, label: 'Blog reads', desc: 'Each time a blog post is opened — slug + title recorded' },
                    { icon: <MousePointer size={12} />, label: 'Project clicks', desc: 'Each project modal open — id + name recorded' },
                    { icon: <Zap size={12} />, label: 'AskMe opens', desc: 'Every time the AI chat is opened via Navbar' },
                    { icon: <FileText size={12} />, label: 'Resume views', desc: 'Each time the resume page is navigated to' },
                    { icon: <Activity size={12} />, label: 'User agent', desc: 'Browser/device string attached to each server-side event' },
                  ].map(({ icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3 py-2.5 border-b border-border-light dark:border-border-dark last:border-0">
                      <span className="shrink-0 mt-0.5 text-text-muted-light dark:text-text-muted-dark opacity-50">{icon}</span>
                      <div>
                        <p className="text-xs font-medium text-text-light dark:text-text-dark">{label}</p>
                        <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark opacity-60">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AdminPage;
