import { getDb } from '../_lib/mongodb.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const event = req.body || {};
    const entry = {
      ...event,
      timestamp: new Date().toISOString(),
      ua: (req.headers['user-agent'] || '').slice(0, 120),
      ref: req.headers['referer'] || '',
    };

    const db = await getDb();
    await db.collection('analytics_events').insertOne(entry);

    const summaryCol = db.collection('analytics');
    const existing = await summaryCol.findOne({ _id: 'summary' });
    const { _id, ...existingFields } = existing || {};
    const data = Object.keys(existingFields).length
      ? existingFields
      : { pageViews: {}, eventCounts: {}, blogViews: {}, projectClicks: {}, totalPageViews: 0, totalEvents: 0 };

    if (event.type === 'page_view' && event.path) {
      data.pageViews[event.path] = (data.pageViews[event.path] || 0) + 1;
      data.totalPageViews += 1;
    }
    data.eventCounts[event.type] = (data.eventCounts[event.type] || 0) + 1;
    data.totalEvents += 1;

    if (event.type === 'blog_open' && event.slug) {
      data.blogViews[event.slug] = (data.blogViews[event.slug] || 0) + 1;
    }
    if (event.type === 'project_click' && event.projectId) {
      data.projectClicks[event.projectId] = (data.projectClicks[event.projectId] || 0) + 1;
    }

    await summaryCol.updateOne({ _id: 'summary' }, { $set: data }, { upsert: true });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
