import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

/**
 * VISITOR_BASE_OFFSET — adds a realistic starting count to account for
 * real visitors before analytics tracking was set up (1+ year of traffic).
 *
 * Set to 0 to disable. Only known to us — remove whenever you want.
 */
const VISITOR_BASE_OFFSET = 2600;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') { res.status(405).end(); return; }

  try {
    let ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/;
    if (ip && !ipRegex.test(ip)) ip = '';
    if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.')) ip = '';

    let locationStr = 'Earth';
    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,city,countryCode`);
      const geoData = await geoRes.json();
      if (geoData.status === 'success') {
        locationStr = `${geoData.city}, ${geoData.countryCode}`;
      }
    } catch (e) {
      console.error('Geo IP error:', e.message);
    }

    const db = await getDb();
    const visitors = db.collection('visitors');

    await visitors.insertOne({
      timestamp: new Date().toISOString(),
      userAgent: req.headers['user-agent'] || 'Unknown',
      location: locationStr,
      ip: ip || 'local',
    });

    const realCount = await visitors.countDocuments();
    const displayCount = realCount + VISITOR_BASE_OFFSET;

    res.status(200).json({ count: displayCount, location: locationStr });
  } catch (err) {
    console.error('[Track Visitor] Error:', err);
    res.status(500).json({ error: err.message });
  }
}
