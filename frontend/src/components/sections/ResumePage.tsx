import React from 'react';
import { Download, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

const DRIVE_ID = '1boNL4UPwe1n71af10VWWRU4Vw1L7rTT-';
const DRIVE_PREVIEW = `https://drive.google.com/file/d/${DRIVE_ID}/preview`;

const ResumePage: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.3 }}
    className="pt-10 pb-24"
  >
    {/* ── Header ─────────────────────────────────────────────────────── */}
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
      <div>
        <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-light dark:text-text-dark tracking-tight mb-1">
          Resume
        </h1>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
          Pranav Gawai · Software Engineer
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Routes through /api/track-resume which logs the view + redirects to Drive */}
        <a
          href="/api/track-resume?type=view"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-sm font-medium text-text-light dark:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
        >
          <ExternalLink size={14} className="text-text-muted-light dark:text-text-muted-dark" />
          Open
        </a>
        <a
          href="/api/track-resume?type=download"
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-1.5 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark rounded-full text-sm font-semibold hover:scale-105 transition-transform active:scale-95"
        >
          <Download size={14} />
          Download
        </a>
      </div>
    </div>

    {/* ── Viewer — full width, A4 proportions ── */}
    <div
      className="w-full rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-white dark:bg-neutral-900"
      style={{ aspectRatio: '1 / 1.4142' }}
    >
      <iframe
        src={DRIVE_PREVIEW}
        className="w-full h-full border-0 block"
        title="Pranav Gawai - Resume"
      />
    </div>

    <p className="mt-3 text-center text-[11px] text-text-muted-light dark:text-text-muted-dark opacity-60">
      <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-neutral-50 dark:bg-white/[0.06] border border-neutral-200/60 dark:border-white/[0.06] text-neutral-500 mr-1">⌘P</kbd>
      to print or save as PDF
    </p>
  </motion.div>
);

export default ResumePage;
