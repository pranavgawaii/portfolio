import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const db = await getDb();
    const summaryDoc = await db.collection('analytics').findOne({ _id: 'summary' });
    const data = summaryDoc || { pageViews: {}, eventCounts: {}, blogViews: {}, projectClicks: {}, totalPageViews: 0, totalEvents: 0 };

    const recentEvents = await db
      .collection('analytics_events')
      .find({})
      .sort({ timestamp: -1 })
      .limit(30)
      .toArray();

    res.status(200).json({
      totalPageViews: data.totalPageViews || 0,
      pageViews: data.pageViews || {},
      eventCounts: data.eventCounts || {},
      blogViews: data.blogViews || {},
      projectClicks: data.projectClicks || {},
      recentEvents,
      totalEvents: data.totalEvents || 0,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
