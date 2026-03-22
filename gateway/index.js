
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

// Simple environment variable parser
function loadEnv(filePath) {
    if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf-8');
        content.split('\n').forEach(line => {
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] ? match[2].trim() : '';
                if (value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                }
                process.env[key] = value;
            }
        });
    }
}

// Load env vars
loadEnv(path.join(__dirname, '..', '.env'));
loadEnv(path.join(__dirname, '..', '.env.local'));

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN;
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
const { db } = await import('../web/lib/firebase.js');
const { collection, addDoc } = await import('firebase/firestore');

const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

// Fallback tracks for when Spotify API is restricted (e.g. Premium required)
const FALLBACK_TRACKS = [
    {
        title: "Starboy",
        artist: "The Weeknd, Daft Punk",
        albumImageUrl: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop",
        songUrl: "https://open.spotify.com/track/7MXVBY9wcG4I4McZJZ9IuG",
        previewUrl: "https://p.scdn.co/mp3-preview/a22533ca9c1626f634f19b674828f731110f0f4a"
    },
    {
        title: "Blinding Lights",
        artist: "The Weeknd",
        albumImageUrl: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop",
        songUrl: "https://open.spotify.com/track/0VjIj9n9tPewoUMfCq2B7v",
        previewUrl: "https://p.scdn.co/mp3-preview/63378c4d924db0a59a7f34032d1f1f7cf8402db2"
    },
    {
        title: "Nightcall",
        artist: "Kavinsky",
        albumImageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&auto=format&fit=crop",
        songUrl: "https://open.spotify.com/track/0U0ldTjRlZMcpxp9tAsT3F",
        previewUrl: "https://p.scdn.co/mp3-preview/421fc360829871587d4653a06f3e1b730596ba31"
    }
];

function getFallbackTrack() {
    // Pick based on minute to make it feel "live" and changing
    const index = new Date().getMinutes() % FALLBACK_TRACKS.length;
    return { ...FALLBACK_TRACKS[index], isPlaying: false, isFallback: true };
}

const getAccessToken = async () => {
    return new Promise((resolve, reject) => {
        const data = new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: process.env.SPOTIFY_REFRESH_TOKEN || '',
        }).toString();

        const req = https.request(TOKEN_ENDPOINT, {
            method: 'POST',
            headers: {
                Authorization: `Basic ${basic}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    if (json.error) return reject(json.error);
                    resolve(json);
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.write(data);
        req.end();
    });
};

const getNowPlaying = async (access_token) => {
    return new Promise((resolve, reject) => {
        const req = https.request(NOW_PLAYING_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }, (res) => {
            if (res.statusCode === 204 || res.statusCode > 400) {
                if (res.statusCode > 400) {
                    console.error(`Now Playing Status: ${res.statusCode}`);
                    // We don't read body here because we resolve early, 
                    // let's read it to see the error message.
                    let body = '';
                    res.on('data', (chunk) => body += chunk);
                    res.on('end', () => {
                        console.error(`Now Playing Body: ${body}`);
                        resolve({ status: res.statusCode, data: null });
                    });
                    return;
                }
                resolve({ status: res.statusCode, data: null });
                return;
            }

            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(body);
                    resolve({ status: 200, data: json });
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
};

const getRecentlyPlayed = async (access_token) => {
    return new Promise((resolve, reject) => {
        const req = https.request(RECENTLY_PLAYED_ENDPOINT, {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        }, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    if (res.statusCode >= 400) {
                        console.error(`Recently Played Status: ${res.statusCode}`);
                        console.error(`Recently Played Body: ${body}`);
                        resolve({ status: res.statusCode, data: null });
                        return;
                    }
                    const json = JSON.parse(body);
                    resolve({ status: res.statusCode, data: json });
                } catch (e) {
                    console.error('JSON Parse Error in getRecentlyPlayed');
                    console.error('Status:', res.statusCode);
                    console.error('Body:', body);
                    reject(e);
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
};

const server = http.createServer(async (req, res) => {
    // CORS — allow GET + POST for the chat endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);

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
    if (url.pathname === '/api/spotify/now-playing') {
        // Disable caching
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        const missingKeys = [];
        if (!process.env.SPOTIFY_CLIENT_ID) missingKeys.push('SPOTIFY_CLIENT_ID');
        if (!process.env.SPOTIFY_CLIENT_SECRET) missingKeys.push('SPOTIFY_CLIENT_SECRET');
        if (!process.env.SPOTIFY_REFRESH_TOKEN) missingKeys.push('SPOTIFY_REFRESH_TOKEN');

        if (missingKeys.length > 0) {
            console.log('Missing keys:', missingKeys);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                error: 'Missing Spotify credentials',
                details: `Server could not find: ${missingKeys.join(', ')}. Please check .env or .env.local`
            }));
            return;
        }

        try {
            const { access_token } = await getAccessToken();
            let response = await getNowPlaying(access_token);
            let isPlaying = false;
            let item = null;

            // 1. Check if we have a currently active track (playing OR paused)
            if (response.status === 200 && response.data && response.data.item) {
                // If we have an item here, it's either playing or just paused. 
                // We prioritize this over "recently played" history which lags behind.
                item = response.data.item;
                isPlaying = response.data.is_playing; // true or false
            }

            // 2. Only fallback to recently played if NO item was returned above
            if (!item) {
                const recent = await getRecentlyPlayed(access_token);
                if (recent.status === 200 && recent.data && recent.data.items && recent.data.items.length > 0) {
                    item = recent.data.items[0].track;
                    isPlaying = false;
                }
            }

            if (!item) {
                // FALLBACK: If Spotify is restricted (403), use a curated list
                const fallback = getFallbackTrack();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    ...fallback,
                    message: 'Spotify API Restricted: Upgrade to Premium or use Last.fm'
                }));
                return;
            }

            const title = item.name;
            const artist = item.artists.map((_artist) => _artist.name).join(', ');
            const album = item.album.name;
            const albumImageUrl = item.album.images[0].url;
            const songUrl = item.external_urls.spotify;
            const previewUrl = item.preview_url;
            const durationMs = item.duration_ms;
            const progressMs = response.status === 200 && response.data ? response.data.progress_ms : 0;

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                albumImageUrl,
                artist,
                isPlaying,
                songUrl,
                title,
                previewUrl,
                durationMs,
                progressMs
            }));

        } catch (error) {
            console.error('Error in /api/spotify/now-playing:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ isPlaying: false, error: 'Failed to fetch spotify data', details: error.toString() }));
        }
    } else if (url.pathname === '/api/track-resume') {
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
    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Spotify server running on port ${PORT}`);
});
