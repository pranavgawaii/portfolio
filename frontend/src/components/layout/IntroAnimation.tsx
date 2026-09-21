import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'motion/react';

// ─── Shared types & context ──────────────────────────────────────────────────
export type IntroPhase = 'visible' | 'collapsing' | 'centered' | 'rebuilding' | 'done';

export const IntroContext = createContext<IntroPhase>('done');
export const useIntroPhase = () => useContext(IntroContext);

// ─── Easing curves ───────────────────────────────────────────────────────────
const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];
const EASE_OUT_QUINT: [number, number, number, number] = [0.22, 1, 0.36, 1];

// ─── IntroReveal ─────────────────────────────────────────────────────────────
interface IntroRevealProps {
  delay?: number;
  children: React.ReactNode;
  className?: string;
}

export const IntroReveal: React.FC<IntroRevealProps> = ({ delay = 0, children, className }) => {
  const phase = useIntroPhase();
  const shouldShow = phase === 'visible' || phase === 'done' || phase === 'rebuilding';

  return (
    <motion.div
      className={className}
      initial={false}
      animate={
        shouldShow
          ? { opacity: 1, filter: 'blur(0px)', y: 0 }
          : { opacity: 0, filter: 'blur(8px)', y: 16 }
      }
      transition={
        phase === 'rebuilding'
          ? { duration: 0.7, delay, ease: EASE_OUT_QUINT }
          : phase === 'collapsing'
            ? { duration: 0.45, ease: EASE_IN }
            : { duration: 0 }
      }
    >
      {children}
    </motion.div>
  );
};

// ─── IntroAnimation (floating overlay) ───────────────────────────────────────
//
// Timeline (ms from mount):
//   0      website visible normally
//   200    collapse starts, avatar clone appears above viewport
//   500    avatar starts dropping to center
//   1100   avatar at center
//   1300   phase → 'centered'
//   1800   "Hey, I'm Pranav" reveals letter-by-letter
//   2700   phase → 'rebuilding', text exits
//   3500   re-measure, avatar starts moving to hero position
//   4500   phase → 'done', clone unmounts
//

interface IntroAnimationProps {
  onPhaseChange: (phase: IntroPhase) => void;
}

const AVATAR_SIZE = 120;
const GREETING = "Hey, I'm Pranav";

