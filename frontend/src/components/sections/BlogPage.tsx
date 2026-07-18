import React, { useState } from 'react';
import { BLOGS, BlogPost } from '../../config/constants';
import { ArrowLeft, Share2, Copy, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ─── Shared Share Modal ───────────────────────────────────────────────────────
export const ShareModal: React.FC<{ post: BlogPost; onClose: () => void }> = ({ post, onClose }) => {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/blog/${post.slug}`;
  const displayHost = window.location.host.replace(/^www\./, '');

  const copy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${post.title}" by @pranavgawai_`)}&url=${encodeURIComponent(url)}`;
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
        className="relative w-full max-w-sm bg-white dark:bg-[#111] rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div>
            <p className="font-sans font-semibold text-sm text-text-light dark:text-text-dark">Share</p>
            <p className="font-mono text-[11px] text-text-muted-light dark:text-text-muted-dark mt-0.5 truncate max-w-[220px]">"{post.title}"</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full text-text-muted-light dark:text-text-muted-dark hover:bg-neutral-100 dark:hover:bg-white/6 transition-colors"
          >
            <X size={13} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          {/* URL row */}
          <div className="flex items-center gap-2 h-9 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-white/[0.03] px-3">
            <span className="flex-1 font-mono text-[10px] text-text-muted-light dark:text-text-muted-dark truncate">{displayHost}</span>
            <button
              onClick={copy}
              className="shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark transition-colors"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied
                  ? <motion.span key="y" className="flex items-center gap-1 text-emerald-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Check size={12} /> copied</motion.span>
                  : <motion.span key="n" className="flex items-center gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><Copy size={12} /> copy</motion.span>
                }
              </AnimatePresence>
            </button>
          </div>

          {/* Share buttons */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={twitterUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-10 rounded-lg bg-neutral-950 dark:bg-neutral-100 text-white dark:text-neutral-900 text-[12px] font-medium hover:opacity-80 transition-opacity"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.633 5.905-5.633Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              Twitter / X
            </a>
            <a
              href={linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 h-10 rounded-lg border border-neutral-200 dark:border-neutral-800 text-[12px] font-medium text-text-muted-light dark:text-text-muted-dark hover:bg-neutral-50 dark:hover:bg-white/4 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ─── Blog Row ─────────────────────────────────────────────────────────────────
const BlogRow: React.FC<{
  post: BlogPost;
  index: number;
  isAnyHovered: boolean;
  isThisHovered: boolean;
  onHover: (id: string | null) => void;
  onShare: (post: BlogPost) => void;
  onOpen: (post: BlogPost) => void;
}> = ({ post, index, isAnyHovered, isThisHovered, onHover, onShare, onOpen }) => {

  const handleClick = () => {
    if (post.isLocal) onOpen(post);
    else if (post.link) window.open(post.link, '_blank');
  };

  return (
    <motion.div
      onHoverStart={() => onHover(post.id)}
      onHoverEnd={() => onHover(null)}
      animate={{
        opacity: isAnyHovered && !isThisHovered ? 0.28 : 1,
        filter: isAnyHovered && !isThisHovered ? 'blur(1.2px)' : 'blur(0px)',
      }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="group relative py-5 flex items-start gap-5 cursor-pointer border-b border-neutral-100 dark:border-neutral-800/70 last:border-0"
      onClick={handleClick}
    >
      {/* Index number */}
      <span className="shrink-0 font-mono text-xs text-neutral-300 dark:text-neutral-700 tabular-nums pt-0.5 w-6 text-right">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
          {post.tags?.map(t => (
            <span key={t} className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500">
              {t}
            </span>
          ))}
          <span className="text-[10px] text-neutral-300 dark:text-neutral-700">{post.date}</span>
        </div>

        <h2 className="font-sans font-semibold text-[16px] text-neutral-800 dark:text-neutral-200 leading-snug mb-1 group-hover:text-neutral-950 dark:group-hover:text-white transition-colors">
          {post.title}
        </h2>
        <p className="text-sm text-neutral-400 dark:text-neutral-500 leading-relaxed line-clamp-2">
          {post.description}
        </p>
      </div>

      {/* Preview thumbnail on hover */}
      <AnimatePresence>
        {isThisHovered && post.image && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, x: 10, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 2 }}
            exit={{ opacity: 0, scale: 0.92, x: -5, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 36 }}
            className="absolute right-full mr-4 md:mr-8 top-2 z-50 w-[120px] h-[80px] rounded-xl overflow-hidden border-2 border-white dark:border-neutral-800 shadow-2xl pointer-events-none hidden lg:block"
          >
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      <div className="shrink-0 flex items-center gap-1.5 pt-0.5">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: isThisHovered ? 1 : 0 }}
          onClick={e => { e.stopPropagation(); onShare(post); }}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-white/5 transition-colors"
        >
          <Share2 size={13} />
        </motion.button>
        <span className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-600 dark:group-hover:text-neutral-400 group-hover:translate-x-0.5 transition-all text-sm">→</span>
      </div>
    </motion.div>
  );
};

// ─── Main BlogPage ────────────────────────────────────────────────────────────
interface Props {
  onBack: () => void;
  onOpenBlog: (b: BlogPost) => void;
}

const ALL_TAGS = ['All', ...Array.from(new Set(BLOGS.flatMap(b => b.tags ?? [])))];

const BlogPage: React.FC<Props> = ({ onBack, onOpenBlog }) => {
  const [activeTag, setActiveTag] = useState('All');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sharePost, setSharePost] = useState<BlogPost | null>(null);

  const filtered = activeTag === 'All' ? BLOGS : BLOGS.filter(b => b.tags?.includes(activeTag));

  return (
    <div className="pt-8 pb-24">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-sans font-bold text-2xl sm:text-3xl text-neutral-900 dark:text-neutral-100 tracking-tight mb-3">
          Blog
        </h1>
        <p className="text-sm text-neutral-400">
          Things I've built, learned, and thought about.
        </p>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-10">
        {ALL_TAGS.map(tag => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`text-xs font-mono px-3.5 py-1.5 rounded-full border transition-all ${
              activeTag === tag
                ? 'border-neutral-900 dark:border-neutral-200 text-white bg-neutral-900 dark:bg-neutral-100 dark:text-neutral-900'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-600 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div>
        {filtered.map((post, i) => (
          <BlogRow
            key={post.id}
            post={post}
            index={i}
            isAnyHovered={hoveredId !== null}
            isThisHovered={hoveredId === post.id}
            onHover={setHoveredId}
            onShare={setSharePost}
            onOpen={onOpenBlog}
          />
        ))}

        <p className="text-[12px] text-neutral-300 dark:text-neutral-700 italic mt-8">
          More on the way - follow <a href="https://x.com/pranavgawai_" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-500 transition-colors">@pranavgawai_</a>
        </p>
      </div>

      <AnimatePresence>
        {sharePost && <ShareModal post={sharePost} onClose={() => setSharePost(null)} />}
      </AnimatePresence>
    </div>
  );
};

export default BlogPage;
