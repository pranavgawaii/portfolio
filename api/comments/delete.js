import { getDb } from '../_lib/mongodb.js';
import { applyCors } from '../_lib/cors.js';
import { getVerifiedUserId, ADMIN_CLERK_ID } from '../_lib/admin.js';
import { checkRateLimit } from '../_lib/rateLimit.js';
import { logError } from '../_lib/logError.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  const { slug, commentId, parentId } = req.body || {};
  if (!slug) { res.status(400).json({ error: 'Missing slug' }); return; }

  let db;
  try {
    db = await getDb();
    const comments = db.collection('comments');
    const doc = await comments.findOne({ slug });
    if (!doc) { res.status(404).json({ error: 'Not found' }); return; }

    // Both the admin override and "delete your own comment" now come from
    // the verified Clerk token — a client can no longer claim any identity
    // it wants in the request body.
    const verifiedUserId = await getVerifiedUserId(req);
    if (!verifiedUserId) { res.status(401).json({ error: 'Sign in required' }); return; }
    const verifiedAdmin = verifiedUserId === ADMIN_CLERK_ID;

    const allowed = await checkRateLimit(db, `comments:delete:${verifiedUserId || 'admin'}`, { windowMs: 5 * 60 * 1000, max: 20 });
    if (!allowed) { res.status(429).json({ error: 'Too many deletes — please slow down.' }); return; }

    const items = doc.items || [];
    const canDelete = (c) => verifiedAdmin || (verifiedUserId && c.clerkUserId === verifiedUserId);

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
    logError(db, 'comments/delete', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
