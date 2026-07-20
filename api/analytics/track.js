import { getDb } from '../_lib/mongodb.js';
import { applyCors } from '../_lib/cors.js';

/**
 * Parse UA string into:
 *   os      — macOS | Windows | Android | iOS | Linux | ChromeOS | unknown
 *   osVersion — e.g. "14", "10", "15.1", "10_15_7" etc.
 *   device  — mobile | tablet | desktop  (kept for backward compat)
 */
function parseUA(ua) {
  if (!ua) return { os: 'unknown', osVersion: '', device: 'desktop' };

  // Android — must come before Linux check
  const android = ua.match(/Android\s*([\d._]+)?/i);
  if (android) {
    const ver = (android[1] || '').replace(/_/g, '.').split('.').slice(0, 2).join('.');
    const isTablet = /Tablet|iPad/i.test(ua) || !/Mobile/i.test(ua);
    return { os: 'Android', osVersion: ver, device: isTablet ? 'tablet' : 'mobile' };
  }

  // iPhone / iPad (iOS)
  const ios = ua.match(/OS\s*([\d_]+)\s*like\s*Mac/i);
  if (/iPhone/i.test(ua)) {
    const ver = ios ? ios[1].replace(/_/g, '.').split('.').slice(0, 2).join('.') : '';
    return { os: 'iOS', osVersion: ver, device: 'mobile' };
  }
  if (/iPad/i.test(ua)) {
    const ver = ios ? ios[1].replace(/_/g, '.').split('.').slice(0, 2).join('.') : '';
    return { os: 'iOS', osVersion: ver, device: 'tablet' };
  }

  // Windows
  const win = ua.match(/Windows NT\s*([\d.]+)/i);
  if (win) {
    const ntMap: Record<string, string> = { '10.0': '10/11', '6.3': '8.1', '6.2': '8', '6.1': '7', '6.0': 'Vista' };
    const ver = ntMap[win[1]] || win[1];
    return { os: 'Windows', osVersion: ver, device: 'desktop' };
  }

  // macOS
  const mac = ua.match(/Mac OS X\s*([\d_]+)/i);
  if (mac && !/iPhone|iPad/i.test(ua)) {
    const ver = mac[1].replace(/_/g, '.').split('.').slice(0, 2).join('.');
    return { os: 'macOS', osVersion: ver, device: 'desktop' };
  }

  // ChromeOS
  if (/CrOS/i.test(ua)) return { os: 'ChromeOS', osVersion: '', device: 'desktop' };

  // Linux
  if (/Linux/i.test(ua)) return { os: 'Linux', osVersion: '', device: 'desktop' };

  return { os: 'unknown', osVersion: '', device: 'desktop' };
}

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    const event = req.body || {};
    const ua = (req.headers['user-agent'] || '').slice(0, 150);
    const { os, osVersion, device } = parseUA(ua);
    const sessionId = typeof event.sessionId === 'string' ? event.sessionId.slice(0, 64) : null;

    const entry = {
      ...event,
      sessionId,
      device,
      os,
      osVersion,
      timestamp: new Date().toISOString(),
      ua,
      ref: (req.headers['referer'] || '').slice(0, 200),
    };

    const db = await getDb();
    await db.collection('analytics_events').insertOne(entry);

    // ── Update summary doc ────────────────────────────────────────────────
    const summaryCol = db.collection('analytics');
    const existing = await summaryCol.findOne({ _id: 'summary' });
    const { _id, ...existingFields } = existing || {};
    const data = Object.keys(existingFields).length ? existingFields : {
      pageViews: {},
      eventCounts: {},
      blogViews: {},
      projectClicks: {},
      totalPageViews: 0,
      totalEvents: 0,
      deviceBreakdown: { mobile: 0, tablet: 0, desktop: 0 },
      avgDuration: {},        // { '/path': { total: 0, count: 0 } }
      scrollDepth: {},        // { 'slug': { 25: 0, 50: 0, 75: 0, 100: 0 } }
      externalClicks: {},     // { 'domain': count }
      uniqueSessions: {},     // { 'YYYY-MM-DD': count } — approximated
    };

    // Ensure all keys exist for backward compat
    if (!data.deviceBreakdown) data.deviceBreakdown = { mobile: 0, tablet: 0, desktop: 0 };
    if (!data.avgDuration) data.avgDuration = {};
    if (!data.scrollDepth) data.scrollDepth = {};
    if (!data.externalClicks) data.externalClicks = {};
    if (!data.uniqueSessions) data.uniqueSessions = {};
    if (!data.osBreakdown) data.osBreakdown = {};
    if (!data.utmSources) data.utmSources = {};

    // Device (mobile/tablet/desktop)
    data.deviceBreakdown[device] = (data.deviceBreakdown[device] || 0) + 1;

    // OS — e.g. "macOS", "Windows", "Android 14", "iOS 17"
    const osLabel = osVersion ? `${os} ${osVersion}` : os;
    data.osBreakdown[osLabel] = (data.osBreakdown[osLabel] || 0) + 1;

    // Event type counters
    data.eventCounts[event.type] = (data.eventCounts[event.type] || 0) + 1;
    data.totalEvents += 1;

    // Page views
    if (event.type === 'page_view' && event.path) {
      data.pageViews[event.path] = (data.pageViews[event.path] || 0) + 1;
      data.totalPageViews += 1;
    }

    // Blog views
    if (event.type === 'blog_open' && event.slug) {
      data.blogViews[event.slug] = (data.blogViews[event.slug] || 0) + 1;
    }

    // Project clicks
    if (event.type === 'project_click' && event.projectId) {
      data.projectClicks[event.projectId] = (data.projectClicks[event.projectId] || 0) + 1;
    }

    // Page leave — avg duration per path
    if (event.type === 'page_leave' && event.path && typeof event.duration === 'number') {
      const dur = Math.min(event.duration, 3600); // cap at 1h
      if (dur >= 3) { // ignore bounces < 3s
        if (!data.avgDuration[event.path]) data.avgDuration[event.path] = { total: 0, count: 0 };
        data.avgDuration[event.path].total += dur;
        data.avgDuration[event.path].count += 1;
      }
    }

    // Scroll depth milestones
    if (event.type === 'scroll_depth' && event.slug && typeof event.depth === 'number') {
      const depthKey = String(event.depth);
      if (!data.scrollDepth[event.slug]) data.scrollDepth[event.slug] = {};
      data.scrollDepth[event.slug][depthKey] = (data.scrollDepth[event.slug][depthKey] || 0) + 1;
    }

    // External clicks
    if (event.type === 'external_click' && event.domain) {
      const domain = String(event.domain).slice(0, 100);
      data.externalClicks[domain] = (data.externalClicks[domain] || 0) + 1;
    }

    // UTM Sources
    if (event.type === 'utm_source' && event.source) {
      const src = String(event.source).slice(0, 50);
      data.utmSources[src] = (data.utmSources[src] || 0) + 1;
    }

    // Unique sessions (approximate — count per day bucket)
    if (sessionId) {
      const today = new Date().toISOString().slice(0, 10);
      // We track unique session count by storing count (not IDs) — for exact tracking
      // we'd use $addToSet on a separate collection, but a running approx is fine here
      // We use the raw analytics_events collection for unique session queries
    }

    await summaryCol.updateOne({ _id: 'summary' }, { $set: data }, { upsert: true });
    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
