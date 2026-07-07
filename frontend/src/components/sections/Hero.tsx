import React, { useState, useEffect } from 'react';
import { PROFILE, ICONS_MAP } from '../../config/constants';
import { AnimatePresence, motion } from 'motion/react';
import ProgressiveImage from '../ui/ProgressiveImage';
import ContactModal from '../modals/ContactModal';
import { useNav } from '../../App';

const Hero: React.FC = () => {
  const [showContact, setShowContact] = useState(false);
  const [showZoom, setShowZoom]       = useState(false);
  const [mounted, setMounted]         = useState(false);
  const { openResume, roast } = useNav() as any;

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      <header className="pt-24 pb-2">
        {/* Identity block */}
        <div className="flex items-center gap-4 mb-5">
          <div className="relative shrink-0">
            <button
              onClick={() => setShowZoom(true)}
              className="w-24 h-24 rounded-2xl overflow-hidden hover:ring-2 hover:ring-neutral-400 dark:hover:ring-neutral-500 transition-all duration-300"
            >
              <ProgressiveImage src="/avatar.jpg" alt="Pranav Gawai" className="w-full h-full object-cover" />
            </button>

            {/* Roast bubble — dark mode is locked, this fires when someone tries to switch it */}
            <AnimatePresence>
              {roast && (
                <motion.div
                  key={roast.id}
                  initial={{ opacity: 0, y: 'calc(-50% + 8px)', scale: 0.85, rotate: -3 }}
                  animate={{ opacity: 1, y: '-50%', scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, y: '-50%', scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 460, damping: 24 }}
                  className="absolute z-30 w-[min(220px,80vw)] px-4.5 py-3.5 right-full top-1/2 mr-3.5
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
                  <span className="absolute top-1/2 -translate-y-1/2 -right-[6px] w-3.5 h-3.5
                    bg-white/95 dark:bg-neutral-950/95
                    border-r border-b border-neutral-200/80 dark:border-white/[0.08]
                    rotate-[-45deg]" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-text-light dark:text-text-dark tracking-tight leading-none">
                Pranav Gawai
              </h1>
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-blue-500 fill-current shrink-0">
                <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.15-.44.23-.91.23-1.4 0-2.45-1.99-4.44-4.44-4.44-.49 0-.96.08-1.4.23-1.42-1.3-3.08-2.18-3.66-2.18-1.58 0-2.95.88-3.66 2.18-.44-.15-.91-.23-1.4-.23-2.45 0-4.44 1.99-4.44 4.44 0 .49.08.96.23 1.4C1.3 10.08.42 11.74.42 12.5c0 1.58.88 2.95 2.18 3.66-.15.44-.23.91-.23 1.4 0 2.45 1.99 4.44 4.44 4.44.49 0 .96-.08 1.4-.23 1.42 1.3 3.08 2.18 3.66 2.18 1.58 0 2.95-.88 3.66-2.18.44.15.91.23 1.4.23 2.45 0 4.44-1.99 4.44-4.44 0-.49-.08-.96-.23-1.4 1.3-1.42 2.18-3.08 2.18-3.66z"/>
                <path d="M10.2 16.25l-3.45-3.45 1.06-1.06 2.39 2.39 5.39-5.39 1.06 1.06-6.45 6.45z" className="text-white fill-current"/>
              </svg>
            </div>

            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Engineer · AI Builder
            </p>

            <div className="inline-flex items-center gap-1.5 mt-2 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/60 dark:bg-emerald-950/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 tracking-wide">Open to roles</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark mb-4 w-full">
          Final year CSE student building{' '}
          <span className="bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-medium">AI-native products</span>. 
          Competing in national hackathons. Looking for an early AI team to join.
        </p>

        {/* Social icons */}
        <div className="flex items-center gap-3 text-text-muted-light dark:text-text-muted-dark mb-6">
          {PROFILE.socials.map(s => {
            const Icon = ICONS_MAP[s.icon.toLowerCase()];
            return Icon ? (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group/social hover:text-text-light dark:hover:text-text-dark transition-colors duration-200"
              >
                <Icon size={20} strokeWidth={1.5} />
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-sans bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-2 py-0.5 rounded opacity-0 group-hover/social:opacity-100 transition-opacity pointer-events-none z-20">
                  {s.name}
                </span>
              </a>
            ) : null;
          })}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={openResume}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-200"
          >
            View Resume
          </button>
          <button
            onClick={() => setShowContact(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-200"
          >
            Get in touch
            <span className="text-text-light dark:text-text-dark">→</span>
          </button>
        </div>
      </header>

      <ContactModal isOpen={showContact} onClose={() => setShowContact(false)} />

      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowZoom(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="w-72 h-72 rounded-3xl overflow-hidden shadow-2xl ring-2 ring-white/10"
              onClick={e => e.stopPropagation()}
            >
              <img src="/avatar.jpg" alt="Pranav Gawai" className="w-full h-full object-cover" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;
