import { applyCors } from './_lib/cors.js';

function decodeJwt(token) {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return null;
    const payload = parts[1];
    // Pad base64
    const padded = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decoded = Buffer.from(padded, 'base64').toString('utf-8');
    return JSON.parse(decoded);
  } catch (e) {
    return { error: e.message };
  }
}

export default function handler(req, res) {
  if (applyCors(req, res)) return;
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) return res.status(200).json({ userId: null, message: 'No token — not logged in' });
  const claims = decodeJwt(token);
  res.status(200).json({ userId: claims?.sub, claims });
}
