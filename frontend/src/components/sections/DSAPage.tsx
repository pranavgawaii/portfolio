import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ExternalLink, Github, CheckCircle2, ChevronDown, Check } from 'lucide-react';
import { STRIVER_SHEET } from '../../config/striverSheet';

const REPO_URL  = 'https://github.com/pranavgawaii/Striver-SDE-Sheet';
const SHEET_URL = 'https://takeuforward.org/dsa/strivers-sde-sheet-top-coding-interview-problems';

interface Props { onBack?: () => void }

const difficultyColors = {
  Easy: 'text-[#00b8a3] bg-[#00b8a3]/10 border-[#00b8a3]/20',
  Medium: 'text-[#ffc01e] bg-[#ffc01e]/10 border-[#ffc01e]/20',
  Hard: 'text-[#ff375f] bg-[#ff375f]/10 border-[#ff375f]/20',
};

const DSAPage: React.FC<Props> = () => {
  const [submittedIds, setSubmittedIds] = useState<Set<string>>(new Set());
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('striver_sde_progress');
    if (saved) {
      try {
        const ids = JSON.parse(saved);
        if (Array.isArray(ids)) {
          setSubmittedIds(new Set(ids));
        }
      } catch (e) {
        console.error('Failed to parse progress', e);
      }
    }
  }, []);

  const toggleProblem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSubmittedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      localStorage.setItem('striver_sde_progress', JSON.stringify(Array.from(next)));
      return next;
    });
  };

  // Calculate stats
  let total = 0;
  let totalEasy = 0, totalMedium = 0, totalHard = 0;
  let solvedEasy = 0, solvedMedium = 0, solvedHard = 0;

  STRIVER_SHEET.forEach(topic => {
    topic.problems.forEach(p => {
      total++;
      if (p.difficulty === 'Easy') totalEasy++;
      if (p.difficulty === 'Medium') totalMedium++;
      if (p.difficulty === 'Hard') totalHard++;
      
      if (submittedIds.has(p.id)) {
        if (p.difficulty === 'Easy') solvedEasy++;
        if (p.difficulty === 'Medium') solvedMedium++;
        if (p.difficulty === 'Hard') solvedHard++;
      }
    });
  });

  const solved = submittedIds.size;
  const pct = total === 0 ? 0 : Math.round((solved / total) * 100);

  return (
    <motion.div
      key="dsa"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      className="pt-10 pb-24 max-w-content mx-auto"
    >
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-sans font-bold text-3xl sm:text-4xl text-text-light dark:text-text-dark tracking-tight mb-4">
          Striver SDE Sheet
        </h1>
        <p className="text-base text-text-muted-light dark:text-text-muted-dark leading-relaxed mb-6">
          Solving one problem daily from the Striver SDE Sheet. Code and notes are pushed to the repo after every session.
        </p>

        <div className="flex flex-wrap gap-3">
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-sm font-medium text-text-light dark:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
            <Github size={14} /> Solutions Repo
          </a>
          <a href={SHEET_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border-light dark:border-border-dark text-sm font-medium text-text-light dark:text-text-dark hover:bg-neutral-50 dark:hover:bg-white/5 transition-colors">
            <ExternalLink size={14} className="text-text-muted-light dark:text-text-muted-dark" /> Original Sheet
          </a>
        </div>
      </div>

      {/* Main Stats with Difficulty Breakdown */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-text-muted-light dark:text-text-muted-dark mb-1">Overall Progress</p>
            <div className="flex items-baseline gap-2">
              <span className="font-sans font-bold text-2xl text-text-light dark:text-text-dark">{solved}</span>
              <span className="text-sm text-text-muted-light dark:text-text-muted-dark">/ {total} solved</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#00b8a3]"></div>
              <span className="text-text-muted-light dark:text-text-muted-dark">Easy <span className="text-text-light dark:text-text-dark font-medium">{solvedEasy}/{totalEasy}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ffc01e]"></div>
              <span className="text-text-muted-light dark:text-text-muted-dark">Medium <span className="text-text-light dark:text-text-dark font-medium">{solvedMedium}/{totalMedium}</span></span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#ff375f]"></div>
              <span className="text-text-muted-light dark:text-text-muted-dark">Hard <span className="text-text-light dark:text-text-dark font-medium">{solvedHard}/{totalHard}</span></span>
            </div>
            <span className="font-sans font-bold text-xl text-text-light dark:text-text-dark ml-2">{pct}%</span>
          </div>
        </div>
        <div className="w-full h-1.5 rounded-full bg-border-light dark:bg-border-dark overflow-hidden relative flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-full rounded-full bg-text-light dark:bg-text-dark"
          />
        </div>
      </div>

      {/* Topics List */}
      <div>
        <h3 className="font-sans font-bold text-lg text-text-light dark:text-text-dark mb-5">Topics</h3>
        <div className="flex flex-col gap-4">
          {STRIVER_SHEET.map((t) => {
            const topicTotal = t.problems.length;
            const topicDone = t.problems.filter(p => submittedIds.has(p.id)).length;
            const p = topicTotal === 0 ? 0 : Math.round((topicDone / topicTotal) * 100);
            const done = topicDone === topicTotal && topicTotal > 0;
            const isExpanded = expandedTopic === t.name;

            return (
              <div key={t.name} className="flex flex-col border border-border-light dark:border-border-dark rounded-xl bg-white dark:bg-[#0a0a0a] overflow-hidden">
                {/* Topic Header */}
                <button
                  onClick={() => setExpandedTopic(isExpanded ? null : t.name)}
                  className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-6 px-4 py-4 hover:bg-neutral-50 dark:hover:bg-white/[0.02] transition-colors text-left"
                >
                  <div className="flex items-center gap-3 min-w-[200px]">
                    {done ? (
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-border-light dark:border-border-dark shrink-0" />
                    )}
                    <span className={`text-base ${done ? 'text-text-muted-light dark:text-text-muted-dark line-through decoration-neutral-300 dark:decoration-neutral-700' : 'text-text-light dark:text-text-dark font-medium'}`}>
                      {t.name}
                    </span>
                    <ChevronDown size={14} className={`text-text-muted-light dark:text-text-muted-dark transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                  
                  <div className="flex-1 flex items-center gap-4">
                    <div className="flex-1 h-[2px] rounded-full bg-border-light dark:bg-border-dark overflow-hidden relative">
                      <motion.div
                        initial={false}
                        animate={{ width: `${p}%` }}
                        transition={{ duration: 0.5 }}
                        className={`h-full rounded-full absolute left-0 top-0 ${done ? 'bg-emerald-500' : 'bg-text-muted-light dark:bg-text-muted-dark'}`}
                      />
                    </div>
                    <span className="text-xs font-mono text-text-muted-light dark:text-text-muted-dark min-w-[40px] text-right">
                      {topicDone}/{topicTotal}
                    </span>
                  </div>
                </button>

                {/* Expanded Problems List */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="border-t border-border-light dark:border-border-dark"
                    >
                      <div className="px-4 py-3 flex flex-col gap-1">
                        {t.problems.map((prob, idx) => {
                          const isSubmitted = submittedIds.has(prob.id);
                          const diffColors = difficultyColors[prob.difficulty];
                          return (
                            <button
                              key={prob.id}
                              onClick={(e) => toggleProblem(prob.id, e)}
                              className="flex items-center justify-between py-2 px-2 hover:bg-neutral-100 dark:hover:bg-neutral-900 rounded-lg transition-colors text-left group"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                                  isSubmitted 
                                    ? 'bg-emerald-500 border-emerald-500 text-white' 
                                    : 'border-border-light dark:border-border-dark group-hover:border-neutral-400'
                                }`}>
                                  {isSubmitted && <Check size={12} strokeWidth={3} />}
                                </div>
                                <span className={`text-sm ${isSubmitted ? 'text-text-muted-light dark:text-text-muted-dark line-through' : 'text-text-light dark:text-text-dark'}`}>
                                  {idx + 1}. {prob.name}
                                </span>
                              </div>
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${diffColors}`}>
                                {prob.difficulty}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default DSAPage;
