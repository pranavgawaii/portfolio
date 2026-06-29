import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'motion/react';
import { GitHubCalendar } from '../ui/git-hub-calendar';

const GitHubActivitySection: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'github' | 'leetcode'>('github');
  const [totalGithub,   setTotalGithub]   = useState(0);
  const [totalLeetcode, setTotalLeetcode] = useState(0);
  const [githubData,    setGithubData]    = useState<{ date: string; count: number }[]>([]);
  const [leetcodeData,  setLeetcodeData]  = useState<{ date: string; count: number }[]>([]);
  const [loadingGithub,   setLoadingGithub]   = useState(true);
  const [loadingLeetcode, setLoadingLeetcode] = useState(false);

  const CACHE_TTL = 60 * 60 * 1000;
  const getCached = (key: string) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return null;
      const { data, ts } = JSON.parse(raw);
      if (Date.now() - ts > CACHE_TTL) { localStorage.removeItem(key); return null; }
      return data;
    } catch { return null; }
  };
  const setCache = (key: string, data: unknown) => {
    try { localStorage.setItem(key, JSON.stringify({ data, ts: Date.now() })); } catch {}
  };

  const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3001' : '');

  useEffect(() => {
    if (activeTab === 'github' && !githubData.length) {
      const cached = getCached('gh_contributions');
      if (cached) { setGithubData(cached.flat); setTotalGithub(cached.total); setLoadingGithub(false); return; }
      setLoadingGithub(true);
      fetch('https://github-contributions-api.jogruber.de/v4/pranavgawaii')
        .then(r => r.json())
        .then(d => {
          if (!d?.contributions) return;
          const flat = d.contributions as { date: string; count: number }[];
          const cutoff = new Date(); cutoff.setFullYear(cutoff.getFullYear() - 1);
          const total = flat.filter((x: any) => new Date(x.date) >= cutoff).reduce((s: number, x: any) => s + x.count, 0);
          setGithubData(flat); setTotalGithub(total);
          setCache('gh_contributions', { flat, total });
        })
        .catch(console.error)
        .finally(() => setLoadingGithub(false));
    }
    if (activeTab === 'leetcode' && !leetcodeData.length) {
      const cached = getCached('lc_submissions');
      if (cached) { setLeetcodeData(cached.transformed); setTotalLeetcode(cached.total); setLoadingLeetcode(false); return; }
      setLoadingLeetcode(true);
      fetch(`${API_BASE}/api/leetcode`)
        .catch(() => fetch('https://leetcode-api-faisalshohag.vercel.app/pranavgawai'))
        .then(r => r.json())
        .then(d => {
          const cal = d?.submissionCalendar || d;
          if (!cal || typeof cal !== 'object') return;
          const entries = Object.entries(cal)
            .map(([ts, c]) => ({ ts: parseInt(ts), count: Number(c) }))
            .filter(e => !isNaN(e.ts) && !isNaN(e.count));
          const transformed = entries.map(({ ts, count }) => ({
            date: new Date(ts * 1000).toISOString().split('T')[0], count,
          })).sort((a, b) => a.date.localeCompare(b.date));
          const total = transformed.reduce((s, x) => s + x.count, 0);
          setLeetcodeData(transformed); setTotalLeetcode(total);
          setCache('lc_submissions', { transformed, total });
        })
        .catch(console.error)
        .finally(() => setLoadingLeetcode(false));
    }
  }, [activeTab]);

  const currentData = activeTab === 'github' ? githubData : leetcodeData;
  const isLoading   = activeTab === 'github' ? loadingGithub : loadingLeetcode;
  const total       = activeTab === 'github' ? totalGithub : totalLeetcode;

  const ghColors = {
    dark:  ['#1c1c1c','#0e4429','#006d32','#26a641','#39d353'],
    light: ['#ebedf0','#9be9a8','#40c463','#30a14e','#216e39'],
  };
  const lcColors = {
    dark:  ['#1c1c1c','#6b4000','#ab6600','#e68a00','#ffa116'],
    light: ['#ebedf0','#ffe4b5','#ffcc80','#ffa94d','#ff8c00'],
  };
  const colors = resolvedTheme === 'dark'
    ? (activeTab === 'github' ? ghColors.dark : lcColors.dark)
    : (activeTab === 'github' ? ghColors.light : lcColors.light);

  return (
    <section className="w-full mb-0">
      {/* Header & Switcher */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
          {isLoading ? (
            <span className="font-semibold opacity-30">-</span>
          ) : (
            <span className="font-sans font-bold text-text-light dark:text-text-dark text-[15px] tabular-nums">
              {total.toLocaleString()}
            </span>
          )}
          <span className="opacity-60 font-sans">
            {activeTab === 'github' ? 'contributions in the last year' : 'LeetCode problems solved'}
          </span>
        </div>

        {/* Pill tab switcher */}
        <div className="relative flex items-center bg-neutral-200/50 dark:bg-neutral-950/65 border border-black/[0.03] dark:border-white/[0.03] rounded-full p-[3px] shadow-inner">
          {(['github', 'leetcode'] as const).map(tab => {
            const isActive = activeTab === tab;
            let activeTextColor = 'text-neutral-900 dark:text-white';
            if (isActive) {
              activeTextColor = tab === 'github' ? 'text-emerald-500 dark:text-emerald-400 font-extrabold' : 'text-amber-500 dark:text-amber-400 font-extrabold';
            }
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="relative px-3.5 py-1.5 text-[11px] font-mono uppercase tracking-widest rounded-full z-10 transition-colors duration-150"
              >
                {isActive && (
                  <motion.div 
                    layoutId="htab" 
                    className="absolute inset-0 rounded-full bg-white dark:bg-neutral-800/80 shadow border border-black/[0.03] dark:border-white/[0.05]" 
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }} 
                  />
                )}
                <span className={`relative z-10 transition-colors duration-200 ${
                  isActive ? activeTextColor : 'text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-400 font-semibold'
                }`}>
                  {tab}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 0.99, filter: 'blur(4px)' }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        >
          {isLoading ? (
            <div className="h-[140px] flex items-center justify-center">
              <div className="flex gap-1">
                {[0,1,2].map(i => (
                  <motion.div key={i} className={`w-1.5 h-1.5 rounded-full ${activeTab === 'github' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    animate={{ opacity: [0.3,1,0.3] }} transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                ))}
              </div>
            </div>
          ) : (
            <GitHubCalendar data={currentData} colors={colors} />
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default GitHubActivitySection;
