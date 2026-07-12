import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';
import { getVerifiedUserId } from './_lib/admin.js';
import { checkRateLimit } from './_lib/rateLimit.js';
import { logError } from './_lib/logError.js';

function countsFromVotes(votes) {
  const counts = {};
  for (const [emoji, userIds] of Object.entries(votes || {})) {
    counts[emoji] = (userIds || []).length;
  }
  return counts;
}

function myVotesFromVotes(votes, userId) {
  if (!userId) return [];
  return Object.entries(votes || {})
    .filter(([, userIds]) => (userIds || []).includes(userId))
    .map(([emoji]) => emoji);
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const slug = req.query.slug || (req.body && req.body.slug);
  if (!slug) { res.status(400).json({ error: 'Missing slug' }); return; }

  let db;
  try {
    db = await getDb();
    const reactions = db.collection('reactions');

    if (req.method === 'GET') {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      const userId = await getVerifiedUserId(req);
      const doc = await reactions.findOne({ slug });
      const votes = doc?.votes || {};
      res.status(200).json({ counts: countsFromVotes(votes), myVotes: myVotesFromVotes(votes, userId) });
      return;
    }

    if (req.method === 'POST') {
      const userId = await getVerifiedUserId(req);
      if (!userId) { res.status(401).json({ error: 'Sign in required to react' }); return; }

      const { emoji } = req.body || {};
      if (!emoji) { res.status(400).json({ error: 'Missing emoji' }); return; }

      const allowed = await checkRateLimit(db, `reactions:post:${userId}`, { windowMs: 60 * 1000, max: 30 });
      if (!allowed) { res.status(429).json({ error: 'Too many reactions — please slow down.' }); return; }

      const doc = await reactions.findOne({ slug });
      const votes = doc?.votes || {};
      const current = new Set(votes[emoji] || []);

      // Server decides add vs. remove from current membership — never trusts
      // a client-supplied action, so it can't be replayed to double-vote.
      if (current.has(userId)) current.delete(userId); else current.add(userId);
      votes[emoji] = [...current];

      await reactions.updateOne({ slug }, { $set: { slug, votes } }, { upsert: true });
      res.status(200).json({ counts: countsFromVotes(votes), myVotes: myVotesFromVotes(votes, userId) });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('[reactions] handler error:', err);
    logError(db, 'reactions', err);
    res.status(500).json({ error: err.message || 'Internal server error' });
  }
}
