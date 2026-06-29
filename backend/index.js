
import http from 'http';
import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Groq from 'groq-sdk';
// import { db } from './src/lib/firebase.js';           <-- REMOVED
// import { collection, addDoc } from 'firebase/firestore'; <-- REMOVED

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import dotenv from 'dotenv';

// Load env vars
dotenv.config({ path: path.join(__dirname, '..', '.env') });
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const GROQ_API_KEY = process.env.GROQ_API_KEY;
// ─── Groq system prompt (built server-side from portfolio KB) ─────────────────
const PORTFOLIO_SYSTEM_PROMPT = `You are an AI version of Pranav Gawai, a Full-stack Developer based in Pune, India.

Speak in first person as Pranav Gawai himself, not as an "AI assistant".
Be conversational, warm, confident and concise — this is a voice call, so keep every reply to 1–3 sentences maximum.
Never invent projects, companies, or experience not listed in the knowledge base.
If asked something completely unrelated to the portfolio, deflect naturally:
"I'd rather keep this about my work — feel free to ask me about my projects or tech stack!"

Here is everything you know about yourself:
- Bio: I build production-ready web applications from scratch, working across frontend and backend with a strong focus on clean architecture, performance, and user experience.
- Open to work: Yes, actively looking for opportunities.
- Tech stack: { languages: ["JavaScript","TypeScript","C++","SQL","HTML5"], frontend: ["React","Next.js","Tailwind CSS","Vite"], backend: ["Node.js","Express","Firebase","REST APIs"], tools: ["Git","GitHub","VS Code","Vercel","Postman"] }
- Projects: Portfolio Website — personal dark-themed portfolio with an AI voice assistant. Tech: Vite, React, TypeScript, Tailwind CSS, Node.js, Groq, Firebase.
- GitHub: github.com/pranavgawai
- LinkedIn: linkedin.com/in/pranavgawai
- Twitter/X: x.com/pranavgawai

CRITICAL RULES:
1. Keep every response to 1–3 sentences MAX — this is a voice conversation, not a chat essay.
2. Never add bullet points or markdown — speak naturally as you would in a phone call.
3. Never fabricate portfolio details not listed above.`;

// Initialize Firebase dynamically after env vars are loaded
const { db } = await import('../frontend/src/lib/firebase.js');
const { collection, addDoc, doc, getDoc, setDoc, query, orderBy, limit, getDocs } = await import('firebase/firestore');


