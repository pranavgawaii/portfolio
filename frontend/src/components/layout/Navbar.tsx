import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useNav } from '../../App';
import AnimatedThemeToggler from '../ui/AnimatedThemeToggler';
import AskMeModal from '../modals/AskMeModal';

const Navbar: React.FC<{ onResumeOpen: () => void }> = ({ onResumeOpen }) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted]       = useState(false);
  const [askOpen, setAskOpen]       = useState(false);
  const { page, goHome, goProjects, goBlog, goDSA } = useNav();

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = (_e: React.MouseEvent) => {
    const root = document.documentElement;
    // Step 1: Freeze all transitions for this frame
    root.classList.add('theme-switching');
    // Step 2: Apply the new theme
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    // Step 3: Re-enable transitions on the very next animation frame
    // (after browser has painted the new theme)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        root.classList.remove('theme-switching');
      });
    });
  };

  const handleHome = () => {
    if (page !== 'home') goHome();
    else document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) return (
    <nav className="w-full max-w-content px-4 sm:px-6 py-3 flex justify-between items-center sticky top-0 z-50" />
  );

  const links = [
    { label: 'Home',     active: page === 'home',     action: handleHome },
    { label: 'Projects', active: page === 'projects', action: goProjects },
    { label: 'Blog',     active: page === 'blog',     action: goBlog },
    { label: 'Resume',   active: page === 'resume',   action: onResumeOpen },
  ];

  return (
    <>
      <nav className="w-full sticky top-0 z-50 bg-white/80 dark:bg-[#100F0F]/80 backdrop-blur-md border-b border-border-light dark:border-border-dark">
        <div className="w-full max-w-content mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
          {/* Nav links */}
          <div className="flex items-center gap-0.5">
            {links.map(({ label, active, action }: any) => (
              <button
                key={label}
                onClick={action}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                  active
                    ? 'text-text-light dark:text-text-dark'
                    : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-100 dark:hover:bg-white/5'
                }`}
              >
                {label}
              </button>
            ))}
            
            <div className="w-[1px] h-4 bg-border-light dark:bg-border-dark mx-1.5" />
            
            <button
              onClick={goDSA}
              className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 flex items-center gap-1.5 ${
                page === 'dsa' 
                  ? 'text-text-light dark:text-text-dark bg-neutral-100 dark:bg-white/10' 
                  : 'text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-100 dark:hover:bg-white/5'
              }`}
            >
                Sheet
              </button>
            </div>

            {/* Right - Ask me + theme toggle */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setAskOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
              >
                <span className="text-[14px] leading-none">✦</span>
                Ask me
              </button>

              <div className="text-text-muted-light dark:text-text-muted-dark">
                <AnimatedThemeToggler isDark={resolvedTheme === 'dark'} onToggle={toggleTheme} />
              </div>
            </div>
          </div>
        </nav>

        <AskMeModal isOpen={askOpen} onClose={() => setAskOpen(false)} />
      </>
    );
};

export default Navbar;
