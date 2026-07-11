import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';
import { isVerifiedAdmin } from './_lib/admin.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const slug = req.query.slug || (req.body && req.body.slug);
  if (!slug) { res.status(400).json({ error: 'Missing slug' }); return; }

  try {
    const db = await getDb();
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
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
