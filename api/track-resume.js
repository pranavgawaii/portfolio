import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

const DRIVE_ID = '1boNL4UPwe1n71af10VWWRU4Vw1L7rTT-';
const VIEW_LINK = `https://drive.google.com/file/d/${DRIVE_ID}/preview`;
const DOWNLOAD_LINK = `https://drive.google.com/uc?export=download&id=${DRIVE_ID}`;

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const type = (req.query.type || 'view').slice(0, 20);
  const targetUrl = type === 'download' ? DOWNLOAD_LINK : VIEW_LINK;

  const ua = req.headers['user-agent'] || 'unknown';
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';

  // Geo lookup (same as track-visitor.js)
  let country = 'Unknown';
  try {
    let ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
    if (ip.includes(',')) ip = ip.split(',')[0].trim();
    const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/;
    if (ip && ipRegex.test(ip) && ip !== '::1' && ip !== '127.0.0.1' && !ip.startsWith('::ffff:127.')) {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`);
      const geoData = await geoRes.json();
      if (geoData.status === 'success') {
        country = `${geoData.city || ''}, ${geoData.countryCode || ''}`.trim().replace(/^,\s*/, '');
      }
    }
  } catch (_) { /* fail silently */ }

  try {
    const db = await getDb();
    await db.collection('resume_logs').insertOne({
      timestamp: new Date().toISOString(),
      type: String(type),
      ua: ua.slice(0, 150),
      deviceType,
      country,
    });
  } catch (error) {
    console.error('[Resume Tracker] Error logging:', error);
    // Fail open — always redirect
  }

  res.writeHead(307, { Location: targetUrl });
  res.end();
}