const IntroAnimation: React.FC<IntroAnimationProps> = ({ onPhaseChange }) => {
  const [showClone, setShowClone] = useState(false);
  const [avatarPos, setAvatarPos] = useState<'above' | 'center' | 'hero'>('above');
  const [textState, setTextState] = useState<'hidden' | 'revealing' | 'exiting'>('hidden');
  const [cloneOpacity, setCloneOpacity] = useState(1);
  const [done, setDone] = useState(false);

  const heroRectRef = useRef<DOMRect | null>(null);
  const [ready, setReady] = useState(false);
  const timelineStarted = useRef(false);
  const [, forceRender] = useState(0);

  // ── Measure hero avatar position ───────────────────────────────────────────
  const measure = useCallback(() => {
    const el = document.querySelector('[data-hero-avatar]');
    if (el) {
      heroRectRef.current = el.getBoundingClientRect();
      return true;
    }
    return false;
  }, []);

  useEffect(() => {
    let cancelled = false;
    let attempts = 0;
    const poll = () => {
      if (cancelled) return;
      if (measure()) { setReady(true); return; }
      if (++attempts < 60) requestAnimationFrame(poll);
    };
    requestAnimationFrame(poll);
    return () => { cancelled = true; };
  }, [measure]);

  useEffect(() => {
    const h = () => { measure(); forceRender(n => n + 1); };
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, [measure]);

  // ── Main timeline ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!ready || timelineStarted.current) return;
    timelineStarted.current = true;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => { timers.push(setTimeout(fn, ms)); };

    // T=200 — Collapse: content fades, clone appears above viewport
    t(() => {
      onPhaseChange('collapsing');
      setShowClone(true);
    }, 200);

    // T=500 — Avatar drops from above to center
    t(() => setAvatarPos('center'), 500);

    // T=1300 — Centered phase
    t(() => onPhaseChange('centered'), 1300);

    // T=1800 — Text reveals letter-by-letter
    t(() => setTextState('revealing'), 1800);

    // T=2700 — Rebuild: content starts reappearing, text exits
    t(() => {
      onPhaseChange('rebuilding');
      setTextState('exiting');
    }, 2700);

    // T=3500 — Re-measure & avatar moves to hero position
    t(() => {
      measure();
      forceRender(n => n + 1);
      setAvatarPos('hero');
    }, 3500);

    // T=4150 — Phase done: real avatar snaps in instantly. Start fading out clone.
    t(() => {
      onPhaseChange('done');
      setCloneOpacity(0);
    }, 4150);

    // T=4400 — Unmount clone completely
    t(() => setDone(true), 4400);

    return () => timers.forEach(clearTimeout);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Render ─────────────────────────────────────────────────────────────────
  if (done || !ready) return null;

  const heroRect = heroRectRef.current!;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  // Clone's CSS home = viewport center
  const cloneCenterLeft = vw / 2 - AVATAR_SIZE / 2;
  const cloneCenterTop = vh / 2 - AVATAR_SIZE / 2 - 16;

  // Transform offset: center → hero position
  const heroOffsetX = (heroRect.left + heroRect.width / 2) - vw / 2;
  const heroOffsetY = (heroRect.top + heroRect.height / 2) - (vh / 2 - 16);
  const heroScale = heroRect.width / AVATAR_SIZE;

  // Drop distance: far enough above the viewport to be invisible
  const aboveY = -(cloneCenterTop + AVATAR_SIZE + 60);

  // Avatar animate values based on position state
  const avatarAnimate =
    avatarPos === 'above'
      ? { x: 0, y: aboveY, scale: 1 }
      : avatarPos === 'center'
        ? { x: 0, y: 0, scale: 1 }
        : { x: heroOffsetX, y: heroOffsetY, scale: heroScale };

  // Avatar transition — spring for the drop, smooth ease for the return
  const avatarTransition =
    avatarPos === 'center'
      ? { type: 'spring' as const, damping: 14, stiffness: 80, mass: 1.2 }
      : avatarPos === 'hero'
        ? { duration: 0.65, ease: EASE_OUT_QUINT }
        : { duration: 0 };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      {showClone && (
        <>
          {/* ── Avatar clone — drops from above, then returns to hero ── */}
          <motion.div
            className="absolute rounded-2xl overflow-hidden"
            style={{
              width: AVATAR_SIZE,
              height: AVATAR_SIZE,
              left: cloneCenterLeft,
              top: cloneCenterTop,
              willChange: 'transform',
            }}
            initial={{ x: 0, y: aboveY, scale: 1 }}
            animate={{ ...avatarAnimate, opacity: cloneOpacity }}
            transition={{
              ...avatarTransition,
              opacity: { duration: 0.15, ease: 'linear' },
            }}
          >
            <img
              src="/avatar.jpg"
              alt="Pranav Gawai"
              className="w-full h-full object-cover"
              draggable={false}
            />
          </motion.div>

          {/* ── "Hey, I'm Pranav" — letter-by-letter reveal ── */}
          <div
            className="absolute font-sans font-bold text-2xl sm:text-3xl text-text-light dark:text-text-dark tracking-tight leading-none flex justify-center"
            style={{
              left: '50%',
              top: cloneCenterTop + AVATAR_SIZE + 24,
              transform: 'translateX(-50%)',
            }}
          >
            {GREETING.split('').map((char, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 16, filter: 'blur(8px)' }}
                animate={
                  textState === 'revealing'
                    ? { opacity: 1, y: 0, filter: 'blur(0px)' }
                    : textState === 'exiting'
                      ? { opacity: 0, y: -12, filter: 'blur(4px)' }
                      : { opacity: 0, y: 16, filter: 'blur(8px)' }
                }
                transition={
                  textState === 'revealing'
                    ? { duration: 0.7, delay: i * 0.035, ease: EASE_OUT_QUINT }
                    : textState === 'exiting'
                      ? { duration: 0.3, ease: EASE_IN }
                      : { duration: 0 }
                }
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IntroAnimation;
