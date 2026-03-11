import { db } from '../lib/firebase.js';
import { collection, addDoc } from 'firebase/firestore';

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { type = 'view' } = req.query;

    // Google Drive Links
    const VIEW_LINK = "https://drive.google.com/file/d/1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi/preview";
    const DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi";

    const targetUrl = type === 'download' ? DOWNLOAD_LINK : VIEW_LINK;

    try {
        const safePayload = {
            timestamp: new Date().toISOString(),
            type: String(type || 'view'),
            userAgent: String(req.headers['user-agent'] || 'unknown'),
            deviceType: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.headers['user-agent']) ? 'Mobile' : 'Desktop',
            ip: String(req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'),
            location: {
                city: String(req.headers['x-vercel-ip-city'] || 'Unknown'),
                country: String(req.headers['x-vercel-ip-country'] || 'Unknown'),
                region: String(req.headers['x-vercel-ip-country-region'] || 'Unknown')
            }
        };

        console.log('[Resume Tracker] Attempting to log from Vercel:', safePayload);

        await addDoc(collection(db, "resume_logs"), safePayload);
        console.log(`[Resume Tracker] Logged ${type} event from ${safePayload.ip}`);
    } catch (error) {
        console.error(`[Resume Tracker] Error logging:`, error);
    }

    // Redirect
    res.redirect(307, targetUrl);
}
