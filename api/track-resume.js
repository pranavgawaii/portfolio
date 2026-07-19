import { getDb } from './_lib/mongodb.js';
import { applyCors } from './_lib/cors.js';

const VIEW_LINK = 'https://drive.google.com/file/d/1boNL4UPwe1n71af10VWWRU4Vw1L7rTT-/preview';
const DOWNLOAD_LINK = 'https://drive.google.com/uc?export=download&id=1boNL4UPwe1n71af10VWWRU4Vw1L7rTT-';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const type = req.query.type || 'view';
  const targetUrl = type === 'download' ? DOWNLOAD_LINK : VIEW_LINK;

  try {
    const db = await getDb();
    await db.collection('resume_logs').insertOne({
      timestamp: new Date().toISOString(),
      type: String(type),
      userAgent: String(req.headers['user-agent'] || 'unknown'),
      deviceType: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.headers['user-agent'] || '') ? 'Mobile' : 'Desktop',
    });
  } catch (error) {
    console.error('[Resume Tracker] Error logging:', error);
    // Fail open: still redirect even if logging fails
  }

  res.writeHead(307, { Location: targetUrl });
  res.end();
}
