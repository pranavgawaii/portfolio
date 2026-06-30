import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from 'next-themes';
import { useNav } from '../../App';
import AnimatedThemeToggler from '../ui/AnimatedThemeToggler';
import AskMeModal from '../modals/AskMeModal';
import { useUser, useClerk } from '@clerk/clerk-react';
import { LogOut, LayoutDashboard, Command } from 'lucide-react';
import { track } from '../../hooks/useAnalytics';

const ADMIN_EMAIL = 'pranvgg@gmail.com';

const Navbar: React.FC<{ onResumeOpen: () => void }> = ({ onResumeOpen }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted]       = useState(false);
  const [askOpen, setAskOpen]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { page, goHome, goProjects, goBlog, goDSA, goAdmin } = useNav();
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    root.classList.add('theme-switching');
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')));
  };

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
                className={`relative touch-compact px-2 sm:px-3.5 py-[7px] rounded-[13px] text-[11px] sm:text-[13px] font-medium transition-colors duration-150 ${!mobile ? 'hidden sm:block' : ''} ${
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

            {/* Theme toggle */}
            <div className="px-1 text-neutral-400 dark:text-neutral-500">
              <AnimatedThemeToggler isDark={resolvedTheme === 'dark'} onToggle={toggleTheme} />
            </div>

            {/* Admin avatar — only shown to admin */}
            {isSignedIn && user && isAdmin && (
              <div className="relative ml-0.5" ref={menuRef}>
                <motion.button
                  whileTap={{ scale: 0.93 }}
                  onClick={() => setUserMenuOpen(o => !o)}
                  className="relative w-7 h-7 rounded-[10px] overflow-hidden
                    ring-[1.5px] ring-amber-300/80 dark:ring-amber-600/60
                    hover:ring-amber-400 dark:hover:ring-amber-500
                    shadow-[0_2px_8px_rgba(245,158,11,0.2)] dark:shadow-[0_2px_8px_rgba(245,158,11,0.15)]
                    transition-all duration-150"
                  title="Admin"
                >
                  {user.imageUrl
                    ? <img src={user.imageUrl} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-[11px] font-bold text-amber-700 dark:text-amber-300">{user.firstName?.[0]}</div>
                  }
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95, filter: 'blur(4px)' }}
                      animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, y: 6, scale: 0.95, filter: 'blur(4px)' }}
                      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute right-0 top-[38px] w-54 min-w-[210px]
                        bg-white/85 dark:bg-neutral-950/85
                        backdrop-blur-2xl backdrop-saturate-150
                        border border-white/60 dark:border-white/[0.07]
                        rounded-2xl
                        shadow-[0_2px_0_rgba(255,255,255,0.8)_inset,0_16px_48px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]
                        dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_16px_48px_rgba(0,0,0,0.6),0_4px_12px_rgba(0,0,0,0.4)]
                        overflow-hidden z-[60]"
                    >
                      {/* Header */}
                      <div className="px-4 py-3.5 border-b border-neutral-100/80 dark:border-white/[0.05]">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[12px] font-semibold text-neutral-900 dark:text-neutral-100 truncate flex-1">{user.fullName || user.firstName}</p>
                          <span className="text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md
                            bg-amber-100/80 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400
                            border border-amber-200/60 dark:border-amber-800/50">admin</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
                      </div>
                      {/* Dashboard */}
                      <button
                        onClick={() => { (goAdmin as any)?.(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-medium
                          text-neutral-600 dark:text-neutral-300
                          hover:bg-neutral-50 dark:hover:bg-white/[0.04]
                          hover:text-neutral-900 dark:hover:text-white
                          transition-colors"
                      >
                        <div className="w-6 h-6 rounded-lg bg-neutral-100 dark:bg-white/[0.06] flex items-center justify-center">
                          <LayoutDashboard size={12} />
                        </div>
                        Admin Dashboard
                      </button>
                      {/* Sign out */}
                      <button
                        onClick={() => { signOut(); setUserMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-[12px] font-medium
                          text-red-400 hover:text-red-500
                          hover:bg-red-50/50 dark:hover:bg-red-950/20
                          transition-colors
                          border-t border-neutral-100/80 dark:border-white/[0.05]"
                      >
                        <div className="w-6 h-6 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center">
                          <LogOut size={12} className="text-red-400" />
                        </div>
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.nav>
      </div>

      <AskMeModal isOpen={askOpen} onClose={() => setAskOpen(false)} />
    </>
  );
};

export default Navbar;
