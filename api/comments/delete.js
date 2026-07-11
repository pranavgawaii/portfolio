import { getDb } from '../_lib/mongodb.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { slug, commentId, parentId, clerkUserId, isAdmin } = req.body || {};
  if (!slug) { res.status(400).json({ error: 'Missing slug' }); return; }

  try {
    const db = await getDb();
    const comments = db.collection('comments');
    const doc = await comments.findOne({ slug });
    if (!doc) { res.status(404).json({ error: 'Not found' }); return; }

    const items = doc.items || [];
    const canDelete = (c) => isAdmin || c.clerkUserId === clerkUserId;

    let updatedItems = items;
    if (parentId) {
      const parent = items.find((c) => c.id === parentId);
      if (parent) {
        const reply = parent.replies.find((r) => r.id === commentId);
        if (reply && canDelete(reply)) {
          parent.replies = parent.replies.filter((r) => r.id !== commentId);
        }
      }
    } else {
      const comment = items.find((c) => c.id === commentId);
      if (comment && canDelete(comment)) {
        updatedItems = items.filter((c) => c.id !== commentId);
      }
    }

    await comments.updateOne({ slug }, { $set: { items: updatedItems } });
    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[comments/delete] handler error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
