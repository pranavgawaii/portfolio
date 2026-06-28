import React, { useState, useEffect, useCallback } from 'react';
import { BlogPost } from '../../config/constants';
import { ArrowLeft, Share2, X, MessageCircle, LogIn, Send, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShareModal } from './BlogPage';

import { useUser, useClerk } from '@clerk/clerk-react';

const API = 'http://localhost:3001';
const ADMIN_EMAIL = 'pranvgg@gmail.com';

// ─── Comment ──────────────────────────────────────────────────────────────────
interface Comment {
  id: string;
  author: string;
  avatar?: string | null;
  text: string;
  clerkUserId: string;
  timestamp: string;
  replies?: Comment[];
}

// ─── Comment Section ──────────────────────────────────────────────────────────
const CommentSection: React.FC<{ slug: string }> = ({ slug }) => {
  const hasClerk = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  if (!hasClerk) {
    return (
      <div className="mt-16 pt-10 border-t border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle size={16} className="text-neutral-400" />
          <h3 className="font-sans font-semibold text-[15px] text-neutral-800 dark:text-neutral-200">Discussion</h3>
        </div>
        <div className="rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 px-6 py-8 text-center">
          <p className="text-[13px] text-neutral-400">Comments coming soon.</p>
        </div>
      </div>
    );
  }

  return <AuthCommentSection slug={slug} />;
};

// ─── Authenticated Comment Section ───────────────────────────────────────────
const AuthCommentSection: React.FC<{ slug: string }> = ({ slug }) => {
  const { isSignedIn, user } = useUser();
  const { openSignIn } = useClerk();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/comments/${slug}`);
      if (res.ok) setComments(await res.json());
    } catch { /* backend offline, comments unavailable */ }
    setLoading(false);
  }, [slug]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async () => {
    if (!text.trim() || !isSignedIn || !user) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API}/api/comments/${slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: user.fullName || user.firstName || 'Anonymous',
          avatar: user.imageUrl || null,
          text: text.trim(),
          clerkUserId: user.id,
          parentId: replyingTo || undefined,
        }),
      });
      if (res.ok) {
        setText('');
        setReplyingTo(null);
        await fetchComments();
      }
    } catch { /* noop */ }
    setSubmitting(false);
  };

  const handleDelete = async (commentId: string, parentId?: string) => {
    if (!user) return;
    try {
      await fetch(`${API}/api/comments/${slug}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId, parentId, clerkUserId: user.id, isAdmin }),
      });
      await fetchComments();
    } catch { /* noop */ }
  };

  const canDelete = (c: Comment) => isAdmin || c.clerkUserId === user?.id;

  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const CommentAvatar = ({ c }: { c: Comment }) => (
    c.avatar
      ? <img src={c.avatar} alt={c.author} className="w-7 h-7 rounded-full shrink-0 object-cover ring-1 ring-neutral-200 dark:ring-neutral-700" />
      : <div className="w-7 h-7 rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[11px] font-bold text-neutral-600 dark:text-neutral-300">{c.author[0]}</div>
  );

  const totalCount = comments.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="mt-16 pt-10 border-t border-neutral-100 dark:border-neutral-800">
      <div className="flex items-center gap-2 mb-8">
        <MessageCircle size={16} className="text-neutral-400" />
        <h3 className="font-sans font-semibold text-[15px] text-neutral-800 dark:text-neutral-200">
          Discussion
        </h3>
        {totalCount > 0 && (
          <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full">
            {totalCount}
          </span>
        )}
        {isAdmin && (
          <span className="ml-1 text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
            admin
          </span>
        )}
      </div>

      {/* Comment input — visible to signed-in users */}
      {isSignedIn ? (
        <div className="mb-8">
          {replyingTo && (
            <div className="flex items-center gap-2 mb-3 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg border border-neutral-200 dark:border-neutral-700 w-fit">
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Replying to <span className="font-semibold text-neutral-700 dark:text-neutral-200">{comments.find(c => c.id === replyingTo)?.author}</span>
              </span>
              <button onClick={() => setReplyingTo(null)} className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"><X size={12} /></button>
            </div>
          )}
          <div className="flex gap-3">
            <img src={user?.imageUrl} alt={user?.firstName ?? ''} className="w-8 h-8 rounded-full shrink-0 object-cover ring-1 ring-neutral-200 dark:ring-neutral-700" />
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
                placeholder={replyingTo ? 'Write a reply...' : 'Share a thought...'}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-[13px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600">⌘↵ to post</span>
                <button
                  onClick={handleSubmit}
                  disabled={!text.trim() || submitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-medium disabled:opacity-40 hover:opacity-85 transition-opacity"
                >
                  {submitting ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <Send size={11} />}
                  {replyingTo ? 'Reply' : 'Post'}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => openSignIn()}
          className="w-full mb-8 flex items-center justify-center gap-2.5 px-4 py-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 text-[13px] text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all group"
        >
          <LogIn size={14} className="group-hover:translate-x-0.5 transition-transform" />
          Sign in to join the discussion
        </motion.button>
      )}

      {/* Comments list — visible to EVERYONE */}
      {loading ? (
        <div className="flex gap-2 items-center text-[12px] text-neutral-400">
          <span className="w-3 h-3 border border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          Loading comments...
        </div>
      ) : (
        <AnimatePresence>
          {comments.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-[13px] text-neutral-300 dark:text-neutral-700 italic">
              No comments yet. Be the first.
            </motion.p>
          ) : (
            <div className="space-y-6">
              {comments.map(c => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <CommentAvatar c={c} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                      <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-200">{c.author}</span>
                      {c.clerkUserId === user?.id && <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">you</span>}
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{fmtDate(c.timestamp)}</span>
                    </div>
                    <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">{c.text}</p>
                    <div className="flex items-center gap-3">
                      {isSignedIn && (
                        <button onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                          className="text-[11px] font-medium text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors">
                          {replyingTo === c.id ? 'Cancel' : 'Reply'}
                        </button>
                      )}
                      {canDelete(c) && (
                        <button onClick={() => handleDelete(c.id)}
                          className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-500 transition-colors">
                          <Trash2 size={10} /> Delete
                        </button>
                      )}
                    </div>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-4 space-y-4 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800">
                        {c.replies.map(r => (
                          <motion.div key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                            <CommentAvatar c={r} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                                <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-200">{r.author}</span>
                                {r.clerkUserId === user?.id && <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">you</span>}
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{fmtDate(r.timestamp)}</span>
                              </div>
                              <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">{r.text}</p>
                              {canDelete(r) && (
                                <button onClick={() => handleDelete(r.id, c.id)}
                                  className="flex items-center gap-1 text-[11px] font-medium text-red-400 hover:text-red-500 transition-colors">
                                  <Trash2 size={10} /> Delete
                                </button>
                              )}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      )}
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
