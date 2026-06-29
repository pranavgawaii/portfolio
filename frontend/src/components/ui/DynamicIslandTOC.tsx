import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

type HeadingData = { id: string; text: string; level: number; element: HTMLElement };

function CircleProgress({ percentage }: { percentage: number }) {
  const size = 22, sw = 2.2, r = (size - sw) / 2, c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw} className="opacity-10" />
      <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" strokeWidth={sw}
        strokeDasharray={c} initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c - (percentage / 100) * c }}
        transition={{ duration: 0.15, ease: 'easeOut' }} strokeLinecap="round"
      />
    </svg>
  );
}

export function DynamicIslandTOC({ selector = 'article h2, article h3, article h4' }: { selector?: string }) {
  const [headings, setHeadings] = useState<HeadingData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const els = Array.from(document.querySelectorAll(selector)) as HTMLElement[];
      const valid = els
        .filter(el => el.textContent && el.textContent.trim().length > 0)
        .map((el, i) => {
          if (!el.id) {
            el.id = (el.textContent || '').toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || `toc-${i}`;
          }
          const tag = el.tagName.toUpperCase();
          const level = tag.startsWith('H') && tag.length === 2 ? parseInt(tag[1], 10) : 2;
          return { id: el.id, text: el.textContent || '', level, element: el };
        });
      setHeadings(valid);
    }, 200);
    return () => clearTimeout(timer);
  }, [selector]);

  useEffect(() => {
    const onScroll = () => {
      let cur: string | null = null;
      for (const h of headings) {
        if (h.element.getBoundingClientRect().top <= 130) cur = h.id;
        else break;
      }
      if (!cur && headings.length) cur = headings[0].id;
      setActiveId(cur);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(100, (window.scrollY / total) * 100) : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [headings]);

  const minLevel = useMemo(() => headings.length ? Math.min(...headings.map(h => h.level)) : 1, [headings]);
  const activeHeading = headings.find(h => h.id === activeId);

  if (headings.length < 2) return null;

  const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="fixed inset-0 z-[9998] bg-black/20 dark:bg-black/40 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Island */}
      <div className="fixed bottom-7 left-1/2 z-[9999] -translate-x-1/2">
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        >
          <motion.div
            onClick={() => { if (!isExpanded) setIsExpanded(true); }}
            initial={false}
            animate={{
              width: isExpanded ? 300 : 260,
              height: isExpanded ? Math.min(52 + headings.length * 38 + 24, 420) : 48,
              borderRadius: isExpanded ? 22 : 24,
            }}
            transition={{ type: 'tween', ease, duration: 0.45 }}
            style={{ cursor: isExpanded ? 'default' : 'pointer' }}
            className="relative overflow-hidden
              bg-white/80 dark:bg-neutral-950/85
              backdrop-blur-2xl backdrop-saturate-150
              border border-white/60 dark:border-white/[0.08]
              shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_rgba(0,0,0,0.12),0_4px_12px_rgba(0,0,0,0.06)]
              dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_12px_40px_rgba(0,0,0,0.55),0_4px_12px_rgba(0,0,0,0.4)]"
          >
            {/* Collapsed pill */}
            <motion.div
              initial={false}
              animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.93 : 1, filter: isExpanded ? 'blur(4px)' : 'blur(0px)' }}
              transition={{ duration: 0.25, ease }}
              className={`absolute inset-0 flex items-center gap-3.5 px-4 ${isExpanded ? 'pointer-events-none' : ''}`}
            >
              <div className="w-2 h-2 rounded-full bg-neutral-800 dark:bg-neutral-200 shrink-0" />
              <div className="flex-1 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={activeId || 'empty'}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="block text-[12px] font-medium text-neutral-800 dark:text-neutral-200 truncate"
                  >
                    {activeHeading?.text || 'Contents'}
                  </motion.span>
                </AnimatePresence>
              </div>
              <div className="text-neutral-600 dark:text-neutral-300">
                <CircleProgress percentage={progress} />
              </div>
            </motion.div>

            {/* Expanded menu */}
            <motion.div
              initial={false}
              animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 1.04 }}
              transition={{ duration: 0.25, ease, delay: isExpanded ? 0.08 : 0 }}
              className={`absolute inset-0 flex flex-col ${!isExpanded ? 'pointer-events-none' : ''}`}
            >
              <div className="flex items-center justify-between px-5 py-4 shrink-0">
                <span className="text-[9px] font-mono uppercase tracking-[0.12em] text-neutral-400 dark:text-neutral-500">Contents</span>
                <button
                  onClick={e => { e.stopPropagation(); setIsExpanded(false); }}
                  className="w-5 h-5 rounded-full bg-neutral-100 dark:bg-white/[0.07] flex items-center justify-center text-neutral-400 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors"
                >
                  <X size={11} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto px-2 pb-3">
                <div className="flex flex-col gap-0.5">
                  {headings.map(h => {
                    const isActive = activeId === h.id;
                    const isHovered = hoveredId === h.id;
                    const indent = (h.level - minLevel) * 12 + 10;
                    return (
                      <button
                        key={h.id}
                        onMouseEnter={() => setHoveredId(h.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={e => {
                          e.stopPropagation();
                          const y = h.element.getBoundingClientRect().top + window.scrollY - 90;
                          window.scrollTo({ top: y, behavior: 'smooth' });
                          setIsExpanded(false);
                        }}
                        style={{ paddingLeft: `${indent}px` }}
                        className={`w-full flex items-center rounded-xl py-2 pr-3 text-left text-[12px] transition-all duration-200 ${
                          isActive
                            ? 'bg-neutral-900/[0.07] dark:bg-white/[0.08] font-medium text-neutral-900 dark:text-white'
                            : isHovered
                            ? 'bg-neutral-100/60 dark:bg-white/[0.04] text-neutral-700 dark:text-neutral-300'
                            : 'text-neutral-400 dark:text-neutral-600'
                        }`}
                      >
                        <span className="flex-1 truncate transition-transform duration-200 group-hover:translate-x-0.5">{h.text}</span>
                        {isActive && (
                          <motion.span
                            layoutId="toc-dot"
                            className="ml-2 w-1.5 h-1.5 rounded-full bg-neutral-800 dark:bg-neutral-200 shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}
