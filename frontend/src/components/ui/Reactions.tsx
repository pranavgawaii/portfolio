import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ThumbsUp, Flame, Lightbulb, Heart } from 'lucide-react';

import { API_BASE as API } from '../../lib/api';

const REACTIONS = [
  { key: 'like',      Icon: ThumbsUp,  label: 'Useful',      activeColor: 'text-blue-500',   activeBg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60' },
  { key: 'fire',      Icon: Flame,      label: 'Insightful',  activeColor: 'text-orange-500', activeBg: 'bg-orange-50 dark:bg-orange-950/40 border-orange-200 dark:border-orange-800/60' },
  { key: 'idea',      Icon: Lightbulb,  label: 'Thought-provoking', activeColor: 'text-amber-500', activeBg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60' },
  { key: 'love',      Icon: Heart,      label: 'Love it',     activeColor: 'text-rose-500',   activeBg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60' },
] as const;

type ReactionKey = typeof REACTIONS[number]['key'];

interface Props { slug: string }

const Reactions: React.FC<Props> = ({ slug }) => {
  const [counts, setCounts] = useState<Record<ReactionKey, number>>({} as Record<ReactionKey, number>);
  const [voted, setVoted] = useState<Set<ReactionKey>>(() => {
    try { return new Set(JSON.parse(localStorage.getItem(`reactions-${slug}`) || '[]') as ReactionKey[]); }
    catch { return new Set(); }
  });
  const [burst, setBurst] = useState<ReactionKey | null>(null);
  const [tooltip, setTooltip] = useState<ReactionKey | null>(null);

  useEffect(() => {
    fetch(`${API}/api/reactions?slug=${encodeURIComponent(slug)}`)
      .then(r => r.ok ? r.json() : {})
      .then(setCounts)
      .catch(() => {});
  }, [slug]);

  const toggle = async (key: ReactionKey) => {
    const alreadyVoted = voted.has(key);
    const action = alreadyVoted ? 'remove' : 'add';
    setCounts(c => ({ ...c, [key]: Math.max(0, (c[key] || 0) + (alreadyVoted ? -1 : 1)) }));
    const next = new Set(voted);
    alreadyVoted ? next.delete(key) : next.add(key);
    setVoted(next);
    localStorage.setItem(`reactions-${slug}`, JSON.stringify([...next]));
    if (!alreadyVoted) { setBurst(key); setTimeout(() => setBurst(null), 500); }
    try {
      const res = await fetch(`${API}/api/reactions?slug=${encodeURIComponent(slug)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji: key, action }),
      });
      if (res.ok) setCounts(await res.json());
      else console.error('[reactions] toggle failed:', res.status);
    } catch (err) {
      console.error('[reactions] toggle error:', err);
    }
  };

  const total = (Object.values(counts) as number[]).reduce((a: number, b: number) => a + b, 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600">React to this</span>
        {total > 0 && <span className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">· {total} total</span>}
      </div>
      <div className="flex items-center gap-2">
        {REACTIONS.map(({ key, Icon, label, activeColor, activeBg }) => {
          const count = (counts[key] as number) || 0;
          const active = voted.has(key);
          const isBurst = burst === key;
          return (
            <div key={key} className="relative">
              {/* Tooltip */}
              <AnimatePresence>
                {tooltip === key && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 2, scale: 0.9 }}
                    transition={{ duration: 0.12 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap
                      bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 pointer-events-none z-10"
                  >
                    {label}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Burst ring */}
              <AnimatePresence>
                {isBurst && (
                  <motion.span
                    initial={{ scale: 1, opacity: 0.6 }}
                    animate={{ scale: 2.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className={`absolute inset-0 rounded-xl pointer-events-none ${active ? 'bg-current' : ''}`}
                    style={{ border: '1.5px solid currentColor' }}
                  />
                )}
              </AnimatePresence>

              <motion.button
                whileTap={{ scale: 0.84 }}
                onMouseEnter={() => setTooltip(key)}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => toggle(key)}
                className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all duration-200 ${
                  active
                    ? `${activeBg} ${activeColor}`
                    : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 hover:border-neutral-300 dark:hover:border-neutral-700 hover:text-neutral-600 dark:hover:text-neutral-400 bg-transparent'
                }`}
              >
                <Icon
                  size={14}
                  className={`transition-transform duration-200 ${isBurst ? 'scale-125' : ''} ${active ? 'fill-current' : ''}`}
                  strokeWidth={active ? 1.5 : 1.8}
                />
                <AnimatePresence mode="popLayout">
                  {count > 0 && (
                    <motion.span
                      key={count}
                      initial={{ opacity: 0, scale: 0.6, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.6, y: 4 }}
                      transition={{ duration: 0.2 }}
                      className="text-[11px] font-mono tabular-nums leading-none"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Reactions;
