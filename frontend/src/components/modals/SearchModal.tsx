import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ArrowRight, BookOpen, Layers, X, Hash, Command } from 'lucide-react';
import { BLOGS, PROJECTS } from '../../config/constants.tsx';
import { useNav } from '../../App';

interface SearchResult {
  type: 'blog' | 'project';
  id: string;
  title: string;
  description: string;
  tags?: string[];
}

const ALL_RESULTS: SearchResult[] = [
  ...BLOGS.map(b => ({ type: 'blog' as const, id: b.slug, title: b.title, description: b.description, tags: b.tags })),
  ...PROJECTS.map(p => ({ type: 'project' as const, id: p.id, title: p.title, description: p.description || '', tags: p.techStack })),
];

const score = (item: SearchResult, q: string) => {
  const lq = q.toLowerCase();
  if (item.title.toLowerCase().includes(lq)) return 2;
  if (item.description.toLowerCase().includes(lq)) return 1;
  if (item.tags?.some(t => t.toLowerCase().includes(lq))) return 1;
  return 0;
};

interface Props { isOpen: boolean; onClose: () => void; }

const SearchModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { openBlog, openProject, goBlog } = useNav() as any;

  const results = query.trim().length > 0
    ? ALL_RESULTS.map(r => ({ ...r, s: score(r, query) })).filter(r => r.s > 0).sort((a, b) => b.s - a.s)
    : ALL_RESULTS.slice(0, 6);

  useEffect(() => { if (isOpen) { setQuery(''); setSelected(0); setTimeout(() => inputRef.current?.focus(), 50); } }, [isOpen]);
  useEffect(() => { setSelected(0); }, [query]);

  const pick = useCallback((item: SearchResult) => {
    onClose();
    if (item.type === 'blog') {
      const blog = BLOGS.find(b => b.slug === item.id);
      if (blog?.isLocal && blog) openBlog(blog);
      else { goBlog(); }
    } else {
      const proj = PROJECTS.find(p => p.id === item.id);
      if (proj) openProject(proj);
    }
  }, [onClose, openBlog, openProject, goBlog]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, results.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && results[selected]) pick(results[selected]);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, results, selected, pick, onClose]);

  const hi = (text: string, q: string) => {
    if (!q.trim()) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx < 0) return <>{text}</>;
    return <>{text.slice(0, idx)}<mark className="bg-neutral-200 dark:bg-neutral-700 rounded px-0.5 not-italic">{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[80] bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-[81] flex items-end sm:items-start justify-center pt-0 sm:pt-[15vh] px-0 sm:px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: 10, scale: 0.97, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              className="pointer-events-auto w-full sm:max-w-[520px] rounded-t-[20px] sm:rounded-[20px]
                bg-white/75 dark:bg-[#0a0a0a]/80
                backdrop-blur-2xl backdrop-saturate-[180%]
                border border-white/70 dark:border-white/[0.07]
                rounded-[20px]
                shadow-[0_2px_0_rgba(255,255,255,0.9)_inset,0_32px_80px_rgba(0,0,0,0.14),0_8px_24px_rgba(0,0,0,0.08)]
                dark:shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_32px_80px_rgba(0,0,0,0.7),0_8px_24px_rgba(0,0,0,0.5)]
                overflow-hidden"
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Search input */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-200/50 dark:border-white/[0.05]">
                <Search size={15} className="text-neutral-400 dark:text-neutral-500 shrink-0" strokeWidth={1.8} />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search posts, projects..."
                  className="flex-1 bg-transparent text-[14px] text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none"
                />
                <div className="flex items-center gap-1.5 shrink-0">
                  {query && (
                    <button onClick={() => setQuery('')} className="touch-compact w-7 h-7 rounded-md bg-neutral-100 dark:bg-white/[0.07] flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors">
                      <X size={12} />
                    </button>
                  )}
                  <kbd className="hidden sm:flex items-center px-1.5 py-0.5 text-[10px] font-mono
                    text-neutral-400 dark:text-neutral-600
                    bg-neutral-100/80 dark:bg-white/[0.05]
                    rounded-md border border-neutral-200/60 dark:border-white/[0.06]">
                    esc
                  </kbd>
                </div>
              </div>

              {/* Results */}
              <div className="py-1.5 max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <p className="text-[13px] text-neutral-400 dark:text-neutral-600 text-center py-10">No results for "{query}"</p>
                ) : (
                  results.map((item, i) => (
                    <button
                      key={item.id}
                      onMouseEnter={() => setSelected(i)}
                      onClick={() => pick(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        selected === i ? 'bg-neutral-100 dark:bg-white/[0.06]' : ''
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0 border ${
                        item.type === 'blog'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-emerald-200/60 dark:border-emerald-800/40'
                          : 'bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border-sky-200/60 dark:border-sky-800/40'
                      }`}>
                        {item.type === 'blog' ? <BookOpen size={12} strokeWidth={1.8} /> : <Layers size={12} strokeWidth={1.8} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-medium text-neutral-800 dark:text-neutral-100 truncate">{hi(item.title, query)}</p>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">{item.description}</p>
                      </div>
                      {selected === i && <ArrowRight size={12} className="text-neutral-400 shrink-0" />}
                    </button>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t border-neutral-200/50 dark:border-white/[0.05] flex items-center gap-4 bg-neutral-50/50 dark:bg-white/[0.02]">
                {[['↑↓', 'navigate'], ['↵', 'open'], ['esc', 'close']].map(([key, label]) => (
                  <span key={key} className="flex items-center gap-1.5">
                    <kbd className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-white dark:bg-white/[0.06] border border-neutral-200/60 dark:border-white/[0.06] text-neutral-500 dark:text-neutral-500 shadow-[0_1px_0_rgba(0,0,0,0.05)]">{key}</kbd>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{label}</span>
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SearchModal;
