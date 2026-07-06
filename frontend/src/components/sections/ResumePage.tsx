import React from 'react';
import { Download } from 'lucide-react';
import { motion } from 'motion/react';

const DRIVE_PREVIEW = 'https://drive.google.com/file/d/1rzKHkdME-8SsIoQqEqh6ZVAoKYXoQ7M4/preview';
const DRIVE_DOWNLOAD = 'https://drive.google.com/uc?export=download&id=1rzKHkdME-8SsIoQqEqh6ZVAoKYXoQ7M4';

const ResumePage: React.FC = () => (
  <div className="w-full min-h-screen pt-8 pb-24">
    <div className="w-full max-w-4xl mx-auto">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-end justify-between mb-8 px-1"
      >
        <div>
          <p className="text-[10px] font-mono uppercase tracking-[0.14em] text-neutral-400 dark:text-neutral-600 mb-1.5">Document</p>
          <h1 className="font-sans font-bold text-3xl sm:text-[38px] text-neutral-900 dark:text-neutral-100 tracking-tight leading-none">
            Resume
          </h1>
        </div>
        <a
          href={DRIVE_DOWNLOAD}
          target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-[12px] shadow-sm hover:opacity-85 transition-opacity"
        >
          <Download size={13} />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </a>
      </motion.div>

      {/* ── Viewer card ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
        className="relative"
      >
        {/* Gradient border effect */}
        <div className="absolute -inset-px rounded-[22px] bg-gradient-to-b from-neutral-300/60 to-neutral-100/30 dark:from-neutral-700/50 dark:to-neutral-900/20 pointer-events-none" />

        <div className="relative rounded-[22px] overflow-hidden
          border border-neutral-200/60 dark:border-neutral-800/80
          bg-white dark:bg-[#0a0a0a]
          shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_24px_80px_rgba(0,0,0,0.10),0_8px_24px_rgba(0,0,0,0.06)]
          dark:shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_80px_rgba(0,0,0,0.55),0_8px_24px_rgba(0,0,0,0.4)]"
        >
          {/* Browser chrome top bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/80 dark:bg-neutral-950/60">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="px-4 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900/80 text-[10px] font-mono text-neutral-400 dark:text-neutral-600 border border-neutral-200/70 dark:border-neutral-800/70">
                pranav-gawai-resume.pdf
              </div>
            </div>
            <div className="w-14" />
          </div>

          {/* iFrame */}
          <div style={{ height: '74dvh' }}>
            <iframe
              src={DRIVE_PREVIEW}
              className="w-full h-full border-0 block"
              title="Pranav Gawai - Resume"
            />
          </div>

          {/* Bottom bar */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-neutral-100 dark:border-neutral-900 bg-neutral-50/80 dark:bg-neutral-950/60">
            <p className="text-[10px] font-mono text-neutral-400 dark:text-neutral-600">
              Pranav Gawai · Software Engineer
            </p>
            <p className="text-[10px] font-mono text-neutral-300 dark:text-neutral-700">
              Updated 2026
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Keyboard hints ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
      >
        {[['⌘ scroll', 'zoom in viewer'], ['⌘P', 'print from viewer']].map(([key, label]) => (
          <span key={key} className="flex items-center gap-1.5 text-[10px] text-neutral-400 dark:text-neutral-600">
            <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 font-mono text-[9px]">{key}</kbd>
            {label}
          </span>
        ))}
      </motion.div>

    </div>
  </div>
);

export default ResumePage;
