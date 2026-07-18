import React, { useState, useEffect, useCallback, useRef } from 'react';
import { BLOGS, BlogPost } from '../../config/constants';
import { ArrowLeft, Share2, X, MessageCircle, LogIn, Send, Trash2, LogOut, ThumbsUp, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ShareModal } from './BlogPage';
import Reactions from '../ui/Reactions';
import BlogDiagram from '../features/BlogDiagram';
import { DynamicIslandTOC } from '../ui/DynamicIslandTOC';
import { track } from '../../hooks/useAnalytics';

import { useUser, useClerk, useAuth } from '@clerk/clerk-react';
import { openGoogleSignInPopup } from '../../lib/oauthPopup';

import { API_BASE as API } from '../../lib/api';
const ADMIN_EMAIL = 'pranvgg@gmail.com';

// ─── Inline Reply Box — must be module-level to avoid remount-on-render bug ──
interface InlineReplyBoxProps {
  parentId: string;
  parentAuthor: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  submitting: boolean;
  userImageUrl?: string | null;
  userInitial?: string;
}
const InlineReplyBox: React.FC<InlineReplyBoxProps> = ({
  parentId, parentAuthor, value, onChange, onSubmit, onCancel, submitting, userImageUrl, userInitial,
}) => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { setTimeout(() => inputRef.current?.focus(), 60); }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className="mt-3"
    >
      <div className="flex gap-2.5 pl-1">
        {userImageUrl
          ? <img src={userImageUrl} className="w-6 h-6 rounded-full shrink-0 object-cover mt-0.5" alt="" />
          : <div className="w-6 h-6 rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[9px] font-bold mt-0.5">{userInitial}</div>
        }
        <div className="flex-1">
          <textarea
            ref={inputRef}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSubmit();
              if (e.key === 'Escape') onCancel();
            }}
            placeholder={`Reply to ${parentAuthor}...`}
            rows={2}
            className="w-full px-3 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/60
              text-[13px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600
              resize-none focus:outline-none focus:ring-1 focus:ring-neutral-300 dark:focus:ring-neutral-700 transition-all"
          />
          <div className="flex items-center justify-between mt-1.5">
            <button onClick={onCancel} className="text-[11px] text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors flex items-center gap-1">
              <X size={10} /> Cancel
            </button>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-neutral-400 dark:text-neutral-600">⌘↵</span>
              <button
                onClick={onSubmit}
                disabled={!value.trim() || submitting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[11px] font-medium disabled:opacity-40 hover:opacity-85 transition-opacity"
              >
                {submitting ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <CornerDownRight size={10} />}
                Reply
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Comment ──────────────────────────────────────────────────────────────────
interface Comment {
  id: string;
  author: string;
  avatar?: string | null;
  text: string;
  clerkUserId: string;
  isAdmin?: boolean;
  timestamp: string;
  likedBy?: string[];
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
  const { signOut } = useClerk();
  const { getToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyTexts, setReplyTexts] = useState<Record<string, string>>({});
  const [replySubmitting, setReplySubmitting] = useState<string | null>(null);
  const [likePending, setLikePending] = useState<string | null>(null);

  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const fetchComments = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/comments?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data: Comment[] = await res.json();
        setComments(data);
      } else {
        console.error('[comments] fetch failed:', res.status);
      }
    } catch (err) {
      console.error('[comments] fetch error:', err);
    }
    setLoading(false);
  }, [slug]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const handleSubmit = async (parentId?: string) => {
    const body = parentId ? (replyTexts[parentId] || '') : text;
    if (!body.trim() || !isSignedIn || !user) return;
    if (parentId) setReplySubmitting(parentId); else setSubmitting(true);
    setSubmitError(null);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/comments?slug=${encodeURIComponent(slug)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          author: user.fullName || user.firstName || 'Anonymous',
          avatar: user.imageUrl || null,
          text: body.trim(),
          clerkUserId: user.id,
          parentId: parentId || undefined,
        }),
      });
      if (res.ok) {
        if (parentId) { setReplyTexts(t => ({ ...t, [parentId]: '' })); setReplyingTo(null); }
        else setText('');
        await fetchComments();
      } else {
        const data = await res.json().catch(() => ({}));
        console.error('[comments] submit failed:', res.status, data);
        setSubmitError(data.error || `Failed to post comment (${res.status})`);
      }
    } catch (err) {
      console.error('[comments] submit error:', err);
      setSubmitError('Network error — please try again.');
    }
    if (parentId) setReplySubmitting(null); else setSubmitting(false);
  };

  const handleDelete = async (commentId: string, parentId?: string) => {
    if (!user) return;
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/comments/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, commentId, parentId }),
      });
      if (!res.ok) console.error('[comments] delete failed:', res.status);
      await fetchComments();
    } catch (err) {
      console.error('[comments] delete error:', err);
    }
  };

  const handleLike = async (commentId: string, parentId?: string) => {
    if (!isSignedIn) { openGoogleSignInPopup(); return; }
    if (likePending) return;
    setLikePending(commentId);
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/comments/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ slug, commentId, parentId }),
      });
      if (res.ok) {
        const { liked, count } = await res.json();
        setComments(prev => prev.map(c => {
          if (parentId) {
            if (c.id !== parentId) return c;
            return { ...c, replies: (c.replies || []).map(r => r.id === commentId ? { ...r, likedBy: liked ? [...(r.likedBy || []), user!.id] : (r.likedBy || []).filter(id => id !== user!.id) } : r) };
          }
          if (c.id !== commentId) return c;
          return { ...c, likedBy: liked ? [...(c.likedBy || []), user!.id] : (c.likedBy || []).filter(id => id !== user!.id) };
        }));
        void count;
      } else {
        console.error('[comments] like failed:', res.status);
      }
    } catch (err) {
      console.error('[comments] like error:', err);
    }
    setLikePending(null);
  };

  const canDelete = (c: Comment) => isAdmin || c.clerkUserId === user?.id;
  const fmtDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const CommentAvatar = ({ c, size = 7 }: { c: Comment; size?: number }) => (
    c.avatar
      ? <img src={c.avatar} alt={c.author} className={`w-${size} h-${size} rounded-full shrink-0 object-cover ring-1 ring-neutral-200 dark:ring-neutral-700`} />
      : <div className={`w-${size} h-${size} rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[10px] font-bold text-neutral-600 dark:text-neutral-300`}>{c.author[0]}</div>
  );


  const totalCount = comments.reduce((a, c) => a + 1 + (c.replies?.length || 0), 0);

  return (
    <div className="mt-16 pt-10 border-t border-neutral-100 dark:border-neutral-800">
      {/* Discussion header */}
      <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <MessageCircle size={15} className="text-neutral-400" />
          <h3 className="font-sans font-semibold text-[15px] text-neutral-800 dark:text-neutral-200">Discussion</h3>
          {totalCount > 0 && (
            <span className="text-[11px] font-mono text-neutral-400 dark:text-neutral-600 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded-full">{totalCount}</span>
          )}
          {isAdmin && (
            <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">admin</span>
          )}
        </div>
        {isSignedIn && user && (
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
            {user.imageUrl
              ? <img src={user.imageUrl} className="w-4 h-4 rounded-full object-cover" alt="" />
              : <div className="w-4 h-4 rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-[8px] font-bold">{user.firstName?.[0]}</div>
            }
            <span className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-[100px] truncate">{user.firstName || user.primaryEmailAddress?.emailAddress}</span>
            <button onClick={() => signOut()} title="Sign out" className="text-neutral-300 dark:text-neutral-600 hover:text-red-400 transition-colors">
              <LogOut size={10} />
            </button>
          </div>
        )}
      </div>

      {/* Top-level comment input */}
      {isSignedIn ? (
        <div className="mb-8">
          <div className="flex gap-3">
            {user?.imageUrl
              ? <img src={user.imageUrl} className="w-8 h-8 rounded-full shrink-0 object-cover ring-1 ring-neutral-200 dark:ring-neutral-700" alt="" />
              : <div className="w-8 h-8 rounded-full shrink-0 bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xs font-bold">{user?.firstName?.[0]}</div>
            }
            <div className="flex-1">
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSubmit(); }}
                placeholder="Share a thought..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 text-[13px] text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 dark:placeholder-neutral-600 resize-none focus:outline-none focus:ring-1 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-neutral-400 dark:text-neutral-600">⌘↵ to post</span>
                <button
                  onClick={() => handleSubmit()}
                  disabled={!text.trim() || submitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-[12px] font-medium disabled:opacity-40 hover:opacity-85 transition-opacity"
                >
                  {submitting ? <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <Send size={11} />}
                  Post
                </button>
              </div>
              {submitError && (
                <p className="mt-1.5 text-[11px] text-red-500 dark:text-red-400">{submitError}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          onClick={() => openGoogleSignInPopup()}
          className="w-full mb-8 flex items-center justify-center gap-2.5 px-4 py-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-700 text-[13px] text-neutral-500 hover:border-neutral-400 dark:hover:border-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all group"
        >
          <LogIn size={14} className="group-hover:translate-x-0.5 transition-transform" />
          Sign in to join the discussion
        </motion.button>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="flex gap-2 items-center text-[12px] text-neutral-400">
          <span className="w-3 h-3 border border-neutral-300 border-t-neutral-600 rounded-full animate-spin" />
          Loading...
        </div>
      ) : (
        <AnimatePresence>
          {comments.length === 0 ? (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[13px] text-neutral-300 dark:text-neutral-700 italic">
              No comments yet. Be the first.
            </motion.p>
          ) : (
            <div className="space-y-6">
              {comments.map(c => (
                <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <CommentAvatar c={c} size={7} />
                  <div className="flex-1 min-w-0">
                    {/* Comment header */}
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[12px] font-semibold text-neutral-800 dark:text-neutral-200">{c.author}</span>
                      {c.isAdmin && (
                        <span className="inline-flex items-center gap-0.5 text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md
                          bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400
                          border border-amber-200/70 dark:border-amber-800/50">
                          ✦ author
                        </span>
                      )}
                      {c.clerkUserId === user?.id && !c.isAdmin && <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">you</span>}
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{fmtDate(c.timestamp)}</span>
                    </div>
                    <p className="text-[13px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-2">{c.text}</p>

                    {/* Action row */}
                    <div className="flex items-center gap-3">
                      {/* Like button */}
                      <motion.button
                        whileTap={{ scale: 0.85 }}
                        onClick={() => handleLike(c.id)}
                        disabled={likePending === c.id}
                        title={isSignedIn ? undefined : 'Sign in to like'}
                        className={`flex items-center gap-1 text-[11px] transition-colors disabled:opacity-60 ${
                          c.likedBy?.includes(user?.id || '') ? 'text-blue-500' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                        }`}
                      >
                        <ThumbsUp size={11} className={c.likedBy?.includes(user?.id || '') ? 'fill-current' : ''} strokeWidth={1.8} />
                        {(c.likedBy?.length || 0) > 0 && <span className="font-mono">{c.likedBy?.length}</span>}
                      </motion.button>

                      {/* Reply button */}
                      {isSignedIn && (
                        <button
                          onClick={() => setReplyingTo(replyingTo === c.id ? null : c.id)}
                          className="flex items-center gap-1 text-[11px] font-medium text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
                        >
                          <CornerDownRight size={11} />
                          {replyingTo === c.id ? 'Cancel' : 'Reply'}
                        </button>
                      )}

                      {canDelete(c) && (
                        <button onClick={() => handleDelete(c.id)} className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-500 transition-colors">
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>

                    {/* Inline reply box */}
                    <AnimatePresence>
                      {replyingTo === c.id && isSignedIn && (
                        <InlineReplyBox
                          parentId={c.id}
                          parentAuthor={c.author}
                          value={replyTexts[c.id] || ''}
                          onChange={v => setReplyTexts(t => ({ ...t, [c.id]: v }))}
                          onSubmit={() => handleSubmit(c.id)}
                          onCancel={() => setReplyingTo(null)}
                          submitting={replySubmitting === c.id}
                          userImageUrl={user?.imageUrl}
                          userInitial={user?.firstName?.[0]}
                        />
                      )}
                    </AnimatePresence>

                    {/* Replies */}
                    {c.replies && c.replies.length > 0 && (
                      <div className="mt-4 space-y-3 pl-4 border-l-2 border-neutral-100 dark:border-neutral-800/60">
                        {c.replies.map(r => (
                          <motion.div key={r.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="flex gap-2.5">
                            <CommentAvatar c={r} size={6} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                                <span className="text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">{r.author}</span>
                                {r.isAdmin && (
                                  <span className="inline-flex items-center gap-0.5 text-[8px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-md
                                    bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400
                                    border border-amber-200/70 dark:border-amber-800/50">
                                    ✦ author
                                  </span>
                                )}
                                {r.clerkUserId === user?.id && !r.isAdmin && <span className="text-[9px] font-mono text-neutral-400 dark:text-neutral-600">you</span>}
                                <span className="text-[10px] text-neutral-400 dark:text-neutral-600">{fmtDate(r.timestamp)}</span>
                              </div>
                              <p className="text-[12px] text-neutral-600 dark:text-neutral-400 leading-relaxed mb-1.5">{r.text}</p>
                              <div className="flex items-center gap-3">
                                {/* Like reply */}
                                <motion.button
                                  whileTap={{ scale: 0.85 }}
                                  onClick={() => handleLike(r.id, c.id)}
                                  disabled={likePending === r.id}
                                  title={isSignedIn ? undefined : 'Sign in to like'}
                                  className={`flex items-center gap-1 text-[11px] transition-colors disabled:opacity-60 ${
                                    r.likedBy?.includes(user?.id || '') ? 'text-blue-500' : 'text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200'
                                  }`}
                                >
                                  <ThumbsUp size={10} className={r.likedBy?.includes(user?.id || '') ? 'fill-current' : ''} strokeWidth={1.8} />
                                  {(r.likedBy?.length || 0) > 0 && <span className="font-mono">{r.likedBy?.length}</span>}
                                </motion.button>
                                {canDelete(r) && (
                                  <button onClick={() => handleDelete(r.id, c.id)} className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-500 transition-colors">
                                    <Trash2 size={10} />
                                  </button>
                                )}
                              </div>
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

const ReadingProgress: React.FC = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
    };
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  return (
    <div className="fixed top-0 left-0 w-full h-[2px] z-[200] bg-transparent">
      <div className="h-full bg-neutral-600 dark:bg-neutral-300 transition-none" style={{ width: `${pct}%` }} />
    </div>
  );
};

const BlogPostPage: React.FC<Props> = ({ blog, onBack }) => {
  const [shareOpen, setShareOpen] = useState(false);
  const readingTime = blog.content
    ? Math.ceil(blog.content.reduce((acc, b) => acc + (b.text?.split(' ').length ?? 0), 0) / 200)
    : null;

  return (
    <div className="pt-8 pb-24">
      <ReadingProgress />
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
        <>
          <DynamicIslandTOC selector="article h2, article h3" hideAfterSelector="#post-reactions" />
          <article className="max-w-[640px]">
            {blog.content.map((block, i) =>
              block.type === 'heading' ? (
                <h2 key={i} className="font-sans font-bold text-[19px] text-neutral-900 dark:text-neutral-100 tracking-tight mt-10 mb-3 leading-snug">
                  {block.text}
                </h2>
              ) : block.type === 'diagram' ? (
                <BlogDiagram key={i} id={block.diagram} caption={block.caption} />
              ) : (
                <p key={i} className="text-[15px] text-neutral-700 dark:text-neutral-300 leading-[1.9] mb-5 font-normal">
                  {block.text}
                </p>
              )
            )}
          </article>
        </>
      ) : blog.link ? (
        <a href={blog.link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-500 hover:underline">
          Read on {blog.platform} →
        </a>
      ) : null}

      {/* Reactions */}
      {blog.isLocal && (
        <div id="post-reactions" className="max-w-[640px] mt-10 pt-8 border-t border-neutral-100 dark:border-neutral-800">
          <Reactions slug={blog.slug} />
        </div>
      )}

      {/* Footer strip */}
      <div className="max-w-[640px] mt-8 flex items-center justify-between">
        <button onClick={onBack} className="text-[13px] text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors">
          ← All posts
        </button>
        <button
          onClick={() => { setShareOpen(true); track({ type: 'share', slug: blog.slug }); }}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-all"
        >
          <Share2 size={12} />
          Share
        </button>
      </div>

      {/* Related posts */}
      {(() => {
        const related = BLOGS.filter(b => b.slug !== blog.slug && b.isLocal && b.tags?.some(t => blog.tags?.includes(t))).slice(0, 2);
        if (!related.length) return null;
        return (
          <div className="max-w-[640px] mt-12 pt-10 border-t border-neutral-100 dark:border-neutral-800">
            <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 dark:text-neutral-600 mb-4">Related</p>
            <div className="space-y-3">
              {related.map(r => (
                <button
                  key={r.slug}
                  onClick={() => { window.scrollTo({ top: 0 }); /* parent openBlog handled via custom event */ window.dispatchEvent(new CustomEvent('open-blog', { detail: r })); }}
                  className="group w-full text-left flex items-start gap-3 py-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-white/[0.03] transition-colors px-3 -mx-3"
                >
                  {r.image && <img src={r.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-neutral-800 dark:text-neutral-200 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors truncate">{r.title}</p>
                    <p className="text-[11px] text-neutral-400 dark:text-neutral-600 truncate mt-0.5">{r.description}</p>
                  </div>
                  <ArrowLeft size={13} className="shrink-0 text-neutral-300 dark:text-neutral-700 rotate-180 group-hover:translate-x-0.5 transition-transform mt-0.5" />
                </button>
              ))}
            </div>
          </div>
        );
      })()}

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
