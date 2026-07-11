import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

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

    const totalCount = await visitors.countDocuments();
    res.status(200).json({ count: totalCount, location: locationStr });
  } catch (err) {
    console.error('[Track Visitor] Error:', err);
    res.status(500).json({ error: err.message });
  }
}
