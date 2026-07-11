import { getDb } from '../_lib/mongodb.js';
import { applyCors } from '../_lib/cors.js';
import { getVerifiedUserId } from '../_lib/admin.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const userId = await getVerifiedUserId(req);
  if (!userId) { res.status(401).json({ error: 'Sign in required to like' }); return; }

  const { slug, commentId, parentId } = req.body || {};
  if (!slug || !commentId) { res.status(400).json({ error: 'Missing slug or commentId' }); return; }

  try {
    const db = await getDb();
    const comments = db.collection('comments');
    const doc = await comments.findOne({ slug });
    if (!doc) { res.status(404).json({ error: 'Not found' }); return; }

    const items = doc.items || [];
    const target = parentId
      ? items.find((c) => c.id === parentId)?.replies?.find((r) => r.id === commentId)
      : items.find((c) => c.id === commentId);

    if (!target) { res.status(404).json({ error: 'Comment not found' }); return; }

    const likedBy = new Set(target.likedBy || []);
    const liked = !likedBy.has(userId);
    if (liked) likedBy.add(userId); else likedBy.delete(userId);
    target.likedBy = [...likedBy];

    await comments.updateOne({ slug }, { $set: { items } });
    res.status(200).json({ liked, count: target.likedBy.length });
  } catch (err) {
    console.error('[comments/like] handler error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
