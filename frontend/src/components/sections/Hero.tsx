import React, { useState, useEffect } from 'react';
import { PROFILE, ICONS_MAP } from '../../config/constants';
import { AnimatePresence, motion } from 'motion/react';
import ProgressiveImage from '../ui/ProgressiveImage';
import ContactModal from '../modals/ContactModal';

const Hero: React.FC = () => {
  const [showContact, setShowContact] = useState(false);
  const [showZoom, setShowZoom]       = useState(false);
  const [mounted, setMounted]         = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      <header className="pt-10 pb-2">
        {/* Identity block — big avatar left, info right */}
        <div className="flex items-center gap-4 mb-5">
          {/* Avatar — fully circular and smaller */}
          <button
            onClick={() => setShowZoom(true)}
            className="shrink-0 w-24 h-24 rounded-2xl overflow-hidden hover:ring-2 hover:ring-neutral-400 dark:hover:ring-neutral-500 transition-all duration-300"
          >
            <ProgressiveImage src="/avatar.jpg" alt="Pranav Gawai" className="w-full h-full object-cover" />
          </button>

          {/* Name + role + socials */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="font-sans font-bold text-2xl sm:text-3xl text-text-light dark:text-text-dark tracking-tight leading-none">
                Pranav Gawai
              </h1>
              {/* Verified badge */}
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-blue-500 fill-current shrink-0">
                <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.15-.44.23-.91.23-1.4 0-2.45-1.99-4.44-4.44-4.44-.49 0-.96.08-1.4.23-1.42-1.3-3.08-2.18-3.66-2.18-1.58 0-2.95.88-3.66 2.18-.44-.15-.91-.23-1.4-.23-2.45 0-4.44 1.99-4.44 4.44 0 .49.08.96.23 1.4C1.3 10.08.42 11.74.42 12.5c0 1.58.88 2.95 2.18 3.66-.15.44-.23.91-.23 1.4 0 2.45 1.99 4.44 4.44 4.44.49 0 .96-.08 1.4-.23 1.42 1.3 3.08 2.18 3.66 2.18 1.58 0 2.95-.88 3.66-2.18.44.15.91.23 1.4.23 2.45 0 4.44-1.99 4.44-4.44 0-.49-.08-.96-.23-1.4 1.3-1.42 2.18-3.08 2.18-3.66z"/>
                <path d="M10.2 16.25l-3.45-3.45 1.06-1.06 2.39 2.39 5.39-5.39 1.06 1.06-6.45 6.45z" className="text-white fill-current"/>
              </svg>
            </div>

            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Full Stack Engineer · AI-native SaaS Builder
            </p>

          </div>
        </div>

        {/* Bio */}
        <p className="text-sm leading-relaxed text-text-muted-light dark:text-text-muted-dark mb-4 w-full">
          Pre-final year <span className="text-text-light dark:text-text-dark font-medium">B.Tech CSE (AI/ML)</span> student shipping{' '}
          <span className="font-medium text-text-light dark:text-text-dark">
            AI-native SaaS products
          </span>{' '}
          and competing in national-level hackathons. Targeting <span className="bg-blue-100/70 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-1 py-0.5 rounded font-medium">AI-first startups</span>. Building in public.
        </p>

        {/* Social icons inline */}
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

        {/* CTA */}
        <button
          onClick={() => setShowContact(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-all duration-200"
        >
          Get in touch
          <span className="text-text-light dark:text-text-dark">→</span>
        </button>
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
