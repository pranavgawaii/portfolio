import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';
import { isVerifiedAdmin } from './_lib/admin.js';
import { checkRateLimit } from './_lib/rateLimit.js';
import { logError } from './_lib/logError.js';

const MAX_COMMENT_LENGTH = 2000;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const slug = req.query.slug || (req.body && req.body.slug);
  if (!slug) { res.status(400).json({ error: 'Missing slug' }); return; }

  let db;
  try {
    db = await getDb();
    const comments = db.collection('comments');

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const doc = await comments.findOne({ slug });
      res.status(200).json(doc?.items || []);
      return;
    }

    if (req.method === 'POST') {
      const { author, avatar, text, clerkUserId, parentId } = req.body || {};
      if (!author || !text || !clerkUserId) {
        res.status(400).json({ error: 'Missing fields' });
        return;
      }
      if (text.length > MAX_COMMENT_LENGTH) {
        res.status(400).json({ error: `Comment too long (max ${MAX_COMMENT_LENGTH} characters)` });
        return;
      }

      const allowed = await checkRateLimit(db, `comments:post:${clerkUserId}`, { windowMs: 5 * 60 * 1000, max: 10 });
      if (!allowed) { res.status(429).json({ error: 'Too many comments — please slow down.' }); return; }

      // isAdmin is never trusted from the client — only a verified Clerk
      // token matching the admin account can earn the "author" badge.
      const verifiedAdmin = await isVerifiedAdmin(req);

      const newComment = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        author,
        avatar: avatar || null,
        text: String(text).trim(),
        clerkUserId,
        isAdmin: verifiedAdmin,
        timestamp: new Date().toISOString(),
        replies: [],
        likedBy: [],
      };

      const doc = await comments.findOne({ slug });
      const items = doc?.items || [];

      if (parentId) {
        const parent = items.find((c) => c.id === parentId);
        if (parent) parent.replies.push(newComment);
      } else {
        items.push(newComment);
      }

      await comments.updateOne({ slug }, { $set: { slug, items } }, { upsert: true });
      res.status(200).json(newComment);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[comments] handler error:', err);
    logError(db, 'comments', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
