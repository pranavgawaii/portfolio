import React, { useState, useEffect } from 'react';
import { Download, ExternalLink, Lock, Mail, ShieldCheck, ArrowRight, CheckCircle2, RefreshCw, Building } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DRIVE_ID = '1boNL4UPwe1n71af10VWWRU4Vw1L7rTT-';
const DRIVE_PREVIEW = `https://drive.google.com/file/d/${DRIVE_ID}/preview`;

const ResumePage: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = localStorage.getItem('resume_unlocked') === 'true';
      if (unlocked) setIsUnlocked(true);
    }
  }, []);

  const isOptedOut = typeof window !== 'undefined' && localStorage.getItem('admin_opt_out') === 'true';
  const openUrl = isOptedOut ? `https://drive.google.com/file/d/${DRIVE_ID}/view` : '/api/track-resume?type=view';
  const downloadUrl = isOptedOut ? `https://drive.google.com/uc?export=download&id=${DRIVE_ID}` : '/api/track-resume?type=download';

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid work email address.');
      return;
    }

    setLoading(true);

    try {
      // Log recruiter request to backend API
      await fetch('/api/track-resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          company: company.trim(),
          type: 'recruiter_request'
        })
      }).catch(() => {});

      setSuccessMsg('Access granted. Opening resume...');
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('resume_unlocked', 'true');
        }
        setIsUnlocked(true);
        setLoading(false);
      }, 400);
    } catch (_) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  const handleLockSession = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('resume_unlocked');
    }
    setIsUnlocked(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="pt-10 pb-24 max-w-4xl mx-auto"
    >
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2.5 mb-1">
            <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-light dark:text-text-dark tracking-tight">
              Resume
            </h1>
            <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
              isUnlocked 
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' 
                : 'bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border border-neutral-500/20'
            }`}>
              {isUnlocked ? 'Unlocked' : 'Protected'}
            </span>
          </div>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Pranav Gawai · Software Engineer
          </p>
        </div>

        {isUnlocked && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleLockSession}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-xs font-medium text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
            >
              <Lock size={12} />
              Lock View
            </button>
            <a
              href={openUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md border border-border-light dark:border-border-dark text-sm font-medium text-text-light dark:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors"
            >
              <ExternalLink size={14} className="text-text-muted-light dark:text-text-muted-dark" />
              Open PDF
            </a>
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-1.5 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark rounded-full text-sm font-semibold hover:scale-105 transition-transform active:scale-95 shadow-sm"
            >
              <Download size={14} />
              Download
            </a>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isUnlocked ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-md mx-auto my-12 p-6 sm:p-8 rounded-2xl border border-border-light dark:border-border-dark bg-white dark:bg-neutral-900 shadow-xl"
          >
            {/* Lock Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-text-light dark:text-text-dark border border-neutral-200/60 dark:border-neutral-700/60">
                <Lock size={22} className="text-text-light dark:text-text-dark" />
              </div>
              <h2 className="text-lg font-bold text-text-light dark:text-text-dark tracking-tight">
                Request Resume Access
              </h2>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1 leading-relaxed">
                Enter your work email to view and download Pranav's full resume immediately.
              </p>
            </div>

            {/* Unlock Form */}
            <form onSubmit={handleUnlock} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-mono font-medium text-text-muted-light dark:text-text-muted-dark mb-1">
                  Work Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="recruiter@company.com"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-text-light dark:text-text-dark text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-text-light dark:focus:ring-text-dark transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-medium text-text-muted-light dark:text-text-muted-dark mb-1">
                  Company / Organization <span className="opacity-40">(Optional)</span>
                </label>
                <div className="relative">
                  <Building size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="text"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    placeholder="e.g. Google, OpenAI (manifesting hard here 😭)"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-text-light dark:text-text-dark text-xs placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-text-light dark:focus:ring-text-dark transition-all"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-rose-500 font-medium pt-1 text-center">
                  {error}
                </p>
              )}

              {successMsg && (
                <p className="text-xs text-emerald-500 font-medium pt-1 flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} />
                  {successMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark font-semibold text-xs rounded-xl hover:opacity-90 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    View Resume
                    <ArrowRight size={13} />
                  </>
                )}
              </button>
            </form>

            {/* Direct Contact Info */}
            <div className="mt-5 pt-3.5 border-t border-neutral-200/60 dark:border-neutral-800 text-center">
              <p className="text-[11px] text-text-muted-light dark:text-text-muted-dark">
                Direct inquiries:{' '}
                <a
                  href="mailto:pranavgawai1518@gmail.com"
                  className="font-medium text-text-light dark:text-text-dark hover:underline underline-offset-4"
                >
                  pranavgawai1518@gmail.com
                </a>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked-resume"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
          >
            {/* ── Viewer — full width, A4 proportions ── */}
            <div
              className="w-full rounded-xl overflow-hidden border border-border-light dark:border-border-dark bg-white dark:bg-neutral-900 shadow-lg"
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
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ResumePage;
