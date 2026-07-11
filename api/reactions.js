import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const slug = req.query.slug || (req.body && req.body.slug);
  if (!slug) { res.status(400).json({ error: 'Missing slug' }); return; }

  try {
    const db = await getDb();
    const reactions = db.collection('reactions');

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const doc = await reactions.findOne({ slug });
      res.status(200).json(doc?.counts || {});
      return;
    }

    if (req.method === 'POST') {
      const { emoji, action } = req.body || {};
      if (!emoji) { res.status(400).json({ error: 'Missing emoji' }); return; }

      const doc = await reactions.findOne({ slug });
      const counts = doc?.counts || {};
      counts[emoji] = Math.max(0, (counts[emoji] || 0) + (action === 'add' ? 1 : -1));

      await reactions.updateOne({ slug }, { $set: { slug, counts } }, { upsert: true });
      res.status(200).json(counts);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[reactions] handler error:', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
