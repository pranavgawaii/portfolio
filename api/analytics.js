import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const db = await getDb();

    // ── Summary doc ──────────────────────────────────────────────────────────
    const summaryDoc = await db.collection('analytics').findOne({ _id: 'summary' });
    const data = summaryDoc || {
      pageViews: {}, eventCounts: {}, blogViews: {}, projectClicks: {},
      totalPageViews: 0, totalEvents: 0,
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      avgDuration: {}, scrollDepth: {}, externalClicks: {}, uniqueSessions: {},
    };

    // ── Recent events (last 50) ───────────────────────────────────────────────
    const recentEvents = await db
      .collection('analytics_events')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    // ── Unique session count (today) ─────────────────────────────────────────
    const today = new Date().toISOString().slice(0, 10);
    const todayStart = new Date(today + 'T00:00:00.000Z').toISOString();
    const uniqueSessionsToday = await db
      .collection('analytics_events')
      .distinct('sessionId', { timestamp: { $gte: todayStart }, sessionId: { $ne: null } });

    // ── Geo: top visitor locations ───────────────────────────────────────────
    const topLocations = await db
      .collection('visitors')
      .aggregate([
        { $match: { location: { $ne: 'Earth', $exists: true } } },
        { $group: { _id: '$location', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
      ])
      .toArray();

    // ── Resume logs ──────────────────────────────────────────────────────────
    const resumeLogs = await db
      .collection('resume_logs')
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();

    const resumeSummary = {
      totalViews: resumeLogs.filter(r => r.type === 'view').length,
      totalDownloads: resumeLogs.filter(r => r.type === 'download').length,
      mobileViews: resumeLogs.filter(r => r.deviceType === 'Mobile').length,
      desktopViews: resumeLogs.filter(r => r.deviceType === 'Desktop').length,
      recentLogs: resumeLogs.slice(0, 20),
      countryBreakdown: resumeLogs.reduce((acc, r) => {
        const k = r.country || 'Unknown';
        acc[k] = (acc[k] || 0) + 1;
        return acc;
      }, {}),
    };

    res.status(200).json({
      totalPageViews: data.totalPageViews || 0,
      pageViews: data.pageViews || {},
      eventCounts: data.eventCounts || {},
      blogViews: data.blogViews || {},
      projectClicks: data.projectClicks || {},
      deviceBreakdown: data.deviceBreakdown || { mobile: 0, tablet: 0, desktop: 0 },
      avgDuration: data.avgDuration || {},
      scrollDepth: data.scrollDepth || {},
      externalClicks: data.externalClicks || {},
      recentEvents,
      totalEvents: data.totalEvents || 0,
      uniqueSessionsToday: uniqueSessionsToday.length,
      topLocations,
      resumeSummary,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
