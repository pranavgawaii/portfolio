import React from 'react';
import { motion } from 'motion/react';
import { useNav } from '../../App';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const { goHome } = useNav() as any;
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md"
      >
        {/* Glitch number */}
        <motion.div
          animate={{ textShadow: ['0 0 0px transparent', '2px 0 8px rgba(139,92,246,0.4)', '-2px 0 8px rgba(236,72,153,0.4)', '0 0 0px transparent'] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
          className="font-mono font-bold text-[120px] sm:text-[160px] leading-none tracking-tighter text-neutral-100 dark:text-neutral-900 select-none mb-2"
          style={{ WebkitTextStroke: '1.5px currentColor', color: 'transparent', WebkitTextStrokeColor: 'var(--tw-prose-body, #737373)' }}
        >
          404
        </motion.div>

        {/* Thin rule */}
        <div className="w-12 h-px bg-neutral-300 dark:bg-neutral-700 mx-auto mb-6" />

        <h1 className="font-sans font-bold text-2xl text-neutral-900 dark:text-neutral-100 mb-2 tracking-tight">
          Page not found
        </h1>
        <p className="text-[14px] text-neutral-500 dark:text-neutral-400 leading-relaxed mb-8">
          The route you're looking for doesn't exist.<br />
          Maybe it was moved, deleted, or you mistyped the URL.
        </p>

        {/* Bordered card with hint */}
        <div className="mb-8 px-5 py-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 text-left">
          <p className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-2">You might want</p>
          <ul className="space-y-1.5 text-[13px] text-neutral-600 dark:text-neutral-400">
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" /> The <button onClick={goHome} className="underline underline-offset-2 decoration-dashed hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors">home page</button></li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" /> Check the URL for typos</li>
            <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-neutral-400 dark:bg-neutral-600 shrink-0" /> Use ⌘K to search the site</li>
          </ul>
        </div>

        <button
          onClick={goHome}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[13px] font-semibold hover:opacity-85 transition-opacity shadow-sm"
        >
          <ArrowLeft size={14} />
          Back to home
        </button>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
