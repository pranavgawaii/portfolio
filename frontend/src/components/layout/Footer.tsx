import React, { useState, useEffect } from 'react';
import { PROFILE, ICONS_MAP } from '../../config/constants';
import { useNav } from '../../App';
import { useUser } from '@clerk/clerk-react';
import { Github, Users, MapPin, X } from 'lucide-react';
import { API_BASE } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAIL = 'pranvgg@gmail.com';

interface VisitorData { count: number; location: string; }

// ── Visitor Toast ─────────────────────────────────────────────────────────────
const VisitorToast: React.FC<{ data: VisitorData; onDismiss: () => void }> = ({ data, onDismiss }) => {
  const countryCode = data.location.split(', ').pop()?.trim();
  const flag = (() => {
    if (!countryCode || countryCode.length !== 2) return '🌍';
    try { return countryCode.toUpperCase().replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt(0))); }
    catch { return '🌍'; }
  })();

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, scale: 0.96 }}
      animate={{ y: 0, opacity: 1, scale: 1 }}
      exit={{ y: 80, opacity: 0, scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 280, damping: 26 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-4 py-3 rounded-2xl
        bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl
        border border-neutral-200/80 dark:border-white/[0.08]
        shadow-[0_8px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.6)]
        text-sm font-medium text-text-light dark:text-text-dark
        whitespace-nowrap max-w-[calc(100vw-2rem)]"
    >
      <span className="text-xl leading-none">{flag}</span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-text-light dark:text-text-dark">
          You are visitor{' '}
          <span className="font-black text-emerald-500">#{data.count.toLocaleString()}</span>
        </p>
        <p className="text-[10px] font-mono text-text-muted-light dark:text-text-muted-dark opacity-70 truncate">
          from {data.location}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-100 dark:hover:bg-white/10 transition-all"
        aria-label="Dismiss"
      >
        <X size={12} />
      </button>
    </motion.div>
  );
};

const Footer: React.FC = () => {
  const { goHome, goProjects, goBlog, goAdmin } = useNav();
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const [githubHover, setGithubHover] = useState(false);
  const [visitorData, setVisitorData] = useState<VisitorData | null>(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const API = API_BASE;
    if (!API && typeof window !== 'undefined' && !window.location.origin) return;

    const isOptedOut = localStorage.getItem('admin_opt_out') === 'true';
    const already = sessionStorage.getItem('_visitor_toast');
    const shouldPeek = isOptedOut || already;

    fetch(`${API}/api/track-visitor${shouldPeek ? '?peek=1' : ''}`)
      .then(res => res.json())
      .then(data => {
        if (data?.count) {
          setVisitorData({ count: data.count, location: data.location || 'Earth' });
          if (!shouldPeek) {
            setShowToast(true);
            sessionStorage.setItem('_visitor_toast', '1');
            // Auto-dismiss after 6 seconds
            setTimeout(() => setShowToast(false), 6000);
          }
        }
      })
      .catch(() => {/* silent */});
  }, []);

  return (
    <>
      {/* ── Visitor toast ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showToast && visitorData && (
          <VisitorToast data={visitorData} onDismiss={() => setShowToast(false)} />
        )}
      </AnimatePresence>

      <footer className="w-full bg-background-light dark:bg-background-dark border-t border-border-light dark:border-border-dark transition-colors duration-300">
        <div className="w-full max-w-content mx-auto px-4 sm:px-6 pt-10 pb-8">
          <div className="flex flex-col md:flex-row justify-between gap-8 md:gap-16 mb-10">
            {/* Left - brand */}
            <div className="space-y-3 max-w-[220px]">
              <div className="flex items-center gap-2">
                <img src="/avatar.jpg" alt="Pranav Gawai" className="w-6 h-6 rounded-[6px] object-cover ring-1 ring-border-light dark:ring-border-dark" />
                <p className="font-sans font-bold text-base text-text-light dark:text-text-dark">
                  Pranav Gawai
                </p>
              </div>
              <p className="text-sm text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                Building AI-native products.<br />Open to AI-first startup roles.
              </p>
            </div>

            {/* Right - two columns */}
            <div className="flex gap-12 md:gap-24">
              {/* Navigate */}
              <div>
                <p className="text-xs font-sans font-semibold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">
                  Navigate
                </p>
                <ul className="space-y-2.5">
                  {[
                    { label: 'Home',     action: goHome },
                    { label: 'Projects', action: goProjects },
                    { label: 'Blog',     action: goBlog },
                  ].map(({ label, action }) => (
                    <li key={label}>
                      <button
                        onClick={action}
                        className="text-sm font-sans text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
                      >
                        {label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Connect */}
              <div>
                <p className="text-xs font-sans font-semibold uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-4">
                  Connect
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {PROFILE.socials.map(s => {
                    const Icon = ICONS_MAP[s.icon];
                    if (!Icon) return null;
                    return (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={s.name}
                        className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark bg-transparent text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-neutral-400 dark:hover:border-neutral-500 transition-all"
                      >
                        <Icon size={16} strokeWidth={1.5} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-border-light dark:border-border-dark pt-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-wrap">
              <p className="font-sans text-xs text-text-muted-light dark:text-text-muted-dark">
                © 2026 Pranav Gawai
              </p>
              {/* Inline visitor count (subtle, always visible after load) */}
              {visitorData && (
                <>
                  <span className="text-border-light dark:text-border-dark text-xs">|</span>
                  <div className="flex items-center gap-3 text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                    <div className="flex items-center gap-1.5" title="Total Visitors">
                      <Users size={12} className="text-emerald-500" />
                      <span>#{visitorData.count.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1.5" title="Your Location">
                      <MapPin size={12} className="text-amber-500" />
                      <span>{visitorData.location}</span>
                    </div>
                  </div>
                </>
              )}
              {isAdmin && (
                <button
                  onClick={goAdmin}
                  className="font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors opacity-40 hover:opacity-100"
                >
                  ⌥ portal
                </button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <p className="font-sans text-xs text-text-muted-light dark:text-text-muted-dark">
                Built with 🫶 · Pune, IN
              </p>
              <div className="relative" onMouseEnter={() => setGithubHover(true)} onMouseLeave={() => setGithubHover(false)}>
                <a
                  href="https://github.com/pranavgawaii/portfolio"
                  target="_blank" rel="noopener noreferrer"
                  aria-label="View source code"
                  className="flex items-center justify-center w-7 h-7 rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-neutral-400 dark:hover:border-neutral-500 transition-all opacity-50 hover:opacity-100"
                >
                  <Github size={14} strokeWidth={1.5} />
                </a>
                <AnimatePresence>
                  {githubHover && (
                    <motion.div
                      initial={{ opacity: 0, y: 4, x: "-50%", scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, x: "-50%", scale: 1 }}
                      exit={{ opacity: 0, y: 2, x: "-50%", scale: 0.92 }}
                      transition={{ duration: 0.12 }}
                      className="absolute -top-9 left-1/2 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap pointer-events-none z-10
                        bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 shadow-lg"
                    >
                      View source code
                      <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-900 dark:border-t-neutral-100" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