const server = http.createServer(async (req, res) => {
    // Secure CORS
    const origin = req.headers.origin || '*';
    const allowedOrigins = ['http://localhost:3002', 'http://localhost:5173', 'https://pranavgawai.vercel.app'];
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

    // ── /api/track-visitor — Live Visitor Tracking & Geolocation ──────────────
    if (url.pathname === '/api/track-visitor' && req.method === 'GET') {
        try {
            // Get client IP
            let ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
            if (ip.includes(',')) ip = ip.split(',')[0].trim();
            // Basic IP validation to prevent spoofing injections
            const ipRegex = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$|^[0-9a-fA-F:]+$/;
            if (ip && !ipRegex.test(ip)) ip = '';
            if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('::ffff:127.')) ip = ''; // let ip-api auto-detect external

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

            const { getCountFromServer } = await import('firebase/firestore');
            const visitorsCol = collection(db, 'visitors');
            
            // Log this visit
            await addDoc(visitorsCol, {
                timestamp: new Date().toISOString(),
                userAgent: req.headers['user-agent'] || 'Unknown',
                location: locationStr,
                ip: ip || 'local'
            });

            // Get total unique visitors (simplistic count)
            const snapshot = await getCountFromServer(visitorsCol);
            const totalCount = snapshot.data().count;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ count: totalCount, location: locationStr }));
        } catch (err) {
            console.error('[Track Visitor] Error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
    }

    // ── /api/chat — Groq LLaMA 3.3 70B streaming endpoint ────────────────────
    if (url.pathname === '/api/chat' && req.method === 'POST') {
        if (!GROQ_API_KEY) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'GROQ_API_KEY is not set in .env or .env.local' }));
            return;
        }

        // Read POST body
        let body = '';
        req.on('data', (chunk) => { body += chunk; });
        req.on('end', async () => {
            try {
                const { messages } = JSON.parse(body);

                if (!Array.isArray(messages)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'messages must be an array' }));
                    return;
                }

                const groq = new Groq({ apiKey: GROQ_API_KEY });

                const stream = await groq.chat.completions.create({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: PORTFOLIO_SYSTEM_PROMPT },
                        ...messages,
                    ],
                    max_tokens: 150,
                    stream: true,
                    temperature: 0.7,
                });

                res.writeHead(200, {
                    'Content-Type': 'text/plain; charset=utf-8',
                    'Transfer-Encoding': 'chunked',
                    'X-Content-Type-Options': 'nosniff',
                    'Cache-Control': 'no-cache',
                });

                for await (const chunk of stream) {
                    const token = chunk.choices[0]?.delta?.content;
                    if (token) res.write(token);
                }

                res.end();
            } catch (err) {
                console.error('[Groq Chat] Error:', err);
                if (!res.headersSent) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Groq request failed', details: err.message }));
                } else {
                    res.end();
                }
            }
        });
        return;
    }
    if (url.pathname === '/api/track-resume') {
        // Resume Tracking Endpoint
        const type = url.searchParams.get('type') || 'view'; // 'view' or 'download'

        // Google Drive Links
        const VIEW_LINK = "https://drive.google.com/file/d/1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi/preview";
        const DOWNLOAD_LINK = "https://drive.google.com/uc?export=download&id=1ZTe3LT5xuc27A-FXvUr_zHr9NOKqUlUi";

        const targetUrl = type === 'download' ? DOWNLOAD_LINK : VIEW_LINK;

        // Log to Firebase "silently"
        try {
            const safePayload = {
                timestamp: new Date().toISOString(),
                type: String(type || 'view'),
                userAgent: String(req.headers['user-agent'] || 'unknown'),
                deviceType: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(req.headers['user-agent']) ? 'Mobile' : 'Desktop',
                ip: "127.0.0.1",
                location: {
                    city: "Pune (LocalDev)",
                    country: "IN",
                    region: "MH"
                }
            };

            console.log('[Resume Tracker] Attempting to log:', safePayload);

            await addDoc(collection(db, "resume_logs"), safePayload);
            console.log(`[Resume Tracker] Logged ${type} event.`);
        } catch (error) {
            console.error(`[Resume Tracker] Error logging:`, error);
            // Fail open: still redirect even if logging fails
        }

        // Redirect immediately
        res.writeHead(307, { 'Location': targetUrl });
        res.end();

    } else if (url.pathname === '/api/leetcode') {
        // LeetCode Endpoint with Caching
        // Simple in-memory cache
        if (!global.leetcodeCache) global.leetcodeCache = { data: null, timestamp: 0 };
        const CACHE_DURATION = 1000 * 60 * 60; // 1 Hour

        const now = Date.now();
        if (global.leetcodeCache.data && (now - global.leetcodeCache.timestamp < CACHE_DURATION)) {
            console.log('Serving LeetCode data from cache');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(global.leetcodeCache.data));
            return;
        }

        try {
            console.log('Fetching fresh LeetCode data...');
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);

            const response = await fetch('https://leetcode.com/graphql', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query: `query { matchedUser(username: "pranavgawai") { submissionCalendar } }`
                }),
                signal: controller.signal
            });
            clearTimeout(timeout);

            if (!response.ok) {
                throw new Error(`LeetCode API returned status: ${response.status}`);
            }

            const data = await response.json();

            if (!data.data || !data.data.matchedUser) {
                throw new Error('User not found or invalid data structure');
            }

            const submissionCalendar = JSON.parse(data.data.matchedUser.submissionCalendar);

            global.leetcodeCache = { data: submissionCalendar, timestamp: now };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(submissionCalendar));

        } catch (error) {
            console.error('Error in /api/leetcode:', error);
            // Fallback to cache if available even if expired, otherwise error
            if (global.leetcodeCache.data) {
                console.log('Serving expired cache due to error');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(global.leetcodeCache.data));
                return;
            }

            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Failed to fetch LeetCode data', details: error.message }));
        }
    // ── /api/comments/:slug GET — fetch all comments for a post ────────────────
    } else if (url.pathname.startsWith('/api/comments/') && req.method === 'GET') {
        const slug = url.pathname.replace('/api/comments/', '').split('/')[0];
        if (!slug) { res.writeHead(400); res.end(); return; }
        try {
            const raw = fs.readFileSync(path.join(__dirname, 'comments.json'), 'utf-8');
            const store = JSON.parse(raw);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(store[slug] || []));
        } catch {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify([]));
        }

    // ── /api/comments/:slug POST — add a new comment ────────────────────────
    } else if (url.pathname.startsWith('/api/comments/') && req.method === 'POST') {
        const slug = url.pathname.replace('/api/comments/', '').split('/')[0];
        if (!slug) { res.writeHead(400); res.end(); return; }
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const ADMIN_CLERK_ID = 'user_3Fncnt8BqkypDn2wAl3d13lWkMI';
                const { author, avatar, text, clerkUserId, parentId, isAdmin } = JSON.parse(body);
                if (!author || !text || !clerkUserId) { res.writeHead(400); res.end(JSON.stringify({ error: 'Missing fields' })); return; }
                const raw = fs.readFileSync(path.join(__dirname, 'comments.json'), 'utf-8');
                const store = JSON.parse(raw);
                if (!store[slug]) store[slug] = [];
                const newComment = {
                    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                    author, avatar: avatar || null, text: text.trim(),
                    clerkUserId,
                    isAdmin: !!isAdmin || clerkUserId === ADMIN_CLERK_ID,
                    timestamp: new Date().toISOString(),
                    replies: []
                };
                if (parentId) {
                    const parent = store[slug].find(c => c.id === parentId);
                    if (parent) parent.replies.push(newComment);
                } else {
                    store[slug].push(newComment);
                }
                fs.writeFileSync(path.join(__dirname, 'comments.json'), JSON.stringify(store, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newComment));
            } catch (e) {
                res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
            }
        });

    // ── /api/comments/:slug/delete POST — delete a comment (admin or owner) ──
    } else if (url.pathname.match(/^\/api\/comments\/[^/]+\/delete$/) && req.method === 'POST') {
        const slug = url.pathname.split('/')[3];
        let body = '';
        req.on('data', c => body += c);
        req.on('end', () => {
            try {
                const { commentId, parentId, clerkUserId, isAdmin } = JSON.parse(body);
                const raw = fs.readFileSync(path.join(__dirname, 'comments.json'), 'utf-8');
                const store = JSON.parse(raw);
                if (!store[slug]) { res.writeHead(404); res.end(); return; }

                const canDelete = (c) => isAdmin || c.clerkUserId === clerkUserId;

                if (parentId) {
                    const parent = store[slug].find(c => c.id === parentId);
                    if (parent) {
                        const reply = parent.replies.find(r => r.id === commentId);
                        if (reply && canDelete(reply)) parent.replies = parent.replies.filter(r => r.id !== commentId);
                    }
                } else {
                    const comment = store[slug].find(c => c.id === commentId);
                    if (comment && canDelete(comment)) store[slug] = store[slug].filter(c => c.id !== commentId);
                }
                fs.writeFileSync(path.join(__dirname, 'comments.json'), JSON.stringify(store, null, 2));
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (e) {
                res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
            }
        });

    // ── /api/analytics/track POST — fire-and-forget event tracking ─────────────
    } else if (url.pathname === '/api/analytics/track' && req.method === 'POST') {
        let body = '';
        req.on('data', c => body += c);
        req.on('end', async () => {
            try {
                const event = JSON.parse(body);
                const entry = {
                    ...event,
                    timestamp: new Date().toISOString(),
                    ua: (req.headers['user-agent'] || '').slice(0, 120),
                    ref: (req.headers['referer'] || ''),
                };

                const eventsCol = collection(db, 'analytics_events');
                await addDoc(eventsCol, entry);

                const summaryRef = doc(db, 'analytics', 'summary');
                const snap = await getDoc(summaryRef);
                let data = snap.exists() ? snap.data() : { pageViews: {}, eventCounts: {}, blogViews: {}, projectClicks: {}, totalPageViews: 0, totalEvents: 0 };
                
                if (!data.pageViews) data.pageViews = {};
                if (!data.eventCounts) data.eventCounts = {};
                if (!data.blogViews) data.blogViews = {};
                if (!data.projectClicks) data.projectClicks = {};
                if (!data.totalPageViews) data.totalPageViews = 0;
                if (!data.totalEvents) data.totalEvents = 0;

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

                await setDoc(summaryRef, data);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));
            } catch (e) {
                res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
            }
        });

    // ── /api/analytics GET — return analytics summary ──────────────────────────
    } else if (url.pathname === '/api/analytics' && req.method === 'GET') {
        try {
            const summaryRef = doc(db, 'analytics', 'summary');
            const snap = await getDoc(summaryRef);
            const data = snap.exists() ? snap.data() : { pageViews: {}, eventCounts: {}, blogViews: {}, projectClicks: {}, totalPageViews: 0, totalEvents: 0 };

            // Fetch recent 30 events from Firestore
            const eventsCol = collection(db, 'analytics_events');
            const q = query(eventsCol, orderBy('timestamp', 'desc'), limit(30));
            const querySnap = await getDocs(q);
            const recentEvents = [];
            querySnap.forEach(d => {
                recentEvents.push(d.data());
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                totalPageViews: data.totalPageViews || 0,
                pageViews: data.pageViews || {},
                eventCounts: data.eventCounts || {},
                blogViews: data.blogViews || {},
                projectClicks: data.projectClicks || {},
                recentEvents,
                totalEvents: data.totalEvents || 0,
            }));
        } catch (e) {
            res.writeHead(500); res.end(JSON.stringify({ error: e.message }));
        }

    // ── /api/health GET — backend health check ─────────────────────────────────
    } else if (url.pathname === '/api/health' && req.method === 'GET') {
        let analyticsSize = 0;
        try {
            const summaryRef = doc(db, 'analytics', 'summary');
            const snap = await getDoc(summaryRef);
            if (snap.exists()) {
                const totalEvents = snap.data().totalEvents || 0;
                analyticsSize = totalEvents * 150; // estimate size: ~150 bytes per event log
            }
        } catch {}

        const commentsPath = path.join(__dirname, 'comments.json');
        let commentsCount = 0;
        try { const s = JSON.parse(fs.readFileSync(commentsPath, 'utf-8')); commentsCount = Object.values(s).reduce((a, b) => a + b.length, 0); } catch {}

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            memory: process.memoryUsage().heapUsed,
            analyticsSize,
            commentsCount,
        }));

    // ── /api/reactions/:slug GET — get reaction counts ─────────────────────────
    } else if (url.pathname.startsWith('/api/reactions/') && req.method === 'GET') {
        const slug = url.pathname.replace('/api/reactions/', '');
        const reactionsPath = path.join(__dirname, 'reactions.json');
        let store = {};
        try { store = JSON.parse(fs.readFileSync(reactionsPath, 'utf-8')); } catch {}
        cors(res);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(store[slug] || {}));

    // ── /api/reactions/:slug POST — toggle a reaction ──────────────────────────
    } else if (url.pathname.startsWith('/api/reactions/') && req.method === 'POST') {
        const slug = url.pathname.replace('/api/reactions/', '');
        let body = '';
        req.on('data', d => { body += d; });
        req.on('end', () => {
            const reactionsPath = path.join(__dirname, 'reactions.json');
            let store = {};
            try { store = JSON.parse(fs.readFileSync(reactionsPath, 'utf-8')); } catch {}
            const { emoji, action } = JSON.parse(body || '{}');
            if (!store[slug]) store[slug] = {};
            if (!store[slug][emoji]) store[slug][emoji] = 0;
            store[slug][emoji] = Math.max(0, store[slug][emoji] + (action === 'add' ? 1 : -1));
            fs.writeFileSync(reactionsPath, JSON.stringify(store, null, 2));
            cors(res);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(store[slug]));
        });

    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Gateway server running on port ${PORT}`);
});
