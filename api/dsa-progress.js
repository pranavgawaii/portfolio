import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';
import { requireAdmin } from './_lib/admin.js';

// Single global document: the DSA sheet reflects the admin's own solving
// progress. Everyone can view it; only the verified admin can edit it.
export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  try {
    const db = await getDb();
    const progress = db.collection('dsa_progress');

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const doc = await progress.findOne({ _id: 'admin' });
      res.status(200).json({ solvedIds: doc?.solvedIds || [] });
      return;
    }

    if (req.method === 'POST') {
      const isAdmin = await requireAdmin(req, res);
      if (!isAdmin) return; // requireAdmin already sent the 403

      const { solvedIds } = req.body || {};
      if (!Array.isArray(solvedIds)) {
        res.status(400).json({ error: 'solvedIds must be an array' });
        return;
      }

      await progress.updateOne(
        { _id: 'admin' },
        { $set: { solvedIds, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      res.status(200).json({ ok: true, solvedIds });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[dsa-progress] handler error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
