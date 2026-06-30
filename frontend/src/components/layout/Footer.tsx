import React, { useState, useEffect } from 'react';
import { PROFILE, ICONS_MAP } from '../../config/constants';
import { useNav } from '../../App';
import { useUser } from '@clerk/clerk-react';
import { Github, Users, MapPin } from 'lucide-react';
import { API_BASE } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';

const ADMIN_EMAIL = 'pranvgg@gmail.com';

const Footer: React.FC = () => {
  const { goHome, goProjects, goBlog, goAdmin } = useNav() as any;
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;
  const [githubHover, setGithubHover] = useState(false);
  const [visitorData, setVisitorData] = useState<{ count: number; location: string } | null>(null);

  useEffect(() => {
    const API = API_BASE;
    if (!API) return;

    fetch(`${API}/api/track-visitor`)
      .then(res => res.json())
      .then(data => {
        if (data && data.count) {
          setVisitorData({ count: data.count, location: data.location || 'Earth' });
        }
      })
      .catch(err => console.error('Visitor tracking failed:', err));
  }, []);

  return (
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
        <div className="border-t border-border-light dark:border-border-dark pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="font-sans text-xs text-text-muted-light dark:text-text-muted-dark">
              © 2026 Pranav Gawai
            </p>
            {visitorData && (
              <>
                <span className="text-border-light dark:text-border-dark text-xs">|</span>
                <div className="flex items-center gap-3 text-xs font-medium text-text-muted-light dark:text-text-muted-dark">
                  <div className="flex items-center gap-1.5" title="Total Unique Visitors">
                    <Users size={14} className="text-emerald-500" />
                    <span>#{visitorData.count.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Your Location">
                    <MapPin size={14} className="text-amber-500" />
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
                    initial={{ opacity: 0, y: 4, scale: 0.92 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 2, scale: 0.92 }}
                    transition={{ duration: 0.12 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap pointer-events-none z-10
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
  );
};

export default Footer;
