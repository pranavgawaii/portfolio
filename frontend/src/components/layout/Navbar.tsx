import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { useNav } from '../../App';
import AnimatedThemeToggler from '../ui/AnimatedThemeToggler';
import AskMeModal from '../modals/AskMeModal';
import { useUser } from '@clerk/clerk-react';
import { Command } from 'lucide-react';
import { track } from '../../hooks/useAnalytics';

const ADMIN_EMAIL = 'pranvgg@gmail.com';

const Navbar: React.FC<{ onResumeOpen: () => void }> = ({ onResumeOpen }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted]       = useState(false);
  const [askOpen, setAskOpen]       = useState(false);
  const { page, goHome, goProjects, goBlog, goDSA, roast, triggerRoast } = useNav();
  const { isSignedIn, user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => { setMounted(true); }, []);

  // Coerce any stale "light" preference from before the lock existed.
  useEffect(() => {
    if (mounted && resolvedTheme === 'light') setTheme('dark');
  }, [mounted, resolvedTheme, setTheme]);

  // Light mode is locked — every click just roasts the visitor instead of switching.
  const toggleTheme = () => { triggerRoast(); };

  const handleHome = () => {
    if (page !== 'home') goHome();
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!mounted) return <div className="w-full h-16" />;

  const links = [
    { label: 'Home',     active: page === 'home',                          action: handleHome,    mobile: true },
    { label: 'Projects', active: page === 'projects',                       action: goProjects,    mobile: true },
    { label: 'Blog',     active: page === 'blog' || page === 'blog-post',   action: goBlog,        mobile: true },
    { label: 'Resume',   active: page === 'resume',                         action: onResumeOpen,  mobile: true },
    { label: 'Sheet',    active: page === 'dsa',                            action: goDSA,         mobile: false },
  ];

  const openSearch = () =>
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true }));

  return (
    <>
      {/* layout spacer — keeps page content below the fixed pill */}
      <div className="w-full h-16 pointer-events-none" />

      {/* ── Floating pill ─────────────────────────────────────────────────── */}
      <div className="fixed top-3 inset-x-0 z-50 flex justify-center pointer-events-none px-3">
        <motion.nav
          initial={{ opacity: 0, y: -14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto flex items-center gap-0.5 px-1.5 py-1.5
            rounded-[18px]
            bg-white/60 dark:bg-[#0a0a0a]/60
            border border-white/80 dark:border-white/[0.06]
            shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_8px_32px_rgba(0,0,0,0.08),0_2px_8px_rgba(0,0,0,0.04)]
            dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_8px_32px_rgba(0,0,0,0.5),0_2px_8px_rgba(0,0,0,0.3)]
            backdrop-blur-2xl backdrop-saturate-[180%]
            select-none"
        >

          {/* ── Nav links ──────────────────────────────────────────────────── */}
          <div className="flex items-center">
            {links.map(({ label, active, action, mobile }) => (
              <button
                key={label}
                onClick={action}
                className={`relative px-2 sm:px-3.5 py-[7px] rounded-[13px] text-[11px] sm:text-[13px] font-medium transition-colors duration-150 ${!mobile ? 'hidden sm:block' : ''} ${
                  active
                    ? 'text-neutral-900 dark:text-white'
                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-[13px]
                      bg-white dark:bg-white/[0.09]
                      border border-neutral-200/70 dark:border-white/[0.08]
                      shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_1px_4px_rgba(0,0,0,0.06)]
                      dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset]"
                    transition={{ type: 'spring', stiffness: 520, damping: 38, mass: 0.8 }}
                  />
                )}
                <span className="relative z-10 leading-none">{label}</span>
              </button>
            ))}
          </div>

          {/* ── Separator ─────────────────────────────────────────────────── */}
          <div className="w-px h-[18px] bg-neutral-200/80 dark:bg-white/[0.07] mx-1 rounded-full" />

          {/* ── Right controls ─────────────────────────────────────────────── */}
          <div className="flex items-center gap-0.5">

            {/* Search — ⌘K */}
            <button
              onClick={openSearch}
              className="hidden sm:flex items-center gap-2 px-3 py-[7px] rounded-[13px] text-[12px] font-medium
                text-neutral-400 dark:text-neutral-500
                hover:text-neutral-700 dark:hover:text-neutral-200
                hover:bg-neutral-100/70 dark:hover:bg-white/[0.05]
                transition-all duration-150 group"
              title="Search (⌘K)"
            >
              <Command size={12} className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-300 transition-colors" />
              <span className="hidden md:inline text-[12px]">Search</span>
              <kbd className="hidden md:inline text-[9px] font-mono px-1 py-0.5 rounded
                bg-neutral-100/80 dark:bg-white/[0.06]
                border border-neutral-200/60 dark:border-white/[0.06]
                text-neutral-400 dark:text-neutral-600">K</kbd>
            </button>

            {/* Ask me */}
            <button
              onClick={() => { setAskOpen(true); track({ type: 'askme_open' }); }}
              className="flex items-center gap-1.5 px-3 py-[7px] rounded-[13px] text-[13px] font-medium
                text-neutral-500 dark:text-neutral-400
                hover:text-neutral-800 dark:hover:text-neutral-200
                hover:bg-neutral-100/70 dark:hover:bg-white/[0.05]
                transition-all duration-150"
            >
              <span className="text-[12px] leading-none opacity-70">✦</span>
              <span className="hidden sm:inline">Ask me</span>
            </button>

            {/* Theme toggle — light mode is locked, clicking just roasts you (message shows next to the profile picture on Home, or here on other pages) */}
            <div className="relative px-1 text-neutral-400 dark:text-neutral-500">
              <AnimatedThemeToggler isDark={resolvedTheme === 'dark'} onToggle={toggleTheme} />

              {page !== 'home' && (
                <AnimatePresence>
                  {roast && (
                    <motion.div
                      key={roast.id}
                      initial={{ opacity: 0, y: 'calc(-50% + 8px)', scale: 0.85, rotate: 3 }}
                      animate={{ opacity: 1, y: '-50%', scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, y: '-50%', scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 460, damping: 24 }}
                      className="absolute z-30 w-[min(220px,70vw)] px-4.5 py-3.5 left-full top-1/2 ml-3.5
                        bg-white/95 dark:bg-neutral-950/95
                        backdrop-blur-xl
                        border border-neutral-200/80 dark:border-white/[0.08]
                        rounded-[20px]
                        shadow-[0_2px_0_rgba(255,255,255,0.95)_inset,0_20px_48px_rgba(0,0,0,0.16)]
                        dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_20px_48px_rgba(0,0,0,0.6)]
                        text-[13.5px] font-semibold tracking-[-0.01em] leading-snug text-text-light dark:text-text-dark text-center
                        pointer-events-none"
                    >
                      {roast.text}
                      <span className="absolute top-1/2 -translate-y-1/2 -left-[6px] w-3.5 h-3.5
                        bg-white/95 dark:bg-neutral-950/95
                        border-r border-b border-neutral-200/80 dark:border-white/[0.08]
                        rotate-[135deg]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>

          </div>
        </motion.nav>
      </div>

      <AskMeModal isOpen={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
};

export default Navbar;
