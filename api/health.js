import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  let analyticsSize = 0;
  let commentsCount = 0;

  try {
    const db = await getDb();
    const summary = await db.collection('analytics').findOne({ _id: 'summary' });
    analyticsSize = (summary?.totalEvents || 0) * 150; // rough estimate: ~150 bytes/event

    const commentDocs = await db.collection('comments').find({}).toArray();
    commentsCount = commentDocs.reduce((total, doc) => total + (doc.items?.length || 0), 0);
  } catch (e) {
    console.error('[Health] Error:', e);
  }

  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    memory: process.memoryUsage().heapUsed,
    timestamp: new Date().toISOString(),
    analyticsSize,
    commentsCount,
  });
}
