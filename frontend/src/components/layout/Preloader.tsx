import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

const SEQUENCE = ['pranav', 'pranav.init()', 'pranav.init() ✓'];
const DELAY_PER_CHAR = 38;

const Preloader = () => {
  const [display, setDisplay] = useState('');
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const target = SEQUENCE[phase];
    if (!target) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplay(target.slice(0, i));
      if (i >= target.length) {
        clearInterval(interval);
        if (phase < SEQUENCE.length - 1) {
          setTimeout(() => { setDisplay(''); setPhase(p => p + 1); }, 180);
        }
      }
    }, DELAY_PER_CHAR);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center gap-3"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45, ease: 'easeInOut' } }}
    >
      <p className="font-mono text-sm text-neutral-400 tracking-widest min-w-[160px]">
        {display}
        <span className="animate-pulse text-neutral-600">_</span>
      </p>
    </motion.div>
  );
};

export default Preloader;
