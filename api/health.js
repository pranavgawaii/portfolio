import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  let analyticsSize = 0;
  let commentsCount = 0;
  let recentErrors = [];
  let errorCount24h = 0;

  try {
    const db = await getDb();
    const summary = await db.collection('analytics').findOne({ _id: 'summary' });
    analyticsSize = (summary?.totalEvents || 0) * 150; // rough estimate: ~150 bytes/event

    const commentDocs = await db.collection('comments').find({}).toArray();
    commentsCount = commentDocs.reduce((total, doc) => total + (doc.items?.length || 0), 0);

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const errorCol = db.collection('error_logs');
    recentErrors = await errorCol.find({}).sort({ timestamp: -1 }).limit(10).toArray();
    errorCount24h = (await errorCol.find({ timestamp: { $gte: since } }).toArray()).length;
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
    errorCount24h,
    recentErrors,
  });
}
