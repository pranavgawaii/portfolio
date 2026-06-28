import React, { useState } from 'react';
import { BlogPost } from '../../config/constants';
import { ArrowLeft, Share2, Copy, Check, X, MessageCircle, LogIn, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShareModal } from './BlogPage';

import { useUser, useClerk } from '@clerk/clerk-react';

// ─── Comment Section ──────────────────────────────────────────────────────────
const CommentSection: React.FC<{ slug: string }> = ({ slug }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    const script = document.createElement('script');
    script.src = 'https://utteranc.es/client.js';
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.setAttribute('repo', 'pranavgawaii/portfolio');
    script.setAttribute('issue-term', `blog-post-${slug}`);
    script.setAttribute('label', 'blog-comment');
    script.setAttribute('theme', 'github-dark');
    containerRef.current.appendChild(script);
  }, [slug]);

  return (
    <div className="mt-16 pt-10 border-t border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={16} className="text-neutral-400" />
        <h3 className="font-sans font-semibold text-[15px] text-neutral-800 dark:text-neutral-200">Discussion</h3>
      </div>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Sign in with GitHub to join the conversation.
      </p>
      <div ref={containerRef} className="w-full min-h-[300px]" />
    </div>
  );
};

// ─── Blog Post Page ───────────────────────────────────────────────────────────
interface Props {
  blog: BlogPost;
  onBack: () => void;
}

const BlogPostPage: React.FC<Props> = ({ blog, onBack }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const readingTime = blog.content
    ? Math.ceil(blog.content.reduce((acc, b) => acc + (b.text?.split(' ').length ?? 0), 0) / 200)
    : null;

  return (
    <div className="pt-8 pb-24">
      {/* Nav bar */}
      <div className="flex items-center justify-between mb-10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors group"
        >
          <ArrowLeft size={13} className="group-hover:-translate-x-0.5 transition-transform" />
          All posts
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] text-neutral-500 dark:text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-600 transition-all"
        >
          <Share2 size={12} />
          Share
        </button>
      </div>

      {/* Hero */}
      {blog.image && (
        <motion.div
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full rounded-2xl overflow-hidden mb-10"
          style={{ aspectRatio: '2.4 / 1' }}
        >
          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
        </motion.div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-2 flex-wrap mb-4">
        {blog.tags?.map(t => (
          <span key={t} className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-500">
            {t}
          </span>
        ))}
        <span className="text-[11px] text-neutral-400">{blog.date}</span>
        {readingTime && <span className="text-[11px] text-neutral-400">· {readingTime} min read</span>}
      </div>

      {/* Title */}
      <h1 className="font-sans font-bold text-3xl sm:text-[36px] text-neutral-900 dark:text-neutral-100 tracking-tight leading-[1.15] mb-12">
        {blog.title}
      </h1>

      {/* Body */}
      {blog.content ? (
        <article className="max-w-[640px]">
          {blog.content.map((block, i) =>
            block.type === 'heading' ? (
              <h2 key={i} className="font-sans font-bold text-[19px] text-neutral-900 dark:text-neutral-100 tracking-tight mt-10 mb-3 leading-snug">
                {block.text}
              </h2>
            ) : (
              <p key={i} className="text-[15px] text-neutral-700 dark:text-neutral-300 leading-[1.9] mb-5 font-normal">
                {block.text}
              </p>
            )
          )}
        </article>
      ) : blog.link ? (
        <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
          Read on {blog.platform} →
        </a>
      ) : null}

      {/* Footer share strip */}
      <div className="max-w-[640px] mt-12 pt-8 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        <button onClick={onBack} className="text-[13px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
          ← All posts
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all"
        >
          <Share2 size={12} />
          Share
        </button>
      </div>

      {/* Comments */}
      <div className="max-w-[640px]">
        <CommentSection slug={blog.slug} />
      </div>

      <AnimatePresence>
        {shareOpen && <ShareModal post={blog} onClose={() => setShareOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default BlogPostPage;
